import { httpTokenCodePoints } from './utils.js';

const matcher: RegExp = /(["\\])/ug;
const httpQuotedStringTokenCodePoints: RegExp = /^[\t\u0020-\u007E\u0080-\u00FF]*$/u;

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
		return super.get(name.toLowerCase());
	}

	/**
	 * Indicates whether the media type parameter with the specified name exists or not.
	 *
	 * @param name The name of the media type parameter to check.
	 * @returns true if the media type parameter exists, false otherwise.
	 */
	override has(name: string): boolean {
		return super.has(name.toLowerCase());
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

		super.set(name.toLowerCase(), value);

		return this;
	}

	/**
	 * Removes the media type parameter using the specified name.
	 *
	 * @param name The name of the media type parameter to delete.
	 * @returns true if the parameter existed and has been removed, or false if the parameter does not exist.
	 */
	override delete(name: string): boolean {
		return super.delete(name.toLowerCase());
	}

	/**
	 * Returns a string representation of the media type parameters.
	 *
	 * @returns The string representation of the media type parameters.
	 */
	override toString(): string {
		return Array.from(this).map(([ name, value ]) => `;${name}=${!value || !httpTokenCodePoints.test(value) ? `"${value.replace(matcher, '\\$1')}"` : value}`).join('');
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