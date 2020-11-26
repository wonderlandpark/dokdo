const { ProcessManager, inspect } = require('../utils')

module.exports = async function js (message, parent) {
  // eslint-disable-next-line no-unused-vars
  const { client, Discord } = parent // for eval
  if (!message.data.args) return message.channel.send('Argument missing.')
  // eslint-disable-next-line no-eval
  const res = new Promise(resolve => resolve(eval(message.data.args)))
  const result = await res
    .then(output => {
      if (typeof output === 'function') output = output.toString()
      message.react('✅')
      return inspect(output, { depth: 1 })
    })
    .catch(e => {
      console.log(e instanceof SyntaxError)
      message.react('❗')
      return e.stack || e.toString()
    })

  const msg = new ProcessManager(message, result || '', parent, { lang: 'js' })
  await msg.init()
  await msg.addAction([{ emoji: '⏹️', action: ({ manager }) => manager.destroy() }, { emoji: '◀️', action: ({ manager }) => manager.previousPage(), requirePage: true }, { emoji: '▶️', action: ({ manager }) => manager.nextPage(), requirePage: true }])
}
