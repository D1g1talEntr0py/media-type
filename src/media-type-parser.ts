import { MediaTypeParameters } from './media-type-parameters.js';
import { httpTokenCodePoints } from './utils.js';

const whitespaceCharacters: string[] = [' ', '\t', '\n', '\r'];
const trailingWhitespace: RegExp = /[ \t\n\r]+$/u;
const leadingAndTrailingWhitespace: RegExp = /^[ \t\n\r]+|[ \t\n\r]+$/ug;

export interface MediaTypeComponent {
	position?: number;
	input: string;
	lowerCase?: boolean;
	trim?: boolean;
}

export interface ParsedMediaType {
	type: string;
	subtype: string;
	parameters: MediaTypeParameters;
}

/**
 * Parser for media types.
 * @see https://mimesniff.spec.whatwg.org/#parsing-a-mime-type
 * @author D1g1talEntr0py <jason.dimeo@gmail.com>
 */
export class MediaTypeParser {
	/**
	 * Function to parse a media type.
	 * @param input The media type to parse
	 * @returns An object populated with the parsed media type properties and any parameters.
	 */
	static parse(input: string): ParsedMediaType {
		input = input.replace(leadingAndTrailingWhitespace, '');

		const length = input.length, trim = true, lowerCase = false;
		const { position: initialPosition, result: type } = MediaTypeParser.filterComponent({ input }, '/');
		let position = initialPosition;

		if (!type.length || position >= length || !httpTokenCodePoints.test(type)) {
			throw new TypeError(MediaTypeParser.generateErrorMessage('type', type));
		}

		let subtype = '';
		({ position, result: subtype } = MediaTypeParser.filterComponent({ position: ++position, input, trim }, ';')); // `++position` Skips past "/"

		if (!subtype.length || !httpTokenCodePoints.test(subtype)) {
			throw new TypeError(MediaTypeParser.generateErrorMessage('subtype', subtype));
		}

		let parameterName = '';
		let parameterValue: string | null = null;
		const parameters = new MediaTypeParameters();

		while (position++ < length) { // `position++` Skips past "/"
			while (whitespaceCharacters.includes(input[position]!)) { ++position }

			({ position, result: parameterName } = MediaTypeParser.filterComponent({ position, input, lowerCase }, ';', '='));

			if (position < length) {
				if (input[position] == ';') { continue }

				// Skip past "="
				++position;
			}

			if (input[position] === '"') {
				[ parameterValue, position ] = MediaTypeParser.collectHttpQuotedString(input, position);

				while (position < length && input[position] !== ';') { ++position }
			} else {
				({ position, result: parameterValue } = MediaTypeParser.filterComponent({ position, input, lowerCase, trim }, ';'));

				if (!parameterValue) { continue }
			}

			if (parameterName && parameterValue !== null && MediaTypeParameters.isValid(parameterName, parameterValue) && !parameters.has(parameterName)) {
				parameters.set(parameterName, parameterValue);
			}
		}

		return { type, subtype, parameters };
	}

	/**
	 * Gets the name of this class.
	 * @returns The string tag of this class.
	 */
	get [Symbol.toStringTag](): string {
		return 'MediaTypeParser';
	}

	/**
	 * Filters a component from the input string.
	 * @param options The options.
	 * @param charactersToFilter The characters to filter.
	 * @returns An object that includes the resulting string and updated position.
	 */
	private static filterComponent({ position = 0, input, lowerCase = true, trim = false }: MediaTypeComponent, ...charactersToFilter: string[]): { position: number, result: string } {
		let result = '';
		for (const length = input.length; position < length && !charactersToFilter.includes(input[position]!); position++) {
			result += input[position];
		}

		if (lowerCase) { result = result.toLowerCase() }
		if (trim) { result = result.replace(trailingWhitespace, '') }

		return { position, result };
	}

	/**
	 * Collects all the HTTP quoted strings.
	 * This variant only implements it with the extract-value flag set.
	 * @param input The string to process.
	 * @param position The starting position.
	 * @returns An array that includes the resulting string and updated position.
	 */
	private static collectHttpQuotedString(input: string, position: number): [string, number] {
		let value = '';

		for (let length = input.length, char; ++position < length;) {
			if ((char = input[position]) === '"') { break }

			value += char == '\\' && ++position < length ? input[position] : char;
		}

		return [ value, position ];
	}

	/**
	 * Generates an error message.
	 * @param component The component name.
	 * @param value The component value.
	 * @returns The error message.
	 */
	private static generateErrorMessage(component: string, value: string): string {
		return `Invalid ${component} "${value}": only HTTP token code points are valid.`;
	}
}