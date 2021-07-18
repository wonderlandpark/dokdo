module.exports = class DateFormatting {
  /**
   * @param {Date|number} date Target date or timestamp.
   * @param {string} format Date format.
   **/
  static _format (date, style) {
    return `<t:${Math.floor(date / 1000)}` + (style ? `:${style}` : '') + '>'
  }

  static relative (date) {
    return this._format(date, 'R')
  }
}
