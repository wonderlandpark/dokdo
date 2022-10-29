import Discord from 'discord.js'
import { ProcessManager, inspect } from '../utils'

export async function shard(message, parent) {
  if (!message.data.args) return message.reply('Missing Arguments.')
  if (!parent.client.shard) return message.reply('Shard Manager not found.')
  let evalFunction
  try {
    // eslint-disable-next-line no-new-func
    evalFunction = Function('client', `return ${message.data.args}`) // catch syntax error
  } catch (err: any) {
    return message.reply(err.toString())
  }
  const result = await parent.client.shard
    .broadcastEval(evalFunction)
    .then((el: any) => el)
    .catch((e: any) => e.toString())
  let msg
  if (!Array.isArray(result))
    msg = new ProcessManager(message, result, parent, { lang: 'js' })
  else {
    let sum
    if (typeof result[0] === 'number')
      sum = result.reduce((prev, val) => prev + val, 0)
    else if (Array.isArray(result[0]))
      sum = result.reduce((prev, val) => prev.concat(val), [])
    msg = new ProcessManager(
      message,
      `// TOTAL\n${inspect(sum, { depth: 1, maxArrayLength: 50 })}\n\n${result
        .map(
          (value, index) =>
            `// #${index} SHARD\n${inspect(value, {
              depth: 1,
              maxArrayLength: 100,
            })}`
        )
        .join('\n')}`,
      parent,
      { lang: 'js' }
    )
  }

  await msg.init()
  await msg.addAction([
    {
      button: new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Primary)
        .setCustomId('dokdo$prev')
        .setLabel('Prev'),
      action: ({ manager }) => manager.previousPage(),
      requirePage: true,
    },
    {
      button: new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Secondary)
        .setCustomId('dokdo$stop')
        .setLabel('Stop'),
      action: ({ manager }) => manager.destroy(),
      requirePage: true,
    },
    {
      button: new Discord.ButtonBuilder()
        .setStyle(Discord.ButtonStyle.Success)
        .setCustomId('dokdo$next')
        .setLabel('Next'),
      action: ({ manager }) => manager.nextPage(),
      requirePage: true,
    },
  ])
}
