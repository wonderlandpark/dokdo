const fetch = require('node-fetch')
const { ProcessManager, HLJS } = require('../utils')
const Discord = require('discord.js')

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
    { button: new Discord.MessageButton().setStyle('DANGER').setCustomID('dokdo$back').setLabel('이전'), action: ({ manager }) => manager.previousPage(), requirePage: true },
    { button: new Discord.MessageButton().setStyle('SECONDARY').setCustomID('dokdo$stop').setLabel('정지'), action: ({ manager }) => manager.destroy(), requirePage: true },
    { button: new Discord.MessageButton().setStyle('SUCCESS').setCustomID('dokdo$next').setLabel('다음'), action: ({ manager }) => manager.nextPage(), requirePage: true }
  ])
}
