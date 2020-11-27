const { Collection } = require('discord.js')

/**
 * @param {any} target
 * @param {any} theClass
 */
module.exports = function (target, theClass) {
  if ((Array.isArray(target) || target instanceof Collection) && target.map(f => f instanceof theClass).includes(false)) return false
  else if (!(target instanceof theClass)) return false
  else return true
}
