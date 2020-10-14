const { exec } = require('child_process')
const Discord = require('discord.js')
const Pagination = require('./Pagination')

/**
 * 
 * @param {Discord.Message} message 
 */
module.exports = async function exec(message) {
    const msg = new Pagination(message.channel, `$ ${message.data.args}`, { lang: 'bash' })
    await msg.init()

    const res = require('child_process').exec(message.data.args)

    res.stdout.on('data', (data) => {
        msg.add(data)
    })

    res.stderr.on('data', ( data ) => {
        res.add(`[stderr] ${data}`)
    })

    res.on('close', ( code ) => { 
        res.add(`[status] process exited with code ${code}`)
    })
}