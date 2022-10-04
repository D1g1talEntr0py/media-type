/**
 *
 * @param {string} input
 * @returns {{ type: string, subtype: string, parameters: Map }}
 */
declare function parse(input: string): {
	type: string;
	subtype: string;
	parameters: Map<any, any>;
};

/**
 *
 * @param {MIMEType} mimeType
 * @returns {string}
 */
declare function serialize(mimeType: MIMEType): string;

export {
	class MIMETypeParameters {
    constructor(map: any);
    _map: any;
    get size(): any;
    get(name: any): any;
    has(name: any): any;
    set(name: any, value: any): any;
    clear(): void;
    delete(name: any): any;
    forEach(callbackFn: any, thisArg: any): void;
    keys(): any;
    values(): any;
    entries(): any;
    [Symbol.iterator](): any;
	}

	class MIMEType {
    /**
     *
     * @param {string} string
     * @returns {MIMEType}
     */
    static parse(string: string): MIMEType;
    /**
     *
     * @param {string} string
     */
    constructor(string: string);
    _type: string;
    _subtype: string;
    _parameters: MIMETypeParameters;
    get essence(): string;
    set type(arg: string);
    get type(): string;
    set subtype(arg: string);
    get subtype(): string;
    get parameters(): MIMETypeParameters;
    toString(): string;
    isJavaScript({ prohibitParameters }?: {
        prohibitParameters?: boolean;
    }): boolean;
    isXML(): boolean;
    isHTML(): boolean;
    get [Symbol.toStringTag](): string;
	}

	parse;
	serialize;

	function removeLeadingAndTrailingHTTPWhitespace(string: any): any;

	function removeTrailingHTTPWhitespace(string: any): any;

	function isHTTPWhitespaceChar(char: any): boolean;

	function solelyContainsHTTPTokenCodePoints(string: any): boolean;

	function solelyContainsHTTPQuotedStringTokenCodePoints(string: any): boolean;

	function asciiLowercase(string: any): any;

	function collectAnHTTPQuotedString(input: any, position: any): any[];
}