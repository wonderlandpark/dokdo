const { ProcessManager, inspect, table, type } = require('../utils')

module.exports = async function jsi (message, parent) {
  // eslint-disable-next-line no-unused-vars
  const { client, Discord } = parent
  if (!message.data.args) return message.channel.send('Missing Arguments.')

  // eslint-disable-next-line no-eval
  const res = new Promise(resolve => resolve(eval(message.data.args)))
  let msg
  await res.then(output => {
    const typeofTheRes = type(output)
    const overview = inspect(output, { depth: -1 })
    const constructorName = output && output.constructor ? Object.getPrototypeOf(output.constructor).name : null
    msg = new ProcessManager(message, `=== ${overview.slice(0, 100)}${overview.length > 100 ? '...' : ''} ===\n\n${table({ Type: `${typeof output}(${typeofTheRes})`, Name: constructorName || null, Length: typeof output === 'string' && output.length })}`, parent, { lang: 'prolog' })
  }).catch(e => {
    msg = new ProcessManager(message, e.toString(), parent, { lang: 'js' })
  })

  await msg.init()
  await msg.addAction([{ emoji: '⏹️', action: ({ manager }) => manager.destroy() }, { emoji: '◀️', action: ({ manager }) => manager.previousPage(), requirePage: true }, { emoji: '▶️', action: ({ manager }) => manager.nextPage(), requirePage: true }])
}
