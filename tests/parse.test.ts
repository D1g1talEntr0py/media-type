import { describe, expect, it } from 'vitest';
import { MediaTypeParser } from '../src/media-type-parser';
import { MediaTypeParameters } from '../src/media-type-parameters';

describe('parse', () => {
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
			parameters: new MediaTypeParameters([['Charset', 'utf-8']])
		});
	});

	it('should parse a media type with quoted parameters', () => {
		const parsed = MediaTypeParser.parse('text/html; charset="utf-8"');
		expect(parsed).toEqual({
			type: 'text',
			subtype: 'html',
			parameters: new MediaTypeParameters([['charset', 'utf-8']])
		});
	});

	it('should parse a media type with quoted parameters with escaped quotes', () => {
		const parsed = MediaTypeParser.parse('text/html; charset="utf\\"8"');
		expect(parsed).toEqual({
			type: 'text',
			subtype: 'html',
			parameters: new MediaTypeParameters([['charset', 'utf"8']])
		});
	});

	it('should parse a media type with quoted parameters with escaped backslashes', () => {
		const parsed = MediaTypeParser.parse('text/html; charset="utf\\\\8"');
		expect(parsed).toEqual({
			type: 'text',
			subtype: 'html',
			parameters: new MediaTypeParameters([['charset', 'utf\\8']])
		});
	});

	it('should parse a media type with quoted parameters with escaped backslashes followed by a quote', () => {
		const parsed = MediaTypeParser.parse('text/html; charset="utf\\\\\\"8"');
		expect(parsed).toEqual({
			type: 'text',
			subtype: 'html',
			parameters: new MediaTypeParameters([['charset', 'utf\\"8']])
		});
	});

	it('should parse a media type with quoted parameters with escaped backslashes followed by a quote followed by escaped backslashes', () => {
		const parsed = MediaTypeParser.parse('text/html; charset="utf\\\\\\\\8"');
		expect(parsed).toEqual({
			type: 'text',
			subtype: 'html',
			parameters: new MediaTypeParameters([['charset', 'utf\\\\8']])
		});
	});

	it('should parse a media type with quoted parameters with escaped backslashes', () => {
		const parsed = MediaTypeParser.parse('text/html; charset="utf\\\\8"');
		expect(parsed).toEqual({
			type: 'text',
			subtype: 'html',
			parameters: new MediaTypeParameters([['charset', 'utf\\8']])
		});
	});

	it('should parse a media type with quoted parameters with escaped backslashes', () => {
		const parsed = MediaTypeParser.parse('x/x;"=x;bonus=x');
		expect(parsed).toEqual({
			type: 'x',
			subtype: 'x',
			parameters: new MediaTypeParameters([['bonus', 'x']])
		});
	});
});