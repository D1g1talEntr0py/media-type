import printableString from 'printable-string';
import { labelToName as encodingLabelToName } from '@exodus/bytes/encoding.js';
import testCases from './web-platform-tests/media-types.json';
import generatedTestCases from './web-platform-tests/generated-media-types.json';
import { MediaType } from '../src/media-type';
import { expect, describe, it } from 'vitest';

type TestCase = string | { input: string; output: string | null; encoding?: string | null; navigable?: boolean; };

describe('media-types.json', () => {
	runTestCases(testCases);
});

describe('generated-media-types.json', () => {
	runTestCases(generatedTestCases);
});

/**
 * Run the test cases.
 */
function runTestCases(cases: Array<TestCase | string>): void {
	for (const testCase of cases) {
		if (typeof testCase === 'string') {
			// It's a comment
			continue;
		}

		const printableVersion = printableString(testCase.input);
		const testName = printableVersion !== testCase.input ? `${testCase.input} (${printableString(testCase.input)})` :	testCase.input;

		it(testName, () => {
			if (testCase.output === null) {
				expect(() => new MediaType(testCase.input)).toThrow();
			} else {
				const mediaType = new MediaType(testCase.input);
				expect(mediaType.toString()).toEqual(testCase.output);

				const charset = mediaType.parameters.get('charset') ?? '';
				const encoding = encodingLabelToName(charset);
				if (testCase.encoding !== null && testCase.encoding !== undefined) {
					expect(encoding).toEqual(testCase.encoding);
				} else {
					expect(encoding).toEqual(null);
				}
			}
		});
	}
}