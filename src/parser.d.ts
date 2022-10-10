export default parse;
/**
 * Function to parse a media type.
 *
 * @module parser
 * @param {string} input The media type to parse
 * @returns {{ type: string, subtype: string, parameters: Map<string, string> }} An object populated with the parsed media type properties and any parameters.
 */
declare function parse(input: string): {
    type: string;
    subtype: string;
    parameters: Map<string, string>;
};
