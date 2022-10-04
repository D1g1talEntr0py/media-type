/**
 * Class used to parse MIME types.
 *
 * @see https://mimesniff.spec.whatwg.org/#understanding-mime-types
 * @module MIMEType
 */
export default class MIMEType {
    /**
     * Static factor method for parsing a MIME type.
     *
     * @param {string} string
     * @returns {MIMEType}
     */
    static parse(string: string): MIMEType;
    /**
     * Create a new MIMEType instance from a string representation.
     *
     * @param {string} string
     */
    constructor(string: string);
    _type: string;
    _subtype: string;
    _parameters: MIMETypeParameters;
    /**
     * Gets the MIME type essence (type/subtype).
     *
     * @returns {string}
     */
    get essence(): string;
    /**
     * Sets the type.
     */
    set type(arg: string);
    /**
     * Gets the type.
     *
     * @returns {string}
     */
    get type(): string;
    /**
     * Sets the subtype.
     */
    set subtype(arg: string);
    /**
     * Gets the subtype.
     *
     * @returns {string}
     */
    get subtype(): string;
    /**
     * Gets the parameters.
     *
     * @returns {MIMETypeParameters}
     */
    get parameters(): MIMETypeParameters;
    /**
     * Gets the serialized version of the MIME type.
     *
     * @returns {string}
     */
    toString(): string;
    /**
     * Determines if this instance is a JavaScript MIME type.
     *
     * @param {Object} [options]
     * @param {boolean} [options.prohibitParameters=false]
     * @returns {boolean} true if this instance represents a JavaScript MIME type, false otherwise.
     */
    isJavaScript({ prohibitParameters }?: {
        prohibitParameters?: boolean;
    }): boolean;
    /**
     * Determines if this instance is an XML MIME type.
     *
     * @returns {boolean} true if this instance represents an XML MIME type, false otherwise.
     */
    isXML(): boolean;
    /**
     * Determines if this instance is an HTML MIME type.
     *
     * @returns {boolean} true if this instance represents an HTML MIME type, false otherwise.
     */
    isHTML(): boolean;
    /**
     * Gets the name of the class.
     *
     * @returns {string} The class name
     */
    get [Symbol.toStringTag](): string;
}
import MIMETypeParameters from "./mime-type-parameters.js";
