import { describe, expect, it } from 'vitest';
import {
	asciiLower,
	HTTP_QUOTED_VALUE_TABLE,
	HTTP_TOKEN_TABLE,
	httpTokenCodePoints,
	isHttpQuotedStringToken,
	isHttpToken,
	isHttpTokenCodePoint,
	isHttpWhitespace
} from '../src/utils';

describe('utils', () => {
	describe('isHttpWhitespace', () => {
		it('should return true for SP (0x20), HT (0x09), LF (0x0A), CR (0x0D)', () => {
			expect(isHttpWhitespace(0x20)).toBe(true);
			expect(isHttpWhitespace(0x09)).toBe(true);
			expect(isHttpWhitespace(0x0A)).toBe(true);
			expect(isHttpWhitespace(0x0D)).toBe(true);
		});

		it('should return false for non-whitespace code points', () => {
			expect(isHttpWhitespace(0x00)).toBe(false);
			expect(isHttpWhitespace(0x1F)).toBe(false);
			expect(isHttpWhitespace(0x21)).toBe(false);
			expect(isHttpWhitespace(0x61)).toBe(false);
			expect(isHttpWhitespace(0x80)).toBe(false);
		});
	});

	describe('isHttpTokenCodePoint', () => {
		it('should return true for token code points', () => {
			expect(isHttpTokenCodePoint(0x61)).toBe(true); // 'a'
			expect(isHttpTokenCodePoint(0x41)).toBe(true); // 'A'
			expect(isHttpTokenCodePoint(0x30)).toBe(true); // '0'
			expect(isHttpTokenCodePoint(0x2D)).toBe(true); // '-'
			expect(isHttpTokenCodePoint(0x21)).toBe(true); // '!'
			expect(isHttpTokenCodePoint(0x2B)).toBe(true); // '+'
		});

		it('should return false for non-token code points', () => {
			expect(isHttpTokenCodePoint(0x20)).toBe(false); // space
			expect(isHttpTokenCodePoint(0x2F)).toBe(false); // '/'
			expect(isHttpTokenCodePoint(0x3B)).toBe(false); // ';'
			expect(isHttpTokenCodePoint(0x3D)).toBe(false); // '='
			expect(isHttpTokenCodePoint(0x22)).toBe(false); // '"'
			expect(isHttpTokenCodePoint(128)).toBe(false);
			expect(isHttpTokenCodePoint(256)).toBe(false);
		});
	});

	describe('isHttpToken', () => {
		it('should return true for valid token strings', () => {
			expect(isHttpToken('text')).toBe(true);
			expect(isHttpToken('application')).toBe(true);
			expect(isHttpToken('x-custom_token.1+2')).toBe(true);
		});

		it('should return false for empty string and invalid token strings', () => {
			expect(isHttpToken('')).toBe(false);
			expect(isHttpToken('text/html')).toBe(false);
			expect(isHttpToken('text html')).toBe(false);
			expect(isHttpToken('foo;bar')).toBe(false);
			expect(isHttpToken('foo=bar')).toBe(false);
			expect(isHttpToken('foo"bar')).toBe(false);
			expect(isHttpToken('tëxt')).toBe(false);
			expect(isHttpToken('foo\u0080')).toBe(false);
		});

		it('should validate on both sides of the long-string threshold', () => {
			expect(isHttpToken('a'.repeat(63))).toBe(true);
			expect(isHttpToken('a'.repeat(64))).toBe(true);
			expect(isHttpToken(`${'a'.repeat(63)}/`)).toBe(false);
		});
	});

	describe('isHttpQuotedStringToken', () => {
		it('should return true for valid HTTP quoted-string characters', () => {
			expect(isHttpQuotedStringToken('\t')).toBe(true);
			expect(isHttpQuotedStringToken('hello world')).toBe(true);
			expect(isHttpQuotedStringToken('value with "quotes" and \\slashes\\')).toBe(true);
			expect(isHttpQuotedStringToken('latin-\u00e9\u00ff')).toBe(true);
		});

		it('should return false for invalid quoted-string characters', () => {
			expect(isHttpQuotedStringToken('null\x00byte')).toBe(false);
			expect(isHttpQuotedStringToken('control\x1Fchar')).toBe(false);
			expect(isHttpQuotedStringToken('del\x7Fchar')).toBe(false);
			expect(isHttpQuotedStringToken('unicode\u0100above-255')).toBe(false);
			expect(isHttpQuotedStringToken('emoji😀')).toBe(false);
		});

		it('should validate on both sides of the long-string threshold', () => {
			expect(isHttpQuotedStringToken('a'.repeat(63))).toBe(true);
			expect(isHttpQuotedStringToken('a'.repeat(64))).toBe(true);
			expect(isHttpQuotedStringToken(`${'a'.repeat(63)}\x00`)).toBe(false);
		});
	});

	describe('asciiLower', () => {
		it('should return the identical string instance if already lowercase', () => {
			const str = 'already-lowercase_123';
			expect(asciiLower(str)).toBe(str);
		});

		it('should lowercase ASCII uppercase characters', () => {
			expect(asciiLower('Text/HTML')).toBe('text/html');
			expect(asciiLower('CHARSET')).toBe('charset');
			expect(asciiLower('ISO-8859-1')).toBe('iso-8859-1');
		});

		it('should leave non-ASCII characters unchanged', () => {
			expect(asciiLower('ÄA')).toBe('Äa');
		});
	});

	describe('httpTokenCodePoints regex', () => {
		it('should match token strings', () => {
			expect(httpTokenCodePoints.test('text-123')).toBe(true);
			expect(httpTokenCodePoints.test('te/xt')).toBe(false);
		});
	});

	describe('tables', () => {
		it('should classify characters in HTTP_TOKEN_TABLE and HTTP_QUOTED_VALUE_TABLE', () => {
			expect(HTTP_TOKEN_TABLE[0x61]).toBe(1); // 'a'
			expect(HTTP_TOKEN_TABLE[0x41]).toBe(2); // 'A'
			expect(HTTP_TOKEN_TABLE[0x20]).toBe(0); // space

			expect(HTTP_QUOTED_VALUE_TABLE[0x09]).toBe(1); // \t
			expect(HTTP_QUOTED_VALUE_TABLE[0x20]).toBe(1); // space
			expect(HTTP_QUOTED_VALUE_TABLE[0xFF]).toBe(1); // 0xFF
			expect(HTTP_QUOTED_VALUE_TABLE[0x00]).toBe(0); // null
		});
	});
});
