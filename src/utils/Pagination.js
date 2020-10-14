const Discord = require('discord.js')
const codeBlock = require('./codeBlock')
module.exports = class Pagination {
    /**
     * 
     * @param {Discord.TextChannel} target 
     * @param {string} content 
     * @param {Object} options 
     */
    constructor(target, content, options={}) {
        this.target = target
        this.content = content
        this.options = options
        this.limit = options.limit || 1900
        this.splitted = content.match(new RegExp(`.{1,${this.limit}}`, 'gms'))
        this.page = 1   
        this.message = null
    }

    async init() {
        this.message = await this.target.send(`${codeBlock(this.splitted[this.page-1], this.options.lang)}\n\nPage ${this.page}/${this.splitted.length}`)
        await this.addReaction()
    }

    async addReaction() {
        ["⏹️", "⏮️", "⏭️", "◀️", "▶️", "⏭️"].forEach(el=> this.message.react(el))
    }

    update(content) {
        if(!this.message) throw new Error('Please `init` first')
        this.content = content
        this.splitted = this.content.match(new RegExp(`.{1,${this.limit}}`, 'gms'))
        this.message.edit(`${codeBlock(this.splitted[this.page-1], this.options.lang)}\n\nPage ${this.page}/${this.splitted.length}`)
    }

    add(content) {
        if(!this.message) throw new Error('Please `init` first')
        this.content += content
        this.splitted = this.content.match(new RegExp(`.{1,${this.limit}}`, 'gms'))
        this.message.edit(`${codeBlock(this.splitted[this.page-1], this.options.lang)}\n\nPage ${this.page}/${this.splitted.length}`)
    }
}