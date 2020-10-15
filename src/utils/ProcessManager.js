const Discord = require('discord.js')
const codeBlock = require('./codeBlock')
module.exports = class ProcessManager {
    /**
     * 
     * @param {Discord.Message} message
     * @param {string} content 
     * @param {Object} options 
     */
    constructor(message, content, options={}) {
        this.target = message.channel
        this.content = content
        this.messageContent = ''
        this.options = options
        this.limit = options.limit || 1900
        this.splitted = content.match(new RegExp(`.{1,${this.limit}}`, 'gms'))
        this.page = 1
        this.author = message.author
        this.actions = [ ]
        this.message = null
    }

    async init() {
        this.messageContent = `${codeBlock(this.splitted[this.page-1], this.options.lang)}\n\nPage ${this.page}/${this.splitted.length}`
        this.message = await this.target.send(this.messageContent)
        
    }

    async addAction(actions, args) {
        if(!this.message) return

        this.actions = actions
        this.args = args

        actions.forEach(el=> this.message.react(el.emoji))
        
        this.reactCollector = this.message.createReactionCollector(( reaction, user ) => this.actions.find(e=> e.emoji === reaction.emoji.name) && user.id === this.author.id, { time: 300000, error: [ 'time' ], dispose: true })
        
        this.args.manager = this
        this.reactCollector.on('collect', r => {
            console.log(this.args)
            const e = this.actions.find(e=> e.emoji === r.emoji.name)

            console.log(e)
            if(!e) return
            e.action(this.args)
        })

        this.reactCollector.on('remove', r => {
            console.log('remove')
            const e = this.actions.find(e=> e.emoji === r.emoji.name)

            if(!e) return
            e.action(this.args)
        })

        this.reactCollector.on('end', (reason) => {
            console.log(reason)
            this.message.reactions.removeAll()
        })



    }

    updatePage(num) {
        if(!this.message) return console.log('GG')
        if(this.splitted.length < num || num < 1) throw new Error('Invalid page.')
        console.log(num)
        this.page = num

        console.log(this.page)
        this.update(`${codeBlock(this.splitted[this.page-1], this.options.lang)}\n\nPage ${this.page}/${this.splitted.length}`)
    }

    nextPage() {
        if(this.page >= this.splitted.length) return

        this.updatePage(this.page+1)
    }

    previousPage() {
        if(this.page <= 1) return

        this.updatePage(this.page-1)
    }

    update() {
        if(!this.message) return
        this.splitted = this.content.match(new RegExp(`.{1,${this.limit}}`, 'gms'))
        this.messageContent = `${codeBlock(this.splitted[this.page-1], this.options.lang)}\n\nPage ${this.page}/${this.splitted.length}`
        this.message.edit(`${codeBlock(this.splitted[this.page-1], this.options.lang)}\n\nPage ${this.page}/${this.splitted.length}`)
    }

    add(content) {
        if(!this.message) return
        this.content += content
        this.splitted = this.content.match(new RegExp(`.{1,${this.limit}}`, 'gms'))

        this.update(this.content)
    }
}