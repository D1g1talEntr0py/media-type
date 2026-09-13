import { MediaTypeParameters } from '../src/media-type-parameters';
import { vi, expect, describe, it } from 'vitest';

describe('MediaTypeParameters', () => {
	describe('constructor', () => {
		it('should create a new instance with default constructor', () => {
			const parameters = new MediaTypeParameters();

			expect(parameters).toBeInstanceOf(MediaTypeParameters);
			expect(parameters.size).toBe(0);
		});

		it('should create a new instance with initial entries', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters).toBeInstanceOf(MediaTypeParameters);
			expect(parameters.size).toBe(1);
		});
	});

	describe('isValid', () => {
		it('should return true for valid HTTP token names and valid quoted values', () => {
			expect(MediaTypeParameters.isValid('charset', 'utf-8')).toBe(true);
			expect(MediaTypeParameters.isValid('boundary', '---12345')).toBe(true);
			expect(MediaTypeParameters.isValid('foo', 'bar baz')).toBe(true);
			expect(MediaTypeParameters.isValid('foo', '\u00ff')).toBe(true);
		});

		it('should return false for invalid parameter names', () => {
			expect(MediaTypeParameters.isValid('', 'bar')).toBe(false);
			expect(MediaTypeParameters.isValid('foo bar', 'baz')).toBe(false);
			expect(MediaTypeParameters.isValid('chärset', 'utf-8')).toBe(false);
			expect(MediaTypeParameters.isValid('foo@bar', 'baz')).toBe(false);
			expect(MediaTypeParameters.isValid('foo/bar', 'baz')).toBe(false);
		});

		it('should return false for invalid parameter values', () => {
			expect(MediaTypeParameters.isValid('foo', 'bar\x00baz')).toBe(false);
			expect(MediaTypeParameters.isValid('foo', 'bar\x1Fbaz')).toBe(false);
			expect(MediaTypeParameters.isValid('foo', 'bar\u0100baz')).toBe(false);
			expect(MediaTypeParameters.isValid('foo', 'bar🤣baz')).toBe(false);
		});
	});

	describe('has', () => {
		it('should return true if the parameter exists', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.has('foo')).toBe(true);
		});

		it('should be case-insensitive', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.has('FOO')).toBe(true);
			expect(parameters.has('Foo')).toBe(true);
		});

		it('should return false if the parameter does not exist', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.has('baz')).toBe(false);
		});
	});

	describe('get', () => {
		it('should return the parameter value if the parameter exists', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.get('foo')).toBe('bar');
		});

		it('should be case-insensitive', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.get('FOO')).toBe('bar');
			expect(parameters.get('Foo')).toBe('bar');
		});

		it('should return undefined if the parameter does not exist', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.get('baz')).toBeUndefined();
		});
	});

	describe('set', () => {
		it('should set the parameter value if the parameter exists', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			parameters.set('foo', 'baz');

			expect(parameters.get('foo')).toBe('baz');
		});

		it('should ASCII-lowercase parameter names and update existing entry regardless of casing', () => {
			const parameters = new MediaTypeParameters();

			parameters.set('Charset', 'utf-8');
			expect(parameters.get('charset')).toBe('utf-8');
			expect(parameters.size).toBe(1);

			parameters.set('CHARSET', 'windows-1252');
			expect(parameters.get('charset')).toBe('windows-1252');
			expect(parameters.size).toBe(1);
		});

		it('should throw an error if passed an invalid parameter name', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(() => parameters.set('🤣', 'bar')).toThrow();
			expect(() => parameters.set('foo bar', 'bar')).toThrow();
			expect(() => parameters.set('foo@bar', 'bar')).toThrow();
			expect(() => parameters.set('', 'bar')).toThrow();
		});

		it('should throw an error if passed invalid parameter value', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(() => parameters.set('foo', '🤣')).toThrow();
			expect(() => parameters.set('foo', 'bar\u0100')).toThrow();
			expect(() => parameters.set('foo', 'bar\x00baz')).toThrow();
		});

		it('should accept valid high-byte characters (0x80..0xFF) in parameter value', () => {
			const parameters = new MediaTypeParameters();

			parameters.set('foo', 'val\u00A0ue');
			expect(parameters.get('foo')).toBe('val\u00A0ue');
		});

		it('should return this instance for chaining', () => {
			const parameters = new MediaTypeParameters();

			const result = parameters.set('a', '1').set('b', '2');
			expect(result).toBe(parameters);
			expect(parameters.size).toBe(2);
		});
	});

	describe('delete', () => {
		it('should delete the parameter if the parameter exists', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.delete('foo')).toBe(true);
			expect(parameters.has('foo')).toBe(false);
		});

		it('should be case-insensitive when deleting', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.delete('FOO')).toBe(true);
			expect(parameters.has('foo')).toBe(false);
		});

		it('should return false if the parameter does not exist', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar' ]]);

			expect(parameters.delete('baz')).toBe(false);
		});
	});

	describe('toString', () => {
		it('should return empty string when there are no parameters', () => {
			const parameters = new MediaTypeParameters();

			expect(parameters.toString()).toBe('');
		});

		it('should serialize single token parameter without quotes', () => {
			const parameters = new MediaTypeParameters([['charset', 'utf-8']]);

			expect(parameters.toString()).toBe(';charset=utf-8');
		});

		it('should serialize empty string value with quotes', () => {
			const parameters = new MediaTypeParameters([['empty', '']]);

			expect(parameters.toString()).toBe(';empty=""');
		});

		it('should quote values with spaces or non-token characters', () => {
			const parameters = new MediaTypeParameters([['title', 'hello world']]);

			expect(parameters.toString()).toBe(';title="hello world"');
		});

		it('should escape quotes and backslashes in quoted values', () => {
			const parameters = new MediaTypeParameters([
				['quote', 'a"b'],
				['slash', 'a\\b'],
				['both', 'a"b\\c']
			]);

			expect(parameters.toString()).toBe(';quote="a\\"b";slash="a\\\\b";both="a\\"b\\\\c"');
		});

		it('should serialize multiple parameters in insertion order', () => {
			const parameters = new MediaTypeParameters([
				['foo', 'bar'],
				['baz', 'hello world']
			]);

			expect(parameters.toString()).toBe(';foo=bar;baz="hello world"');
		});
	});

	describe('forEach', () => {
		it('should iterate over each parameter', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);
			const callback = vi.fn();

			parameters.forEach(callback);

			expect(callback).toHaveBeenCalledTimes(2);
		});
	});

	describe('Symbol.iterator', () => {
		it('should return an iterator', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters[Symbol.iterator]()).toBeInstanceOf(Object);
		});

		it('should return the parameter entries', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(Array.from(parameters[Symbol.iterator]())).toEqual([[ 'foo', 'bar' ], [ 'bar', 'baz' ]]);
		});
	});

	describe('Symbol.toStringTag', () => {
		it('should return the string tag', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters[Symbol.toStringTag]).toBe('MediaTypeParameters');
		});
	});

	describe('entries', () => {
		it('should return an iterator', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters.entries()).toBeInstanceOf(Object);
		});

		it('should return the parameter entries', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(Array.from(parameters.entries())).toEqual([[ 'foo', 'bar' ], [ 'bar', 'baz' ]]);
		});
	});

	describe('keys', () => {
		it('should return an iterator', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters.keys()).toBeInstanceOf(Object);
		});

		it('should return the parameter names', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(Array.from(parameters.keys())).toEqual([ 'foo', 'bar' ]);
		});
	});

	describe('values', () => {
		it('should return an iterator', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters.values()).toBeInstanceOf(Object);
		});

		it('should return the parameter values', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(Array.from(parameters.values())).toEqual([ 'bar', 'baz' ]);
		});
	});

	describe('size', () => {
		it('should return the number of parameters', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			expect(parameters.size).toBe(2);
		});
	});

	describe('clear', () => {
		it('should remove all parameters', () => {
			const parameters = new MediaTypeParameters([[ 'foo', 'bar'], [ 'bar', 'baz' ]]);

			parameters.clear();

			expect(parameters.size).toBe(0);
		});
	});
});