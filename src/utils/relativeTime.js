/**
 * @param {Date} date
 */
module.exports = function relativeTime (date) {
  return `<t:${Math.floor(date / 1000)}:R>`
}
