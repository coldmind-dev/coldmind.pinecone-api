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
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { CmEventEmitter, ClientEventType } from './cm.event-emitter'; // Import the CmEventEmitter class

describe('CmEventEmitter', () => {
	let emitter: CmEventEmitter;

	beforeEach(() => {
		emitter = new CmEventEmitter();
	});

	it('should notify listeners for emitted events', () => {
		const event1Listener = sinon.spy();
		const event2Listener = sinon.spy();

		emitter.on(ClientEventType.Event1, event1Listener);
		emitter.on(ClientEventType.Event2, event2Listener);

		emitter.emit(ClientEventType.Event1, { message: 'Hello' });
		emitter.emit(ClientEventType.Event2, { count: 10, active: true });

		expect(event1Listener.calledOnce).to.be.true;
		expect(event1Listener.calledWith({ type: ClientEventType.Event1, metadata: { message: 'Hello' } })).to.be.true;

		expect(event2Listener.calledOnce).to.be.true;
		expect(event2Listener.calledWith({ type: ClientEventType.Event2, metadata: { count: 10, active: true } })).to.be.true;
	});

	it('should apply event filters to emitted events', () => {
		const event1Listener = sinon.spy();
		const event2Listener = sinon.spy();

		const event1Filter = (event: any) => {
			event.metadata.modified = true;
			return event;
		};

		const event2Filter = (event: any) => {
			if (event.metadata.token === 'secret') {
				return event;
			}
			return null;
		};

		emitter.addEventFilter(ClientEventType.Event1, event1Filter);
		emitter.addEventFilter(ClientEventType.Event2, event2Filter);
		emitter.on(ClientEventType.Event1, event1Listener);
		emitter.on(ClientEventType.Event2, event2Listener);

		emitter.emit(ClientEventType.Event1, { message: 'Hello' });
		emitter.emit(ClientEventType.Event2, { count: 10, active: true, token: 'secret' });

		expect(event1Listener.calledOnce).to.be.true;
		expect(event1Listener.calledWith({ type: ClientEventType.Event1, metadata: { message: 'Hello', modified: true } })).to.be.true;

		expect(event2Listener.calledOnce).to.be.true;
		expect(event2Listener.calledWith({ type: ClientEventType.Event2, metadata: { count: 10, active: true, token: 'secret' } })).to.be.true;
	});

	it('should mute and unmute event types', () => {
		const event1Listener = sinon.spy();
		const event2Listener = sinon.spy();

		emitter.on(ClientEventType.Event1, event1Listener);
		emitter.on(ClientEventType.Event2, event2Listener);

		emitter.mute(ClientEventType.Event1);
		emitter.mute(ClientEventType.Event2);

		emitter.emit(ClientEventType.Event1, { message: 'Hello' });
		emitter.emit(ClientEventType.Event2, { count: 10, active: true });

		expect(event1Listener.notCalled).to.be.true;
		expect(event2Listener.notCalled).to.be.true;

		emitter.unmute(ClientEventType.Event1);
		emitter.unmute(ClientEventType.Event2);

		emitter.emit(ClientEventType.Event1, { message: 'Hello' });
		emitter.emit(ClientEventType.Event2, { count: 10, active: true });

		expect(event1Listener.calledOnce).to.be.true;
		expect(event2Listener.calledOnce).to.be.true;
	});
});
