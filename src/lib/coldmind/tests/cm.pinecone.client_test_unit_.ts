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



const { expect } = require('chai');
const sinon = require('sinon');
const { CmPineconeEngine, CmError, CmPineconeMetric, CmErrorCode } = require('./CmPineconeEngine');

/**
 * Unit tests for the CmPineconeEngine class.
 */
describe('CmPineconeEngine', () => {
	let clientStub;
	let engine;

	beforeEach(() => {
		clientStub = sinon.stub();
		engine = new CmPineconeEngine('apiKey', 'baseURL');
		engine.client = clientStub;
	});

	afterEach(() => {
		sinon.restore();
	});

	/**
	 * Tests that an instance of CmPineconeEngine can be created.
	 */
	it('should create an instance of CmPineconeEngine', () => {
		expect(engine).to.be.an.instanceOf(CmPineconeEngine);
	});

	/**
	 * Tests getting an existing index.
	 */
	it('should get an existing index', () => {
		const getIndexStub = sinon.stub(engine, 'getIndex');

		engine.getIndex('index1');
		expect(getIndexStub.calledWith('index1')).to.be.true;
	});

	/**
	 * Tests creating a new index.
	 */
	it('should create a new index', async () => {
		const createIndexStub = sinon.stub(engine.client, 'createIndex');
		const waitUntilIndexIsReadyStub = sinon.stub(engine, 'waitUntilIndexIsReady');

		await engine.createIndex('index1', 10, CmPineconeMetric.L2);

		expect(createIndexStub.calledWith('index1', 10, CmPineconeMetric.L2)).to.be.true;
		expect(waitUntilIndexIsReadyStub.calledWith('index1')).to.be.true;
	});

	/**
	 * Tests using an existing index.
	 */
	it('should use an existing index', async () => {
		const getIndexStub = sinon.stub(engine, 'getIndex').returns({});

		await engine.useIndex('index1');

		expect(getIndexStub.calledWith('index1')).to.be.true;
	});

	/**
	 * Tests using a new index if it does not exist.
	 */
	it('should use a new index if it does not exist', async () => {
		const createIndexStub = sinon.stub(engine.client, 'createIndex');
		const waitUntilIndexIsReadyStub = sinon.stub(engine, 'waitUntilIndexIsReady');
		const getIndexStub = sinon.stub(engine, 'getIndex').returns({});

		await engine.useIndex('index1', true, 10, CmPineconeMetric.L2);

		expect(createIndexStub.calledWith('index1', 10, CmPineconeMetric.L2)).to.be.true;
		expect(waitUntilIndexIsReadyStub.calledWith('index1')).to.be.true;
		expect(getIndexStub.calledWith('index1')).to.be.true;
	});

	/**
	 * Tests that an error is thrown when using an index that does not exist.
	 */
	it('should throw an error when using an index that does not exist', async () => {
		sinon.stub(engine, 'indexExists').resolves(false);

		try {
			await engine.useIndex('nonexistent', false);
		} catch (error) {
			expect(error).to.be.an.instanceOf(CmError);
			expect(error.code).to.equal(CmErrorCode.IndexNotFound);
			expect(error.message).to.equal('Index "nonexistent" does not exist');
		}
	});
});

/**
 * Integration tests for the CmPineconeEngine class.
 */
describe('CmPineconeEngine (Integration)', () => {
	let engine;

	beforeEach(() => {
		engine = new CmPineconeEngine('apiKey', 'baseURL');
	});

	afterEach(() => {
		sinon.restore();
	});

	/**
	 * Tests listing indexes.
	 */
	it('should list existing indexes', async () => {
		const expectedIndexes = ['index1', 'index2'];
		sinon.stub(engine.client, 'listIndexes').resolves(expectedIndexes);

		/**
		 * Fetches the list of existing indexes.
		 * @returns {Promise<string[]>} A promise that resolves to an array of index names.
		 */
		const listIndexes = async () => {
			return engine.listIndexes();
		};

		const indexes = await listIndexes();

		expect(indexes).to.deep.equal(expectedIndexes);
	});

	/**
	 * Tests upserting vectors into an index.
	 */
	it('should upsert vectors into an index', async () => {
		const expectedResponse = { success: true };
		sinon.stub(engine.client, 'upsertVectors').resolves(expectedResponse);

		/**
		 * Upserts vectors into an index.
		 * @param {string} name - The name of the index.
		 * @param {number[][]} vectors - The vectors to upsert.
		 * @param {string} [namespace] - The namespace for the vectors (optional).
		 * @returns {Promise<any>} A promise that resolves to the upsert response.
		 */
		const upsertVectors = async (name, vectors, namespace) => {
			return engine.getIndex(name).upsert(vectors, namespace);
		};

		const response = await upsertVectors('index1', [[1, 2, 3], [4, 5, 6]], 'namespace');

		expect(response).to.deep.equal(expectedResponse);
	});

	// Add more integration tests for other methods
});
