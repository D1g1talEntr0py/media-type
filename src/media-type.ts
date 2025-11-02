import { MediaTypeParser } from './media-type-parser.js';
import { MediaTypeParameters } from './media-type-parameters.js';

/**
 * Class used to parse media types.
 * @see https://mimesniff.spec.whatwg.org/#understanding-mime-types
 */
export class MediaType {
	private readonly _type: string;
	private readonly _subtype: string;
	private readonly _parameters: MediaTypeParameters;

	/**
	 * Create a new MediaType instance from a string representation.
	 * @param mediaType The media type to parse.
	 * @param parameters Optional parameters.
	 */
	constructor(mediaType: string, parameters: Record<string, string> = {}) {
		if (parameters === null || typeof parameters !== 'object' || Array.isArray(parameters)) {
			throw new TypeError('The parameters argument must be an object');
		}

		({ type: this._type, subtype: this._subtype, parameters: this._parameters } = MediaTypeParser.parse(mediaType));

		for (const [ name, value ] of Object.entries(parameters)) { this._parameters.set(name, value) }
	}

	/**
	 * Parses a media type string.
	 * @param mediaType The media type to parse.
	 * @returns The parsed media type or null if the mediaType cannot be parsed.
	 */
	static parse(mediaType: string): MediaType | null {
		try {
			return new MediaType(mediaType);
		} catch {
			// ignore
		}

		return null;
	}

	/**
	 * Gets the type.
	 * @returns The type.
	 */
	get type(): string {
		return this._type;
	}

	/**
	 * Gets the subtype.
	 * @returns The subtype.
	 */
	get subtype(): string {
		return this._subtype;
	}

	/**
	 * Gets the media type essence (type/subtype).
	 * @returns The media type without any parameters
	 */
	get essence(): string {
		return `${this._type}/${this._subtype}`;
	}

	/**
	 * Gets the parameters.
	 * @returns The media type parameters.
	 */
	get parameters(): MediaTypeParameters {
		return this._parameters;
	}

	/**
	 * Checks if the media type matches the specified type.
	 *
	 * @param mediaType The media type to check.
	 * @returns true if the media type matches the specified type, false otherwise.
	 */
	matches(mediaType: MediaType | string): boolean {
		return typeof mediaType === 'string' ? this.essence.includes(mediaType) : this._type === mediaType._type && this._subtype === mediaType._subtype;
	}

	/**
	 * Gets the serialized version of the media type.
	 *
	 * @returns The serialized media type.
	 */
	toString(): string {
		return `${this.essence}${this._parameters.toString()}`;
	}

	/**
	 * Gets the name of the class.
	 * @returns The class name
	 */
	get [Symbol.toStringTag](): string {
		return 'MediaType';
	}
}