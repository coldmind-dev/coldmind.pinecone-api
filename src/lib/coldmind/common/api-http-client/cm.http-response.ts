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

import { CmError }      from "..";
import { CmHttpHeader } from "..";
import {
	ICmHttpHeader,
	ICmHttpResponse }   from ".."

/**
 * HTTP API Response
 */
export class CmHttpResponse<T, Err extends CmError = CmError> implements ICmHttpResponse<T, Err> {
	private _httpHeaders: ICmHttpHeader = new CmHttpHeader({});

	error?: Err;
	headers?: ICmHttpHeader;

	/**
	 * Returns true if the HTTP status code is 200
	 * @returns {boolean}
	 */
	get success(): boolean {
		return this.status >= 200 && this.status < 300
	}

	/**
	 * Create a new HTTP API Response
	 * @param {number} status
	 * @param {string} statusText
	 * @param {T} data
	 */
	constructor(
		public status: number,
		public statusText?: string,
		public data?: T
	) {
	}

	/**
	 * Set the HTTP status code
	 * @param {number} status
	 * @param {string} text
	 * @returns {IHttpApiResponse}
	 */
	setStatus(status: number, text?: string): ICmHttpResponse<T> {
		this.status = status;
		this.statusText = text;
		return this;
	}

	/**
	 * Set the HTTP response data
	 * @param {T} data
	 * @returns {IHttpApiResponse}
	 */
	setData(data: T): ICmHttpResponse<T> {
		this.data = data;
		return this;
	}
}
