const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config')

const Dokdo = require('../src')

const DokdoHandler = new Dokdo(client, { aliases: ['dokdo', 'dok'], prefix: '!', noPerm: (message) => message.reply('No Permission') })
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async message => {
  DokdoHandler.run(message)
})

client.login(config.token)
