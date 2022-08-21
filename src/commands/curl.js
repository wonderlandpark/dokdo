const fetch = require('node-fetch')
const Discord = require('discord.js')
const { ProcessManager, HLJS } = require('../utils')

module.exports = async function curl (message, parent) {
  if (!message.data.args) return message.channel.send('Missing Arguments.')

  let type
  const res = await fetch(message.data.args.split(' ')[0]).then(async r => {
    const text = await r.text()
    try {
      type = 'json'
      return JSON.stringify(JSON.parse(text), null, 2)
    } catch {
      type = HLJS.getLang(r.headers.get('Content-Type')) || 'html'
      return text
    }
  }).catch(e => {
    type = 'js'
    message.react('❗')
    console.log(e.stack)
    return e.toString()
  })

  // console.log(res)
  const msg = new ProcessManager(message, res || '', parent, { lang: type })
  await msg.init()
  await msg.addAction([
    { button: new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Danger).setCustomId('dokdo$prev').setLabel('Prev'), action: ({ manager }) => manager.previousPage(), requirePage: true },
    { button: new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('dokdo$stop').setLabel('Stop'), action: ({ manager }) => manager.destroy(), requirePage: true },
    { button: new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Success).setCustomId('dokdo$next').setLabel('Next'), action: ({ manager }) => manager.nextPage(), requirePage: true }
  ])
}
