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

import { ICmActionData } from "./cm.action.intf";
/**
 * Generic action object that acts as a result wrapper for various actions.
 * @template T - The type of the data associated with the action.
 * @template E - The type of the event associated with the action (optional).
 * @template Err - The type of the error flag associated with the action (optional).
 */
import { ICmAction }     from "./cm.action.intf";

export class CmAction<T, E = string, Err = any> implements ICmAction<T, E, Err> {
	readonly data: T;
	readonly eventType?: E;
	readonly error?: Err;

	/**
	 * Constructs an Action object.
	 * @param {T} data - The data associated with the action.
	 * @param {E} [eventType] - The event type associated with the action (optional).
	 * @param {Err} [error] - The error flag associated with the action (optional).
	 */
	constructor(data: T, eventType?: E, error?: Err) {
		this.data = data;
		this.eventType = eventType;
		this.error = error;
	}


	/**
	 * Checks if the action represents a successful result.
	 * @returns {boolean} - True if the action represents a successful result, false otherwise.
	 */
	success(): boolean {
		return !this.error;
	}

	/**
	 * Create a successful action.
	 * @param {T} data - The data associated with the action.
	 * @param {E} [eventType] - The event type associated with the action (optional).
	 * @returns {Action<T, E, false>} - The created successful action object.
	 */
	static createSuccessAction<T, E = string>(data: T, eventType?: E): CmAction<T, E, false> {
		return new CmAction<T, E, false>(data, eventType, false);
	}

	/**
	 * Create an error action.
	 * @param {T} data - The data associated with the action.
	 * @param {E} [eventType] - The event type associated with the action (optional).
	 * @returns {Action<T, E, true>} - The created error action object.
	 */
	static createErrorAction<T, E = string>(data: T, eventType?: E): CmAction<T, E, true> {
		return new CmAction<T, E, true>(data, eventType, true);
	}

	/**
	 * Create an action object from an event.
	 * @param {E} eventType - The event type associated with the action.
	 * @param {T} data - The data associated with the action.
	 * @param {boolean} [error] - The error flag associated with the action (optional).
	 * @returns {Action<T, E>} - The created action object.
	 */
	static fromEvent<T, E = string>(eventType: E, data: T, error?: boolean): CmAction<T, E> {
		return new CmAction<T, E>(data, eventType, error);
	}

	/**
	 * Set the data associated with the action.
	 * @param {U} data - The new data for the action.
	 * @returns {Action<U, E, Err>} - A new action object with the updated data.
	 */
	setData<U extends T>(data: U): CmAction<U, E, Err> {
		return new CmAction<U, E, Err>(data, this.eventType, this.error);
	}

	/**
	 * Set the error flag associated with the action.
	 * @param {ErrType} error - The new error flag for the action.
	 * @returns {Action<T, E, ErrType>} - A new action object with the updated error flag.
	 */
	setError<ErrType extends Err>(error: ErrType): CmAction<T, E, ErrType> {
		return new CmAction<T, E, ErrType>(this.data, this.eventType, error);
	}

	/**
	 * Set the event type associated with the action.
	 * @param {U} eventType - The new event type for the action.
	 * @returns {Action<T, U, Err>} - A new action object with the updated event type.
	 */
	setEventType<U extends E>(eventType: U): CmAction<T, U, Err> {
		return new CmAction<T, U, Err>(this.data, eventType, this.error);
	}

	/**
	 * Serialize the action object to a JSON string.
	 * @returns {string} - The JSON representation of the action object.
	 */
	serialize(): string {
		return JSON.stringify(this);
	}

	/**
	 * Deserialize a JSON string into an action object.
	 * @param {string} json - The JSON string to deserialize.
	 * @returns {Action<T, E, Err>} - The deserialized action object.
	 */
	static deserialize<T, E = string, Err = any>(json: string): CmAction<T, E, Err> {
		const parsedData: ICmActionData<T, E> = JSON.parse(json);
		return new CmAction<T, E, Err>(parsedData.data, parsedData.eventType, parsedData?.error);
	}
}
