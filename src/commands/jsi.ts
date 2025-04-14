import { Collection, ButtonBuilder, ButtonStyle, Message } from 'discord.js'
import type { Client } from '../'
import { ProcessManager as _ProcessManager, count as _count, inspect as _inspect, table as _table, typeFind as _typeFind } from '../utils'

export async function jsi (message: Message, _dokdo: Client): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { client } = _dokdo
  if (!message.data.args) {
    message.reply('Missing Arguments.')
    return
  }

  // eslint-disable-next-line no-eval
  const res = new Promise((resolve) => resolve(eval(message.data.args ?? '')))
  let msg!: _ProcessManager
  await res
    .then((output) => {
      const typeofTheRes = _typeFind(output)
      const overview = _inspect(output, { depth: -1 })
      const constructorName =
        output && output.constructor
          ? Object.getPrototypeOf(output.constructor).name
          : null
      const arrCount = _count(output)
      msg = new _ProcessManager(
        message,
        `=== ${overview.slice(0, 100)}${
          overview.length > 100 ? '...' : ''
        } ===\n\n${_table({
          Type: `${typeof output}(${typeofTheRes})`,
          Name: constructorName || null,
          Length: typeof output === 'string' && output.length,
          Size: output instanceof Collection ? output.size : null,
          'Content Types': arrCount
            ? arrCount.map((el) => `${el.name} (${el.ratio}％)`).join(', ')
            : null
        })}`,
        _dokdo,
        { lang: 'prolog' }
      )
    })
    .catch((e) => {
      msg = new _ProcessManager(message, e.stack, _dokdo, { lang: 'js' })
    })

  await msg.init()
  await msg.addAction([
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
      action: ({ manager }) => manager.destroy(),
      requirePage: true
    },
    {
      button: new ButtonBuilder()
        .setStyle(ButtonStyle.Success)
        .setCustomId('dokdo$next')
        .setLabel('Next'),
      action: ({ manager }) => manager.nextPage(),
      requirePage: true
    }
  ])
}
