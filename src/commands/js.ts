import Discord, { Message } from 'discord.js'
import type { Context } from '../structures/Dokdo'
import { ProcessManager, inspect, isInstance, isGenerator } from '../utils'

export async function js(message: Context, parent) {
  // eslint-disable-next-line no-unused-vars
  const { client } = parent // for eval
  const isMessage = message instanceof Message
  if (isMessage && !message.data.args)
    return message.reply('Missing Arguments.')

  // eslint-disable-next-line no-eval
  const res = new Promise((resolve) =>
    resolve(
      eval(
        isMessage
          ? message.data.args
          : message.options.getString('content', true)
      )
    )
  )
  let typeOf
  const result = await res
    .then(async (output) => {
      typeOf = typeof output

      async function prettify(target: any) {
        if (
          target instanceof Discord.Embed ||
          target instanceof Discord.EmbedBuilder
        )
          await message.reply({ embeds: [target] })
        else if (isInstance(target, Discord.Attachment)) {
          await message.reply({
            files:
              target instanceof Discord.Collection ? target.toJSON() : [target],
          })
        }
      }

      if (isGenerator(output)) {
        for (const value of output) {
          prettify(value)

          if (typeof value === 'function') await message.reply(value.toString())
          else if (typeof value === 'string') await message.reply(value)
          else
            await message.reply(
              inspect(value, { depth: 1, maxArrayLength: 200 })
            )
        }
      }

      prettify(output)

      if (typeof output === 'function') {
        typeOf = 'object'
        return output.toString()
      } else if (typeof output === 'string') {
        return output
      }
      return inspect(output, { depth: 1, maxArrayLength: 200 })
    })
    .catch((e) => {
      typeOf = 'object'
      return e.toString()
    })

  const msg = new ProcessManager(message, result || '', parent, {
    lang: 'js',
    noCode: typeOf !== 'object',
  })
  await msg.init()
  await msg.addAction([
    {
      button: new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Danger)
        .setCustomId('dokdo$prev')
        .setLabel('Prev'),
      action: ({ manager }) => manager.previousPage(),
      requirePage: true,
    },
    {
      button: new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId('dokdo$stop')
        .setLabel('Stop'),
      action: ({ manager }) => manager.destroy(),
      requirePage: true,
    },
    {
      button: new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Success)
        .setCustomId('dokdo$next')
        .setLabel('Next'),
      action: ({ manager }) => manager.nextPage(),
      requirePage: true,
    },
  ])
}
