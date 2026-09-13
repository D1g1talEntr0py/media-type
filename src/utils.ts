/**
 * RFC 9110 / WHATWG HTTP token regex for backwards compatibility.
 */
export const httpTokenCodePoints: RegExp = /^[-!#$%&'*+.^_`|~A-Za-z0-9]*$/u;

const httpQuotedStringTokenCodePoints: RegExp = /^[\t\u0020-\u007E\u0080-\u00FF]*$/u;
const REGEX_VALIDATION_THRESHOLD = 64;

/**
 * Token classification lookup table:
 * 0 = Not a token code point
 * 1 = HTTP token code point (lowercase, digit, or symbol)
 * 2 = HTTP token code point (ASCII uppercase 'A'-'Z')
 */
export const HTTP_TOKEN_TABLE: Uint8Array = new Uint8Array(128);

// Populate symbols: ! # $ % & ' * + - . ^ _ ` | ~
HTTP_TOKEN_TABLE[0x21] = 1; // !
HTTP_TOKEN_TABLE[0x23] = 1; // #
HTTP_TOKEN_TABLE[0x24] = 1; // $
HTTP_TOKEN_TABLE[0x25] = 1; // %
HTTP_TOKEN_TABLE[0x26] = 1; // &
HTTP_TOKEN_TABLE[0x27] = 1; // '
HTTP_TOKEN_TABLE[0x2A] = 1; // *
HTTP_TOKEN_TABLE[0x2B] = 1; // +
HTTP_TOKEN_TABLE[0x2D] = 1; // -
HTTP_TOKEN_TABLE[0x2E] = 1; // .
HTTP_TOKEN_TABLE[0x5E] = 1; // ^
HTTP_TOKEN_TABLE[0x5F] = 1; // _
HTTP_TOKEN_TABLE[0x60] = 1; // `
HTTP_TOKEN_TABLE[0x7C] = 1; // |
HTTP_TOKEN_TABLE[0x7E] = 1; // ~

// Digits '0'-'9' (0x30..0x39)
for (let c = 0x30; c <= 0x39; c++) {
	HTTP_TOKEN_TABLE[c] = 1;
}

// Uppercase 'A'-'Z' (0x41..0x5A) -> marked with 2
for (let c = 0x41; c <= 0x5A; c++) {
	HTTP_TOKEN_TABLE[c] = 2;
}

// Lowercase 'a'-'z' (0x61..0x7A)
for (let c = 0x61; c <= 0x7A; c++) {
	HTTP_TOKEN_TABLE[c] = 1;
}

/**
 * HTTP quoted-string token code points lookup table (0x00..0xFF):
 * 1 = valid quoted-string token (\t, 0x20..0x7E, 0x80..0xFF)
 * 0 = invalid
 */
export const HTTP_QUOTED_VALUE_TABLE: Uint8Array = new Uint8Array(256);

HTTP_QUOTED_VALUE_TABLE[0x09] = 1; // \t

for (let c = 0x20; c <= 0x7E; c++) {
	HTTP_QUOTED_VALUE_TABLE[c] = 1;
}

for (let c = 0x80; c <= 0xFF; c++) {
	HTTP_QUOTED_VALUE_TABLE[c] = 1;
}

/**
 * Checks if a code point is an HTTP whitespace code point.
 * HTTP whitespace code points: SP (0x20), HT (0x09), LF (0x0A), CR (0x0D)
 * @see https://fetch.spec.whatwg.org/#http-whitespace
 * @param c The code point to check.
 * @returns true if the code point is HTTP whitespace, false otherwise.
 */
export function isHttpWhitespace(c: number): boolean {
	return c === 0x20 || c === 0x09 || c === 0x0A || c === 0x0D;
}

/**
 * Checks if a code point is an HTTP token code point.
 * @param c The code point to check.
 * @returns true if the code point is an HTTP token code point, false otherwise.
 */
export function isHttpTokenCodePoint(c: number): boolean {
	return c < 128 && HTTP_TOKEN_TABLE[c] !== 0;
}

/**
 * Checks if a string contains solely HTTP token code points.
 * @param str The string to check.
 * @returns true if all code points are HTTP token code points, false otherwise.
 */
export function isHttpToken(str: string): boolean {
	const len = str.length;
	if (len === 0) {
		return false;
	}
	if (len >= REGEX_VALIDATION_THRESHOLD) {
		return httpTokenCodePoints.test(str);
	}
	for (let i = 0; i < len; i++) {
		const c = str.charCodeAt(i);
		if (c >= 128 || HTTP_TOKEN_TABLE[c] === 0) {
			return false;
		}
	}
	return true;
}

/**
 * Checks if a string contains solely HTTP quoted-string token code points.
 * @param str The string to check.
 * @returns true if all code points are HTTP quoted-string token code points, false otherwise.
 */
export function isHttpQuotedStringToken(str: string): boolean {
	const len = str.length;
	if (len >= REGEX_VALIDATION_THRESHOLD) {
		return httpQuotedStringTokenCodePoints.test(str);
	}
	for (let i = 0; i < len; i++) {
		const c = str.charCodeAt(i);
		if (c > 0xFF || HTTP_QUOTED_VALUE_TABLE[c] === 0) {
			return false;
		}
	}
	return true;
}

/**
 * Returns the ASCII-lowercased version of `s`, or `s` itself when no characters
 * require lowering. Avoids allocating a new string when input is already lowercase.
 * @param s The string to lowercase.
 * @returns The ASCII-lowercased version of `s`.
 */
export function asciiLower(s: string): string {
	for (let i = 0, length = s.length; i < length; i++) {
		const c = s.charCodeAt(i);
		if (c >= 0x41 && c <= 0x5A) {
			let lowered = s.slice(0, i);
			for (; i < length; i++) {
				const code = s.charCodeAt(i);
				lowered += String.fromCharCode(code >= 0x41 && code <= 0x5A ? code + 0x20 : code);
			}
			return lowered;
		}
	}
	return s;
}