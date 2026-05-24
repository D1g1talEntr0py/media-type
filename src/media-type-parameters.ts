import { httpTokenCodePoints } from './utils.js';

const matcher: RegExp = /(["\\])/ug;
const httpQuotedStringTokenCodePoints: RegExp = /^[\t\u0020-\u007E\u0080-\u00FF]*$/u;

/**
 * Returns the ASCII-lowercased version of `s`, or `s` itself when no characters
 * require lowering. Avoids allocating a new string when input is already lowercase.
 * @param s The string to lowercase.
 * @returns The ASCII-lowercased version of `s`.
 */
const asciiLower = (s: string): string => {
	for (let i = 0, length = s.length; i < length; i++) {
		const c = s.charCodeAt(i);
		if (c >= 0x41 && c <= 0x5A) { return s.toLowerCase() }
	}

	return s;
};

/**
 * Class representing the parameters for a media type record.
 * This class extends a JavaScript Map<string, string>.
 *
 * However, MediaTypeParameters methods will always interpret their arguments
 * as appropriate for media types, so parameter names will be lowercased,
 * and attempting to set invalid characters will throw an Error.
 *
 * @see https://mimesniff.spec.whatwg.org
 * @author D1g1talEntr0py <jason.dimeo@gmail.com>
 */
export class MediaTypeParameters extends Map<string, string> {
	/**
	 * Create a new MediaTypeParameters instance.
	 *
	 * @param entries An array of [ name, value ] tuples.
	 */
	constructor(entries: Iterable<[string, string]> = []) {
		super(entries);
	}

	/**
	 * Indicates whether the supplied name and value are valid media type parameters.
	 *
	 * @param name The name of the media type parameter to validate.
	 * @param value The media type parameter value to validate.
	 * @returns true if the media type parameter is valid, false otherwise.
	 */
	static isValid(name: string, value: string): boolean {
		return httpTokenCodePoints.test(name) && httpQuotedStringTokenCodePoints.test(value);
	}

	/**
	 * Gets the media type parameter value for the supplied name.
	 *
	 * @param name The name of the media type parameter to retrieve.
	 * @returns The media type parameter value.
	 */
	override get(name: string): string | undefined {
		return super.get(asciiLower(name));
	}

	/**
	 * Indicates whether the media type parameter with the specified name exists or not.
	 *
	 * @param name The name of the media type parameter to check.
	 * @returns true if the media type parameter exists, false otherwise.
	 */
	override has(name: string): boolean {
		return super.has(asciiLower(name));
	}

	/**
	 * Adds a new media type parameter using the specified name and value to the MediaTypeParameters.
	 * If an parameter with the same name already exists, the parameter will be updated.
	 *
	 * @param name The name of the media type parameter to set.
	 * @param value The media type parameter value.
	 * @returns This instance.
	 */
	override set(name: string, value: string): this {
		if (!MediaTypeParameters.isValid(name, value)) {
			throw new Error(`Invalid media type parameter name/value: ${name}/${value}`);
		}

		super.set(asciiLower(name), value);

		return this;
	}

	/**
	 * Removes the media type parameter using the specified name.
	 *
	 * @param name The name of the media type parameter to delete.
	 * @returns true if the parameter existed and has been removed, or false if the parameter does not exist.
	 */
	override delete(name: string): boolean {
		return super.delete(asciiLower(name));
	}

	/**
	 * Returns a string representation of the media type parameters.
	 *
	 * @returns The string representation of the media type parameters.
	 */
	override toString(): string {
		let out = '';
		for (const [ name, value ] of this) {
			out += ';';
			out += name;
			out += '=';
			if (value.length === 0 || !httpTokenCodePoints.test(value)) {
				out += '"';
				out += value.replace(matcher, '\\$1');
				out += '"';
			} else {
				out += value;
			}
		}
		return out;
	}

	/**
	 * Returns the name of this class.
	 *
	 * @returns The name of this class.
	 */
	override get [Symbol.toStringTag](): string {
		return 'MediaTypeParameters';
	}
}
