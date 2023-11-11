import printableString from 'printable-string';
import { labelToName as encodingLabelToName } from 'whatwg-encoding';
import generatedTestCases from './web-platform-tests/generated-media-types.json';
import testCases from './web-platform-tests/media-types.json';
import MediaType from '../src/media-type.js';

describe('media-types.json', () => {
	runTestCases(testCases);
});

describe('generated-media-types.json', () => {
	runTestCases(generatedTestCases);
});

/**
 *
 * @param {Object} cases The test cases to run
 */
function runTestCases(cases) {
	for (const testCase of cases) {
		if (typeof testCase === 'string') {
			// It's a comment
			continue;
		}

		const printableVersion = printableString(testCase.input);
		const testName = printableVersion !== testCase.input ? `${testCase.input} (${printableString(testCase.input)})` :	testCase.input;

		test(testName, () => {
			if (testCase.output === null) {
				expect(() => new MediaType(testCase.input)).toThrow();
			} else {
				const mediaType = new MediaType(testCase.input);
				expect(mediaType.toString()).toEqual(testCase.output);

				const charset = mediaType.parameters.get('charset');
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