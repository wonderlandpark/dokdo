const child = require('child_process')
const Discord = require('discord.js')
const ProcessManager = require('./ProcessManager')

/**
 * 
 * @param {Discord.Message} message 
 */
module.exports = async function Exec(message) {
    const msg = new ProcessManager(message, `$ ${message.data.args}\n`, { lang: 'bash' })
    await msg.init()

    const res = child.exec(message.data.args)

    await msg.addAction([{ emoji: "⏹️", action: ({ res }) => { console.log('GG'); res.kill('SIGINT') } }, { emoji: "◀️", action: ({ manager })  => manager.previousPage() }, { emoji: "▶️", action: ({ manager }) => manager.nextPage() } ], { res })
    
    res.stdout.on('data', (data) => {
        msg.add('\n' + data)
        console.log(data)
    })

    res.stderr.on('data', ( data ) => {
        msg.add(`\n[stderr] ${data}`)
    })

    res.on('close', ( code ) => { 
        msg.add(`\n[status] process exited with code ${code}`)
    })
}