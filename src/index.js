const Discord = require('discord.js')
const { main, exec, js, shard, jsi } = require('./commands')
const { codeBlock } = require('./utils')

module.exports = class Dokdo {
  /**
     * @typedef {Function} noPerm
     * @param {Discord.Message} message
     * @returns {any|Promise<any>}
     */
  /**
     * @typedef {Object} options
     * @property {?string[]} aliases Aliases of command
     * @property {?string[]} owners ID of owners
     * @property {?string} prefix Prefix of Bot
     * @property {?any[]} secrets Secrets to hide
     * @property {?noPerm} noPerm Executed when command runned by not allowed user
     */

  /**
     * Main Client of Dokdo
     * @param {Discord.Client} client
     * @param {options} options
     */
  constructor (client, options) {
    if (!client) throw new Error('`client` is required.')
    if (!options) throw new Error('`options` is required.')
    if (!options.owners) {
      console.log('[dokdo] Owner not given. Fetching from Application.')
      client.fetchApplication().then(data => {
        if (data.owner.members) options.owners = data.owner.members.map(el => el.id)
        else if (data.owner.id) options.owners = [data.owner.id]
        else options.owners = []
        console.log(data.owner.members.map(el => el.id))
      })
    }
    if (!options.secrets) options.secrets = []
    if (!options.aliases) options.aliases = ['dokdo', 'dok']
    this.client = client
    this.Discord = Discord
    this.options = options
    this.process = []
  }

  async run (message) {
    if (this.options.prefix && !message.content.startsWith(this.options.prefix)) return

    const parsed = message.content.replace(this.options.prefix, '').split(' ')
    const codeParsed = codeBlock.parse(parsed.slice(2).join(' '))
    message.data = {
      raw: message.content,
      cmd: parsed[0],
      type: parsed[1],
      args: codeParsed ? codeParsed[2] : parsed.slice(2).join(' ')
    }
    if (this.options.aliases && !this.options.aliases.includes(message.data.cmd)) return
    if (!this.options.owners.includes(message.author.id)) {
      if (this.options.noPerm) return this.options.noPerm(message)
      else return
    }
    if (!message.data.type) return main(message, this)
    switch (message.data.type) {
      case 'sh':
        exec(message, this)
        break
      case 'js':
        js(message, this)
        break
      case 'shard':
        shard(message, this)
        break
      case 'jsi':
        jsi(message, this)
        break
      default:
        message.channel.send('Available Options: `sh`, `js`, `shard`')
    }
  }
}
