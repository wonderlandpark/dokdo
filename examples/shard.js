const { ShardingManager } = require('discord.js')
const config = require('./config')
const manager = new ShardingManager('./examples/bot.js', { token: config.token, totalShards: 2 })

manager.on('shardCreate', shard => console.log(`Launched shard ${shard.id}`))
manager.spawn()
