export default parse;
/**
 * Function to parse a MIME type.
 *
 * @module parser
 * @param {string} input The MIME type to parse
 * @returns {{ type: string, subtype: string, parameters: Map.<string, string> }} An object populated with the parsed MIME type properties and any parameters.
 */
declare function parse(input: string): {
    type: string;
    subtype: string;
    parameters: Map<string, string>;
};
