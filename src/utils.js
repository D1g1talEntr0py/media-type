/** @module utils */

const whitespaceCharacters = [' ', '\t', '\n', '\r'];
const leadingWhitespace = /^[ \t\n\r]+/u;
const trailingWhitespace = /[ \t\n\r]+$/u;
const httpTokenCodePoints = /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/u;
const httpQuotedTokenCodePoints = /^[\t\u0020-\u007E\u0080-\u00FF]*$/u;

/**
 * A function to remove any leading and trailing HTTP whitespace.
 *
 * @param {string} string The string to process.
 * @returns {string} The processed string.
 */
const removeLeadingAndTrailingHTTPWhitespace = (string) => string.replace(leadingWhitespace, '').replace(trailingWhitespace, '');

/**
 * A function to remove any trailing HTTP whitespace.
 *
 * @param {string} string The string to process.
 * @returns {string} The processed string.
 */
const removeTrailingHTTPWhitespace = (string) => string.replace(trailingWhitespace, '');

/**
 * Determines if the provided character is whitespace.
 *
 * @param {string} char The character to evaluate.
 * @returns {boolean} true if the character is whitespace, false otherwise.
 */
const isHTTPWhitespaceChar = (char) => whitespaceCharacters.includes(char);

/**
 * Determines if the provided string contains only HTTP token code points.
 *
 * @param {string} string The string to evaluate.
 * @returns {boolean} true if the string contains only HTTP token code points.
 */
const solelyContainsHTTPTokenCodePoints = (string) => httpTokenCodePoints.test(string);

/**
 * Determines if the provided string contains only quoted HTTP token code points.
 *
 * @param {string} string The string to evaluate.
 * @returns {boolean} true if the string contains only quoted HTTP token code points.
 */
const solelyContainsHTTPQuotedStringTokenCodePoints = (string) => httpQuotedTokenCodePoints.test(string);

/**
 * A function to lower case ASCII characters.
 * This implementation iterates over each element of the string, which is treated as an iterable.
 * The elements are destructured into [char, charCode] pairs, where char represents the character,
 * and charCode is assigned the character code using char.charCodeAt(0). If the charCode is not
 * provided, it falls back to the character code obtained from char.charCodeAt(0).
 *
 * @param {string} string The string to process.
 * @returns {string} The processed string with all ASCII characters lower cased.
 */
const asciiLowercase = (string) => {
	let result = '';
	for (const [char, charCode = char.charCodeAt(0)] of string) {
		result += charCode >= 65 && charCode <= 90 ? String.fromCharCode(charCode + 32) : char;
	}

	return result;
};

/**
 * Collects all the HTTP quoted strings.
 * This variant only implements it with the extract-value flag set.
 *
 * @param {string} input The string to process.
 * @param {number} position The starting position.
 * @returns {Array<string|number>} An array that includes the resulting string and updated position.
 */
const collectAnHTTPQuotedString = (input, position) => {
	let value = '';

	for (let length = input.length, char; ++position < length;) {
		char = input[position];

		if (char == '\\') {
			value += ++position < length ? input[position] : char;
		} else if (char == '"') {
			break;
		} else {
			value += char;
		}
	}

	return [value, position];
};

export { removeLeadingAndTrailingHTTPWhitespace, removeTrailingHTTPWhitespace, isHTTPWhitespaceChar, solelyContainsHTTPTokenCodePoints, solelyContainsHTTPQuotedStringTokenCodePoints, asciiLowercase, collectAnHTTPQuotedString };
