import fetch from 'node-fetch'
import { ButtonBuilder, ButtonStyle, Message } from 'discord.js'
import { ProcessManager, HLJS } from '../utils'
import type { Client } from '../'

export async function curl (message: Message, parent: Client): Promise<void> {
  if (!message.data.args) {
    message.reply('Missing Arguments.')
    return
  }

  let type
  const res = await fetch(message.data.args.split(' ')[0] as string)
    .then(async r => {
      const text = await r.text()
      try {
        type = 'json'
        return JSON.stringify(JSON.parse(text), null, 2)
      } catch {
        type = HLJS.getLang(r.headers.get('Content-Type')) || 'html'
        return text
      }
    })
    .catch((e) => {
      type = 'js'
      message.react('❗')
      console.log(e.stack)
      return e.toString()
    })

  // console.log(res)
  const msg = new ProcessManager(message, res || '', parent, { lang: type })
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
