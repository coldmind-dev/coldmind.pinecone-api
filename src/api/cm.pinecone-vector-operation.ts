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

import { CmPineconeApi }    from "./cm-pinecone.api";
import { IVectorOperation } from "./cm.pinecone-vector-operation.type";

/**
 * Represents a Pinecone index implementation.
 */
class CmPineconeVectorOperation implements IVectorOperation {
	private _indexName: string;

	get indexName(): string {
		return this._indexName;
	};

	set indexName(value: string) {
		this._indexName = value;
	}

	/**
	 * Creates an instance of PineconeIndex.
	 * @param apiClient - The CmRestClient instance.
	 * @param indexName - The name of the index.
	 */
	constructor(private apiClient: CmPineconeApi, indexName: string) {
		this.indexName = indexName;
	}

	/**
	 * Upserts vectors into the index with an optional namespace.
	 * @param vectors - The vectors to upsert.
	 * @param namespace - The namespace for the vectors (optional).
	 * @returns A Promise that resolves to the upsert response.
	 */
	public async upsert(vectors: number[][], namespace?: string): Promise<any> {
		return this.apiClient.upsertVectors(this.indexName, vectors, namespace);
	}

	/**
	 * Updates a vector in the index with optional values, metadata, and namespace.
	 * @param id - The ID of the vector to update.
	 * @param values - The new values for the vector (optional).
	 * @param setMetadata - The metadata to set for the vector (optional).
	 * @param namespace - The namespace of the vector (optional).
	 * @returns A Promise that resolves to the update response.
	 */
	public async update(
		id: string,
		values?: number[],
		setMetadata?: object,
		namespace?: string
	): Promise<any> {
		return this.apiClient.updateVector(this.indexName, id, values, setMetadata, namespace);
	}

	/**
	 * Deletes vectors from the index with optional namespace.
	 * @param ids - The IDs of the vectors to delete.
	 * @param namespace - The namespace of the vectors (optional).
	 * @returns A Promise that resolves to the delete response.
	 */
	public async delete(ids: string[], namespace?: string): Promise<any> {
		return this.apiClient.deleteVectors(this.indexName, ids, namespace);
	}

	/**
	 * Fetches vectors from the index with optional namespace.
	 * @param ids - The IDs of the vectors to fetch.
	 * @param namespace - The namespace of the vectors (optional).
	 * @returns A Promise that resolves to the fetch response.
	 */
	public async fetch(ids: string[], namespace?: string): Promise<any> {
		return this.apiClient.fetchVectors(this.indexName, ids, namespace);
	}

	/**
	 * Performs a vector similarity search on the index with optional namespace.
	 * @param queryVector - The vector to use as the query.
	 * @param topK - The number of most similar vectors to retrieve.
	 * @param namespace - The namespace of the vectors (optional).
	 * @returns A Promise that resolves to the query response.
	 */
	public async query(queryVector: number[], topK: number, namespace?: string): Promise<any> {
		return this.apiClient.queryVectors(this.indexName, queryVector, topK, namespace);
	}
}

export { CmPineconeVectorOperation as VectorOperation }
