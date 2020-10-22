const Discord = require('discord.js')
const { exec, js } = require('./utils')
const codeBlock = require('./utils/codeBlock')

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
        
        const parsed = message.content.replace(this.options.prefix, '').split(' ')
        let codeParsed = codeBlock.parse(parsed.slice(2).join(' '))
        message.data = {
            raw: message.content,
            cmd: parsed[0],
            type: parsed[1],
            args: codeParsed ? codeParsed[2] :  parsed.slice(2).join(' ')
        }
        if(this.options.aliases.includes(message.data.cmd)) {
            if(!this.options.owners.includes(message.author.id)) {
                if(this.options.noPerm) return this.options.noPerm(message)
                else return
            }
            switch(message.data.type) {
                case 'sh':
                    exec(message)
                break
                case 'js':
                    js(message, this.client)
                break;
                default:
                    message.reply('Available Options: `sh`, `js`')
            }
        }

    }
}