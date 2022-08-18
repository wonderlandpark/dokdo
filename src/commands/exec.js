const child = require('child_process')
const Discord = require('discord.js')
const { ProcessManager, codeBlock } = require('../utils')

module.exports = async function Exec (message, parent) {
  if (!message.data.args) return message.channel.send('Missing Arguments.')

  const shell = process.env.SHELL || (process.platform === 'win32' ? 'powershell' : null)
  console.log(shell)
  if (!shell) return message.channel.send('Sorry, we are not able to find your default shell.\nPlease set `process.env.SHELL`.')

  const msg = new ProcessManager(message, `$ ${message.data.args}\n`, parent, { lang: 'bash' })
  await msg.init()

  const res = child.spawn(shell, ['-c', (shell === 'win32' ? 'chcp 65001\n' : '') + message.data.args], { encoding: 'utf8' })
  const timeout = setTimeout(() => {
    kill(res, 'SIGTERM')
    message.reply('Shell timeout occured.')
  }, 180000)
  console.log(res.pid)

  await msg.addAction([
    { button: new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Danger).setCustomId('dokdo$prev').setLabel('Prev'), action: ({ manager }) => manager.previousPage(), requirePage: true },
    {
      button: new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Secondary).setCustomId('dokdo$stop').setLabel('Stop'),
      action: async ({ res, manager }) => {
        res.stdin.pause()
        const gg = await kill(res)
        console.log(gg)
        msg.add('^C')
        manager.destroy()
      }
    },
    { button: new Discord.ButtonBuilder().setStyle(Discord.ButtonStyle.Success).setCustomId('dokdo$next').setLabel('Next'), action: ({ manager }) => manager.nextPage(), requirePage: true }
  ], { res })

  res.stdout.on('data', (data) => {
    console.log(data.toString())
    msg.add('\n' + data.toString())
  })

  res.stderr.on('data', (data) => {
    msg.add(`\n[stderr] ${data.toString()}`)
  })

  res.on('error', (err) => {
    console.log(err)
    return message.channel.send(`Error occurred while spawning process\n${codeBlock.construct(err.toString(), 'sh')}`)
  })
  res.on('close', (code) => {
    console.log(clearTimeout(timeout))
    msg.add(`\n[status] process exited with code ${code}`)
  })
}

/**
 * @param {any} res
 * @param {NodeJS.Signals} [signal]
 */
function kill (res, signal) {
  if (process.platform === 'win32') return child.exec(`powershell -File "..\\utils\\KillChildrenProcess.ps1" ${res.pid}`, { cwd: __dirname })
  else return res.kill('SIGINT' || signal)
}
