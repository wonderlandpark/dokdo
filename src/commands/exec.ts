import child from 'child_process'
import { ButtonBuilder, ButtonStyle, Message } from 'discord.js'
import type { Client } from '../'
import { ProcessManager, codeBlock } from '../utils'

export async function exec (message: Message, parent: Client): Promise<void> {
  if (!message.data.args) {
    message.reply('Missing Arguments.')
    return
  }

  const shell =
    process.env.SHELL || (process.platform === 'win32' ? 'powershell' : null)
  if (!shell) {
    message.reply(
      'Sorry, we are not able to find your default shell.\nPlease set `process.env.SHELL`.'
    )
    return
  }

  const msg = new ProcessManager(message, `$ ${message.data.args}\n`, parent, {
    lang: 'bash'
  })
  await msg.init()

  const res = child.spawn(shell, [
    '-c',
    (shell === 'win32' ? 'chcp 65001\n' : '') + message.data.args
  ])
  const timeout = setTimeout(() => {
    kill(res, 'SIGTERM')
    message.reply('Shell timeout occured.')
  }, 180000)

  await msg.addAction(
    [
      {
        button: new ButtonBuilder()
          .setStyle(ButtonStyle.Danger)
          .setCustomId('dokdo$prev')
          .setLabel('Prev'),
        action: ({ manager }) => manager.previousPage(),
        requirePage: true
      },
      {
        button: new ButtonBuilder()
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('dokdo$stop')
          .setLabel('Stop'),
        action: async ({ res, manager }) => {
          res.stdin.pause()
          kill(res)
          msg.add('^C')
          manager.destroy()
        },
        requirePage: false
      },
      {
        button: new ButtonBuilder()
          .setStyle(ButtonStyle.Success)
          .setCustomId('dokdo$next')
          .setLabel('Next'),
        action: ({ manager }) => manager.nextPage(),
        requirePage: true
      }
    ],
    { res }
  )

  res.stdout.on('data', (data) => {
    msg.add(data.toString())
  })

  res.stderr.on('data', (data) => {
    msg.add(`[stderr] ${data.toString()}`)
  })

  res.on('error', (err) => {
    return message.reply(
      `Error occurred while spawning process\n${codeBlock.construct(
        err.toString(),
        'sh'
      )}`
    )
  })
  res.on('close', (code) => {
    clearTimeout(timeout)
    msg.add(`\n[status] process exited with code ${code}`)
  })
}

function kill (res: child.ChildProcessWithoutNullStreams, signal?: NodeJS.Signals) {
  if (process.platform === 'win32') {
    return child.exec(
      `powershell -File "..\\utils\\KillChildrenProcess.ps1" ${res.pid}`,
      { cwd: __dirname }
    )
  } else return res.kill('SIGINT' || signal)
}
