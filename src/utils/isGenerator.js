/**
 * @param {any} target
 * @returns {boolean}
 */
module.exports = target => target &&
  typeof target.next === 'function' &&
  typeof target.throw === 'function'
