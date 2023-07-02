/**
 *  Coldmind - Pinecone API Client
 *
 *  This file is part of the Coldmind - Pinecone API Client project, an
 *  integration solution for the Pinecone database.
 *  @repository https://github.com/coldmind-dev/coldmind.pinecone-api.git
 *
 *  @author Patrik Forsberg
 *  @contact patrik.forsberg@coldmind.com
 *  @date 2023-07-02
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

import { IMetadata }       from "@lib/coldmind";
import fetch, { Response } from "node-fetch";

export type TApiClientHeaders = IMetadata<string>;

/**
 * Represents a structured API response.
 */
export interface IApiResponse<T = any> {
	status: number;
	statusText?: string;
	success: boolean;
	headers?: TApiClientHeaders;
	data?: T;
	error?: Error;
}

/**
 * Represents the options for an API request.
 */
export interface IApiRequestOptions {
	method: string;
	url: string;
	headers?: TApiClientHeaders;
	body?: Record<string, any>;
}

/**
 * Represents an HTTP client for making API requests.
 */
export class HttpApiClient<T extends any = any> implements IApiClient<T> {
	private headers: TApiClientHeaders;

	/**
	 * Creates an instance of HttpClient.
	 * @param headers - Custom headers to be included in the requests.
	 */
	constructor(headers: TApiClientHeaders) {
		this.headers = headers;
	}

	/**
	 * Performs an HTTP request with custom headers and returns a structured response.
	 * @param options - The options for the API request.
	 * @returns An IApiResponse object.
	 */
	private async fetchRequest<DataType extends any = T>(options: IApiRequestOptions): Promise<IApiResponse<DataType>> {
		let response: IApiResponse<T> = {
			status: 0,
			success: false
		}

		try {
			const fetchResponse = await fetch(options.url, {
				method: options.method,
				headers: { ...this.headers, ...options.headers },
				body: options.body ? JSON.stringify(options.body) : undefined,
			});

			response.status = fetchResponse.status;

			if (fetchResponse.ok) {
				const responseData: DataType = await fetchResponse.json() as DataType;
				response.success = true;
				response.data = {} //fetchResponse ? fetchResponse.json() as DataType : undefined;

				fetchResponse.headers.forEach((value: string, name: string) => {
					response.headers[name] = value;
				});

				response.data = responseData as DataType ?? {};
			} else {
				response.success = false;
				response.error = new Error(`Request failed with status ${fetchResponse.status}`);
			}
		} catch (error) {
			return {
				status: 500,
				success: false,
				error: new Error(`Internal server error`)
			}
		}
	}

	/**
	 * Performs an HTTP GET request with custom headers.
	 * @param url - The URL to make the GET request to.
	 * @returns An IApiResponse object.
	 */
	public async httpGet<DataType extends object = T>(url: string): Promise<IApiResponse<DataType>> {
		const options: IApiRequestOptions = {
			method: 'GET',
			url
		};

		return this.fetchRequest<DataType>(options);
	}

	/**
	 * Performs an HTTP POST request with custom headers and request body.
	 * @param url - The URL to make the POST request to.
	 * @param body - The request body.
	 * @returns An IApiResponse object.
	 */
	public async httpPost(url: string, body?: any): Promise<IApiResponse<T>> {
		const options: IApiRequestOptions = {
			method: 'POST',
			url,
			headers: {},
			body,
		};

		return this.fetchRequest(options);
	}

	/**
	 * Performs an HTTP PUT request with custom headers and request body.
	 * @param url - The URL to make the PUT request to.
	 * @param data
	 * @returns An IApiResponse object.
	 */
	public async httpPut(url: string, data?: any): Promise<IApiResponse<T>> {
		const options: IApiRequestOptions = {
			method: 'PUT',
			url,
			headers: {},
			body: data,
		};

		return this.fetchRequest(options);
	}

	/**
	 * Performs an HTTP PUT request with custom headers and request body.
	 * @param url - The URL to make the PATCH request to.
	 * @param body - The request body.
	 * @returns An IApiResponse object.
	 */
	public async httpPatch(url: string, body?: any): Promise<IApiResponse<T>> {
		const options: IApiRequestOptions = {
			method: 'PATCH',
			url,
			headers: {},
			body: body,
		};

		return this.fetchRequest(options);
	}

	/**
	 * Performs an HTTP DELETE request with custom headers.
	 * @param url - The URL to make the DELETE request to.
	 * @param data
	 * @returns An IApiResponse object.
	 */
	public async httpDelete(url: string, data?: any): Promise<IApiResponse<T>> {
		const options: IApiRequestOptions = {
			method: 'DELETE',
			url,
			body: data,
			headers: {},
		};

		return this.fetchRequest(options);
	}
}

/**
 * Represents an API client with common HTTP methods.
 */
interface IApiClient<T> {
	httpGet(url: string): Promise<IApiResponse<T>>;
	httpPost(url: string, data?: any): Promise<IApiResponse<T>>;
	httpPut(url: string, data?: any): Promise<IApiResponse<T>>;
	httpPatch(url: string, data?: any): Promise<IApiResponse<T>>;
	httpDelete(url: string, data?: any): Promise<IApiResponse<T>>;
}

export default HttpApiClient;
