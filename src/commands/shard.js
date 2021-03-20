const { ProcessManager, inspect } = require('../utils')

module.exports = async function shard (message, parent) {
  if (!message.data.args) return message.channel.send('Missing Arguments.')
  if (!parent.client.shard) return message.channel.send('Shard Manager not found.')
  const result = await parent.client.shard.broadcastEval(message.data.args).then(el => el).catch(e => e.toString())
  let msg
  if (!Array.isArray(result)) msg = new ProcessManager(message, result, parent, { lang: 'js' })
  else {
    let sum
    if (typeof result[0] === 'number') sum = result.reduce((prev, val) => prev + val, 0)
    else if (Array.isArray(result[0])) sum = result.reduce((prev, val) => prev.concat(val), [])
    msg = new ProcessManager(message, `// TOTAL\n${inspect(sum, { depth: 1, maxArrayLength: 50 })}\n\n${result.map((value, index) => `// #${index} SHARD\n${inspect(value, { depth: 1, maxArrayLength: 100 })}`).join('\n')}`, parent, { lang: 'js' })
  }

  await msg.init()
  await msg.addAction([{ emoji: '◀️', action: ({ manager }) => manager.previousPage(), requirePage: true }, { emoji: '⏹️', action: ({ manager }) => manager.destroy(), requirePage: false }, { emoji: '▶️', action: ({ manager }) => manager.nextPage(), requirePage: true }])
}
