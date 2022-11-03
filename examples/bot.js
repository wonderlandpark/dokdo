const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})
const config = require('./config')

const Dokdo = require('../dist')

const DokdoHandler = new Dokdo.Client(client, {
  aliases: ['dokdo', 'dok'],
  prefix: '!',
  noPerm: (message) => message.reply('🚫 You have no permission to use dokdo.'),
  globalVariable: { WONDER_IS_COOL: true }
})
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('messageCreate', async message => {
  if (message.content === 'ping') return message.reply('pong')
  await DokdoHandler.run(message)
})

client.login(config.token)
