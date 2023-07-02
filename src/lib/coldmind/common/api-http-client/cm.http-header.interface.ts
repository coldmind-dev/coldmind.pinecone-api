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

import { IMetadata }  from "@lib/coldmind";
import { TPrimitive } from "@lib/coldmind";

/**
 * Interface representing HTTP headers.
 */
export interface ICmHttpHeader extends IMetadata {
	/**
	 * Get the raw headers object.
	 * @returns The raw headers object.
	 */
	getRawHeaders(): Record<string, string>;

	/**
	 * Get the value of a header.
	 * @param name - The name of the header.
	 * @returns The value of the header, or undefined if the header does not exist.
	 */
	get(name: string): string | undefined;

	/**
	 * Set the value of a header.
	 * @param name - The name of the header.
	 * @param value - The value to set for the header.
	 */
	set(name: string, value: string): void;

	/**
	 * Convert the headers to an internal Record<string, PrimitiveType>.
	 * @returns The headers as an internal Record<string, PrimitiveType>.
	 */
	toInternalRecord(): Record<string, TPrimitive>;
}
