import fs from 'fs'
import { ButtonBuilder, ButtonStyle, Message } from 'discord.js'
import { ProcessManager, HLJS } from '../utils'
import type { Dokdo } from '../structures/Dokdo'

export async function cat(message: Message, parent: Dokdo) {
  if (!message.data.args) return message.reply('Missing Arguments.')
  const filename = message.data.args
  let msg
  fs.readFile(filename, async (err, data) => {
    if (err)
      msg = new ProcessManager(message, err.toString(), parent, { lang: 'js' })
    else
      msg = new ProcessManager(message, data.toString(), parent, {
        lang: HLJS.getLang(filename.split('.').pop()),
      })
    await msg.init()
    await msg.addAction([
      {
        button: new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setCustomId('dokdo$prev')
          .setLabel('Prev'),
        action: ({ manager }) => manager.previousPage(),
        requirePage: true,
      },
      {
        button: new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('dokdo$stop')
          .setLabel('Stop'),
        action: ({ manager }) => manager.destroy(),
        requirePage: true,
      },
      {
        button: new ButtonBuilder()
          .setStyle(ButtonStyle.Primary)
          .setCustomId('dokdo$next')
          .setLabel('Next'),
        action: ({ manager }) => manager.nextPage(),
        requirePage: true,
      },
    ])
  })
}
