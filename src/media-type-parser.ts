import { MediaTypeParameters } from './media-type-parameters.js';
import { HTTP_QUOTED_VALUE_TABLE, HTTP_TOKEN_TABLE, isHttpWhitespace } from './utils.js';

const mapHas = Map.prototype.has;
const mapSet = Map.prototype.set;

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
	private constructor() {
		throw new Error('MediaTypeParser is a static class and cannot be instantiated');
	}

	/**
	 * Function to parse a media type.
	 * @param input The media type to parse
	 * @returns An object populated with the parsed media type properties and any parameters.
	 */
	static parse(input: string): ParsedMediaType {
		// Strip leading/trailing HTTP whitespace without an extra allocation when not needed.
		let start = 0;
		let end = input.length;

		while (start < end && isHttpWhitespace(input.charCodeAt(start))) { start++ }

		while (end > start && isHttpWhitespace(input.charCodeAt(end - 1))) { end-- }

		if (start !== 0 || end !== input.length) { input = input.slice(start, end) }

		const length = input.length;
		let position = 0;

		// Collect type up to '/' with fused token validation and uppercase detection
		let typeHasUpper = false;
		let typeValid = true;

		while (position < length) {
			const c = input.charCodeAt(position);
			if (c === 0x2F /* / */) break;
			if (c >= 128) {
				typeValid = false;
			} else {
				const flag = HTTP_TOKEN_TABLE[c];
				if (flag === 0) {
					typeValid = false;
				} else if (flag === 2) {
					typeHasUpper = true;
				}
			}
			position++;
		}

		if (position === 0 || position >= length || !typeValid) {
			throw new TypeError(MediaTypeParser.#generateErrorMessage('type', input.slice(0, position)));
		}

		const type = typeHasUpper ? input.slice(0, position).toLowerCase() : input.slice(0, position);

		position++; // Skip "/"

		// Collect subtype up to ';' (with trailing whitespace trim)
		const subtypeStart = position;
		let subtypeHasUpper = false;
		let subtypeValid = true;
		let subtypeInvalidAt = -1;

		while (position < length) {
			const c = input.charCodeAt(position);
			if (c === 0x3B /* ; */) break;
			if (c >= 128) {
				subtypeValid = false;
				if (subtypeInvalidAt === -1) { subtypeInvalidAt = position }
			} else {
				const flag = HTTP_TOKEN_TABLE[c];
				if (flag === 0) {
					subtypeValid = false;
					if (subtypeInvalidAt === -1) { subtypeInvalidAt = position }
				} else if (flag === 2) {
					subtypeHasUpper = true;
				}
			}
			position++;
		}

		let subtypeEnd = position;

		if (!subtypeValid) {
			while (subtypeEnd > subtypeStart && isHttpWhitespace(input.charCodeAt(subtypeEnd - 1))) { subtypeEnd-- }
			if (subtypeEnd === subtypeStart) {
				throw new TypeError(MediaTypeParser.#generateErrorMessage('subtype', ''));
			}
			subtypeValid = subtypeInvalidAt >= subtypeEnd;
		}

		if (subtypeEnd === subtypeStart || !subtypeValid) {
			throw new TypeError(MediaTypeParser.#generateErrorMessage('subtype', input.slice(subtypeStart, subtypeEnd)));
		}

		const subtype = subtypeHasUpper ? input.slice(subtypeStart, subtypeEnd).toLowerCase() : input.slice(subtypeStart, subtypeEnd);

		const parameters = new MediaTypeParameters();

		while (position < length) {
			position++; // Skip ";"

			// Skip leading HTTP whitespace
			while (position < length && isHttpWhitespace(input.charCodeAt(position))) { position++ }

			// Collect parameter name up to ';' or '=' with fused validation and uppercase detection
			const nameStart = position;
			let nameHasUpper = false;
			let nameValid = true;

			while (position < length) {
				const c = input.charCodeAt(position);
				if (c === 0x3B /* ; */ || c === 0x3D /* = */) break;
				if (c >= 128) {
					nameValid = false;
				} else {
					const flag = HTTP_TOKEN_TABLE[c];
					if (flag === 0) {
						nameValid = false;
					} else if (flag === 2) {
						nameHasUpper = true;
					}
				}
				position++;
			}

			const nameLength = position - nameStart;
			if (nameLength === 0) {
				nameValid = false;
			}

			if (position >= length || input.charCodeAt(position) === 0x3B /* ; */) { continue }

			position++; // Skip "="

			let value: string;
			let valValid = true;

			if (position < length && input.charCodeAt(position) === 0x22 /* " */) {
				position = MediaTypeParser.#collectHttpQuotedString(input, position, length);
				value = MediaTypeParser.#lastQuoted;
				valValid = MediaTypeParser.#lastQuotedValid;
				MediaTypeParser.#lastQuoted = '';
				// Advance to next ';'
				const semi = input.indexOf(';', position);
				position = semi === -1 ? length : semi;
			} else {
				const valStart = position;
				while (position < length && input.charCodeAt(position) !== 0x3B /* ; */) {
					const c = input.charCodeAt(position);
					if (c > 0xFF || HTTP_QUOTED_VALUE_TABLE[c] === 0) {
						valValid = false;
					}
					position++;
				}
				let valEnd = position;
				while (valEnd > valStart && isHttpWhitespace(input.charCodeAt(valEnd - 1))) { valEnd-- }
				if (valEnd === valStart) { continue }
				if (!valValid) {
					valValid = true;
					for (let i = valStart; i < valEnd; i++) {
						const c = input.charCodeAt(i);
						if (c > 0xFF || HTTP_QUOTED_VALUE_TABLE[c] === 0) {
							valValid = false;
							break;
						}
					}
				}
				value = input.slice(valStart, valEnd);
			}

			if (nameValid && valValid) {
				const name = nameHasUpper ? input.slice(nameStart, nameStart + nameLength).toLowerCase() : input.slice(nameStart, nameStart + nameLength);

				// Direct references to Map.prototype methods so we can bypass the validation/lowercase performed by
				// MediaTypeParameters.set when we already know the key is lowercased and the name/value pair has been validated.
				if (!mapHas.call(parameters, name)) { mapSet.call(parameters, name, value) }
			}
		}

		return { type, subtype, parameters };
	}

	// Scratch slots for the quoted-string value and validity to avoid allocating a tuple per call.
	static #lastQuoted: string = '';
	static #lastQuotedValid: boolean = true;

	/**
	 * Collects an HTTP quoted-string starting at `position` (which points at the opening `"`).
	 * Stores the decoded value in `#lastQuoted` and returns the new position (one past the
	 * closing `"`, or `length` if unterminated).
	 * @see https://httpwg.org/specs/rfc9110.html#token-syntax
	 * @param input The full input string being parsed.
	 * @param position The current position in the input (pointing at the opening `"`).
	 * @param length The length of the input string.
	 * @returns The new position after parsing the quoted string.
	 */
	static #collectHttpQuotedString(input: string, position: number, length: number): number {
		position++; // skip opening "

		// Fast path: scan for '"' or '\\' — most quoted strings have neither.
		const start = position;
		let valValid = true;

		while (position < length) {
			const c = input.charCodeAt(position);

			if (c === 0x22 /* " */ || c === 0x5C /* \ */) { break }

			if (c > 0xFF || HTTP_QUOTED_VALUE_TABLE[c] === 0) {
				valValid = false;
			}

			position++;
		}

		if (position >= length) {
			MediaTypeParser.#lastQuoted = input.slice(start, position);
			MediaTypeParser.#lastQuotedValid = valValid;
			return position;
		}
		if (input.charCodeAt(position) === 0x22) {
			MediaTypeParser.#lastQuoted = input.slice(start, position);
			MediaTypeParser.#lastQuotedValid = valValid;
			return position + 1;
		}

		// Slow path: append contiguous spans between escapes.
		let value = '';
		let segmentStart = start;
		while (position < length) {
			const c = input.charCodeAt(position);
			if (c === 0x22 /* " */) {
				value += input.slice(segmentStart, position);
				position++;
				segmentStart = position;
				break;
			}
			if (c === 0x5C /* \ */ && position + 1 < length) {
				value += input.slice(segmentStart, position);
				position++;
				segmentStart = position;
				const nextCode = input.charCodeAt(position);
				if (nextCode > 0xFF || HTTP_QUOTED_VALUE_TABLE[nextCode] === 0) {
					valValid = false;
				}
			} else {
				if (c > 0xFF || HTTP_QUOTED_VALUE_TABLE[c] === 0) {
					valValid = false;
				}
			}
			position++;
		}
		value += input.slice(segmentStart, position);
		MediaTypeParser.#lastQuoted = value;
		MediaTypeParser.#lastQuotedValid = valValid;
		return position;
	}

	/**
	 * Generates an error message.
	 * @param component The component name.
	 * @param value The component value.
	 * @returns The error message.
	 */
	static #generateErrorMessage(component: string, value: string): string {
		return `Invalid ${component} "${value}": only HTTP token code points are valid.`;
	}
}
