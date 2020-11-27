const { ProcessManager, inspect, isinstance, type } = require('../utils')

module.exports = async function js (message, parent) {
  // eslint-disable-next-line no-unused-vars
  const { client, Discord } = parent // for eval
  if (!message.data.args) return message.channel.send('Argument missing.')
  // eslint-disable-next-line no-eval
  const res = new Promise(resolve => resolve(eval(message.data.args)))
  let typeOf
  const result = await res
    .then(async output => {
      typeOf = typeof output
      if (output instanceof Discord.MessageEmbed) await message.channel.send(output)
      else if (isinstance(output, Discord.MessageAttachment)) await message.channel.send({ files: output instanceof Discord.Collection ? output.array() : [output] })
      if (typeof output === 'function') output = output.toString()
      message.react('✅')
      return inspect(output, { depth: 1 })
    })
    .catch(e => {
      console.log(e instanceof SyntaxError)
      message.react('❗')
      return e.stack || e.toString()
    })

  const msg = new ProcessManager(message, result || '', parent, { lang: 'js', noCode: typeOf !== 'object' })
  await msg.init()
  await msg.addAction([{ emoji: '⏹️', action: ({ manager }) => manager.destroy(), requirePage: true }, { emoji: '◀️', action: ({ manager }) => manager.previousPage(), requirePage: true }, { emoji: '▶️', action: ({ manager }) => manager.nextPage(), requirePage: true }])
}
