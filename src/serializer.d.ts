export default serialize;
export type MIMEType = import('./mime-type.js').default;
/** @typedef { import('./mime-type.js').default } MIMEType */
/**
 * A function that serializes the provided {@link MIMEType} to a string.
 *
 * @module serializer
 * @param {MIMEType} mimeType The MIME type to serialize.
 * @returns {string} The serialized MIME type.
 */
declare function serialize(mimeType: MIMEType): string;
