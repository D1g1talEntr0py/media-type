/** @module utils */
/**
 * A function to remove any leading and trailing HTTP whitespace.
 *
 * @param {string} string The string to process.
 * @returns {string} The processed string.
 */
export function removeLeadingAndTrailingHTTPWhitespace(string: string): string;
/**
 * A function to remove any trailing HTTP whitespace.
 *
 * @param {string} string The string to process.
 * @returns {string} The processed string.
 */
export function removeTrailingHTTPWhitespace(string: string): string;
/**
 * Determines if the provided character is whitespace.
 *
 * @param {string} char The character to evaluate.
 * @returns {boolean} true if the character is whitespace, false otherwise.
 */
export function isHTTPWhitespaceChar(char: string): boolean;
/**
 * Determines if the provided string contains only HTTP token code points.
 *
 * @param {string} string The string to evaluate.
 * @returns {boolean} true if the string contains only HTTP token code points.
 */
export function solelyContainsHTTPTokenCodePoints(string: string): boolean;
/**
 * Determines if the provided string contains only quoted HTTP token code points.
 *
 * @param {string} string The string to evaluate.
 * @returns {boolean} true if the string contains only quoted HTTP token code points.
 */
export function solelyContainsHTTPQuotedStringTokenCodePoints(string: string): boolean;
/**
 * A function to lower case ASCII characters.
 *
 * @param {string} string The string to process.
 * @returns {string} The processed string with all ASCII characters lower cased.
 */
export function asciiLowercase(string: string): string;
/**
 * Collects all the HTTP quoted strings.
 * This variant only implements it with the extract-value flag set.
 *
 * @param {string} input The string to process.
 * @param {number} position The starting position.
 * @returns {[string, number]} An array that includes the resulting string and updated position.
 */
export function collectAnHTTPQuotedString(input: string, position: number): [string, number];
