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
     * @param {string} string The MIME type to parse
     * @returns {MIMEType} The parsed {@link MIMEType} object
     */
    static parse(string: string): MIMEType;
    /**
     * Create a new MIMEType instance from a string representation.
     *
     * @param {string} string The MIME type to parse
     */
    constructor(string: string);
    _type: string;
    _subtype: string;
    _parameters: MIMETypeParameters;
    /**
     * Gets the MIME type essence (type/subtype).
     *
     * @returns {string} The MIME type without any parameters
     */
    get essence(): string;
    /**
     * Sets the type.
     */
    set type(arg: string);
    /**
     * Gets the type.
     *
     * @returns {string} The type.
     */
    get type(): string;
    /**
     * Sets the subtype.
     */
    set subtype(arg: string);
    /**
     * Gets the subtype.
     *
     * @returns {string} The subtype.
     */
    get subtype(): string;
    /**
     * Gets the parameters.
     *
     * @returns {MIMETypeParameters} The MIME type parameters.
     */
    get parameters(): MIMETypeParameters;
    /**
     * Gets the serialized version of the MIME type.
     *
     * @returns {string} The serialized MIME type.
     */
    toString(): string;
    /**
     * Determines if this instance is a JavaScript MIME type.
     *
     * @param {Object} [options] Optional options.
     * @param {boolean} [options.prohibitParameters=false] The option to prohibit parameters when checking if the MIME type is JavaScript.
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
