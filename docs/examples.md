# Examples

Example usages of Dokdo.

## Return message for Non-owner user

```js
const dokdo = require('dokdo')

const DokdoHandler = new Dokdo(client, { prefix: '!', noPerm: (message) => message.reply('🚫 You have no permission to use dokdo.') })

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async message => {
  if (message.content === 'ping') return message.reply('pong')
  await DokdoHandler.run(message)
})
```

### Result

![Preview](/noPerm.png)