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

import { AxiosRequestConfig } from "axios";

/**
 * Represents the type of simple values allowed in metadata.
 */
export type TSimpleType = string | number | boolean | null | undefined;

/**
 * Represents metadata associated with a request.
 * @template T - The type of metadata values.
 */
export interface IMetadata<T> extends Record<string, T> {}

/**
 * Represents the headers to be included in the API client settings.
 */
export interface TCmApiClientHeaders extends IMetadata<any> {}

export class CmApiClientHeaders implements TCmApiClientHeaders {}

export interface ICmApiRequestConfig extends AxiosRequestConfig<TSimpleType> { }

/**
 * Represents the settings for the API client.
 * @param baseURL - The base URL for the API client.
 * @param timeout - The timeout value for requests in milliseconds.
 * @param header - The headers to be included in the requests.
 * @param restJson - Flag indicating whether to add the "Content-Type: application/json" header.
 */
export interface ICmHttpClientSettings extends IMetadata<TSimpleType> {
	baseURL: string;
	timeout: number;
	header: TCmApiClientHeaders;
	restJson?: boolean;
}
