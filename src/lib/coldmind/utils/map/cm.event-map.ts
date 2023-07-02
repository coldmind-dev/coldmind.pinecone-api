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

import { CmEventEmitter } from "@lib/coldmind/common/events";

/**
 * Interface for the event listeners of a CustomMap.
 */
export interface ICmEventMap<K, V> {
	/**
	 * Event listener for the "onDelete" event.
	 * @param key - The key that was deleted.
	 */
	onDelete(key: K): void;

	/**
	 * Event listener for the "onSet" event.
	 * @param key - The key being set.
	 * @param value - The value being set.
	 * @param cancel - A function to cancel the operation. Calling this function will prevent the value from being set.
	 */
	onSet(key: K, value: V, cancel: () => void): void;

	/**
	 * Event listener for the "onGet" event.
	 * @param key - The key being retrieved.
	 * @param value - The value associated with the key, if found.
	 * @param override - A function to override the retrieved value. The overridden value will be returned instead.
	 */
	onGet(key: K, value?: V, override?: (value: V | undefined) => V | undefined): void;

	/**
	 * Event listener for the "onNoSuchKey" event.
	 * @param key - The key that does not exist in the map.
	 */
	onNoSuchKey(key: K): void;

	/**
	 * Get the value associated with the specified key.
	 * @param key - The key to retrieve the value for.
	 * @returns The value associated with the key, or undefined if the key does not exist.
	 */
	get(key: K): V | undefined;

	/**
	 * Set the value for the specified key.
	 * @param key - The key to set the value for.
	 * @param value - The value to set.
	 * @returns True if the value was successfully set, false if the operation was cancelled.
	 */
	set(key: K, value: V): boolean;

	/**
	 * Check if the map contains the specified key.
	 * @param key - The key to check for existence.
	 * @returns True if the key exists in the map, false otherwise.
	 */
	has(key: K): boolean;

	/**
	 * Delete the specified key from the map.
	 * @param key - The key to delete.
	 * @param cancel - A function to cancel the operation. Calling this function will prevent the key from being deleted.
	 * @returns True if the key was successfully deleted, false if the key does not exist or the operation was cancelled.
	 */
	delete(key: K, cancel?: () => void): boolean;
}

/**
 * A custom map implementation with event listeners.
 */
export class CmEventMap<K, V, EventTypes extends keyof any> extends CmEventEmitter<EventTypes> implements ICmEventMap<K, V> {
	private map: Map<K, V>;
	onDeleteListener: ((key: K) => void) | undefined;
	onSetListener: ((key: K, value: V, cancel: () => void) => void) | undefined;
	onGetListener: ((key: K, value?: V, override?: (value: V | undefined) => V | undefined) => void) | undefined;
	onNoSuchKeyListener: ((key: K) => void) | undefined;

	constructor() {
		super();
		this.map = new Map<K, V>();
	}

	/**
	 * Event handler for the "onDelete" event.
	 * @param key - The key that was deleted.
	 */
	onDelete(key: K): void {
		if (this.onDeleteListener) {
			this.onDeleteListener(key);
		}
	}

	/**
	 * Event handler for the "onSet" event.
	 * @param key - The key being set.
	 * @param value - The value being set.
	 * @param cancel - A function to cancel the operation. Calling this function will prevent the value from being set.
	 */
	onSet(key: K, value: V, cancel: () => void): void {
		if (this.onSetListener) {
			this.onSetListener(key, value, cancel);
		}
	}

	/**
	 * Event handler for the "onGet" event.
	 * @param key - The key being retrieved.
	 * @param value - The value associated with the key, if found.
	 * @param override - A function to override the retrieved value. The overridden value will be returned instead.
	 */
	onGet(key: K, value?: V, override?: (value: V | undefined) => V | undefined): void {
		if (this.onGetListener) {
			if (override) {
				const overriddenValue = override(value);
				if (overriddenValue !== undefined) {
					value = overriddenValue;
				}
			}
			this.onGetListener(key, value);
		}
	}

	/**
	 * Event handler for the "onNoSuchKey" event.
	 * @param key - The key that does not exist in the map.
	 */
	onNoSuchKey(key: K): void {
		if (this.onNoSuchKeyListener) {
			this.onNoSuchKeyListener(key);
		}
	}

	/**
	 * Get the value associated with the specified key.
	 * @param key - The key to retrieve the value for.
	 * @returns The value associated with the key, or undefined if the key does not exist.
	 */
	get(key: K): V | undefined {
		let value = this.map.get(key);

		if (this.onGetListener) {
			console.log("onGetListener :: key ::", key, " value ::", value);

			this.onGetListener(key, value, (overrideValue) => {
				if (overrideValue !== undefined) {
					value = overrideValue;
				}
				return value;
			});
		}

		return value;
	}

	/*
	get(key: K): V | undefined {
		const value = this.map.get(key);
		this.onGet(key, value);
		return value;
	}*/

	/**
	 * Set the value for the specified key.
	 * @param key - The key to set the value for.
	 * @param value - The value to set.
	 * @returns True if the value was successfully set, false if the operation was cancelled.
	 */
	set(key: K, value: V): boolean {
		let isCancelled = false;
		const cancel = () => {
			isCancelled = true;
		};

		if (this.onSetListener) {
			this.onSetListener(key, value, cancel);
		}

		if (isCancelled) {
			return false;
		}

		this.map.set(key, value);
		this.onSet(key, value, cancel);
		return true;
	}

	/**
	 * Check if the map contains the specified key.
	 * @param key - The key to check for existence.
	 * @returns True if the key exists in the map, false otherwise.
	 */
	has(key: K): boolean {
		return this.map.has(key);
	}

	/**
	 * Delete the specified key from the map.
	 * @param key - The key to delete.
	 * @param cancel - A function to cancel the operation. Calling this function will prevent the key from being deleted.
	 * @returns True if the key was successfully deleted, false if the key does not exist or the operation was cancelled.
	 */
	delete(key: K, cancel?: () => void): boolean {
		if (!this.map.has(key)) {
			this.onNoSuchKey(key);
			return false;
		}

		let isCancelled = false;
		const cancelOperation = () => {
			isCancelled = true;
		};

		if (cancel) {
			cancel = () => {
				isCancelled = true;
				cancelOperation();
			};
		} else {
			cancel = cancelOperation;
		}

		if (this.onSetListener) {
			this.onSetListener(key, this.map.get(key) as V, cancel);
		}

		if (isCancelled) {
			return false;
		}

		this.map.delete(key);
		this.onDelete(key);
		return true;
	}
}

/*/ Usage example:

const eventMap = new CmEventMap<number, string>();

// onDeleteListener example
eventMap.onDeleteListener = (key) => {
	console.log(`Deleted key: ${key}`);
};

// onSetListener example
eventMap.onSetListener = (key, value, cancel) => {
	console.log(`Setting key: ${key} with value: ${value}`);
	if (value === "") {
		console.log("Value cannot be empty.");
		cancel();
	}
};

// onGetListener example
eventMap.onGetListener = (key, value, override) => {
	if (value) {
		console.log(`Retrieved value for key: ${key} - ${value}`);
		if (override) {
			const overriddenValue = override(value);
			console.log(`Overridden value for key: ${key} - ${overriddenValue}`);
		}
	} else {
		console.log(`No value found for key: ${key}`);
	}
};

// onNoSuchKeyListener example
eventMap.onNoSuchKeyListener = (key) => {
	console.log(`No value found for key: ${key}`);
};



eventMap.onGetListener = (key, value, override) => {
	if (key == 45) {
		override("override my balls");
	}
	else if (value) {
		console.log(`Retrieved value for key: ${ key } - ${ value }`);

	}
	else {
		console.log(`No value found for key: ${ key }`);
	}
};

eventMap.onNoSuchKeyListener = (key) => {
	console.log(`No value found for key: ${ key }`);
};

eventMap.set(1, "Hello"); // Setting key: 1 with value: Hello
eventMap.set(2, ""); // Setting key: 2 with value:
// Value cannot be empty.
eventMap.set(45, "Sucki Suck");
eventMap.get(1); // Retrieved value for key: 1 - Hello
eventMap.get(2); // No value found for key: 2
eventMap.delete(1); // Deleted key: 1
eventMap.delete(2); // No value found for key: 2

//eventMap.onGet()

console.log("RESULT ::",
			eventMap.get(45)
);
*/
