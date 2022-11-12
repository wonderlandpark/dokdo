import type { TimestampStylesString } from 'discord.js'

export class DateFormatting {
  static _format (date: Date | number, style: TimestampStylesString) {
    return (
      `<t:${Math.floor(Number(date) / 1000)}` + (style ? `:${style}` : '') + '>'
    )
  }

  static relative (date: Date | number) {
    return this._format(date, 'R')
  }
}
