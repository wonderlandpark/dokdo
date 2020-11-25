const util = require('util')

/**
 *
 * @param {any} value
 * @param {NodeJS.InspectOptions} obj
 */
module.exports = function inspect (value, obj) {
  return util.inspect(value, obj)
}
