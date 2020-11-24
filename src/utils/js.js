const ProcessManager = require('./ProcessManager')

module.exports = async function JS( message, parent ) {
    const { client } = parent // for eval
    if(!message.data.args) return message.channel.send('Argument missing.')
    const res = new Promise(resolve => resolve(eval(message.data.args)))
    

    const result = await res
    .then(output => {
        if(typeof output !== 'string') output = require('util').inspect(output, {
            depth: 0
        })
        
        if(typeof output === 'function') output = output.toString()

        return output
    })
    .catch(e => e.toString())

    const msg = new ProcessManager(message, `\n${result}`, parent, { lang: 'js' })

    await msg.init()
    await msg.addAction([{ emoji: "⏹️", action: ({ manager }) => manager.destroy() }, { emoji: "◀️", action: ({ manager })  => manager.previousPage() }, { emoji: "▶️", action: ({ manager }) => manager.nextPage() } ], { res })
    
}