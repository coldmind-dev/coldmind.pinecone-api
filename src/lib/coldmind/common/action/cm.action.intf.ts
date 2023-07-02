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

/**
 * Represents the generic data associated with an action.
 * @template T - The type of the data associated with the action.
 * @template E - The type of the event associated with the action (optional).
 */
export interface ICmActionData<T, E = string, Err = any> {
	data: T;
	eventType?: E;
	error?: Err;
}

/**
 * Represents the interface for a generic action object.
 * @template T - The type of the data associated with the action.
 * @template E - The type of the event associated with the action (optional).
 * @template Err - The type of the error flag associated with the action (optional).
 */
export interface ICmAction<T, E = string, Err = any> extends ICmActionData<T, E> {
	success(): boolean;
	setData<U extends T>(data: U): ICmAction<U, E, Err>;
	setError<ErrType extends Err>(error: ErrType): ICmAction<T, E, ErrType>;
	setEventType<U extends E>(eventType: U): ICmAction<T, U, Err>;
}
