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


import { IMetadata }  from "../types/metadata.type";
import { TPrimitive } from "../types/primitive.types";

/**
 * Custom error class for CmError.
 */
export class CmError extends Error {
	metadata: IMetadata<TPrimitive>
	/**
	 * Create a new instance of CmError.
	 * @param {number | string} code - The error code.
	 * @param {string} message - The error message.
	 */
	constructor(public code: number | string, message: string) {
		super(message);
		this.name = "CmError";
	}

	/**
	 * Create a new instance of CmError.
	 * @param {number | string} code - The error code.
	 * @param {string} message - The error message.
	 * @returns {CmError} - The created instance of CmError.
	 */
	static create(code: number | string, message: string): CmError {
		return new CmError(code, message);
	}

	/**
	 * Throw a new instance of CmError.
	 * @param {number | string} code - The error code.
	 * @param {string} message - The error message.
	 * @throws {CmError} - The thrown instance of CmError.
	 */
	static throwNew(code: number | string, message: string): void {
		throw new CmError(code, message);
	}
}
