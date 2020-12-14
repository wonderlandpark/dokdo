const Discord = require('discord.js')
const fetch = require('node-fetch')

const Commands = require('./commands')
const Utils = require('./utils')

/**
 * @typedef {Function} noPerm
 * @param {Discord.Message} message
 * @returns {any|Promise<any>}
 */

/**
 * @typedef DokdoOptions
 * @property {string[]} [aliases=['dokdo', 'dok']] Aliases of command
 * @property {string[]} [owners] ID of owners
 * @property {string} [prefix] Prefix of Bot
 * @property {any[]} [secrets=[]] Secrets to hide
 * @property {noPerm} [noPerm] Executed when command runned by not allowed user
 * @property {boolean} [disableAttachmentExecution=false] Disable attachment execution.
 */

/**
 * @typedef MessageData
 * @property {string} [raw] Raw message content
 * @property {string} [cmd] Command
 * @property {string} [type] Command type
 * @property {string} [args] Arguments given
 */

module.exports = class Dokdo {
  /**
   * Main Client of Dokdo
   *
   * @param {Discord.Client} client Discord Client
   * @param {DokdoOptions} options Dokdo Options
   */
  constructor (client, options) {
    if (!(client instanceof Discord.Client)) throw new Error('Invalid `client`. `client` parameter is required.')
    if (!options || typeof options !== 'object') throw new Error('Invliad `options`. `options` parameter is required.')

    if (!options.owners) {
      console.warn('[dokdo] Owners not given. Fetching from Application.')

      client.fetchApplication().then(data => {
        if (data.owner.members) options.owners = data.owner.members.map(el => el.id)
        else if (data.owner.id) options.owners = [data.owner.id]
        else options.owners = []

        console.info(`[dokdo] Fetched owners(${options.owners.length}): ${options.owners.length > 3 ? options.owners.slice(0, 3).join(', ') + ` and ${options.owners.length - 3} more owners` : options.owners.join(', ')}`)
      })
    }

    if (!options.secrets) options.secrets = []
    if (!options.aliases) options.aliases = ['dokdo', 'dok']

    this.client = client
    this.options = options
    this.process = []
  }

  /**
   * @param {Discord.Message} message Message
   * @returns {Promise<any>|any}
   */
  async run (message) {
    if (this.options.prefix && !message.content.startsWith(this.options.prefix)) return

    const parsed = message.content.replace(this.options.prefix, '').split(' ')
    const codeParsed = Utils.codeBlock.parse(parsed.slice(2).join(' '))

    /**
     * @type {MessageData}
     */
    message.data = {
      raw: message.content,
      cmd: parsed[0],
      type: parsed[1],
      args: codeParsed ? codeParsed[2] : parsed.slice(2).join(' ')
    }
    if (!message.data.args && message.attachments.size > 0 && !this.options.disableAttachmentExecution) {
      const file = message.attachments.first()
      const buffer = await (await fetch(file.url)).buffer()
      const type = { ext: file.name.split('.').pop(), fileName: file.name }
      if (['txt', 'js', 'ts', 'sh', 'bash', 'zsh', 'ps'].includes(type.ext)) {
        message.data.args = buffer.toString()
        if (!message.data.type && type.ext !== 'txt') message.data.type = type.ext
      }
    }
    if (this.options.aliases && !this.options.aliases.includes(message.data.cmd)) return
    if (!this.options.owners.includes(message.author.id)) {
      if (this.options.noPerm) return this.options.noPerm(message)
      else return
    }

    if (!message.data.type) return Commands.main(message, this)
    switch (message.data.type) {
      case 'sh':
      case 'bash':
      case 'ps':
      case 'powershell':
      case 'shell':
      case 'zsh':
        Commands.exec(message, this)
        break
      case 'js':
      case 'javascript':
        Commands.js(message, this)
        break
      case 'shard':
        Commands.shard(message, this)
        break
      case 'jsi':
        Commands.jsi(message, this)
        break
      case 'curl':
        Commands.curl(message, this)
        break
      default:
        message.channel.send('Available Options: `sh`, `js`, `shard`')
    }
  }
}

module.exports.Utils = Utils
module.exports.Commands = Commands
