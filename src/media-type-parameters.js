import httpTokenCodePoints from './utils.js';

const matcher = /(["\\])/ug;
const httpQuotedStringTokenCodePoints = /^[\t\u0020-\u007E\u0080-\u00FF]*$/u;

/**
 * Class representing the parameters for a media type record.
 * This class extends a JavaScript {@link Map}.
 *
 * However, {@link MediaTypeParameters} methods will always interpret their arguments
 * as appropriate for media types, so parameter names will be lowercased,
 * and attempting to set invalid characters will throw an {@link Error}.
 *
 * @extends Map
 * @see https://mimesniff.spec.whatwg.org/#mime-type-essence
 * @see https://mimesniff.spec.whatwg.org/#mime-type-essence-record
 * @see https://mimesniff.spec.whatwg.org/#mime-type-essence-record-creation
 * @see https://mimesniff.spec.whatwg.org/#mime-type-essence-record-creation-algorithm
 * @module {MediaTypeParameters} media-type-parameters
 * @author D1g1talEntr0py <jason.dimeo@gmail.com>
 */
export default class MediaTypeParameters extends Map {
	/**
	 * Create a new MediaTypeParameters instance.
	 *
	 * @param {Array<[string, string]>} entries An array of [name, value] tuples.
	 */
	constructor(entries = []) {
		super(entries);
	}

	/**
	 * Indicates whether the supplied name and value are valid media type parameters.
	 *
	 * @static
	 * @param {string} name The name of the media type parameter to validate.
	 * @param {string} value The media type parameter value to validate.
	 * @returns {boolean} true if the media type parameter is valid, false otherwise.
	 */
	static isValid(name, value) {
		return httpTokenCodePoints.test(name) && httpQuotedStringTokenCodePoints.test(value);
	}

	/**
	 * Gets the media type parameter value for the supplied name.
	 *
	 * @param {string} name The name of the media type parameter to retrieve.
	 * @returns {string} The media type parameter value.
	 */
	get(name) {
		return super.get(name.toLowerCase());
	}

	/**
	 * Indicates whether the media type parameter with the specified name exists or not.
	 *
	 * @param {string} name The name of the media type parameter to check.
	 * @returns {boolean} true if the media type parameter exists, false otherwise.
	 */
	has(name) {
		return super.has(name.toLowerCase());
	}

	/**
	 * Adds a new media type parameter using the specified name and value to the MediaTypeParameters.
	 * If an parameter with the same name already exists, the parameter will be updated.
	 *
	 * @param {string} name The name of the media type parameter to set.
	 * @param {string} value The media type parameter value.
	 * @returns {MediaTypeParameters} This instance.
	 */
	set(name, value) {
		if (!MediaTypeParameters.isValid(name, value)) {
			throw new Error(`Invalid media type parameter name/value: ${name}/${value}`);
		}

		super.set(name.toLowerCase(), value);

		return this;
	}

	/**
	 * Removes the media type parameter using the specified name.
	 *
	 * @param {string} name The name of the media type parameter to delete.
	 * @returns {boolean} true if the parameter existed and has been removed, or false if the parameter does not exist.
	 */
	delete(name) {
		return super.delete(name.toLowerCase());
	}

	/**
	 * Returns a string representation of the media type parameters.
	 *
	 * @override
	 * @returns {string} The string representation of the media type parameters.
	 */
	toString() {
		return Array.from(this).map(([ name, value ]) => `;${name}=${!value || !httpTokenCodePoints.test(value) ? `"${value.replace(matcher, '\\$1')}"` : value}`).join('');
	}

	/**
	 * Returns the name of this class.
	 *
	 * @override
	 * @returns {string} The name of this class.
	 */
	[Symbol.toStringTag]() {
		return 'MediaTypeParameters';
	}
}