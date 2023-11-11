import MediaType from '../src/media-type.js';
import { describe, it } from '@jest/globals';

describe('MediaType', () => {
	describe('constructor', () => {
		it('should create a new instance', () => {
			const mediaType = new MediaType('text/html');

			expect(mediaType).toBeInstanceOf(MediaType);
		});

		it('should throw an error if the type is not a string', () => {
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

		it('should throw an error if the parameters is not an object', () => {
			expect(() => new MediaType('text/html', 'foo')).toThrow();
		});

		it('should throw an error if the parameters is an array', () => {
			expect(() => new MediaType('text/html', [])).toThrow();
		});

		it('should throw an error if the parameters is a string', () => {
			expect(() => new MediaType('text/html', 'foo=bar')).toThrow();
		});

		it('should throw an error if the parameters is a number', () => {
			expect(() => new MediaType('text/html', 42)).toThrow();
		});

		it('should throw an error if the parameters is a boolean', () => {
			expect(() => new MediaType('text/html', true)).toThrow();
		});
	});
});