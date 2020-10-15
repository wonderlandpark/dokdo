const Discord = require('discord.js')
const exec = require('./utils/exec')

module.exports = class Dokdo {
    /**
     * 
     * @param {Discord.Client} client 
     * @param {Object} options 
     */
    constructor(client, options = { aliases: [ 'dokdo', 'dok' ], owners: [ ], prefix: '!' }) {
        if(!options.aliases || !options.owners || !options.prefix) throw new Error('`options` is invalid')
        this.client = client
        this.options = options
        this.process = [ ]
    }

    async run(message) {
        if(!message.content.startsWith(this.options.prefix)) return
        if(!this.options.owners.includes(message.author.id)) {
            if(this.options.noPerm) return this.options.noPerm(message)
            else return
        }
        const parsed = message.content.replace(this.options.prefix, '').split(' ')
        message.data = {
            raw: message.content,
            cmd: parsed[0],
            type: parsed[1],
            args: parsed.slice(2).join(' ')
        }

        console.log(message.data.cmd)
        if(this.options.aliases.includes(message.data.cmd)) {
            switch(message.data.type) {
                case 'sh':
                    exec(message)
                break;
                default:
                    message.reply('Available Options: `sh`')
            }
        }

    }
}