module.exports = class RelativeTime {
  /**
   * @param {Date} [date]
   */
  static construct (date) {
    return `<t:${Math.floor(date / 1000)}:R>`
  }
}
