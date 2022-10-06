import { solelyContainsHTTPTokenCodePoints } from './utils.js';
// eslint-disable-next-line jsdoc/valid-types
/** @typedef { import('./mime-type.js').default } MIMEType */

/**
 * A function that serializes the provided {@link MIMEType} to a string.
 *
 * @module serializer
 * @param {MIMEType} mimeType The MIME type to serialize.
 * @returns {string} The serialized MIME type.
 */
const serialize = (mimeType) => {
	let serialization = `${mimeType.type}/${mimeType.subtype}`;

	if (mimeType.parameters.size === 0) {
		return serialization;
	}

	for (let [name, value] of mimeType.parameters) {
		serialization += ';';
		serialization += name;
		serialization += '=';

		if (!solelyContainsHTTPTokenCodePoints(value) || value.length === 0) {
			value = value.replace(/(["\\])/ug, '\\$1');
			value = `"${value}"`;
		}

		serialization += value;
	}

	return serialization;
};

export default serialize;