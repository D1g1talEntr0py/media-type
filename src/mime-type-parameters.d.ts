/**
 * Class representing the parameters for a MIME type record.
 * This class has the equivalent surface API to a JavaScript {@link Map}.
 *
 * However, {@link MIMETypeParameters} methods will always interpret their arguments
 * as appropriate for MIME types, so parameter names will be lowercased,
 * and attempting to set invalid characters will throw an {@link Error}.
 *
 * @example charset=utf-8
 * @module MIMETypeParameters
 */
export default class MIMETypeParameters {
    /**
     * Create a new MIMETypeParameters instance.
     *
     * @param {Map.<string, string>} map The map of parameters for a MIME type.
     */
    constructor(map: Map<string, string>);
    _map: Map<string, string>;
    /**
     * Gets the number of MIME type parameters.
     *
     * @returns {number} The number of MIME type parameters
     */
    get size(): number;
    /**
     * Gets the MIME type parameter value for the supplied name.
     *
     * @param {string} name The name of the MIME type parameter to retrieve.
     * @returns {string} The MIME type parameter value.
     */
    get(name: string): string;
    /**
     * Indicates whether the MIME type parameter with the specified name exists or not.
     *
     * @param {string} name The name of the MIME type parameter to check.
     * @returns {boolean} true if the MIME type parameter exists, false otherwise.
     */
    has(name: string): boolean;
    /**
     * Adds a new MIME type parameter using the specified name and value to the MIMETypeParameters.
     * If an parameter with the same name already exists, the parameter will be updated.
     *
     * @param {string} name The name of the MIME type parameter to set.
     * @param {string} value The MIME type parameter value.
     * @returns {MIMETypeParameters} This instance.
     */
    set(name: string, value: string): MIMETypeParameters;
    /**
     * Clears all the MIME type parameters.
     */
    clear(): void;
    /**
     * Removes the MIME type parameter using the specified name.
     *
     * @returns {boolean} true if the parameter existed and has been removed, or false if the parameter does not exist.
     */
    delete(name: any): boolean;
    /**
     * Executes a provided function once per each name/value pair in the MIMETypeParameters, in insertion order.
     *
     * @param {function(string, string): void} callback The function called on each iteration.
     * @param {*} [thisArg] Optional object when binding 'this' to the callback.
     */
    forEach(callback: (arg0: string, arg1: string) => void, thisArg?: any): void;
    /**
     * Returns an iterable of parameter names.
     *
     * @returns {IterableIterator.<string>} The {@link IterableIterator} of MIME type parameter names.
     */
    keys(): IterableIterator<string>;
    /**
     * Returns an iterable of parameter values.
     *
     * @returns {IterableIterator.<string>} The {@link IterableIterator} of MIME type parameter values.
     */
    values(): IterableIterator<string>;
    /**
     * Returns an iterable of name, value pairs for every parameter entry in the MIME type parameters.
     *
     * @returns {IterableIterator.<[string, string]>}
     */
    entries(): IterableIterator<[string, string]>;
    /**
     * A method that returns the default iterator for the {@link MIMETypeParameters}. Called by the semantics of the for-of statement.
     * @returns {Iterator.<string, string, undefined>} The {@link Symbol.iterator} for the MIME type parameters.
     */
    [Symbol.iterator](): Iterator<string, string, undefined>;
}
