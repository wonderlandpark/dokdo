# 예시

Dokdo의 사용 예시

## 권한이 없는 유저에 대한 반환 메시지

```js
const Discord = require('discord.js')
const dokdo = require('dokdo')

const client = new Discord.Client()

const DokdoHandler = new Dokdo(client, { prefix: '!', noPerm: (message) => message.reply('🚫 dokdo를 사용할 권한이 없습니다.') })

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on('message', async message => {
  if (message.content === '핑') return message.reply('퐁')
  await DokdoHandler.run(message)
})

client.login('token')
```

### 결과

![Preview](/noPerm.png)