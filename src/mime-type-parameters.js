import { asciiLowercase, solelyContainsHTTPTokenCodePoints, solelyContainsHTTPQuotedStringTokenCodePoints } from './utils.js';

/**
 * Class representing the parameters for a MIME type record.
 * This class has the equivalent surface API to a JavaScript {@link Map}.
 * 
 * However, {@link MIMETypeParameters} methods will always interpret their arguments 
 * as appropriate for MIME types, so parameter names will be lowercased, 
 * and attempting to set invalid characters will throw an {@link Error}.
 * 
 * @example charset=utf-8
 * @module MIMETypeParameters
 */
export default class MIMETypeParameters {
	/**
	 * Create a new MIMETypeParameters instance.
	 * 
	 * @param {Map.<string, string>} map The map of parameters for a MIME type.
	 */
  constructor(map) {
    this._map = map;
  }

	/**
	 * Gets the number of MIME type parameters.
	 * 
	 * @returns {number} The number of MIME type parameters
	 */
  get size() {
    return this._map.size;
  }

	/**
	 * Gets the MIME type parameter value for the supplied name.
	 * 
	 * @param {string} name The name of the MIME type parameter to retrieve.
	 * @returns {string} The MIME type parameter value.
	 */
  get(name) {
    return this._map.get(asciiLowercase(String(name)));
  }

	/**
	 * Indicates whether the MIME type parameter with the specified name exists or not.
	 * 
	 * @param {string} name The name of the MIME type parameter to check.
	 * @returns {boolean} true if the MIME type parameter exists, false otherwise.
	 */
  has(name) {
    return this._map.has(asciiLowercase(String(name)));
  }

	/**
	 * Adds a new MIME type parameter using the specified name and value to the MIMETypeParameters.
	 * If an parameter with the same name already exists, the parameter will be updated.
	 * 
	 * @param {string} name The name of the MIME type parameter to set.
	 * @param {string} value The MIME type parameter value.
	 * @returns {MIMETypeParameters} This instance.
	 */
  set(name, value) {		
    name = asciiLowercase(String(name));
    value = String(value);

    if (!solelyContainsHTTPTokenCodePoints(name)) {
      throw new Error(`Invalid MIME type parameter name "${name}": only HTTP token code points are valid.`);
    }

    if (!solelyContainsHTTPQuotedStringTokenCodePoints(value)) {
      throw new Error(`Invalid MIME type parameter value "${value}": only HTTP quoted-string token code points are valid.`);
    }

		this._map.set(name, value);

    return this;
  }

	/**
	 * Clears all the MIME type parameters.
	 */
  clear() {
    this._map.clear();
  }

	/**
	 * Removes the MIME type parameter using the specified name.
	 * 
	 * @returns {boolean} true if the parameter existed and has been removed, or false if the parameter does not exist.
	 */
  delete(name) {
    name = asciiLowercase(String(name));
    return this._map.delete(name);
  }

	/**
	 * Executes a provided function once per each name/value pair in the MIMETypeParameters, in insertion order.
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
	 * @returns {IterableIterator.<string>} The {@link IterableIterator} of MIME type parameter names.
	 */
  keys() {
    return this._map.keys();
  }

	/**
	 * Returns an iterable of parameter values.
	 * 
	 * @returns {IterableIterator.<string>} The {@link IterableIterator} of MIME type parameter values.
	 */
  values() {
    return this._map.values();
  }

	/**
	 * Returns an iterable of name, value pairs for every parameter entry in the MIME type parameters.
	 * 
	 * @returns {IterableIterator.<[string, string]>}
	 */
  entries() {
    return this._map.entries();
  }

	/**
	 * A method that returns the default iterator for the {@link MIMETypeParameters}. Called by the semantics of the for-of statement.
	 * @returns {Iterator.<string, string, undefined>} The {@link Symbol.iterator} for the MIME type parameters.
	 */
  [Symbol.iterator]() {
    return this._map[Symbol.iterator]();
  }
}