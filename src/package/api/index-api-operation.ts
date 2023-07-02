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

import { MetricEnum }          from "@dataTypes/metric.enum";
import { HttpApiOperationOld } from "./http-api-operation-old";
import { IIndexOperation }     from "@api/index-api-operation.intf";

/**
 * Index related operations
 */
export class IndexApiOperation implements IIndexOperation{
	/**
	 * Create an instance of the CmPineconeIndexOperation.
	 * @param apiClient
	 */
	constructor(private apiClient: HttpApiOperationOld) {}

	/**
	 * Create a new index in the Pinecone Vector database.
	 * @param indexName - The name of the index.
	 * @param dimensions
	 * @param metrics
	 * @returns A Promise that resolves to the API response.
	 * @example
	 * const api = new CmPineconeIndexApi({ baseURL: 'https://api.example.com', apiKey: 'YOUR_API_KEY' });
	 * await api.createIndex('my-index', 128, 1, 1);
	 */
	public async createIndex(indexName: string, dimensions: number, metrics: MetricEnum): Promise<any> {
		return this.apiClient.createIndex(indexName, dimensions, metrics);
	}

	/**
	 * Configure an existing index in the Pinecone Vector database.
	 * @param indexName - The name of the index to configure.
	 * @param patchData - The configuration data to apply to the index.
	 * @returns A Promise that resolves to the API response.
	 * @example
	 * const api = new CmPineconeIndexApi({ baseURL: 'https://api.example.com', apiKey: 'YOUR_API_KEY' });
	 * await api.configureIndex('my-index', { replicas: 2 });
	 */
	public async configureIndex(indexName: string, patchData: any): Promise<any> {
		return this.apiClient.configureIndex(indexName, patchData);
	}

	/**
	 * Delete an existing index from the Pinecone Vector database.
	 * @param indexName - The name of the index to delete.
	 * @returns A Promise that resolves to the API response.
	 * @example
	 * const api = new CmPineconeIndexApi({ baseURL: 'https://api.example.com', apiKey: 'YOUR_API_KEY' });
	 * await api.deleteIndex('my-index');
	 */
	public async deleteIndex(indexName: string): Promise<any> {
		return this.apiClient.deleteIndex(indexName);
	}

	/**
	 * Get information about an existing index in the Pinecone Vector database.
	 * @param indexName - The name of the index to retrieve information about.
	 * @returns A Promise that resolves to the API response.
	 * @example
	 * const api = new CmPineconeIndexApi({ baseURL: 'https://api.example.com', apiKey: 'YOUR_API_KEY' });
	 * const indexInfo = await api.describeIndex('my-index');
	 * console.log(indexInfo);
	 */
	public async describeIndex(indexName: string): Promise<any> {
		return this.apiClient.describeIndex(indexName);
	}

	/**
	 * Get a list of all indexes in the Pinecone Vector database.
	 * @returns A Promise that resolves to the API response.
	 * @example
	 * const api = new CmPineconeIndexApi({ baseURL: 'https://api.example.com', apiKey: 'YOUR_API_KEY' });
	 * const indexes = await api.listIndexes();
	 * console.log(indexes);
	 */
	public async listIndexes(): Promise<any[]> {
		return this.apiClient.listIndexes();
	}

	/**
	 * Create a new collection in the Pinecone Vector database.
	 * @param collectionName - The name of the collection.
	 * @returns A Promise that resolves to the API response.
	 * @example
	 * const api = new CmPineconeIndexApi({ baseURL: 'https://api.example.com', apiKey: 'YOUR_API_KEY' });
	 * await api.createCollection('my-collection');
	 */
	public async createCollection(collectionName: string): Promise<any> {
		return this.apiClient.createCollection(collectionName);
	}

	/**
	 * Delete an existing collection from the Pinecone Vector database.
	 * @param collectionName - The name of the collection to delete.
	 * @returns A Promise that resolves to the API response.
	 * @example
	 * const api = new CmPineconeIndexApi({ baseURL: 'https://api.example.com', apiKey: 'YOUR_API_KEY' });
	 * await api.deleteCollection('my-collection');
	 */
	public async deleteCollection(collectionName: string): Promise<any> {
		return this.apiClient.deleteCollection(collectionName);
	}

	/**
	 * Get information about an existing collection in the Pinecone Vector database.
	 * @param collectionName - The name of the collection to retrieve information about.
	 * @returns A Promise that resolves to the API response.
	 * @example
	 * const api = new CmPineconeIndexApi({ baseURL: 'https://api.example.com', apiKey: 'YOUR_API_KEY' });
	 * const collectionInfo = await api.describeCollection('my-collection');
	 * console.log(collectionInfo);
	 */
	public async describeCollection(collectionName: string): Promise<any> {
		return this.apiClient.describeCollection(collectionName);
	}

	/**
	 * Get a list of all collections in the Pinecone Vector database.
	 * @returns A Promise that resolves to the API response.
	 * @example
	 * const api = new CmPineconeIndexApi({ baseURL: 'https://api.example.com', apiKey: 'YOUR_API_KEY' });
	 * const collections = await api.listCollections();
	 * console.log(collections);
	 */
	public async listCollections(): Promise<any[]> {
		return this.apiClient.listCollections();
	}
}
