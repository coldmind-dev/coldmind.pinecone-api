/**
 *  Coldmind - Pinecone API Client
 *
 *  This file is part of the Coldmind - Pinecone API Client project, an
 *  integration solution for the Pinecone database.
 *  @repository https://github.com/coldmind-dev/coldmind.pinecone-api.git
 *
 *  @author Patrik Forsberg
 *  @contact patrik.forsberg@coldmind.com
 *  @date 2023-07-01
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
 * Represents the union type of primitive types.
 */
export type TPrimitive = string | number | boolean | symbol | null | undefined;

/**
 * Represents the keys of the primitive types.
 * @typeparam T - The union type of primitive types.
 */
export type PrimitiveTypes<T extends TPrimitive> = keyof T;

/**
 * Represents a wrapper class for primitive values.
 * @template T - The type of the primitive value.
 */
export class Primitive<T extends TPrimitive> {
	private _value: T;

	/**
	 * Creates an instance of the Primitive class.
	 * @param value - The primitive value to wrap.
	 */
	constructor(value: T = undefined) {
		this._value = value;
	}

	/**
	 * Determines whether a value is a primitive.
	 * @param value - The value to check.
	 * @returns {boolean} - True if the value is a primitive, false otherwise.
	 */
	static isPrimitive(value: any): boolean {
		return value as TPrimitive !== undefined;
	}

	/**
	 * Sets the value of the primitive.
	 * @param value
	 * @returns {Primitive<T>}
	 */
	setValue(value: any): Primitive<T> {
		this._value = Primitive.toPrimitive(value);
		return this;
	}

	/**
	 * Creates a new instance of the Primitive class from a value.
	 * @param value
	 * @returns {Primitive<T>}
	 */
	static fromValue<T extends TPrimitive>(value: any): Primitive<T> {
		return new Primitive<T>(Primitive.toPrimitive(value));
	}

	/**
	 * Converts a value to its primitive representation.
	 * @param value - The value to convert.
	 * @returns The primitive representation of the value.
	 */
	static toPrimitive<T extends TPrimitive>(value: any): T {
		let result: T;
		if (typeof value === "object") {
			if (value instanceof Date) {
				result = value.getTime() as T;
			}
			else if (value instanceof RegExp) {
				result = value.toString() as T;
			}
			else if (typeof value.valueOf === "function") {
				const primitive = value.valueOf();
				if (typeof primitive === "object") {
					result = Primitive.toPrimitive(primitive) as T;
				} else
				result = primitive as T;
			}
		}
		else if (typeof value === "function") {
			result = Primitive.toPrimitive(value()) as T;
		}

		if (result === 'true') {
			value = true;
		} else if (result === 'false') {
			value = false;
		} else if (!isNaN(Number(result))) {
			value = Number(value).valueOf();
		}

		return value as T;
	}

	/**
	 * Retrieves the wrapped primitive value.
	 * @returns The wrapped primitive value.
	 */
	value(): T {
		return this._value;
	}

	/**
	 * Converts the wrapped primitive value to a string.
	 * @returns {string}
	 */
	toString(): string {

		return this._value.toString();
	}
}
