import {
  GatewayIntentBits,
  IntentsBitField,
  version as djsVersion
} from 'discord.js'
import type { Client, Context } from '../'

import { System, DateFormatting, join } from '../utils'
import { version } from '../../package.json'

export async function main (message: Context, parent: Client): Promise<void> {
  const intents = new IntentsBitField(parent.client.options.intents)

  let summary = `Dokdo v${version}, discord.js \`${djsVersion}\`, \`Node.js ${
    process.version
  }\` on \`${process.platform}\`\nProcess started at ${DateFormatting.relative(
    System.processReadyAt()
  )}, bot was ready at ${DateFormatting.relative(parent.client.readyAt ?? 0)}.\n`

  summary += `\nUsing ${System.memory().rss} at this process.\n`
  const currentGuilds = parent.client.guilds.cache.size
  const currentUsers = parent.client.guilds.cache.reduce((acc, g) => acc + (g.memberCount ?? 0), 0)

  if ((parent.client as any).cluster) {
    const cluster = (parent.client as any).cluster
    const clusterId = cluster.id
    const shardIds = cluster.ids as number[]
    summary += `Running on PID ${process.pid} \u2014 Cluster #${clusterId}, Shard(s): [${shardIds.join(', ')}]\n\nThis cluster can see ${currentGuilds.toLocaleString()} guild(s) and ${currentUsers.toLocaleString()} user(s).\n> \u2139\uFE0F Showing current cluster's data only \u2014 bot uses \`discord-hybrid-sharding\`, each cluster handles a subset of total guilds/users.`
  } else if (parent.client.shard) {
    const guilds = await parent.client.shard
      .fetchClientValues('guilds.cache.size')
      .then((r) => {
        const out = r as number[]
        return out.reduce((prev, val) => prev + val, 0)
      })
    summary += `Running on PID ${process.pid} for this client, and running on PID ${process.ppid} for the parent process.\n\nThis bot is sharded in ${parent.client.shard.count} shard(s) and running in ${guilds} guild(s).\nCan see ${currentGuilds} guild(s) and ${currentUsers.toLocaleString()} user(s) in this client.`
  } else { summary += `Running on PID ${process.pid}\n\nThis bot is not sharded and can see ${currentGuilds} guild(s) and ${currentUsers.toLocaleString()} user(s).` }

  summary +=
    '\n' +
    join(
      [
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
      ].map(
        (u) =>
          `\`${GatewayIntentBits[u]}\` intent is ${
            intents.has(u) ? 'enabled' : 'disabled'
          }`
      ),
      ', ',
      ' and '
    ) +
    '.'
  summary += `\nAverage websocket latency: ${parent.client.ws.ping}ms`

  message.reply(summary)
}
