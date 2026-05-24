import { MediaTypeParameters } from './media-type-parameters.js';
import { httpTokenCodePoints } from './utils.js';

/**
 *  HTTP whitespace code points: SP (0x20), HT (0x09), LF (0x0A), CR (0x0D)
 * @see https://fetch.spec.whatwg.org/#http-whitespace
 * @param c The code point to check.
 * @returns true if the code point is HTTP whitespace, false otherwise.
 */
const isHttpWhitespace = (c: number): boolean => c === 0x20 || c === 0x09 || c === 0x0A || c === 0x0D;

// Direct references to Map.prototype methods so we can bypass the validation/lowercase
// performed by MediaTypeParameters.set when we already know the key is lowercased and
// the name/value pair has been validated.
const mapSet = Map.prototype.set as <K, V>(this: Map<K, V>, key: K, value: V) => Map<K, V>;
const mapHas = Map.prototype.has as <K>(this: Map<K, unknown>, key: K) => boolean;

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
	private constructor() {}

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

		// Collect type up to '/'
		while (position < length && input.charCodeAt(position) !== 0x2F /* / */) { position++ }
		if (position === 0 || position >= length) {
			throw new TypeError(MediaTypeParser.#generateErrorMessage('type', input.slice(0, position)));
		}
		let type = input.slice(0, position);
		if (!httpTokenCodePoints.test(type)) {
			throw new TypeError(MediaTypeParser.#generateErrorMessage('type', type));
		}
		type = type.toLowerCase();

		position++; // Skip "/"

		// Collect subtype up to ';' (with trailing whitespace trim)
		const subtypeStart = position;
		while (position < length && input.charCodeAt(position) !== 0x3B /* ; */) { position++ }
		let subtypeEnd = position;
		while (subtypeEnd > subtypeStart && isHttpWhitespace(input.charCodeAt(subtypeEnd - 1))) { subtypeEnd-- }
		if (subtypeEnd === subtypeStart) {
			throw new TypeError(MediaTypeParser.#generateErrorMessage('subtype', ''));
		}
		let subtype = input.slice(subtypeStart, subtypeEnd);
		if (!httpTokenCodePoints.test(subtype)) {
			throw new TypeError(MediaTypeParser.#generateErrorMessage('subtype', subtype));
		}
		subtype = subtype.toLowerCase();

		const parameters = new MediaTypeParameters();

		while (position < length) {
			position++; // Skip ";"

			// Skip leading HTTP whitespace
			while (position < length && isHttpWhitespace(input.charCodeAt(position))) { position++ }

			// Collect parameter name up to ';' or '='
			const nameStart = position;
			while (position < length) {
				const c = input.charCodeAt(position);
				if (c === 0x3B /* ; */ || c === 0x3D /* = */) break;
				position++;
			}
			const nameRaw = nameStart === position ? '' : input.slice(nameStart, position);

			if (position >= length || input.charCodeAt(position) === 0x3B) { continue }

			position++; // Skip "="

			let value: string;
			if (position < length && input.charCodeAt(position) === 0x22 /* " */) {
				position = MediaTypeParser.#collectHttpQuotedString(input, position, length);
				value = MediaTypeParser.#lastQuoted;
				// Advance to next ';'
				const semi = input.indexOf(';', position);
				position = semi === -1 ? length : semi;
			} else {
				const valStart = position;
				while (position < length && input.charCodeAt(position) !== 0x3B) { position++ }
				let valEnd = position;
				while (valEnd > valStart && isHttpWhitespace(input.charCodeAt(valEnd - 1))) { valEnd-- }
				if (valEnd === valStart) { continue }
				value = input.slice(valStart, valEnd);
			}

			if (nameRaw.length !== 0 && MediaTypeParameters.isValid(nameRaw, value)) {
				const lower = nameRaw.toLowerCase();
				if (!mapHas.call(parameters, lower)) {
					mapSet.call(parameters, lower, value);
				}
			}
		}

		return { type, subtype, parameters };
	}

	// Scratch slot for the quoted-string value to avoid allocating a tuple per call.
	static #lastQuoted: string = '';

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
		while (position < length) {
			const c = input.charCodeAt(position);
			if (c === 0x22 /* " */ || c === 0x5C /* \ */) break;
			position++;
		}

		if (position >= length) {
			MediaTypeParser.#lastQuoted = input.slice(start, position);
			return position;
		}
		if (input.charCodeAt(position) === 0x22) {
			MediaTypeParser.#lastQuoted = input.slice(start, position);
			return position + 1;
		}

		// Slow path: at least one backslash. Build the rest.
		let value = input.slice(start, position);
		while (position < length) {
			const c = input.charCodeAt(position);
			if (c === 0x22 /* " */) { position++; break }
			if (c === 0x5C /* \ */ && position + 1 < length) {
				position++;
				value += input[position];
			} else {
				value += input[position];
			}
			position++;
		}
		MediaTypeParser.#lastQuoted = value;
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
