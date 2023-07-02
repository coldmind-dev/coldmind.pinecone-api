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

export interface ICmHttpClient {
	setCustomHeaders(customHeaders: Record<string, string>): void;

	/**
	 * Sends a GET request to the specified path with optional query parameters.
	 *
	 * @template TRespData - The expected response data type.
	 * @param {string} path - The path of the endpoint.
	 * @param {*} [params] - The query parameters for the request (optional).
	 * @returns {Promise<TRespData>} - A Promise that resolves to the response data.
	 */
	httpGet<TRespData>(path: string, params?: string): Promise<TRespData>;

	/**
	 * Sends a POST request to the specified path with the given data.
	 *
	 * @template TRespData - The expected response data type.
	 * @param {string} path - The path of the endpoint.
	 * @param {*} data - The data to send in the request body.
	 * @returns {Promise<TRespData>} - A Promise that resolves to the response data.
	 */
	httpPost<TRespData>(path: string, data: any): Promise<TRespData>;

	/**
	 * Sends a DELETE request to the specified path with optional query parameters.
	 *
	 * @template TRespData - The expected response data type.
	 * @param {string} path - The path of the endpoint.
	 * @param {*} [params] - The query parameters for the request (optional).
	 * @returns {Promise<TRespData>} - A Promise that resolves to the response data.
	 */
	httpDelete<TRespData>(path: string, params?: any): Promise<TRespData>;

	/**
	 * Sends a PATCH request to the specified path with optional query parameters.
	 *
	 * @template TRespData - The expected response data type.
	 * @param {string} path - The path of the endpoint.
	 * @param {*} [params] - The query parameters for the request (optional).
	 * @returns {Promise<TRespData>} - A Promise that resolves to the response data.
	 */
	httpDelete<TRespData>(path: string, params?: any): Promise<TRespData>;

	/**
	 * Sends a request to the specified path using the given HTTP method and optional data.
	 *
	 * @template TRespData - The expected response data type.
	 * @param {string} method - The HTTP method (e.g., GET, POST, PT, DELETE).
	 * @param {string} path - The path of the endpoint.
	 * @param {*} [data] - The data to send in the request body (optional).
	 * @param {*} [params] - The query parameters for the request (optional).
	 * @returns {Promise<TRespData>} - A Promise that resolves to the response data.
	 */
	request<TRespData>(
		method: string,
		path: string,
		data?: any,
		params?: any
	): Promise<TRespData>
}
