const inspect = require("./inspect")
const ProcessManager = require("./ProcessManager")
const table = require("./table")
const type = require("./type")

module.exports = async function jsi(message, parent) {
    const { client } = parent
    if(!message.data.args) return message.channel.send('Argument missing.')
    
    const res = new Promise(resolve => resolve(eval(message.data.args)))
    let msg
    await res.then(output=> {
        const typeofTheRes = type(output)
        const overview = inspect(output, { depth: -1 })
        const constructorName = Object.getPrototypeOf(output.constructor).name
        msg = new ProcessManager(message, `=== ${overview.slice(0, 100)}${overview.length > 100 ? '...' : ''} ===\n\n${table({ 'Type': `${typeof output}(${typeofTheRes})`, 'Name': constructorName || null, 'Length': typeof output === 'string' && output.length,  })}`, parent, { lang: 'prolog' })
    }).catch(e=> {
        msg = new ProcessManager(message, e.toString(), parent, { lang: 'js' })
    })
    

    await msg.init()
    await msg.addAction([{ emoji: "⏹️", action: ({ manager }) => manager.destroy() }, { emoji: "◀️", action: ({ manager })  => manager.previousPage() }, { emoji: "▶️", action: ({ manager }) => manager.nextPage() } ])
}