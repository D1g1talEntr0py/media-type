import { MediaTypeParser } from './media-type-parser.js';
import { MediaTypeParameters } from './media-type-parameters.js';

/**
 * Class used to parse media types.
 * @see https://mimesniff.spec.whatwg.org/#understanding-mime-types
 */
export class MediaType {
	readonly #type: string;
	readonly #subtype: string;
	readonly #essence: string;
	readonly #parameters: MediaTypeParameters;

	/**
	 * Create a new MediaType instance from a string representation.
	 * @param mediaType The media type to parse.
	 * @param parameters Optional parameters.
	 */
	constructor(mediaType: string, parameters?: Record<string, string>) {
		({ type: this.#type, subtype: this.#subtype, parameters: this.#parameters } = MediaTypeParser.parse(mediaType));
		this.#essence = this.#type + '/' + this.#subtype;

		if (parameters !== undefined) {
			if (parameters === null || typeof parameters !== 'object' || Array.isArray(parameters)) {
				throw new TypeError('The parameters argument must be an object');
			}
			for (const name in parameters) {
				if (Object.prototype.hasOwnProperty.call(parameters, name)) {
					this.#parameters.set(name, parameters[name]!);
				}
			}
		}
	}

	/**
	 * Parses a media type string.
	 * @param mediaType The media type to parse.
	 * @returns The parsed media type or null if the mediaType cannot be parsed.
	 */
	static parse(mediaType: string): MediaType | null {
		try { return new MediaType(mediaType) } catch { return null }
	}

	/**
	 * Gets the type.
	 * @returns The type.
	 */
	get type(): string {
		return this.#type;
	}

	/**
	 * Gets the subtype.
	 * @returns The subtype.
	 */
	get subtype(): string {
		return this.#subtype;
	}

	/**
	 * Gets the media type essence (type/subtype).
	 * @returns The media type without any parameters
	 */
	get essence(): string {
		return this.#essence;
	}

	/**
	 * Gets the parameters.
	 * @returns The media type parameters.
	 */
	get parameters(): MediaTypeParameters {
		return this.#parameters;
	}

	/**
	 * Checks if the media type matches the specified type by essence (`type/subtype`),
	 * ignoring parameters. Comparison is case-sensitive against the lowercased essence
	 * of this instance — pass already-lowercased strings.
	 *
	 * @param mediaType The media type to check.
	 * @returns true if the media type matches the specified type, false otherwise.
	 */
	matches(mediaType: MediaType | string): boolean {
		return typeof mediaType === 'string' ? this.#essence === mediaType : this.#type === mediaType.#type && this.#subtype === mediaType.#subtype;
	}

	/**
	 * Gets the serialized version of the media type.
	 *
	 * @returns The serialized media type.
	 */
	toString(): string {
		return this.#essence + this.#parameters.toString();
	}

	/**
	 * Gets the name of the class.
	 * @returns The class name
	 */
	get [Symbol.toStringTag](): string {
		return 'MediaType';
	}
}
