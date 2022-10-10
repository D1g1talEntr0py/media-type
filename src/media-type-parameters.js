import { asciiLowercase, solelyContainsHTTPQuotedStringTokenCodePoints, solelyContainsHTTPTokenCodePoints } from './utils.js';

/**
 * Class representing the parameters for a media type record.
 * This class has the equivalent surface API to a JavaScript {@link Map}.
 *
 * However, {@link MediaTypeParameters} methods will always interpret their arguments
 * as appropriate for media types, so parameter names will be lowercased,
 * and attempting to set invalid characters will throw an {@link Error}.
 *
 * @example charset=utf-8
 * @module MediaTypeParameters
 */
export default class MediaTypeParameters {
	/**
	 * Create a new MediaTypeParameters instance.
	 *
	 * @param {Map.<string, string>} map The map of parameters for a media type.
	 */
	constructor(map) {
		this._map = map;
	}

	/**
	 * Gets the number of media type parameters.
	 *
	 * @returns {number} The number of media type parameters
	 */
	get size() {
		return this._map.size;
	}

	/**
	 * Gets the media type parameter value for the supplied name.
	 *
	 * @param {string} name The name of the media type parameter to retrieve.
	 * @returns {string} The media type parameter value.
	 */
	get(name) {
		return this._map.get(asciiLowercase(String(name)));
	}

	/**
	 * Indicates whether the media type parameter with the specified name exists or not.
	 *
	 * @param {string} name The name of the media type parameter to check.
	 * @returns {boolean} true if the media type parameter exists, false otherwise.
	 */
	has(name) {
		return this._map.has(asciiLowercase(String(name)));
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
		name = asciiLowercase(String(name));
		value = String(value);

		if (!solelyContainsHTTPTokenCodePoints(name)) {
			throw new Error(`Invalid media type parameter name "${name}": only HTTP token code points are valid.`);
		}

		if (!solelyContainsHTTPQuotedStringTokenCodePoints(value)) {
			throw new Error(`Invalid media type parameter value "${value}": only HTTP quoted-string token code points are valid.`);
		}

		this._map.set(name, value);

		return this;
	}

	/**
	 * Clears all the media type parameters.
	 */
	clear() {
		this._map.clear();
	}

	/**
	 * Removes the media type parameter using the specified name.
	 *
	 * @param {string} name The name of the media type parameter to delete.
	 * @returns {boolean} true if the parameter existed and has been removed, or false if the parameter does not exist.
	 */
	delete(name) {
		name = asciiLowercase(String(name));
		return this._map.delete(name);
	}

	/**
	 * Executes a provided function once per each name/value pair in the MediaTypeParameters, in insertion order.
	 *
	 * @param {function(string, string): void} callback The function called on each iteration.
	 * @param {*} [thisArg] Optional object when binding 'this' to the callback.
	 */
	forEach(callback, thisArg) {
		this._map.forEach(callback, thisArg);
	}

	/**
	 * Returns an iterable of parameter names.
	 *
	 * @returns {IterableIterator<string>} The {@link IterableIterator} of media type parameter names.
	 */
	keys() {
		return this._map.keys();
	}

	/**
	 * Returns an iterable of parameter values.
	 *
	 * @returns {IterableIterator<string>} The {@link IterableIterator} of media type parameter values.
	 */
	values() {
		return this._map.values();
	}

	/**
	 * Returns an iterable of name, value pairs for every parameter entry in the media type parameters.
	 *
	 * @returns {IterableIterator<Array<Array<string>>>} The media type parameter entries.
	 */
	entries() {
		return this._map.entries();
	}

	/**
	 * A method that returns the default iterator for the {@link MediaTypeParameters}. Called by the semantics of the for-of statement.
	 *
	 * @returns {Iterator<string, string, undefined>} The {@link Symbol.iterator} for the media type parameters.
	 */
	[Symbol.iterator]() {
		return this._map[Symbol.iterator]();
	}
}