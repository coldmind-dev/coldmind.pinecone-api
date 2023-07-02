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
 * Represents a client event.
 * @template T - The event type.
 * @template U - The type of the metadata associated with the event.
 */
export type ClientEvent<T extends keyof any, U> = {
	type: T;
	metadata: U;
};

/**
 * Represents an event filter function.
 * @template T - The event type.
 * @template U - The type of the metadata associated with the event.
 */
export type CmEventFilter<T extends keyof any, U> = (
	event: ClientEvent<T, U>
) => ClientEvent<T, U> | null;

/**
 * Represents an event with metadata.
 * @template T - The event type.
 * @template U - The type of the metadata associated with the event.
 */
export type EventWithMetadata<T extends keyof any, U> = {
	type: T;
	metadata: U;
};

/**
 * Represents the possible event types for the client.
 */
export type ClientEventType = keyof any;

/**
 * Custom event emitter for the client.
 * @template T - The enum type representing the event types.
 * @template U - The type of the metadata associated with the events.
 */
export class CmEventEmitter<T extends keyof any, U = any>  {
	/**
	 * The map of event listeners.
	 * @private
	 */
	private listeners: {
		[K in T]?: ((event: EventWithMetadata<K, U>) => void)[];
	};

	/**
	 * The map of event filters.
	 * @private
	 */
	private eventFilters: {
		[K in T]?: CmEventFilter<K, U>[];
	};

	/**
	 * The set of muted event types.
	 * @private
	 */
	private mutedEventTypes: Set<T>;

	/**
	 * Constructs a new CmEventEmitter instance.
	 */
	constructor() {
		this.listeners = {};
		this.eventFilters = {};
		this.mutedEventTypes = new Set<T>();
	}

	/**
	 * Register a listener for a specific event type.
	 * @param {T} eventType - The event type to listen for.
	 * @param {(event: EventWithMetadata<T, U>) => void} listener - The listener function to be called when the event is emitted.
	 */
	on<K extends T>(eventType: K, listener: (event: EventWithMetadata<K, U>) => void): void {
		if (!this.listeners[eventType]) {
			this.listeners[eventType] = [];
		}
		this.listeners[eventType]?.push(listener);
	}

	/**
	 * Add an event filter for a specific event type.
	 * @param {T} eventType - The event type to add the filter for.
	 * @param {CmEventFilter<T, U>} filter - The event filter function to be applied.
	 */
	addEventFilter<K extends T>(eventType: K, filter: CmEventFilter<K, U>): void {
		if (!this.eventFilters[eventType]) {
			this.eventFilters[eventType] = [];
		}
		this.eventFilters[eventType]?.push(filter);
	}

	/**
	 * Mute a specific event type.
	 * @param {T} eventType - The event type to mute.
	 */
	mute(eventType: T): void {
		this.mutedEventTypes.add(eventType);
	}

	/**
	 * Unmute a specific event type.
	 * @param {T} eventType - The event type to unmute.
	 */
	unmute(eventType: T): void {
		this.mutedEventTypes.delete(eventType);
	}

	/**
	 * Emit an event with the specified event type and metadata.
	 * @param {T} eventType - The event type to emit.
	 * @param {U} metadata - The metadata associated with the event.
	 */
	emit<K extends T>(eventType: K, metadata?: U): void {
		if (this.mutedEventTypes.has(eventType)) {
			return;
		}

		const event: EventWithMetadata<K, U> = {
			type: eventType,
			metadata,
		};

		const eventFilters = this.eventFilters[eventType];
		if (eventFilters) {
			eventFilters.forEach((filter) => {
				const filteredEvent = filter(event);
				if (filteredEvent) {
					this.notifyListeners(filteredEvent);
				}
			});
		} else {
			this.notifyListeners(event);
		}
	}

	/**
	 * Notify the listeners for the given event.
	 * @param {EventWithMetadata<T, U>} event - The event to notify the listeners about.
	 * @private
	 */
	private notifyListeners<K extends T>(event: EventWithMetadata<K, U>): void {
		const eventListeners = this.listeners[event.type];
		if (eventListeners) {
			eventListeners.forEach((listener) => listener(event));
		}
	}
}
