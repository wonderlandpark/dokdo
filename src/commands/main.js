const Discord = require('discord.js')
const dayjs = require('dayjs')
const relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const { system } = require('../utils')
const version = require('../../package.json').version

module.exports = async function (message, parent) {
  let summary = `Dokdo v${version}, discord.js \`${Discord.version}\`, \`Node.js ${process.version}\` on \`${process.platform}\`\nProcess started at ${dayjs(system.processReadyAt()).fromNow()}, bot was ready at ${dayjs(parent.client.readyAt).fromNow()}.\n`

  summary += `\nUsing ${system.memory().rss} at this process.\n`
  const cache = `${parent.client.guilds.cache.size} guild(s) and ${parent.client.users.cache.size} user(s)`

  if (parent.client.shard) {
    const guilds = await parent.client.shard.fetchClientValues('guilds.cache.size').then(r => r.reduce((prev, val) => prev + val, 0))
    summary += `Running on PID ${process.pid} for this client, and running on PID ${process.ppid} for the parent process.\n\nThis bot is sharded in ${Array.isArray(parent.client.shard.shards) ? parent.client.shard.shards.length : parent.client.shard.count} shard(s) and running in ${guilds} guild(s).\nCan see ${cache} in this client.`
  } else summary += `Running on PID ${process.pid}\n\nThis bot is not sharded and can see ${cache}.`

  summary += `\nAverage websocket latency: ${parent.client.ws.ping}ms`

  return message.channel.send(summary)
}
