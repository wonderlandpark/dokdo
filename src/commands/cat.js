const fs = require('fs')
const { ProcessManager, HLJS } = require('../utils')
const Discord = require('discord.js')

module.exports = async function curl (message, parent) {
  if (!message.data.args) return message.channel.send('Missing Arguments.')
  const filename = message.data.args
  let msg
  fs.readFile(filename, async (err, data) => {
    if (err) msg = new ProcessManager(message, err.toString(), parent, { lang: 'js' })
    else msg = new ProcessManager(message, data.toString(), parent, { lang: HLJS.getLang(filename.split('.').pop()) })
    await msg.init()
    await msg.addAction([
      { button: new Discord.MessageButton().setStyle('DANGER').setCustomID('dokdo$back').setLabel('이전'), action: ({ manager }) => manager.previousPage(), requirePage: true },
      { button: new Discord.MessageButton().setStyle('SECONDARY').setCustomID('dokdo$stop').setLabel('정지'), action: ({ manager }) => manager.destroy(), requirePage: true },
      { button: new Discord.MessageButton().setStyle('SUCCESS').setCustomID('dokdo$next').setLabel('다음'), action: ({ manager }) => manager.nextPage(), requirePage: true }
    ])
  })
}
