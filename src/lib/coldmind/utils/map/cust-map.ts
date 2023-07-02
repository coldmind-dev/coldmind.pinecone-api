interface ICmEventMap<K, V> {
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

export class CmEventMap<K, V> implements ICmEventMap<K, V> {
	private map: Map<K, V>;
	public onDeleteListener: ( (key: K) => void ) | undefined;
	public onSetListener: ( (key: K, value: V, cancel: () => void) => void ) | undefined;
	public onGetListener: ( (key: K,
							 value?: V,
							 override?: (value: V | undefined) => V | undefined
	) => void ) | undefined;
	public onNoSuchKeyListener: ( (key: K) => void ) | undefined;

	constructor() {
		this.map = new Map<K, V>();
	}

	/**
	 * Event handler for the "onDelete" event.
	 */
	onDelete(key: K): void {
		if (this.onDeleteListener) {
			this.onDeleteListener(key);
		}
	}

	/**
	 * Event handler for the "onSet" event.
	 */
	onSet(key: K, value: V, cancel: () => void): void {
		if (this.onSetListener) {
			this.onSetListener(key, value, cancel);
		}
	}

	/**
	 * Event handler for the "onGet" event.
	 */
	onGet(key: K, value?: V, override?: (value: V | undefined) => V | undefined): void {

		if (this.onGetListener) {
			this.onGetListener(key, value, (overrideValue) => {
				if (overrideValue !== undefined) {
					value = overrideValue;
				}
				return value;
			});
		}
	}

	/**
	 * Event handler for the "onNoSuchKey" event.
	 */
	onNoSuchKey(key: K): void {
		if (this.onNoSuchKeyListener) {
			this.onNoSuchKeyListener(key);
		}
	}

	/**
	 * Get the value associated with the specified key.
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

	/**
	 * Set the value for the specified key.
	 */
	set(key: K, value: V): boolean {
		let isCancelled = false;
		const cancel    = () => {
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
	 */
	has(key: K): boolean {
		return this.map.has(key);
	}

	/**
	 * Delete the specified key from the map.
	 */
	delete(key: K, cancel?: () => void): boolean {
		if ( !this.map.has(key)) {
			this.onNoSuchKey(key);
			return false;
		}

		let isCancelled       = false;
		const cancelOperation = () => {
			isCancelled = true;
		};

		if (cancel) {
			cancel = () => {
				isCancelled = true;
				cancelOperation();
			};
		}
		else {
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

// Usage:
let myMap1a = new CmEventMap<number, string>();

myMap1a.onSetListener = (key, value, cancel) => {
	console.log(`Setting key: ${ key } with value: ${ value }`);
	if (value === "") {
		console.log("Value cannot be empty.");
		cancel();
	}
};

myMap1a.onDeleteListener = (key) => {
	console.log(`Deleted key: ${ key }`);
};

myMap1a.onGetListener = (key, value, override) => {
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

myMap1a.onNoSuchKeyListener = (key) => {
	console.log(`No value found for key: ${ key }`);
};

myMap1a.set(1, "Hello"); // Setting key: 1 with value: Hello
myMap1a.set(2, ""); // Setting key: 2 with value:
// Value cannot be empty.
myMap1a.set(45, "Sucki Suck");
myMap1a.get(1); // Retrieved value for key: 1 - Hello
myMap1a.get(2); // No value found for key: 2
myMap1a.delete(1); // Deleted key: 1
myMap1a.delete(2); // No value found for key: 2

console.log("RESULT ::",
			myMap1a.get(45)
);
