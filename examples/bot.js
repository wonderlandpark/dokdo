const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config')

const Dokdo = require('../src')

const DokdoHandler = new Dokdo(client, { aliases: ['dokdo', 'dok'], prefix: '!', noPerm: (message) => message.reply('🚫 You have no permission to use dokdo.'), globalVariable: { WONDER_IS_COOL: true } })
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async message => {
  if (message.content === 'ping') return message.reply('pong')
  await DokdoHandler.run(message)
})

client.login(config.token)
