const Discord = require('discord.js')

const { ProcessManager, inspect } = require('../utils')

module.exports = async function shard (message, parent) {
  if (!message.data.args) return message.channel.send('Missing Arguments.')
  if (!parent.client.shard) return message.channel.send('Shard Manager not found.')
  const res = parent.client.shard.broadcastEval(message.data.args)
  const result = await res.catch(e => e.toString())
  let msg
  if (!Array.isArray(result)) msg = new ProcessManager(message, result, parent, { lang: 'js' })
  else {
    let sum
    if (typeof result[0] === 'number') sum = result.reduce((prev, val) => prev + val, 0)
    else if (result[0] instanceof Discord.Collection) sum = result.reduce((prev, val) => prev.concat(val))

    msg = new ProcessManager(message, `// TOTAL\n${sum}\n\n${result.map((value, index) => `// #${index} SHARD\n${inspect(value)}`).join('\n')}`, parent, { lang: 'js' })
  }

  await msg.init()
  await msg.addAction([{ emoji: '⏹️', action: ({ manager }) => manager.destroy(), requirePage: false }, { emoji: '◀️', action: ({ manager }) => manager.previousPage(), requirePage: true }, { emoji: '▶️', action: ({ manager }) => manager.nextPage(), requirePage: true }])
}
