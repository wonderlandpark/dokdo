import fetch from 'node-fetch'
import { APIEmbed, MessageReplyOptions, version } from 'discord.js'

export const source = (version: string): string => {
  const isDev = version.includes('dev')
  const parsed = version.match(/^(\d+)\.\d+\.\d+$/)?.[0]
  return `https://raw.githubusercontent.com/discordjs/discord.js/docs/${
    isDev ? 'main' : parsed
  }.json`
}

export async function docs (q: string): Promise<MessageReplyOptions> {
  const params = new URLSearchParams({
    force: 'true',
    src: source(version),
    q
  })
  const res = await fetch(`https://djsdocs.sorta.moe/v2/embed?${params}`).then(r => r).catch(() => null)
  const embed = (res && await res.json().then(r => r).catch(() => null)) as APIEmbed | false
  if (!embed) return { content: 'Nothing found or Request Failed' }
  else return { embeds: [embed] }
}
