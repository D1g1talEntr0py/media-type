/**
 * Class used to parse media types.
 *
 * @see https://mimesniff.spec.whatwg.org/#understanding-mime-types
 * @module MediaType
 */
export default class MediaType {
    /**
     * Static factor method for parsing a media type.
     *
     * @param {string} string The media type to parse
     * @returns {MediaType} The parsed {@link MediaType} object
     */
    static parse(string: string): MediaType;
    /**
     * Create a new MediaType instance from a string representation.
     *
     * @param {string} string The media type to parse
     */
    constructor(string: string);
    _type: string;
    _subtype: string;
    _parameters: MediaTypeParameters;
    /**
     * Gets the media type essence (type/subtype).
     *
     * @returns {string} The media type without any parameters
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
     * @returns {MediaTypeParameters} The media type parameters.
     */
    get parameters(): MediaTypeParameters;
    /**
     * Gets the serialized version of the media type.
     *
     * @returns {string} The serialized media type.
     */
    toString(): string;
    /**
     * Determines if this instance is a JavaScript media type.
     *
     * @param {Object} [options] Optional options.
     * @param {boolean} [options.prohibitParameters=false] The option to prohibit parameters when checking if the media type is JavaScript.
     * @returns {boolean} true if this instance represents a JavaScript media type, false otherwise.
     */
    isJavaScript({ prohibitParameters }?: {
        prohibitParameters?: boolean;
    }): boolean;
    /**
     * Determines if this instance is an XML media type.
     *
     * @returns {boolean} true if this instance represents an XML media type, false otherwise.
     */
    isXML(): boolean;
    /**
     * Determines if this instance is an HTML media type.
     *
     * @returns {boolean} true if this instance represents an HTML media type, false otherwise.
     */
    isHTML(): boolean;
    /**
     * Gets the name of the class.
     *
     * @returns {string} The class name
     */
    get [Symbol.toStringTag](): string;
}
import MediaTypeParameters from "./media-type-parameters.js";
