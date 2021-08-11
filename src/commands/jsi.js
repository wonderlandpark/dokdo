const Discord = require('discord.js')
const { ProcessManager, count, inspect, table, type } = require('../utils')

module.exports = async function jsi (message, parent) {
  // eslint-disable-next-line no-unused-vars
  const { client } = parent
  if (!message.data.args) return message.channel.send('Missing Arguments.')

  // eslint-disable-next-line no-eval
  const res = new Promise(resolve => resolve(eval(message.data.args)))
  let msg
  await res.then(output => {
    const typeofTheRes = type(output)
    const overview = inspect(output, { depth: -1 })
    const constructorName = output && output.constructor ? Object.getPrototypeOf(output.constructor).name : null
    const arrCount = count(output)
    msg = new ProcessManager(message, `=== ${overview.slice(0, 100)}${overview.length > 100 ? '...' : ''} ===\n\n${table({ Type: `${typeof output}(${typeofTheRes})`, Name: constructorName || null, Length: typeof output === 'string' && output.length, Size: output instanceof Discord.Collection ? output.size : null, 'Content Types': arrCount ? arrCount.map(el => `${el.name} (${el.ratio}％)`).join(', ') : null })}`, parent, { lang: 'prolog' })
  }).catch(e => {
    msg = new ProcessManager(message, e.stack, parent, { lang: 'js' })
  })

  await msg.init()
  await msg.addAction([
    { button: new Discord.MessageButton().setStyle('DANGER').setCustomId('dokdo$prev').setLabel('Prev'), action: ({ manager }) => manager.previousPage(), requirePage: true },
    { button: new Discord.MessageButton().setStyle('SECONDARY').setCustomId('dokdo$stop').setLabel('Stop'), action: ({ manager }) => manager.destroy(), requirePage: true },
    { button: new Discord.MessageButton().setStyle('SUCCESS').setCustomId('dokdo$next').setLabel('Next'), action: ({ manager }) => manager.nextPage(), requirePage: true }
  ])
}
