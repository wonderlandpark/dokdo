import type { Message } from 'discord.js'
import type { Dokdo } from '../structures/Dokdo'
import { docs } from '../utils'

export async function djs(message: Message, parent: Dokdo) {
  if (!message.data.args) return message.reply('Missing Argument.')
  return message.reply((await docs(message.data.args)) ?? 'Not Found')
}
