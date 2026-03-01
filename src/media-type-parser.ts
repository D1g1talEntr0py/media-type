import { MediaTypeParameters } from './media-type-parameters.js';
import { httpTokenCodePoints } from './utils.js';

const whitespaceChars = new Set([' ', '\t', '\n', '\r']);
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

		let position = 0;
		const [ type, typeEnd ] = MediaTypeParser.collect(input, position, ['/']);
		position = typeEnd;

		if (!type.length || position >= input.length || !httpTokenCodePoints.test(type)) {
			throw new TypeError(MediaTypeParser.generateErrorMessage('type', type));
		}

		++position; // Skip "/"
		const [ subtype, subtypeEnd ] = MediaTypeParser.collect(input, position, [';'], true, true);
		position = subtypeEnd;

		if (!subtype.length || !httpTokenCodePoints.test(subtype)) {
			throw new TypeError(MediaTypeParser.generateErrorMessage('subtype', subtype));
		}

		const parameters = new MediaTypeParameters();

		while (position < input.length) {
			++position; // Skip ";"
			while (whitespaceChars.has(input[position]!)) { ++position }

			let name: string;
			[name, position] = MediaTypeParser.collect(input, position, [';', '='], false);

			if (position >= input.length || input[position] === ';') { continue }

			++position; // Skip "="

			let value: string;
			if (input[position] === '"') {
				[ value, position ] = MediaTypeParser.collectHttpQuotedString(input, position);
				while (position < input.length && input[position] !== ';') { ++position }
			} else {
				[ value, position ] = MediaTypeParser.collect(input, position, [';'], false, true);
				if (!value) { continue }
			}

			if (name && MediaTypeParameters.isValid(name, value) && !parameters.has(name)) {
				parameters.set(name, value);
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
	 * Collects characters from `input` starting at `pos` until a stop character is found.
	 * @param input The input string.
	 * @param pos The starting position.
	 * @param stopChars Characters that end collection.
	 * @param lowerCase Whether to ASCII-lowercase the result.
	 * @param trim Whether to strip trailing HTTP whitespace.
	 * @returns A tuple of the collected string and the updated position.
	 */
	private static collect(input: string, pos: number, stopChars: string[], lowerCase = true, trim = false): [string, number] {
		let result = '';
		for (const { length } = input; pos < length && !stopChars.includes(input[pos]!); pos++) {
			result += input[pos];
		}

		if (lowerCase) { result = result.toLowerCase() }
		if (trim) { result = result.replace(trailingWhitespace, '') }

		return [result, pos];
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