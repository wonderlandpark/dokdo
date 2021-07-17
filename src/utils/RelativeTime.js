module.exports = class RelativeTime {
  /**
   * @param {Date} [date]
   */
  static construct (date) {
    `<t:${Math.floor(date / 1000)}:R>`
  }
}
