import { describe, expect, it } from 'vitest';
import { MediaTypeParser } from '../src/media-type-parser';
import { MediaTypeParameters } from '../src/media-type-parameters';

describe('media-type-parser', () => {
	it('should throw an error when instantiating the static class', () => {
		// @ts-expect-error - testing private constructor
		expect(() => new MediaTypeParser()).toThrow('MediaTypeParser is a static class and cannot be instantiated');
	});

	describe('basic parsing', () => {
		it('should parse a media type', () => {
			const parsed = MediaTypeParser.parse('text/html');
			expect(parsed).toEqual({
				type: 'text',
				subtype: 'html',
				parameters: new MediaTypeParameters()
			});
		});

		it('should parse a media type with parameters', () => {
			const parsed = MediaTypeParser.parse('text/html; charset=utf-8');
			expect(parsed).toEqual({
				type: 'text',
				subtype: 'html',
				parameters: new MediaTypeParameters([['charset', 'utf-8']])
			});
		});
	});

	describe('ASCII normalization vs non-ASCII / Unicode invalid tokens', () => {
		it('should ASCII-lowercase type and subtype', () => {
			const parsed = MediaTypeParser.parse('TEXT/PLAIN');
			expect(parsed.type).toBe('text');
			expect(parsed.subtype).toBe('plain');
		});

		it('should ASCII-lowercase parameter names while preserving parameter value casing', () => {
			const parsed = MediaTypeParser.parse('text/html; CHARSET=UTF-8; Format=Flowed');
			expect(parsed.parameters.get('charset')).toBe('UTF-8');
			expect(parsed.parameters.get('format')).toBe('Flowed');
		});

		it('should throw TypeError on non-ASCII characters in type', () => {
			expect(() => MediaTypeParser.parse('tëxt/plain')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('текст/plain')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('☕/html')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('\u0080/plain')).toThrow(TypeError);
		});

		it('should throw TypeError on non-ASCII characters in subtype', () => {
			expect(() => MediaTypeParser.parse('text/htm£')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text/hтml')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text/😀')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text/\u0080')).toThrow(TypeError);
		});

		it('should throw TypeError on invalid token characters in type and subtype', () => {
			expect(() => MediaTypeParser.parse('te xt/html')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('te<t/html')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text/ht ml')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text/ht@ml')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('/html')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text/')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('')).toThrow(TypeError);
		});

		it('should ignore parameters with invalid non-ASCII or non-token names', () => {
			const parsed = MediaTypeParser.parse('text/html; chärset=utf-8; valid=yes; inv@lid=no');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.get('valid')).toBe('yes');
			expect(parsed.parameters.has('chärset')).toBe(false);
			expect(parsed.parameters.has('inv@lid')).toBe(false);
		});
	});

	describe('whitespace stripping and trailing whitespace handling', () => {
		it('should strip leading and trailing HTTP whitespace around media type', () => {
			const parsed = MediaTypeParser.parse(' \t\r\n text/html; charset=utf-8 \r\n\t ');
			expect(parsed.type).toBe('text');
			expect(parsed.subtype).toBe('html');
			expect(parsed.parameters.get('charset')).toBe('utf-8');
		});

		it('should handle trailing whitespace on subtype before semicolon', () => {
			const parsed = MediaTypeParser.parse('text/html   ; charset=utf-8');
			expect(parsed.type).toBe('text');
			expect(parsed.subtype).toBe('html');
			expect(parsed.parameters.get('charset')).toBe('utf-8');
		});

		it('should handle trailing whitespace on subtype at EOF', () => {
			const parsed = MediaTypeParser.parse('text/plain  \t\r\n');
			expect(parsed.type).toBe('text');
			expect(parsed.subtype).toBe('plain');
		});

		it('should handle uppercase subtype with trailing whitespace', () => {
			const parsed = MediaTypeParser.parse('TEXT/PLAIN   ; key=val');
			expect(parsed.type).toBe('text');
			expect(parsed.subtype).toBe('plain');
			expect(parsed.parameters.get('key')).toBe('val');
		});

		it('should throw TypeError when subtype consists only of whitespace', () => {
			expect(() => MediaTypeParser.parse('text/ ')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text/   ; a=b')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text/\t\r\n')).toThrow(TypeError);
		});

		it('should throw TypeError when subtype has invalid chars before trailing whitespace', () => {
			expect(() => MediaTypeParser.parse('text/foo™  ; a=b')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text/foo bar  ; a=b')).toThrow(TypeError);
			expect(() => MediaTypeParser.parse('text/foo\u0080  ')).toThrow(TypeError);
		});

		it('should strip trailing whitespace from unquoted parameter values before semicolon or EOF', () => {
			const parsed = MediaTypeParser.parse('text/html; charset=utf-8  \r\n; foo=bar   ');
			expect(parsed.parameters.get('charset')).toBe('utf-8');
			expect(parsed.parameters.get('foo')).toBe('bar');
		});

		it('should ignore unquoted parameter values that consist only of whitespace', () => {
			const parsed = MediaTypeParser.parse('text/html; foo=   ; bar=baz');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.has('foo')).toBe(false);
			expect(parsed.parameters.get('bar')).toBe('baz');
		});

		it('should ignore unquoted parameter values with invalid chars before trailing whitespace', () => {
			const parsed = MediaTypeParser.parse('text/html; foo=bar™   ; bar=baz');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.has('foo')).toBe(false);
			expect(parsed.parameters.get('bar')).toBe('baz');
		});

		it('should handle whitespace between parameter separator and parameter name', () => {
			const parsed = MediaTypeParser.parse('text/html;   \r\n\t  charset=utf-8');
			expect(parsed.parameters.get('charset')).toBe('utf-8');
		});

		it('should skip empty parameter segments', () => {
			const parsed = MediaTypeParser.parse('text/html; ; ;; charset=utf-8; ;');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.get('charset')).toBe('utf-8');
		});

		it('should skip parameter names without values', () => {
			const parsed = MediaTypeParser.parse('text/html; foo; bar=baz; qux');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.has('foo')).toBe(false);
			expect(parsed.parameters.has('qux')).toBe(false);
			expect(parsed.parameters.get('bar')).toBe('baz');
		});
	});

	describe('fast-path vs slow-path quoted string parsing', () => {
		it('should parse fast-path quoted parameters without backslashes', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="utf-8"');
			expect(parsed.parameters.get('charset')).toBe('utf-8');
		});

		it('should parse fast-path unterminated quoted parameters reaching EOF', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="utf-8');
			expect(parsed.parameters.get('charset')).toBe('utf-8');
		});

		it('should parse fast-path unterminated quoted parameters containing semicolons', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="foo; bar=baz');
			expect(parsed.parameters.get('charset')).toBe('foo; bar=baz');
		});

		it('should discard fast-path quoted parameter with characters > 0xFF', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="utf-8™"; valid=yes');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.has('charset')).toBe(false);
			expect(parsed.parameters.get('valid')).toBe('yes');
		});

		it('should discard fast-path quoted parameter with invalid control characters', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="utf\x008"; valid=yes');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.has('charset')).toBe(false);
			expect(parsed.parameters.get('valid')).toBe('yes');
		});

		it('should parse slow-path quoted parameters with escaped quotes', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="utf\\"8"');
			expect(parsed.parameters.get('charset')).toBe('utf"8');
		});

		it('should parse slow-path quoted parameters with escaped backslashes', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="utf\\\\8"');
			expect(parsed.parameters.get('charset')).toBe('utf\\8');
		});

		it('should parse slow-path quoted parameters with escaped backslashes followed by quote', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="utf\\\\\\"8"');
			expect(parsed.parameters.get('charset')).toBe('utf\\"8');
		});

		it('should parse slow-path quoted parameters with multiple escaped backslashes', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="utf\\\\\\\\8"');
			expect(parsed.parameters.get('charset')).toBe('utf\\\\8');
		});

		it('should parse long slow-path quoted parameters without character-by-character concatenation', () => {
			const suffix = 'x'.repeat(8192);
			const parsed = MediaTypeParser.parse(`text/html; data="\\a${suffix}"`);
			expect(parsed.parameters.get('data')).toBe(`a${suffix}`);
		});

		it('should parse slow-path unterminated quoted parameter ending with backslash', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="foo\\\\');
			expect(parsed.parameters.get('charset')).toBe('foo\\');
		});

		it('should discard slow-path quoted parameter with escaped characters > 0xFF', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="foo\\™bar"; valid=yes');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.has('charset')).toBe(false);
			expect(parsed.parameters.get('valid')).toBe('yes');
		});

		it('should discard slow-path quoted parameter with escaped invalid control chars', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="foo\\\x00bar"; valid=yes');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.has('charset')).toBe(false);
			expect(parsed.parameters.get('valid')).toBe('yes');
		});

		it('should discard slow-path quoted parameter with unescaped characters > 0xFF', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="foo\\bar™baz"; valid=yes');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.has('charset')).toBe(false);
			expect(parsed.parameters.get('valid')).toBe('yes');
		});

		it('should discard slow-path quoted parameter with unescaped invalid control chars', () => {
			const parsed = MediaTypeParser.parse('text/html; charset="foo\\bar\x00baz"; valid=yes');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.has('charset')).toBe(false);
			expect(parsed.parameters.get('valid')).toBe('yes');
		});

		it('should advance to next parameter after quoted parameter with escaped characters', () => {
			const parsed = MediaTypeParser.parse('text/html; a="1\\\"2"; b=3');
			expect(parsed.parameters.get('a')).toBe('1"2');
			expect(parsed.parameters.get('b')).toBe('3');
		});

		it('should advance to next parameter after quoted parameter with equals sign', () => {
			const parsed = MediaTypeParser.parse('x/x;"=x;bonus=x');
			expect(parsed.parameters.get('bonus')).toBe('x');
		});
	});

	describe('duplicate parameters', () => {
		it('should preserve only the first occurrence of duplicate parameter names', () => {
			const parsed = MediaTypeParser.parse('text/html; charset=utf-8; CHARSET=iso-8859-1; Charset=windows-1252');
			expect(parsed.parameters.size).toBe(1);
			expect(parsed.parameters.get('charset')).toBe('utf-8');
		});
	});
});