import { CmError }              from "../core/cm.error";
import { ICmApiClientSettings } from "../core/cm.api-client";
import { CmHttpClient }         from "../core/cm.api-client";
import { PineconeErrorCode }    from "../core/cm.pinecone.error.type";
import { PineconeMetric }    from "../types/cm.pinecone-metric.type";

/**
 * Represents a REST client for interacting with the Pinecone API.
 */
export class CmPineconeApi extends CmHttpClient {
	constructor(options: ICmApiClientSettings) {
		super(options);
	}

	/**==================================================================
	 *
	 * 	Index API Related functions
	 *
	 ==================================================================/

	/**
	 * Creates a new index with the specified name, dimensions, and metric.
	 * @param name - The name of the index.
	 * @param dimensions - The dimensionality of the index (optional).
	 * @param metric - The similarity metric to use for the index (optional).
	 * @returns A Promise that resolves when the index creation is complete.
	 * @throws CmError with CmErrorCode.IndexCreationDataMissing if dimensions or metric are missing.
	 * @throws CmError with CmErrorCode.IndexCreationFailed if the index creation process fails.
	 */
	public async createIndex(name: string, dimensions: number, metric?: PineconeMetric): Promise<void> {
		const data = {
			createRequest: {
				name,
				dimension: dimensions,
				metric: metric ?? PineconeMetric.COSINE
			},
		};

		await this.httpPost(`/indexes/create`, data);
		await this.waitUntilIndexIsReady(name);
	}

	/**
	 * Retrieves the description of the index with the specified name.
	 * @param name - The name of the index.
	 * @returns A Promise that resolves to the index description.
	 */
	public async getIndexDescription(name: string): Promise<any> {
		return this.httpGet(`/indexes/describe/${name}`);
	}

	/**
	 * Configure an existing index in the Pinecone Vector database.
	 * @param indexName - The name of the index to configure.
	 * @param patchData - The configuration data to apply to the index.
	 * @returns A Promise that resolves to the API response.
	 */
	public async configureIndex(indexName: string, patchData: any): Promise<any> {
		return this.httpPatch(`/databases/${ indexName }`, patchData);
	}

	/**
	 * Delete an existing index from the Pinecone Vector database.
	 * @param indexName - The name of the index to delete.
	 * @returns A Promise that resolves to the API response.
	 */
	public async deleteIndex(indexName: string): Promise<any> {
		return this.httpDelete(`/databases/${ indexName }`);
	}

	/**
	 * Get information about an existing index in the Pinecone Vector database.
	 * @param indexName - The name of the index to retrieve information about.
	 * @returns A Promise that resolves to the API response.
	 */
	public async describeIndex(indexName: string): Promise<any> {
		return this.httpGet(`/databases/${ indexName }`);
	}

	/**
	 * Get a list of all indexes in the Pinecone Vector database.
	 * @returns A Promise that resolves to the API response.
	 */
	public async listIndexes(): Promise<any[]> {
		return this.httpGet(`/databases`);
	}

	/**
	 * Create a new collection in the Pinecone Vector database.
	 * @param collectionName - The name of the collection.
	 * @returns A Promise that resolves to the API response.
	 */
	public async createCollection(collectionName: string): Promise<any> {
		return this.httpPost('/collections', { collectionName });
	}

	/**
	 * Delete an existing collection from the Pinecone Vector database.
	 * @param collectionName - The name of the collection to delete.
	 * @returns A Promise that resolves to the API response.
	 *
	 * @GraphminApi {
	 *  	path: "/collections",
	 *  	method: "DELETE",
	 *  	summary: "",
	 *  	parameters: {}
	 *  	expect: {
	 *  		status: 200,
	 *  		dataType: "Array<string>"
	 *  	}
	 * 	}
	 */
	public async deleteCollection(collectionName: string): Promise <any> {
		return this.httpDelete(`/collections/${ collectionName }`);
	}

	/**
	 * Get information about an existing collection in the Pinecone Vector database.
	 * @param collectionName - The name of the collection to retrieve information about.
	 * @returns A Promise that resolves to the API response.
	 */
	public async describeCollection(collectionName: string): Promise<any> {
		return this.httpGet(`/collections/${ collectionName }`)
	}

	/**
	 * @desc Get a list of available collections.
	 *
	 * @GraphminApi {
	 *  	path: "/collections",
	 *  	method: "GET",
	 *  	summary: "",
	 *  	parameters: {}
	 *  	expect: {
	 *  		status: 200,
	 *  		dataType: "Array<string>"
	 *  	}
	 * 	}
	 *
	 *	@returns A Promise that resolves to the API response.
	 *
	 */
	public async listCollections(): Promise <string[]> {
		this.httpGet('/collections');
	}

	// ================================================================== //
 	//
 	// 	Vector API Related functions
 	//
	// ================================================================== /

	/**
	 * Upserts vectors into the index with the specified indexName and optional namespace.
	 * @param indexName - The indexName of the index.
	 * @param vectors - The vectors to upsert.
	 * @param namespace - The namespace for the vectors (optional).
	 * @returns A Promise that resolves to the upsert response.
	 */
	public async upsertVectors(indexName: string, vectors: number[][], namespace?: string): Promise<any> {
		const data = {
			upsertRequest: {
				vectors,
				namespace,
			},
		};

		return this.httpPost(`/vectors/upsert`, data);
	}

	/**
	 * Updates a vector in the index with the specified name, ID, and optional values, metadata, and namespace.
	 * @param name - The name of the index.
	 * @param id - The ID of the vector to update.
	 * @param values - The new values for the vector (optional).
	 * @param setMetadata - The metadata to set for the vector (optional).
	 * @param namespace - The namespace of the vector (optional).
	 * @returns A Promise that resolves to the update response.
	 */
	public async updateVector(
		name: string,
		id: string,
		values?: number[],
		setMetadata?: object,
		namespace?: string
	): Promise<any> {
		const data = {
			updateRequest: {
				id,
				values,
				setMetadata,
				namespace,
			},
		};

		return this.httpPost(`/vectors/update`, data);
	}

	/**
	 * Deletes vectors from the index with the specified name, IDs, and optional namespace.
	 * @param name - The name of the index.
	 * @param ids - The IDs of the vectors to delete.
	 * @param namespace - The namespace of the vectors (optional).
	 * @returns A Promise that resolves to the delete response.
	 */
	public async deleteVectors(name: string, ids: string[], namespace?: string): Promise<any> {
		const params = {
			ids,
			namespace,
		};

		return this.delete(`/vectors/delete`, params);
	}

	/**
	 * Fetches vectors from the index with the specified name, IDs, and optional namespace.
	 * @param name - The name of the index.
	 * @param ids - The IDs of the vectors to fetch.
	 * @param namespace - The namespace of the vectors (optional).
	 * @returns A Promise that resolves to the fetch response.
	 */
	public async fetchVectors(name: string, ids: string[], namespace?: string): Promise<any> {
		const params = {
			ids,
			namespace,
		};

		return this.httpGet(`/vectors/fetch`, params);
	}

	/**
	 * Performs a vector similarity search on the index with the specified name, query vector, topK, and optional namespace.
	 * @param name - The name of the index.
	 * @param queryVector - The vector to use as the query.
	 * @param topK - The number of most similar vectors to retrieve.
	 * @param namespace - The namespace of the vectors (optional).
	 * @returns A Promise that resolves to the query response.
	 */
	public async queryVectors(name: string, queryVector: number[], topK: number, namespace?: string): Promise<any> {
		const data = {
			queryRequest: {
				vector: queryVector,
				topK,
				namespace,
			},
		};

		return this.httpPost(`/query`, data);
	}
}
