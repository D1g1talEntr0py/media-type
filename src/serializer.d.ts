export default serialize;
export type MediaType = import('./media-type.js').default;
/** @typedef { import('./media-type.js').default } MediaType */
/**
 * A function that serializes the provided {@link mediaType} to a string.
 *
 * @module serializer
 * @param {MediaType} mediaType The media type to serialize.
 * @returns {string} The serialized media type.
 */
declare function serialize(mediaType: MediaType): string;
