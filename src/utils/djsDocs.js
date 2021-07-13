const qs = require('querystring')
const fetch = require('node-fetch')
const Discord = require('discord.js')

module.exports.source = version => {
  const parsed = version.match(/^(\d+)\.\d+\.\d+$/)?.[1]
  return `https://raw.githubusercontent.com/discordjs/discord.js/docs/${parsed ? `v${parsed}` : 'master'}.json`
}

module.exports.docs = async (q) => {
  const queryString = qs.stringify({ src: this.source(Discord.version), q })
  const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queryString}`)
  const embed = await res.json()
  console.log(embed)
  if (!embed) return 'Nothing found'
  else return { embed }
}
