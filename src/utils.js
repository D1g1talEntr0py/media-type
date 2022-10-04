/** @module utils */

/**
 * A function to remove any leading and trailing HTTP whitespace.
 * 
 * @param {string} string The string to process.
 * @returns {string} The processed string.
 */
const removeLeadingAndTrailingHTTPWhitespace = (string) => string.replace(/^[ \t\n\r]+/u, "").replace(/[ \t\n\r]+$/u, "");

/**
 * A function to remove any trailing HTTP whitespace.
 * 
 * @param {string} string The string to process. 
 * @returns {string} The processed string.
 */
const removeTrailingHTTPWhitespace = (string) => string.replace(/[ \t\n\r]+$/u, "");

/**
 * Determines if the provided character is whitespace.
 * 
 * @param {string} char The character to evaluate.
 * @returns {boolean} true if the character is whitespace, false otherwise.
 */
const isHTTPWhitespaceChar = (char) => char === " " || char === "\t" || char === "\n" || char === "\r";

/**
 * Determines if the provided string contains only HTTP token code points.
 * 
 * @param {string} string The string to evaluate.
 * @returns {boolean} true if the string contains only HTTP token code points.
 */
const solelyContainsHTTPTokenCodePoints = (string) => /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/u.test(string);

/**
 * Determines if the provided string contains only quoted HTTP token code points.
 * 
 * @param {string} string The string to evaluate.
 * @returns {boolean} true if the string contains only quoted HTTP token code points.
 */
const solelyContainsHTTPQuotedStringTokenCodePoints = (string) => /^[\t\u0020-\u007E\u0080-\u00FF]*$/u.test(string);

/**
 * A function to lower case ASCII characters.
 * 
 * @param {string} string The string to process.
 * @returns {string} The processed string with all ASCII characters lower cased.
 */
const asciiLowercase = (string) => string.replace(/[A-Z]/ug, l => l.toLowerCase());

/**
 * Collects all the HTTP quoted strings.
 * This variant only implements it with the extract-value flag set.
 * 
 * @param {string} input The string to process.
 * @param {number} position The starting position.
 * @returns {[string, number]} An array that includes the resulting string and updated position.
 */
const collectAnHTTPQuotedString = (input, position) => {
  let value = "";

  position++;

  while (true) {
    while (position < input.length && input[position] !== "\"" && input[position] !== "\\") {
      value += input[position];
      ++position;
    }

    if (position >= input.length) {
      break;
    }

    const quoteOrBackslash = input[position];
    ++position;

    if (quoteOrBackslash === "\\") {
      if (position >= input.length) {
        value += "\\";
        break;
      }

      value += input[position];
      ++position;
    } else {
      break;
    }
  }

  return [value, position];
};

export { removeLeadingAndTrailingHTTPWhitespace, removeTrailingHTTPWhitespace, isHTTPWhitespaceChar, solelyContainsHTTPTokenCodePoints, solelyContainsHTTPQuotedStringTokenCodePoints, asciiLowercase, collectAnHTTPQuotedString };