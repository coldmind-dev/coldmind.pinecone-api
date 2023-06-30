/**
 *  Coldmind - Pinecone API Client
 *
 *  This file is part of the Coldmind - Pinecone API Client project, an
 *  integration solution for the Pinecone database.
 *  @repository https://github.com/coldmind-dev/coldmind.pinecone-api.git
 *
 *  @author Patrik Forsberg
 *  @contact patrik.forsberg@coldmind.com
 *  @date 2023-06-29
 *
 *  Copyright (c) 2023 Coldmind AB
 *
 *  This Source Code Form is subject to the terms of the Mozilla Public
 *  License, v. 2.0. If a copy of the MPL was not distributed with this
 *  file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 *  The software is provided "as is", without warranty of any kind, express or implied,
 *  including but not limited to the warranties of merchantability, fitness for a
 *  particular purpose and noninfringement. In no event shall the authors or copyright
 *  holders be liable for any claim, damages or other liability, whether in an action of
 *  contract, tort or otherwise, arising from, out of or in connection with the software
 *  or the use or other dealings in the software.
 */

import assert                from "node:assert";
import { IVectorOperation }  from "./api";
import { CmPineconeApi }     from "./api/cm-pinecone.api";
import { IApiSettings }      from "./api/cm.pinecone-api-settings.type";
import { VectorOperation }   from "./api/cm.pinecone-vector-operation";
import { CmError }           from "./core/cm.error";
import { PineconeErrorCode } from "./core/cm.pinecone.error.type";
import { Settings }          from "./environment";
import { PineconeMetric }    from "./types/cm.pinecone-metric.type";
import { EventEmitter } from 'events';

enum ClientEvents {
	IndexUpdate = 'indexUpdate',
}

export class PineconeIndex extends VectorOperation {
	constructor(apiClient: CmPineconeApi, indexName: string) {
		super(apiClient, indexName);
	}
}

/**
 * Represents a Pinecone engine client.
 */
export class CmPineconeClient {
	private api: CmPineconeApi;
	private selectedIndex: PineconeIndex | undefined = undefined;
	private indices: { [name: string]: VectorOperation };

	/**
	 * Creates an instance of CmPineconeClient.
	 * @param settings
	 */
	constructor(
		public readonly settings?: IApiSettings
	) {
		assert(Settings.API_KEY, "API key must be specified");
		assert(Settings.ENVIRONMENT, "Environment key must be specified");

		this.settings = settings ?? {
			baseURL: `https://api.controller.${Settings.ENVIRONMENT}.pinecone.io`,
			apiKey: Settings.API_KEY,
		}

		this.indices = {};
	}

	/**
	 * Initializes the client.
	 * @param {ICmPineconeApiSettings} settings
	 * @returns {Promise<void>}
	 */
	public async init(settings?: IApiSettings): Promise<void> {
		settings = settings ?? {
			baseURL: `https://api.controller.${Settings.ENVIRONMENT}.pinecone.io`,
			apiKey: Settings.API_KEY,
		}

		this.api = new CmPineconeApi(settings);
	}


	/**
	 * Gets or creates an index with the specified indexName.
	 * @param indexName - The indexName of the index.
	 * @returns The Pinecone index.
	 */
	public getIndex(indexName: string): VectorOperation {
		if (!this.indices[indexName]) {
			this.indices[indexName] = new VectorOperation(this.api, indexName);
		}
		return this.indices[indexName];
	}

	/**
	 * Retrieves a list of existing indexes.
	 * @returns A Promise that resolves to an array of index names.
	 */
	public async refreshIndexList(): Promise<string[]> {
		const indexList = await this.api.listIndexes();
		console.log('indexList ::', indexList);
	}

	/**
	 * Sets the current index to be used by the engine.
	 * If the index does not exist, it can be created if specified.
	 * @param indexName - The indexName of the index.
	 * @param createIfNotExists - Indicates whether to create the index if it does not exist (optional, default: false).
	 * @param dimensions - The dimensionality of the index (optional).
	 * @param metric - The similarity metric to use for the index (optional).
	 * @returns A Promise that resolves to the selected index.
	 * @throws CmError with CmErrorCode.IndexNameMissing if the index indexName is missing.
	 * @throws CmError with CmErrorCode.IndexNotFound if the index does not exist and createIfNotExists is false.
	 * @throws CmError with CmErrorCode.IndexCreationDataMissing if dimensions or metric are missing when creating a new index.
	 * @throws CmError with CmErrorCode.IndexCreationFailed if the index creation process fails.
	 */
	public async useIndex(
		indexName: string,
		createIfNotExists?: boolean,
		dimensions?: number,
		metric?: PineconeMetric
	): Promise<IVectorOperation> {
		dimensions = dimensions || this.settings.defDimensions;

		if (!indexName) {
			throw new CmError(PineconeErrorCode.IndexNameMissing, "Index indexName is missing");
		}

		const indexExists = await this.indexExists(indexName);

		if (createIfNotExists) {
			if (!indexExists) {
				await this.createIndex(indexName, dimensions, metric);
			}
		} else if (!indexExists) {
			throw new CmError(PineconeErrorCode.IndexNotFound, `Index "${indexName}" does not exist`);
		}

		return this.getIndex(indexName);
	}

	/**
	 * Creates a new index with the specified name, dimensions, and metric.
	 * @param name - The name of the index.
	 * @param dimensions - The dimensionality of the index.
	 * @param metric - The similarity metric to use for the index.
	 * @returns A Promise that resolves when the index creation is complete.
	 * @throws CmError with CmErrorCode.IndexCreationDataMissing if dimensions or metric are missing.
	 * @throws CmError with CmErrorCode.IndexCreationFailed if the index creation process fails.
	 */
	private async createIndex(name: string, dimensions: number, metric?: PineconeMetric): Promise<void> {
		await this.api.createIndex(name, dimensions, metric);
		await this.waitUntilIndexIsReady(name);
	}

	/**
	 * Waits until the index with the specified name is ready for use.
	 * @param name - The name of the index.
	 * @returns A Promise that resolves when the index is ready.
	 * @throws CmError with CmErrorCode.IndexCreationFailed if the index creation process fails.
	 */
	private async waitUntilIndexIsReady(name: string): Promise<void> {
		const response = await this.api.getIndexDescription(name);
		const status = response.status;

		if (status === "READY") {
			return;
		} else if (status === "FAILED") {
			throw new CmError(PineconeErrorCode.IndexCreationFailed, `Index "${name}" creation failed`);
		}

		await new Promise((resolve) => setTimeout(resolve, 1000));
		await this.waitUntilIndexIsReady(name);
	}

	/**
	 * Checks if an index with the specified name exists.
	 * @param name - The name of the index.
	 * @returns A Promise that resolves to true if the index exists, false otherwise.
	 */
	private async indexExists(name: string): Promise<boolean> {
		try {
			await this.api.getIndexDescription(name);
			return true;
		} catch (error) {
			if (error.response && error.response.status === 404) {
				return false;
			}
			throw error;
		}
	}
}

const pinecone = new CmPineconeClient();

