import MediaTypeParameters from './media-type-parameters.js';
import parse from './parser.js';
import serialize from './serializer.js';
import { asciiLowercase, solelyContainsHTTPTokenCodePoints } from './utils.js';

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
	 * @param {string|object} options The media type string or an object with type, subtype, and parameters.
	 */
	constructor(options) {
		// If options is a string, parse it
		if (typeof options === 'string') {
			options = parse(options);
		}

		const { type, subtype, parameters = new MediaTypeParameters() } = options;
		this.#type = type;
		this.#subtype = subtype;

		// Check if parameters are provided as a Map
		this.#parameters = typeof parameters == Map && parameters.size > 0	? new MediaTypeParameters(parameters.entries())	: parameters;
	}

	/**
	 * Static factory method for parsing a media type.
	 *
	 * @param {string} string The media type to parse.
	 * @returns {MediaType} The parsed {@link MediaType} object or null if the string could not be parsed.
	 */
	static parse(string) {
		try {
			return new MediaType(parse(string));
		} catch (e) {
			throw new Error(`Could not parse media type string '${string}'`);
		}
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
	 * Gets the type.
	 *
	 * @returns {string} The type.
	 */
	get type() {
		return this.#type;
	}

	/**
	 * Sets the type.
	 */
	set type(value) {
		value = asciiLowercase(String(value));

		if (value.length === 0) {
			throw new Error('Invalid type: must be a non-empty string');
		}
		if (!solelyContainsHTTPTokenCodePoints(value)) {
			throw new Error(`Invalid type ${value}: must contain only HTTP token code points`);
		}

		this.#type = value;
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
	 * Sets the subtype.
	 */
	set subtype(value) {
		value = asciiLowercase(String(value));

		if (value.length === 0) {
			throw new Error('Invalid subtype: must be a non-empty string');
		}
		if (!solelyContainsHTTPTokenCodePoints(value)) {
			throw new Error(`Invalid subtype ${value}: must contain only HTTP token code points`);
		}

		this.#subtype = value;
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
	 * Gets the serialized version of the media type.
	 *
	 * @returns {string} The serialized media type.
	 */
	toString() {
		// The serialize function works on both 'media type records' (i.e. the results of parse) and on this class, since
		// this class's interface is identical.
		return serialize(this);
	}

	/**
	 * Determines if this instance is a JavaScript media type.
	 *
	 * @param {Object} [options] Optional options.
	 * @param {boolean} [options.prohibitParameters=false] The option to prohibit parameters when checking if the media type is JavaScript.
	 * @returns {boolean} true if this instance represents a JavaScript media type, false otherwise.
	 */
	isJavaScript({prohibitParameters = false} = {}) {
		switch (this.#type) {
			case 'text': {
				switch (this.#subtype) {
					case 'ecmascript':
					case 'javascript':
					case 'javascript1.0':
					case 'javascript1.1':
					case 'javascript1.2':
					case 'javascript1.3':
					case 'javascript1.4':
					case 'javascript1.5':
					case 'jscript':
					case 'livescript':
					case 'x-ecmascript':
					case 'x-javascript': return !prohibitParameters || this.#parameters.size === 0;
					default: return false;
				}
			}
			case 'application': {
				switch (this.#subtype) {
					case 'ecmascript':
					case 'javascript':
					case 'x-ecmascript':
					case 'x-javascript': return !prohibitParameters || this.#parameters.size === 0;
					default: return false;
				}
			}
			default: return false;
		}
	}

	/**
	 * Determines if this instance is an XML media type.
	 *
	 * @returns {boolean} true if this instance represents an XML media type, false otherwise.
	 */
	isXML() {
		return (this.#subtype === 'xml' && (this.#type === 'text' || this.#type === 'application')) || this.#subtype.endsWith('+xml');
	}

	/**
	 * Determines if this instance is an HTML media type.
	 *
	 * @returns {boolean} true if this instance represents an HTML media type, false otherwise.
	 */
	isHTML() {
		return this.#subtype === 'html' && this.#type === 'text';
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