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

import { IPineconeApiSettings } from "@api/api-settings.interface";
import { HttpApiOperationOld } from "@api/http-api-operation-old";
import { HttpApiOperation }    from "@api/http-api-operation";
import { ICmAction }           from "@lib/coldmind/common/action/cm.action.intf";
import { CmError }              from "@lib/coldmind/common/cm.error";
import { ErrorCode }            from "@core/error-codes.enum";
import { MetricEnum }           from "@dataTypes/metric.enum";
import { CmEventEmitter }       from "@lib/coldmind/common/events";
import assert                   from "node:assert";
import { IndexApiOperation }    from "./package/api";
import { VectorApiOperation }   from "./package/api";
import { IVectorOperation }     from "./package/api";

/**
 * Represents the type of events that can be emitted by the client.
 */
export enum ClientEventsType {
	IndexChange,
	IndexUpdate,
	IndexSelected,
	InitResult
}

export type TVectorApiAction = Promise<ICmAction<IVectorOperation>>;

/**
 * Represents a Pinecone engine client.
 */
export class CmPineconeClient extends CmEventEmitter<ClientEventsType> {
	private _httpApi: HttpApiOperation;
	private _indexOperation: IndexApiOperation;
	private _vectorOperation: VectorApiOperation;
	private _selectedIndex: string | undefined = undefined;
	private indices: Map<string, VectorApiOperation>;

	get httpApi(): HttpApiOperation {
		console.log("httpApi ::", this.settings);
		this._httpApi = this._httpApi ?? new HttpApiOperation(this.settings);
		return this._httpApi;
	}

	get indexOperation(): IndexApiOperation {
		return this._indexOperation ?? new IndexApiOperation(this.httpApi);
	}

	get vectorOperation(): VectorApiOperation {
		return this._vectorOperation ?? new VectorApiOperation(this.httpApi);
	}

	/**
	 * Creates an instance of CmPineconeClient.
	 * @param settings
	 */
	constructor(
		public settings: IPineconeApiSettings,
	) {
		super();

		assert(settings, "Settings must be provided");
		assert(settings?.apiKey, "API key must be specified");
		assert(settings?.environment, "Environment key must be specified");

		/**
		 * Initializes the client asynchronously.
		 */
		process.nextTick(() => {
			this.init(this.settings).then(() => {
				this.emit(ClientEventsType.InitResult);
			}).catch((err) => {
				this.emit(ClientEventsType.InitResult, err);
			});
		});
	}

	/**
	 * Initializes the client.
	 * @param {IPineconeApiSettings} settings
	 * @returns {Promise<void>}
	 */
	public async init(settings?: IPineconeApiSettings): Promise<void> {
		this.settings.header = settings.header ?? {
			"Content-Type": "application/json",
			"Api-Key"     : this.settings.apiKey,
		};

		this.settings.baseURL = this.settings?.baseURL ??
								`https://controller.${ this.settings.environment }.pinecone.io`;

		this.indices = new Map<string, VectorApiOperation>();
	}

	/**
	 * Gets or creates an index with the specified indexName.
	 * @param indexName - The indexName of the index.
	 * @param force
	 * @param optimistic
	 * @returns The Pinecone index.
	 */
	public async getIndex(
		indexName: string,
		force?: boolean,
		optimistic?: boolean
	): TVectorApiAction {


		if ( !this.indices[ indexName ]) {
			this.indices[ indexName ] = new VectorApiOperation(this.httpApi, indexName);
		}

		return this.indices[ indexName ];
	}

	/**
	 * Retrieves a list of existing indexes.
	 * @returns A Promise that resolves to an array of index names.
	 */
	public async refreshIndexList(): Promise<void> {
		const indexList = await this.httpApi.listIndexes();
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
		metric?: MetricEnum,
	): Promise<IVectorOperation> {
		dimensions = dimensions || this.settings.defDimensions;

		if ( !indexName) {
			throw new CmError(ErrorCode.IndexNameMissing, "Index indexName is missing");
		}

		const indexExists = await this.indexExists(indexName);

		if (createIfNotExists) {
			if ( !indexExists) {
				await this.createIndex(indexName, dimensions, metric);
			}
		}
		else if ( !indexExists) {
			throw new CmError(ErrorCode.IndexNotFound, `Index "${ indexName }" does not exist`);
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
	private async createIndex(name: string, dimensions: number, metric?: MetricEnum): Promise<void> {
		await this.httpApi.createIndex(name, dimensions, metric);
		await this.waitUntilIndexIsReady(name);
	}

	/**
	 * Waits until the index with the specified name is ready for use.
	 * @param name - The name of the index.
	 * @returns A Promise that resolves when the index is ready.
	 * @throws CmError with CmErrorCode.IndexCreationFailed if the index creation process fails.
	 */
	private async waitUntilIndexIsReady(name: string): Promise<void> {
		const response = await this.httpApi.getIndexDescription(name);
		const status = response.status;

		if (status === "READY") {
			return;
		}
		else if (status === "FAILED") {
			throw new CmError(ErrorCode.IndexCreationFailed, `Index "${ name }" creation failed`);
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
			await this.httpApi.getIndexDescription(name);
			return true;
		}
		catch (error) {
			if (error.response && error.response.status === 404) {
				return false;
			}
			throw error;
		}
	}
}
