/*!
 * This is a banner
 */

/**
 * ## .parser
 *
 * Set a parser that can later be used to parse any given string.
 *
 * ```js
 * strings.parser (name, replacements)
 * ```
 * 
 * @doc ./docs.md
 * @param {String} `name`
 * @param {Object|Array} `arr` Object or array of replacement patterns to associate.
 *   @property {String|RegExp} [arr] `pattern`
 *   @property {String|Function} [arr] `replacement`
 * @return {Strings} to allow chaining
 *   @property {Array} `foo`
 * @api public
 */

exports.parser = function parser(str) {};