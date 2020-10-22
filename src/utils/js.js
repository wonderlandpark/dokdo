const ProcessManager = require('./ProcessManager')

module.exports = async function JS( message, client ) {
    
    
    
    console.log(message.data.args)
    const res = new Promise(resolve => resolve(eval(message.data.args)))

    const result = await res
    .then(output => {
        if(typeof output !== 'string') output = require('util').inspect(output, {
            depth: 0
        })
        
        if(typeof output === 'function') output = output.toString()
        output = output

        return output
    })
    .catch(e => {
        return e.stack
    })

    console.log(result)

    const msg = new ProcessManager(message, result.replace(new RegExp(client.token, 'gi'), '(accesstoken was hidden)'), { lang: 'js' })

    await msg.init()
    await msg.addAction([{ emoji: "⏹️", action: ({ manager }) => manager.destroy() }, { emoji: "◀️", action: ({ manager })  => manager.previousPage() }, { emoji: "▶️", action: ({ manager }) => manager.nextPage() } ], { res })
    
}