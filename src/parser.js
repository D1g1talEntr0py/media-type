import {
	asciiLowercase,
	collectAnHTTPQuotedString, isHTTPWhitespaceChar, removeLeadingAndTrailingHTTPWhitespace,
	removeTrailingHTTPWhitespace, solelyContainsHTTPQuotedStringTokenCodePoints, solelyContainsHTTPTokenCodePoints
} from './utils.js';

/**
 * Function to parse a media type.
 *
 * @module parser
 * @param {string} input The media type to parse
 * @returns {{ type: string, subtype: string, parameters: Map<string, string> }} An object populated with the parsed media type properties and any parameters.
 */
const parse = (input) => {
	input = removeLeadingAndTrailingHTTPWhitespace(input);

	let position = 0;
	let type = '';
	while (position < input.length && input[position] != '/') {
		type += input[position];
		++position;
	}

	if (type.length === 0 || !solelyContainsHTTPTokenCodePoints(type)) {
		return null;
	}

	if (position >= input.length) {
		return null;
	}

	// Skips past "/"
	++position;

	let subtype = '';
	while (position < input.length && input[position] != ';') {
		subtype += input[position];
		++position;
	}

	subtype = removeTrailingHTTPWhitespace(subtype);

	if (subtype.length === 0 || !solelyContainsHTTPTokenCodePoints(subtype)) {
		return null;
	}

	const mediaType = {
		type: asciiLowercase(type),
		subtype: asciiLowercase(subtype),
		parameters: new Map()
	};

	while (position < input.length) {
		// Skip past ";"
		++position;

		while (isHTTPWhitespaceChar(input[position])) {
			++position;
		}

		let parameterName = '';
		while (position < input.length && input[position] != ';' && input[position] != '=') {
			parameterName += input[position];
			++position;
		}
		parameterName = asciiLowercase(parameterName);

		if (position < input.length) {
			if (input[position] == ';') {
				continue;
			}

			// Skip past "="
			++position;
		}

		let parameterValue = null;
		if (input[position] == '"') {
			[parameterValue, position] = collectAnHTTPQuotedString(input, position);

			while (position < input.length && input[position] != ';') {
				++position;
			}
		} else {
			parameterValue = '';
			while (position < input.length && input[position] != ';') {
				parameterValue += input[position];
				++position;
			}

			parameterValue = removeTrailingHTTPWhitespace(parameterValue);

			if (parameterValue === '') {
				continue;
			}
		}

		if (parameterName.length > 0 &&	solelyContainsHTTPTokenCodePoints(parameterName) &&	solelyContainsHTTPQuotedStringTokenCodePoints(parameterValue) && !mediaType.parameters.has(parameterName)) {
			mediaType.parameters.set(parameterName, parameterValue);
		}
	}

	return mediaType;
};

export default parse;