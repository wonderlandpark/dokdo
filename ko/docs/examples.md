---
lang: ko-KR
title: 예제
---

# 예제

이 페이지는 Dokdo를 사용하는 예제를 포함하고 있습니다.

## 예제 1: 기본 설정

```js
const Dokdo = require('dokdo')
const DokdoHandler = new Dokdo(client, { prefix: '!' })
client.on('message', async (message) => {
  await DokdoHandler.run(message)
})
```

## 예제 2: 사용자 정의 옵션

```js
const Dokdo = require('dokdo')
const DokdoHandler = new Dokdo(client, {
  prefix: '!!',
  noPerm: (message) => message.reply('이 명령어를 사용할 권한이 없습니다.')
})
client.on('message', async (message) => {
  await DokdoHandler.run(message)
})
```