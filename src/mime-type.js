import MIMETypeParameters from './mime-type-parameters.js';
import parse from './parser.js';
import serialize from './serializer.js';
import { asciiLowercase, solelyContainsHTTPTokenCodePoints } from './utils.js';

/**
 * Class used to parse MIME types.
 * 
 * @see https://mimesniff.spec.whatwg.org/#understanding-mime-types
 * @module MIMEType
 */
export default class MIMEType {
	/**
	 * Create a new MIMEType instance from a string representation.
	 * 
	 * @param {string} string 
	 */
  constructor(string) {
    string = String(string);
    const result = parse(string);
    if (result === null) {
      throw new Error(`Could not parse MIME type string '${string}'`);
    }

    this._type = result.type;
    this._subtype = result.subtype;
    this._parameters = new MIMETypeParameters(result.parameters);
  }

	/**
	 * Static factor method for parsing a MIME type.
	 * 
	 * @param {string} string 
	 * @returns {MIMEType}
	 */
  static parse(string) {
    try {
      return new this(string);
    } catch (e) {
      return null;
    }
  }

	/**
	 * Gets the MIME type essence (type/subtype).
	 * 
	 * @returns {string}
	 */
  get essence() {
    return `${this.type}/${this.subtype}`;
  }

	/**
	 * Gets the type.
	 * 
	 * @returns {string}
	 */
  get type() {
    return this._type;
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

    this._type = value;
  }

	/**
	 * Gets the subtype.
	 * 
	 * @returns {string}
	 */
  get subtype() {
    return this._subtype;
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

    this._subtype = value;
  }

	/**
	 * Gets the parameters.
	 * 
	 * @returns {MIMETypeParameters}
	 */
  get parameters() {
    return this._parameters;
  }

	/**
	 * Gets the serialized version of the MIME type.
	 * 
	 * @returns {string}
	 */
  toString() {
    // The serialize function works on both 'MIME type records' (i.e. the results of parse) and on this class, since
    // this class's interface is identical.
    return serialize(this);
  }

	/**
	 * Determines if this instance is a JavaScript MIME type.
	 * 
	 * @param {Object} [options]
	 * @param {boolean} [options.prohibitParameters=false]
	 * @returns {boolean} true if this instance represents a JavaScript MIME type, false otherwise.
	 */
  isJavaScript({prohibitParameters = false} = {}) {
    switch (this._type) {
      case 'text': {
        switch (this._subtype) {
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
          case 'x-javascript': return !prohibitParameters || this._parameters.size === 0;
          default: return false;
        }
      }
      case 'application': {
        switch (this._subtype) {
          case 'ecmascript':
          case 'javascript':
          case 'x-ecmascript':
          case 'x-javascript': return !prohibitParameters || this._parameters.size === 0;
          default: return false;
        }
      }
      default: return false;
    }
  }

	/**
	 * Determines if this instance is an XML MIME type.
	 * 
	 * @returns {boolean} true if this instance represents an XML MIME type, false otherwise.
	 */
  isXML() {
    return (this._subtype === 'xml' && (this._type === 'text' || this._type === 'application')) || this._subtype.endsWith('+xml');
  }

	/**
	 * Determines if this instance is an HTML MIME type.
	 * 
	 * @returns {boolean} true if this instance represents an HTML MIME type, false otherwise.
	 */
  isHTML() {
    return this._subtype === 'html' && this._type === 'text';
  }

	/**
	 * Gets the name of the class.
	 * 
	 * @returns {string} The class name
	 */
	get [Symbol.toStringTag]() {
		return 'MIMEType';
	}
}