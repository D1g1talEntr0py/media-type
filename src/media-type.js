import { _type } from '@d1g1tal/chrysalis';
import MediaTypeParameters from './media-type-parameters.js';
import MediaTypeParser from './media-type-parser.js';

/**
 * Class used to parse media types.
 *
 * @module {MediaType} media-type
 * @see https://mimesniff.spec.whatwg.org/#understanding-mime-types
 */
export default class MediaType {
	/** @type {string} */
	#type;
	/** @type {string} */
	#subtype;
	/** @type {MediaTypeParameters} */
	#parameters;

	/**
	 * Create a new MediaType instance from a string representation.
	 *
	 * @param {string} mediaType The media type to parse.
	 * @param {Object} [parameters] Optional parameters.
	 */
	constructor(mediaType, parameters = {}) {
		if (_type(parameters) != Object) { throw new TypeError('The parameters argument must be an object') }
		({ type: this.#type, subtype: this.#subtype, parameters: this.#parameters } = MediaTypeParser.parse(mediaType));
		for (const [ name, value ] of Object.entries(parameters)) { this.#parameters.set(name, value) }
	}

	static parse(mediaType) {
		try {	return new MediaType(mediaType) } catch(e) { /* ignore */ }

		return null;
	}

	/**
	 * Gets the type.
	 *
	 * @returns {string} The type.
	 */
	get type() {
		return this.#type;
	}

	/**
	 * Gets the subtype.
	 *
	 * @returns {string} The subtype.
	 */
	get subtype() {
		return this.#subtype;
	}

	/**
	 * Gets the media type essence (type/subtype).
	 *
	 * @returns {string} The media type without any parameters
	 */
	get essence() {
		return `${this.#type}/${this.#subtype}`;
	}

	/**
	 * Gets the parameters.
	 *
	 * @returns {MediaTypeParameters} The media type parameters.
	 */
	get parameters() {
		return this.#parameters;
	}

	/**
	 * Checks if the media type matches the specified type.
	 *
	 * @todo Fix string handling to parse the type and subtype from the string.
	 * @param {MediaType|string} mediaType The media type to check.
	 * @returns {boolean} true if the media type matches the specified type, false otherwise.
	 */
	matches(mediaType) {
		return (this.#type === mediaType?.type && this.#subtype === mediaType?.subtype) || this.essence.includes(mediaType);
	}

	/**
	 * Gets the serialized version of the media type.
	 *
	 * @returns {string} The serialized media type.
	 */
	toString() {
		return `${this.essence}${this.#parameters.toString()}`;
	}

	/**
	 * Gets the name of the class.
	 *
	 * @returns {string} The class name
	 */
	get [Symbol.toStringTag]() {
		return 'MediaType';
	}
}