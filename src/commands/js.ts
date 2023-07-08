// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Discord, { Embed, EmbedBuilder, Collection, Attachment, ButtonBuilder, ButtonStyle, Message } from 'discord.js'
import type { Client, Context } from '../'
import { ProcessManager, inspect, isInstance, isGenerator } from '../utils'

export async function js (message: Context, parent: Client): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { client } = parent // for eval
  const isMessage = message instanceof Message
  if (isMessage && !message.data.args) {
    message.reply('Missing Arguments.')
    return
  }

  const res = new Promise((resolve) =>
    resolve(
      // eslint-disable-next-line no-eval
      eval(
        isMessage
          ? message.data.args ?? ''
          : message.options.getString('content', true)
      )
    )
  )
  let typeOf
  const result = await res
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then(async (output: any) => {
      typeOf = typeof output

      async function prettify (target: unknown): Promise<void> {
        if (
          target instanceof Embed ||
          target instanceof EmbedBuilder
        ) { await message.reply({ embeds: [target] }) } else if (isInstance(target, Attachment)) {
          await message.reply({
            files:
              target instanceof Collection ? target.toJSON() : [target]
          })
        }
      }

      if (isGenerator(output)) {
        for (const value of output) {
          prettify(value)

          if (typeof value === 'function') { await message.reply(value.toString()) } else if (typeof value === 'string') await message.reply(value)
          else {
            await message.reply(
              inspect(value, { depth: 1, maxArrayLength: 200 })
            )
          }
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
    noCode: typeOf !== 'object'
  })
  await msg.init()
  await msg.addAction([
    {
      button: new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId('dokdo$prev')
        .setLabel('Prev'),
      action: ({ manager }) => manager.previousPage(),
      requirePage: true
    },
    {
      button: new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('dokdo$stop')
        .setLabel('Stop'),
      action: ({ manager }) => manager.destroy(),
      requirePage: true
    },
    {
      button: new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setCustomId('dokdo$next')
        .setLabel('Next'),
      action: ({ manager }) => manager.nextPage(),
      requirePage: true
    }
  ])
}
