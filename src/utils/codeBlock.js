const Discord = require('discord.js')

/**
 * @param {string} content
 * @param {string} lang
 */
module.exports = class codeBlock {
  static construct (content, lang) {
    return `\`\`\`${content ? lang || '' : ''}
${Discord.Util.escapeCodeBlock(content)}
\`\`\``
  }

  static parse (content) {
    return content.match(/^```(.*?)\n(.*?)```$/ms)
  }
}
