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

import axios, {
	AxiosInstance,
	AxiosRequestConfig,
	AxiosResponse
}                                from "axios";
import { ICmHttpClientSettings } from "./cm.http-client.types";
import { ICmApiRequestConfig }   from "./cm.http-client.types";
import { CmApiClientHeaders }    from "./cm.http-client.types";

/**
 * CmRestApiClient - General-purpose REST API Client
 *
 * This API client provides a convenient interface for making HTTP requests to a RESTful API.
 * It supports common HTTP methods such as GET, POST, and DELETE, and allows customization of
 * request headers and base URL. The client is built on top of Axios.
 */
export class CmHttpClient {
	private client: AxiosInstance;

	/**
	 * Creates an instance of CmRestApiClient.
	 */
	constructor(settings: ICmHttpClientSettings) {
		const defaultHeaders: CmApiClientHeaders = {
			...settings.header,
		}

		if (settings.restJson) {
			defaultHeaders["Content-Type"] = "application/json";
		}

		const clientConfig: ICmApiRequestConfig = {
			baseURL: settings.baseURL,
			timeout: settings.timeout ?? 60000 * 30,
			headers: defaultHeaders,
		};

		this.client = axios.create(clientConfig);
	}

	/**
	 * Creates a new instance of CmRestApiClient.
	 * @returns {this}
	 * @param settings
	 */
	static createHttpClient(settings: ICmHttpClientSettings): this {
		return new this(settings);
	}

	/**
	 * Sets custom headers to be added to the existing headers.
	 * @param customHeaders - Custom headers to be merged with the existing headers.
	 */
	public setCustomHeaders(customHeaders: Record<string, string>): void {
		this.client.defaults.headers = {
			...this.client.defaults.headers,
			...customHeaders,
		}
	}

	/**
	 * Sends a POST request to the specified path with the given data.
	 *
	 * @template TRespData - The expected response data type.
	 * @param {string} path - The path of the endpoint.
	 * @param {*} data - The data to send in the request body.
	 * @returns {Promise<TRespData>} - A Promise that resolves to the response data.
	 */
	public async httpPost<TRespData = any>(path: string, data: any): Promise<TRespData> {
		try {
			const response = await this.client.post(path, data);
			return response.data as TRespData;
		}
		catch (error) {
			throw new Error(`POST request to ${ path } failed: ${ error.message }`);
		}
	}

	/**
	 * Sends a GET request to the specified path with optional query parameters.
	 *
	 * @template TRespData - The expected response data type.
	 * @param {string} path - The path of the endpoint.
	 * @param {*} [params] - The query parameters for the request (optional).
	 * @returns {Promise<TRespData>} - A Promise that resolves to the response data.
	 */
	public async httpGet<TRespData = any>(path: string, params?: any): Promise<TRespData> {
		try {
			const response = await this.client.get(path, { params });
			return response.data as TRespData;
		}
		catch (error) {
			throw new Error(`GET request to ${ path } failed: ${ error.message }`);
		}
	}

	/**
	 * Sends a DELETE request to the specified path with optional query parameters.
	 *
	 * @template TRespData - The expected response data type.
	 * @param {string} path - The path of the endpoint.
	 * @param {*} [params] - The query parameters for the request (optional).
	 * @returns {Promise<TRespData>} - A Promise that resolves to the response data.
	 */
	public async httpDelete<TRespData = any>(path: string, params?: any): Promise<TRespData> {
		try {
			const response = await this.client.delete(path, { params });
			return response.data as TRespData;
		}
		catch (error) {
			throw new Error(`DELETE request to ${ path } failed: ${ error.message }`);
		}
	}

	/**
	 * Sends a PATCH request to the specified path with optional query parameters.
	 *
	 * @template TRespData - The expected response data type.
	 * @param {string} path - The path of the endpoint.
	 * @param {*} [params] - The query parameters for the request (optional).
	 * @returns {Promise<TRespData>} - A Promise that resolves to the response data.
	 */
	public async httpPatch<TRespData = any>(path: string, params?: any): Promise<TRespData> {
		try {
			const response = await this.client.patch(path, { params });
			return response.data as TRespData;
		}
		catch (error) {
			throw new Error(`PATH request to ${ path } failed: ${ error.message }`);
		}
	}

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
	public async request<TRespData = any>(
		method: string,
		path: string,
		data?: any,
		params?: any
	): Promise<TRespData> {
		try {
			const config: AxiosRequestConfig = {
				method,
				url: path,
				data,
				params,
			};
			const response: AxiosResponse = await this.client.request(config);
			return response.data as TRespData;
		}
		catch (error) {
			throw new Error(`Request (${ method }) to ${ path } failed: ${ error.message }`);
		}
	}
}
