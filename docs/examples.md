---
lang: en-US
title: Examples
---

# Examples

This page contains examples of how to use Dokdo.

## Example 1: Basic Setup

```js
const Dokdo = require('dokdo')
const DokdoHandler = new Dokdo(client, { prefix: '!' })
client.on('message', async (message) => {
  await DokdoHandler.run(message)
})
```

## Example 2: Custom Options

```js
const Dokdo = require('dokdo')
const DokdoHandler = new Dokdo(client, {
  prefix: '!!',
  noPerm: (message) => message.reply('You do not have permission to use this command.')
})
client.on('message', async (message) => {
  await DokdoHandler.run(message)
})
```