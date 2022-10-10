/**
 * Class representing the parameters for a media type record.
 * This class has the equivalent surface API to a JavaScript {@link Map}.
 *
 * However, {@link MediaTypeParameters} methods will always interpret their arguments
 * as appropriate for media types, so parameter names will be lowercased,
 * and attempting to set invalid characters will throw an {@link Error}.
 *
 * @example charset=utf-8
 * @module MediaTypeParameters
 */
export default class MediaTypeParameters {
    /**
     * Create a new MediaTypeParameters instance.
     *
     * @param {Map.<string, string>} map The map of parameters for a media type.
     */
    constructor(map: Map<string, string>);
    _map: Map<string, string>;
    /**
     * Gets the number of media type parameters.
     *
     * @returns {number} The number of media type parameters
     */
    get size(): number;
    /**
     * Gets the media type parameter value for the supplied name.
     *
     * @param {string} name The name of the media type parameter to retrieve.
     * @returns {string} The media type parameter value.
     */
    get(name: string): string;
    /**
     * Indicates whether the media type parameter with the specified name exists or not.
     *
     * @param {string} name The name of the media type parameter to check.
     * @returns {boolean} true if the media type parameter exists, false otherwise.
     */
    has(name: string): boolean;
    /**
     * Adds a new media type parameter using the specified name and value to the MediaTypeParameters.
     * If an parameter with the same name already exists, the parameter will be updated.
     *
     * @param {string} name The name of the media type parameter to set.
     * @param {string} value The media type parameter value.
     * @returns {MediaTypeParameters} This instance.
     */
    set(name: string, value: string): MediaTypeParameters;
    /**
     * Clears all the media type parameters.
     */
    clear(): void;
    /**
     * Removes the media type parameter using the specified name.
     *
     * @param {string} name The name of the media type parameter to delete.
     * @returns {boolean} true if the parameter existed and has been removed, or false if the parameter does not exist.
     */
    delete(name: string): boolean;
    /**
     * Executes a provided function once per each name/value pair in the MediaTypeParameters, in insertion order.
     *
     * @param {function(string, string): void} callback The function called on each iteration.
     * @param {*} [thisArg] Optional object when binding 'this' to the callback.
     */
    forEach(callback: (arg0: string, arg1: string) => void, thisArg?: any): void;
    /**
     * Returns an iterable of parameter names.
     *
     * @returns {IterableIterator<string>} The {@link IterableIterator} of media type parameter names.
     */
    keys(): IterableIterator<string>;
    /**
     * Returns an iterable of parameter values.
     *
     * @returns {IterableIterator<string>} The {@link IterableIterator} of media type parameter values.
     */
    values(): IterableIterator<string>;
    /**
     * Returns an iterable of name, value pairs for every parameter entry in the media type parameters.
     *
     * @returns {IterableIterator<Array<Array<string>>>} The media type parameter entries.
     */
    entries(): IterableIterator<Array<Array<string>>>;
    /**
     * A method that returns the default iterator for the {@link MediaTypeParameters}. Called by the semantics of the for-of statement.
     *
     * @returns {Iterator<string, string, undefined>} The {@link Symbol.iterator} for the media type parameters.
     */
    [Symbol.iterator](): Iterator<string, string, undefined>;
}
