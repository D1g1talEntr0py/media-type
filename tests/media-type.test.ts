import { MediaType } from '../src/media-type';
import { describe, expect, it } from 'vitest';

describe('MediaType', () => {
	describe('constructor', () => {
		it('should create a new instance', () => {
			const mediaType = new MediaType('text/html');

			expect(mediaType).toBeInstanceOf(MediaType);
			expect(mediaType.type).toBe('text');
			expect(mediaType.subtype).toBe('html');
			expect(mediaType.essence).toBe('text/html');
		});

		it('should initialize with parameters from second argument', () => {
			const mediaType = new MediaType('text/html', { charset: 'utf-8', boundary: 'abc' });

			expect(mediaType.parameters.get('charset')).toBe('utf-8');
			expect(mediaType.parameters.get('boundary')).toBe('abc');
			expect(mediaType.toString()).toBe('text/html;charset=utf-8;boundary=abc');
		});

		it('should throw an error if the type is not a string', () => {
			// @ts-expect-error - Testing invalid input
			expect(() => new MediaType()).toThrow();
		});

		it('should throw an error if the type is an empty string', () => {
			expect(() => new MediaType('')).toThrow();
		});

		it('should throw an error if the type contains invalid characters', () => {
			expect(() => new MediaType('te xt/html')).toThrow();
		});

		it('should throw an error if the subtype is not a string', () => {
			expect(() => new MediaType('text')).toThrow();
		});

		it('should throw an error if the subtype is an empty string', () => {
			expect(() => new MediaType('text/')).toThrow();
		});

		it('should throw an error if the subtype contains invalid characters', () => {
			expect(() => new MediaType('text/ht ml')).toThrow();
		});

		it('should throw an error if the parameters is null', () => {
			// @ts-expect-error - Testing invalid input
			expect(() => new MediaType('text/html', null)).toThrow(TypeError);
		});

		it('should throw an error if the parameters is not an object', () => {
			// @ts-expect-error - Testing invalid input
			expect(() => new MediaType('text/html', 'foo')).toThrow(TypeError);
		});

		it('should throw an error if the parameters is an array', () => {
			// @ts-expect-error - Testing invalid input
			expect(() => new MediaType('text/html', [])).toThrow(TypeError);
		});

		it('should throw an error if the parameters is a number', () => {
			// @ts-expect-error - Testing invalid input
			expect(() => new MediaType('text/html', 42)).toThrow(TypeError);
		});

		it('should throw an error if the parameters is a boolean', () => {
			// @ts-expect-error - Testing invalid input
			expect(() => new MediaType('text/html', true)).toThrow(TypeError);
		});
	});

	describe('parse', () => {
		it('should return MediaType for valid input', () => {
			const result = MediaType.parse('text/html; charset=utf-8');
			expect(result).toBeInstanceOf(MediaType);
			expect(result?.essence).toBe('text/html');
		});

		it('should return null for invalid input', () => {
			expect(MediaType.parse('')).toBeNull();
			expect(MediaType.parse('invalid')).toBeNull();
			expect(MediaType.parse('text/')).toBeNull();
		});
	});

	describe('matches', () => {
		const mediaType = new MediaType('Text/HTML; charset=utf-8');

		it('should match against full essence string', () => {
			expect(mediaType.matches('text/html')).toBe(true);
			expect(mediaType.matches('TEXT/HTML')).toBe(true);
		});

		it('should match against type-only string', () => {
			expect(mediaType.matches('text')).toBe(true);
			expect(mediaType.matches('TEXT')).toBe(true);
		});

		it('should match against subtype-only string', () => {
			expect(mediaType.matches('html')).toBe(true);
			expect(mediaType.matches('HTML')).toBe(true);
		});

		it('should match against another MediaType instance', () => {
			expect(mediaType.matches(new MediaType('text/html; foo=bar'))).toBe(true);
			expect(mediaType.matches(new MediaType('application/json'))).toBe(false);
		});

		it('should return false for non-matching strings', () => {
			expect(mediaType.matches('application/json')).toBe(false);
			expect(mediaType.matches('plain')).toBe(false);
			expect(mediaType.matches('image')).toBe(false);
		});
	});

	describe('toString', () => {
		it('should serialize essence and parameters', () => {
			const mediaType = new MediaType('TEXT/HTML; Charset="utf-8"');
			expect(mediaType.toString()).toBe('text/html;charset=utf-8');
		});
	});

	describe('Symbol.toStringTag', () => {
		it('should return MediaType', () => {
			const mediaType = new MediaType('text/html');
			expect(mediaType[Symbol.toStringTag]).toBe('MediaType');
			expect(Object.prototype.toString.call(mediaType)).toBe('[object MediaType]');
		});
	});
});