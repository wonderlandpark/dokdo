import { request } from 'undici'
import { ButtonBuilder, ButtonStyle, Message } from 'discord.js'
import { ProcessManager, HLJS } from '../utils'
import type { Client } from '../'

export async function curl (message: Message, parent: Client): Promise<void> {
  if (!message.data.args) {
    message.reply('Missing Arguments.')
    return
  }

  let type
  let res
  try {
    const response = await request(message.data.args.split(' ')[0] as string)
    const text = await response.body.text()
    try {
      type = 'json'
      res = JSON.stringify(JSON.parse(text), null, 2)
    } catch {
      type = HLJS.getLang(response.headers['content-type'] as string | undefined) || 'html'
      res = text
    }
  } catch (e: any) {
    type = 'js'
    message.react('❗')
    console.log(e.stack)
    res = e.toString()
  }

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
