import { solelyContainsHTTPTokenCodePoints } from './utils.js';

/** @typedef { import('./media-type.js').default } MediaType */

/**
 * A function that serializes the provided {@link mediaType} to a string.
 *
 * @module serializer
 * @param {MediaType} mediaType The media type to serialize.
 * @returns {string} The serialized media type.
 */
const serialize = (mediaType) => {
	let serialization = `${mediaType.type}/${mediaType.subtype}`;

	if (mediaType.parameters.size === 0) {
		return serialization;
	}

	for (let [name, value] of mediaType.parameters) {
		serialization += `;${name}=`;

		if (!solelyContainsHTTPTokenCodePoints(value) || value.length === 0) {
			value = `"${value.replace(/(["\\])/ug, '\\$1')}"`;
		}

		serialization += value;
	}

	return serialization;
};

export default serialize;