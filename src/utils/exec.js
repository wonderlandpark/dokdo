const child = require('child_process')
const Discord = require('discord.js')
const ProcessManager = require('./ProcessManager')
const codeBlock = require('./codeBlock');
const kill = require('tree-kill');

/**
 * 
 * @param {Discord.Message} message 
 */
module.exports = async function Exec(message) {
    const msg = new ProcessManager(message, `$ ${message.data.args}\n`, { lang: 'bash' })
    await msg.init()
    const res = child.exec(message.data.args, { cwd: __dirname, encoding: 'utf8' })
    console.log(res.pid)
    await msg.addAction([{ emoji: "⏹️", action: ({ res, manager }) => { 
        kill(res.pid, 'SIGKILL')
        manager.destroy()
     } }, { emoji: "◀️", action: ({ manager })  => manager.previousPage() }, { emoji: "▶️", action: ({ manager }) => manager.nextPage() } ], { res })
    
    res.stdout.on('data', (data) => {
        msg.add('\n' + data.toString())
        res.kill()
    })

    res.stderr.on('data', ( data ) => {
        msg.add(`\n[stderr] ${data.toString()}`)
    })

    res.on('error', ( err ) => {
        console.log(err)
        return message.channel.send(`Error occurred while spawning process\n${codeBlock.construct(err.toString(), 'sh')}`)
    })
    res.on('close', ( code ) => {
        msg.add(`\n[status] process exited with code ${code}`)
    })
}