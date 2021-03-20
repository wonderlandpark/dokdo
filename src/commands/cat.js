const fs = require('fs')
const { ProcessManager, HLJS } = require('../utils')

module.exports = async function curl (message, parent) {
  if (!message.data.args) return message.channel.send('Missing Arguments.')
  const filename = message.data.args
  let msg
  fs.readFile(filename, async (err, data) => {
    if (err) msg = new ProcessManager(message, err.toString(), parent, { lang: 'js' })
    else msg = new ProcessManager(message, data.toString(), parent, { lang: HLJS.getLang(filename.split('.').pop()) })
    await msg.init()
    await msg.addAction([{ emoji: '◀️', action: ({ manager }) => manager.previousPage(), requirePage: true }, { emoji: '⏹️', action: ({ manager }) => manager.destroy(), requirePage: true }, { emoji: '▶️', action: ({ manager }) => manager.nextPage(), requirePage: true }])
  })
}
