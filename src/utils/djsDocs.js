const fetch = require('node-fetch')
const Discord = require('discord.js')

module.exports.source = version => {
  const parsed = version.match(/^(\d+)\.\d+\.\d+$/)?.[1]
  return `https://raw.githubusercontent.com/discordjs/discord.js/docs/${parsed ? `v${parsed}` : 'main'}.json`
}

/**
 * @param {string} q
 * @returns {Promise<string|Discord.MessageOptions>}
 */
module.exports.docs = async (q) => {
  const params = new URLSearchParams({ force: true, src: this.source(Discord.version), q })
  const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?${params}`)
  const embed = await res.json()
  console.log(embed)
  if (!embed) return 'Nothing found'
  else return { embeds: [embed] }
}
