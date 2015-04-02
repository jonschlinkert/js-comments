/*!
 * options-cache <https://github.com/jonschlinkert/options-cache>
 *
 * Copyright (c) 2014 Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';


/**
 * Initialize a new `Options` cache.
 *
 * **Example:**
 *
 * In your application:
 *
 * ```js
 * var util = require('util');
 * var Options = require('options-cache');
 *
 * function App(options) {
 *   Options.call(this, options);
 * }
 * util.inherits(App, Options);
 *
 * App.prototype.foo = function(value) {
 *   this.enable(value);
 * };
 *
 * App.prototype.bar = function(value) {
 *   if (this.enabled(value)) {
 *     // do something
 *   }
 * };
 * ```
 *
 * @class Options
 * @param {Object} `options`
 * @constructor
 * @api public
 */

var Options = module.exports = function(options) {
  this.options = options || {};
};


/** 
 * Set or get an option.
 *
 * ```js
 * app.option('a', true)
 * app.option('a')
 * // => true
 * ```
 *
 * @method option
 * @param {String} `key`
 * @param {*} `value`
 * @return {*}
 * @api public
 */

Options.prototype.option = function(key, value) {
  if (!value) {
    return this.options[key];
  }
  if (typeof key !== 'string') {
    _.extend(this.options, key);
  }
  this.options[key] = value;
  return this;
};


/** 
 * Assign `value` to `key` or return the value of `key`.
 *
 * ```js
 * app.set('foo', true)
 * ```
 *
 * @method set
 * @param {String} `key`
 * @param {*} `value` The value to set.
 * @return {Options} to enable chaining
 * @api public
 */

Options.prototype.set = function(key, value) {
  this.options[key] = value;
  return this;
};


/** 
 * Return the stored value of `key`.
 *
 * ```js
 * app.set('foo', true)
 * app.get('foo')
 * //=> true
 * ```
 *
 * @method get
 * @param {String} `key`
 * @return {Options} to enable chaining
 * @api public
 */

Options.prototype.get = function(key) {
  return this.options[key];
};


/** 
 * Check if `key` is enabled (truthy).
 *
 * ```js
 * app.enabled('foo')
 * // => false
 *
 * app.enable('foo')
 * app.enabled('foo')
 * // => true
 * ```
 *
 * @method enabled
 * @param {String} `key`
 * @return {Boolean}
 * @api public
 */

Options.prototype.enabled = function(key) {
  return !!this.get(key);
};


/** 
 * Check if `key` is disabled (falsey).
 *
 * ```js
 * app.disabled('foo')
 * // => true
 *
 * app.enable('foo')
 * app.disabled('foo')
 * // => false
 * ```
 *
 * @method disabled
 * @param {String} `key`
 * @return {Boolean}
 * @api public
 */

Options.prototype.disabled = function(key) {
  return !this.get(key);
};


/** 
 * Enable `key`.
 *
 * **Example**
 *
 * ```js
 * app.enable('foo')
 * ```
 *
 * @method enable
 * @param {String} `key`
 * @return {Options} for chaining
 * @api public
 */

Options.prototype.enable = function(key) {
  return this.set(key, true);
};


/** 
 * Disable `key`.
 *
 * **Example**
 *
 * ```js
 * app.disable('foo')
 * ```
 *
 * @method disable
 * @param {String} `key` The option to disable.
 * @return {Options} for chaining
 * @api public
 */

Options.prototype.disable = function(key) {
  return this.set(key, false);
};

