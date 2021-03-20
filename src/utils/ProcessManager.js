const Discord = require('discord.js')

const Dokdo = require('../') // eslint-disable-line no-unused-vars
const codeBlock = require('./codeBlock')
/**
 * @typedef {Dokdo} Dokdo
 */

/**
 * @typedef ProcessManagerOptions
 * @property {number} [limit=1900]
 * @property {boolean} [noCode=false]
 * @property {string} [lang]
 */

/**
 * @typedef {Record.<string, any>} ActionArgs
 */
/**
 * @typedef {Function} onAction
 * @param {Record.<string, any>} arguments
 * @returns {any|Promise<any>}
 */

/**
 * @typedef Action
 * @property {string} emoji
 * @property {onAction} action
 * @property {boolean} [requirePage]
 */

/**
   * Process Manager of every Process
   *
   * @param {Discord.Message} message
   * @param {string} content
   * @param {Dokdo} dokdo
   * @param {ProcessManagerOptions} options
   */
module.exports = class ProcessManager {
  constructor (message, content, dokdo, options = {}) {
    this.target = message.channel
    this.dokdo = dokdo
    this.content = content || '​'
    this.messageContent = ''
    this.options = options
    this.limit = options.limit || 1900
    this.splitted = this.splitContent() || [' ']
    this.page = 1
    this.author = message.author
    this.actions = []
    this.wait = 1
    this.message = null
    this.argument = []
    if (typeof this.content !== 'string') throw new Error('Please pass valid content')
  }

  async init () {
    this.messageContent = this.genText()
    this.message = await this.target.send(this.filterSecret(this.messageContent))
  }

  /**
   *
   * @param {Action} actions
   * @param {Record<string, any>} args
   */
  async addAction (actions, args) {
    if (!this.message) return

    this.actions = actions
    this.args = args || {}

    this.args.manager = this

    this.reactMessage()
    this.reactCollector = this.message.createReactionCollector((reaction, user) => this.actions.find(e => e.emoji === reaction.emoji.name) && user.id === this.author.id, { time: 300000, error: ['time'], dispose: true })

    this.reactCollector.on('collect', r => {
      const e = this.actions.find(e => e.emoji === r.emoji.name)
      if (!e) return
      e.action(this.args)
    })

    this.reactCollector.on('remove', r => {
      const e = this.actions.find(e => e.emoji === r.emoji.name)

      if (!e) return
      e.action(this.args)
    })

    this.reactCollector.on('end', () => {
      this.message.reactions.removeAll().catch(e => e)
    })
  }

  async reactMessage () {
    if (this.options.noCode && this.splitted.length < 2) return
    this.actions.filter(el => !el.reacted).forEach(el => {
      if (el.requirePage && this.splitted.length <= 1) return
      el.reacted = true
      this.message.react(el.emoji)
    })
  }

  filterSecret (string) {
    string = string.replace(new RegExp(this.dokdo.client.token, 'gi'), '[accesstoken was hidden]')

    for (const el of this.dokdo.options.secrets) {
      string = string.replace(new RegExp(el, 'gi'), '[secret]')
    }

    return string
  }

  updatePage (num) {
    if (!this.message) return
    if (this.splitted.length < num || num < 1) throw new Error('Invalid page.')
    this.page = num

    this.update(this.genText())
  }

  nextPage () {
    if (this.page >= this.splitted.length) return

    this.updatePage(this.page + 1)
  }

  previousPage () {
    if (this.page <= 1) return

    this.updatePage(this.page - 1)
  }

  update () {
    if (!this.message) return
    this.splitted = this.splitContent()
    if (this.wait === 0) this.messageContent = this.genText()
    else if (this.wait % 2 === 0) {
      this.wait = 0
      setTimeout(() => {
        this.messageContent = this.genText()
        this.edit()
        this.wait++
      }, 1000)
    } else {
      this.messageContent = this.genText()
      this.edit()
      this.wait++
    }
  }

  edit () {
    if (this.splitted.length > 1) this.reactMessage()
    this.message.edit(this.filterSecret(this.messageContent))
  }

  /**
   * @param {string} content
   */
  add (content) {
    if (!this.message) return
    this.content += content

    this.update(this.content)
  }

  destroy () {
    this.message.reactions.removeAll().catch(() => {})
    this.reactCollector.stop()
  }

  genText () {
    return this.options.noCode && this.splitted.length < 2 ? `${this.splitted[this.page - 1]}` : `${codeBlock.construct(this.splitted[this.page - 1], this.options.lang)}\n\nPage ${this.page}/${this.splitted.length}`
  }

  splitContent () {
    const strings = this.content.split('\n')
    return Discord.Util.splitMessage(strings.map(str => str.length > this.limit ? str.match(new RegExp(`.{1,${this.limit}}`, 'g')) : str).flat(), { maxLength: this.limit })
  }
}
