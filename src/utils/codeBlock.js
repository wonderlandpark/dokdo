const { Util } = require('discord.js')

module.exports = class codeBlock {
  /**
   * @param {string} content
   * @param {string} lang
  */
  static construct (content, lang) {
    return `\`\`\`${content ? lang || '' : ''}
${Util.escapeCodeBlock(content)}
\`\`\``
  }

  /**
   * @param {string} content
   */
  static parse (content) {
    return content.match(/^```(.*?)\n(.*?)```$/ms)
  }
}
