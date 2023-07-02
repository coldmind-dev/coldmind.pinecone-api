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

import { expect } from 'chai';
import { CmAction } from './cm.action';

describe('CmAction', () => {
	describe('createSuccessAction', () => {
		it('should create a successful action', () => {
			const data = { name: 'Axl Rose' };
			const eventType = 'successEvent';
			const action = CmAction.createSuccessAction(data, eventType);

			expect(action.data).to.deep.equal(data);
			expect(action.eventType).to.equal(eventType);
			expect(action.error).to.be.false;
		});
	});

	describe('createErrorAction', () => {
		it('should create an error action', () => {
			const data = { message: 'Error occurred' };
			const eventType = 'errorEvent';
			const action = CmAction.createErrorAction(data, eventType);

			expect(action.data).to.deep.equal(data);
			expect(action.eventType).to.equal(eventType);
			expect(action.error).to.be.true;
		});
	});

	describe('fromEvent', () => {
		it('should create an action object from an event', () => {
			const eventType = 'customEvent';
			const data = { value: 42 };
			const error = false;
			const action = CmAction.fromEvent(eventType, data, error);

			expect(action.data).to.deep.equal(data);
			expect(action.eventType).to.equal(eventType);
			expect(action.error).to.be.false;
		});
	});

	describe('setData', () => {
		it('should set the data associated with the action', () => {
			const initialData = { value: 10 };
			const updatedData = { value: 20 };
			const action = new CmAction(initialData);

			const updatedAction = action.setData(updatedData);

			expect(updatedAction.data).to.deep.equal(updatedData);
			expect(updatedAction.eventType).to.equal(action.eventType);
			expect(updatedAction.error).to.equal(action.error);
		});
	});

	describe('setError', () => {
		it('should set the error flag associated with the action', () => {
			const initialData = { value: 10 };
			const initialError = false;
			const newError = true;
			const action = new CmAction(initialData, undefined, initialError);

			const updatedAction = action.setError(newError);

			expect(updatedAction.data).to.deep.equal(action.data);
			expect(updatedAction.eventType).to.equal(action.eventType);
			expect(updatedAction.error).to.equal(newError);
		});
	});

	describe('setEventType', () => {
		it('should set the event type associated with the action', () => {
			const initialData = { value: 10 };
			const initialEventType = 'oldEvent';
			const newEventType = 'newEvent';
			const action = new CmAction(initialData, initialEventType);

			const updatedAction = action.setEventType(newEventType);

			expect(updatedAction.data).to.deep.equal(action.data);
			expect(updatedAction.eventType).to.equal(newEventType);
			expect(updatedAction.error).to.equal(action.error);
		});
	});

	describe('serialize', () => {
		it('should serialize the action object to a JSON string', () => {
			const data = { name: 'Axl Rose' };
			const eventType = 'customEvent';
			const action = new CmAction(data, eventType);

			const serialized = action.serialize();
			const expectedSerialized = JSON.stringify(action);

			expect(serialized).to.equal(expectedSerialized);
		});
	});

	describe('deserialize', () => {
		it('should deserialize a JSON string into an action object', () => {
			const serialized = '{"data":{"name":"Axl Rose"},"eventType":"customEvent","error":false}';
			const expectedData = { name: 'Axl Rose' };
			const expectedEventType = 'customEvent';
			const expectedError = false;

			const action = CmAction.deserialize(serialized);

			expect(action.data).to.deep.equal(expectedData);
			expect(action.eventType).to.equal(expectedEventType);
			expect(action.error).to.equal(expectedError);
		});
	});
});
