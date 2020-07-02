import * as assert from 'assert';
import * as fs from 'fs';
import * as Sinon from 'sinon';

import { moduleGetVersion } from '../moduleGetVersion';

const fakeExists = Sinon.stub(fs, "existsSync");
const fakeReadFile = Sinon.stub(fs, "readFileSync");

describe('utils | moduleGetVersion', () => {
	it('returns 0 if no file exists', () => {
		fakeExists.returns(false);
		assert.strictEqual(moduleGetVersion('/test'), '0');
		fakeExists.reset();
	});

	describe('file exists',() => {
		beforeEach(() => {
			fakeExists.callsFake(() => true);
		});

		afterEach(() => {
			fakeReadFile.reset();
		});
		
		it('returns 0 if the package file has no version', () => {
			fakeReadFile.returns(`{}`);
			assert.strictEqual(moduleGetVersion('/test'), '0');
		});
		
		it('returns the package version', () => {
			fakeReadFile.returns(JSON.stringify({ version: "1.1.0" }));
			assert.strictEqual(moduleGetVersion('/test'), '1.1.0');
		});
	});
});