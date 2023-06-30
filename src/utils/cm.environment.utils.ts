/**
 *  Coldmind - Pinecone API Client
 *
 *  This file is part of the Coldmind - Pinecone API Client project, an
 *  integration solution for the Pinecone database.
 *  @repository https://github.com/coldmind-dev/coldmind.pinecone-api.git
 *
 *  @author Patrik Forsberg
 *  @contact patrik.forsberg@coldmind.com
 *  @date 2023-06-30
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

/**
 * @function getEnv
 * @description Retrieves the value of an environment variable.
 * If the environment variable is not set and no default value is specified,
 * an error is optionally thrown.
 *
 * @param {string} key - The name of the environment variable.
 * @param {string} [defaultValue] - The default value to return if the environment variable is not set.
 * @param {boolean} [throws] - Specifies whether an error should be thrown if the environment variable is not set.
 * @returns {string} The value of the environment variable, or the default value if not set and throws is false.
 * @throws {Error} If the environment variable is not set and throws is true.
 */
export const getEnv = (key: string, defaultValue?: any, throws: boolean = true): string | undefined => {
	let value: any = process.env[ key ] ?? defaultValue;

	value = value ? JSON.stringify(value) : value;

	if (typeof value === "string" && value.trim().length) {
		return value;
	}

	if (throws) {
		throw new Error(`Environment variable ${ key } is not set.`);
	}

	return defaultValue;
}
