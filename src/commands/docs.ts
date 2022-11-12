import type { Message } from 'discord.js'
import { docs } from '../utils'

export async function djs (message: Message): Promise<void> {
  if (!message.data.args) {
    message.reply('Missing Argument.')
    return
  }
  message.reply((await docs(message.data.args)) ?? 'Not Found')
}
