const Discord = require('discord.js')
const { ProcessManager, inspect, isinstance, isGenerator } = require('../utils')

module.exports = async function js (message, parent) {
  // eslint-disable-next-line no-unused-vars
  const { client } = parent // for eval
  if (!message.data.args) return message.channel.send('Missing Arguments.')

  // eslint-disable-next-line no-eval
  const res = new Promise(resolve => resolve(eval(message.data.args)))
  let typeOf
  const result = await res
    .then(async output => {
      typeOf = typeof output

      async function prettify (target) {
        if (target instanceof Discord.MessageEmbed) await message.channel.send({ embeds: [target] })
        else if (isinstance(target, Discord.MessageAttachment)) {
          await message.channel.send({
            files: target instanceof Discord.Collection ? target.array() : [target]
          })
        }
      }

      if (isGenerator(output)) {
        for (const value of output) {
          prettify(value)

          if (typeof value === 'function') await message.channel.send(value.toString())
          else if (typeof value === 'string') await message.channel.send(value)
          else await message.channel.send(inspect(value, { depth: 1, maxArrayLength: 200 }))
        }
      }

      prettify(output)

      if (typeof output === 'function') {
        typeOf = 'object'
        return output.toString()
      } else if (typeof output === 'string') {
        return output
      }
      message.react('✅')
      return inspect(output, { depth: 1, maxArrayLength: 200 })
    })
    .catch(e => {
      typeOf = 'object'
      message.react('❗')
      return e.toString()
    })

  const msg = new ProcessManager(message, result || '', parent, { lang: 'js', noCode: typeOf !== 'object' })
  await msg.init()
  await msg.addAction([
    { button: new Discord.MessageButton().setStyle('DANGER').setCustomId('dokdo$prev').setLabel('Prev'), action: ({ manager }) => manager.previousPage(), requirePage: true },
    { button: new Discord.MessageButton().setStyle('SECONDARY').setCustomId('dokdo$stop').setLabel('Stop'), action: ({ manager }) => manager.destroy(), requirePage: true },
    { button: new Discord.MessageButton().setStyle('SUCCESS').setCustomId('dokdo$next').setLabel('Next'), action: ({ manager }) => manager.nextPage(), requirePage: true }
  ])
}
