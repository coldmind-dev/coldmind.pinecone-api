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

export interface ICmSimpleMap<K, V> {
	/**
	 * Retrieves the value associated with the specified key.
	 * @param key - The key to retrieve the value for.
	 * @returns The value associated with the key, or undefined if the key is not found.
	 */
	get(key: K): V | undefined;

	/**
	 * Associates the specified value with the specified key.
	 * @param key - The key to set the value for.
	 * @param value - The value to associate with the key.
	 */
	set(key: K, value: V): void;

	/**
	 * Checks if the map contains the specified key.
	 * @param key - The key to check for.
	 * @returns True if the key exists in the map, false otherwise.
	 */
	has(key: K): boolean;

	/**
	 * Deletes the specified key and its associated value from the map.
	 * @param key - The key to delete.
	 * @returns True if the key was found and deleted, false otherwise.
	 */
	delete(key: K): boolean;
}

export class CmSimpleMap<K, V> implements ICmSimpleMap<K, V> {
	private map: Map<K, V>;

	constructor() {
		this.map = new Map<K, V>();
	}

	/**
	 * Retrieves the value associated with the specified key.
	 * @param key - The key to retrieve the value for.
	 * @returns The value associated with the key, or undefined if the key is not found.
	 */
	get(key: K): V | undefined {
		return this.map.get(key);
	}

	/**
	 * Associates the specified value with the specified key.
	 * @param key - The key to set the value for.
	 * @param value - The value to associate with the key.
	 */
	set(key: K, value: V): void {
		this.map.set(key, value);
	}

	/**
	 * Checks if the map contains the specified key.
	 * @param key - The key to check for.
	 * @returns True if the key exists in the map, false otherwise.
	 */
	has(key: K): boolean {
		return this.map.has(key);
	}

	/**
	 * Deletes the specified key and its associated value from the map.
	 * @param key - The key to delete.
	 * @returns True if the key was found and deleted, false otherwise.
	 */
	delete(key: K): boolean {
		return this.map.delete(key);
	}
}
