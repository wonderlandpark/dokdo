
const Discord = require('discord.js') // eslint-disable-line no-unused-vars
const Dokdo = require('..') // eslint-disable-line no-unused-vars
const codeBlock = require('./codeBlock')

module.exports = class ProcessManager {
  /**
     * Process Manager of every Process
     * @param {Discord} message
     * @param {string} content
     * @param {Dokdo} dokdo
     * @param {Object} options
     */
  constructor (message, content, dokdo, options = {}) {
    this.target = message.channel
    this.dokdo = dokdo
    this.content = content || ''
    this.messageContent = ''
    this.options = options
    this.limit = options.limit || 1900
    this.splitted = content.match(new RegExp(`.{1,${this.limit}}`, 'gms')) || [' ']
    this.page = 1
    this.author = message.author
    this.actions = []
    this.wait = 1
    this.message = null
    this.argument = []
  }

  async init () {
    this.messageContent = this.genText()
    this.message = await this.target.send(this.filterSecret(this.messageContent))
  }

  async addAction (actions, args) {
    if (!this.message) return

    this.actions = actions
    this.args = args || { }

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
      this.message.reactions.removeAll()
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

    this.dokdo.options.secrets.forEach(el => {
      string = string.replace(new RegExp(el, 'gi'), '[secret]')
    })

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
    const splitted = this.content.match(new RegExp(`.{1,${this.limit}}`, 'gms'))
    this.splitted = splitted
    // if(this.messageContent === `${codeBlock.construct(this.splitted[this.page-1], this.options.lang)}\n\nPage ${this.page}/${this.splitted.length}`) return
    if (this.wait === 0) this.messageContent = this.genText()
    else if (this.wait % 5 === 0) {
      this.wait = 0
      setTimeout(() => {
        this.messageContent = this.genText()
        this.edit()
        this.wait++
      }, 5000)
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

  add (content) {
    if (!this.message) return
    this.content += content

    this.update(this.content)
  }

  destroy () {
    this.reactCollector.stop()
    this.message.reactions.removeAll()
  }

  genText () {
    return this.options.noCode && this.splitted.length < 2 ? `${this.splitted[this.page - 1]}` : `${codeBlock.construct(this.splitted[this.page - 1], this.options.lang)}\n\nPage ${this.page}/${this.splitted.length}`
  }
}
