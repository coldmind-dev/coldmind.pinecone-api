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

import { TPrimitive }    from "@lib/coldmind";
import { CmEventFilter } from "@lib/coldmind/common/events/cm.event-emitter";
import { ClientEvent }   from "@lib/coldmind/common/events/cm.event-emitter";
import { ClientEventType } from "@lib/coldmind/common/events/cm.event-emitter";

/**
 * Interface for the custom event emitter.
 */
export interface ICmEventEmitter {
	/**
	 * Register a listener for a specific event type.
	 * @param {ClientEventType} eventType - The event type to listen for.
	 * @param {(event: ClientEvent) => void} listener - The listener function to be called when the event is emitted.
	 */
	on<T extends ClientEventType>(
		eventType: T,
		listener: (event: ClientEvent<T, Record<string, TPrimitive>>) => void
	): void;

	/**
	 * Add an event filter for a specific event type.
	 * @param {ClientEventType} eventType - The event type to add the filter for.
	 * @param {CmEventFilter} filter - The event filter function to be applied.
	 */
	addEventFilter<T extends ClientEventType>(
		eventType: T,
		filter: CmEventFilter<T, Record<string, TPrimitive>>
	): void;

	/**
	 * Mute a specific event type.
	 * @param {ClientEventType} eventType - The event type to mute.
	 */
	mute(eventType: ClientEventType): void;

	/**
	 * Unmute a specific event type.
	 * @param {ClientEventType} eventType - The event type to unmute.
	 */
	unmute(eventType: ClientEventType): void;

	/**
	 * Emit an event with the specified event type and metadata.
	 * @param {ClientEventType} eventType - The event type to emit.
	 * @param {Record<string, TPrimitive>} metadata - The metadata associated with the event.
	 */
	emit<T extends ClientEventType>(
		eventType: T,
		metadata: Record<string, TPrimitive>
	): void;
}
