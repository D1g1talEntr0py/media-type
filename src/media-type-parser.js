import MediaTypeParameters from './media-type-parameters.js';
import httpTokenCodePoints from './utils.js';

const whitespaceCharacters = [' ', '\t', '\n', '\r'];
const trailingWhitespace = /[ \t\n\r]+$/u;
const leadingAndTrailingWhitespace = /^[ \t\n\r]+|[ \t\n\r]+$/ug;

export default class MediaTypeParser {
	/**
	 * Function to parse a media type.
	 *
	 * @static
	 * @param {string} input The media type to parse
	 * @returns {{ type: string, subtype: string, parameters: MediaTypeParameters }} An object populated with the parsed media type properties and any parameters.
	 */
	static parse(input) {
		input = input.replace(leadingAndTrailingWhitespace, '');

		const length = input.length, trim = true, lowerCase = false;
		let { position, result: type, subtype = '' } = MediaTypeParser.#filterComponent({ input }, '/');

		if (!type.length || position >= length || !httpTokenCodePoints.test(type)) { throw new TypeError(MediaTypeParser.#generateErrorMessage('type', type)) }

		({ position, result: subtype } = MediaTypeParser.#filterComponent({ position: ++position, input, trim }, ';')); // `++position` Skips past "/"

		if (!subtype.length || !httpTokenCodePoints.test(subtype)) { throw new TypeError(MediaTypeParser.#generateErrorMessage('subtype', subtype)) }

		let parameterName = '', parameterValue = null;
		const parameters = new MediaTypeParameters();

		while (position++ < length) { // `position++` Skips past "/"
			while (whitespaceCharacters.includes(input[position])) { ++position }

			({ position, result: parameterName } = MediaTypeParser.#filterComponent({ position, input, lowerCase }, ';', '='));

			if (position < length) {
				if (input[position] == ';') { continue }

				// Skip past "="
				++position;
			}

			if (input[position] == '"') {
				[ parameterValue, position ] = MediaTypeParser.#collectHttpQuotedString(input, position);

				while (position < length && input[position] != ';') { ++position }
			} else {
				({ position, result: parameterValue } = MediaTypeParser.#filterComponent({ position, input, lowerCase, trim }, ';'));

				if (!parameterValue) { continue }
			}

			if (parameterName && MediaTypeParameters.isValid(parameterName, parameterValue) && !parameters.has(parameterName)) {
				parameters.set(parameterName, parameterValue);
			}
		}

		return { type, subtype, parameters };
	}

	/**
	 * Filters a component from the input string.
	 *
	 * @private
	 * @static
	 * @param {Object} options The options.
	 * @param {number} [options.position] The starting position.
	 * @param {string} options.input The input string.
	 * @param {boolean} [options.lowerCase] Indicates whether the result should be lowercased.
	 * @param {boolean} [options.trim] Indicates whether the result should be trimmed.
	 * @param {string[]} charactersToFilter The characters to filter.
	 * @returns {{ position: number, result: string }} An object that includes the resulting string and updated position.
	 */
	static #filterComponent({ position = 0, input, lowerCase = true, trim = false }, ...charactersToFilter) {
		let result = '';
		for (const length = input.length; position < length && !charactersToFilter.includes(input[position]); position++) {
			result += input[position];
		}

		if (lowerCase) { result = result.toLowerCase() }
		if (trim) { result = result.replace(trailingWhitespace, '') }

		return { position, result };
	}

	/**
	 * Collects all the HTTP quoted strings.
	 * This variant only implements it with the extract-value flag set.
	 *
	 * @private
	 * @static
	 * @param {string} input The string to process.
	 * @param {number} position The starting position.
	 * @returns {Array<string|number>} An array that includes the resulting string and updated position.
	 */
	static #collectHttpQuotedString(input, position) {
		let value = '';

		for (let length = input.length, char; ++position < length;) {
			if ((char = input[position]) == '"') { break }

			value += char == '\\' && ++position < length ? input[position] : char;
		}

		return [ value, position ];
	}

	/**
	 * Generates an error message.
	 *
	 * @private
	 * @static
	 * @param {string} component The component name.
	 * @param {string} value The component value.
	 * @returns {string} The error message.
	 */
	static #generateErrorMessage(component, value) {
		return `Invalid ${component} "${value}": only HTTP token code points are valid.`;
	}
}