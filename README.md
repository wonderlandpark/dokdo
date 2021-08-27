<div align="center">
<img src="assets/dokdo.png">
<br/>
<p>
    <a href="https://npmjs.com/package/dokdo"><img src="https://img.shields.io/npm/v/dokdo"></a>
    <a href="https://github.com/wonderlandpark/dokdo/actions"><img src="https://github.com/wonderlandpark/dokdo/workflows/Testing/badge.svg" alt="Build status" /></a>
</p>
<p>
    <a href="https://nodei.co/npm/dokdo/"><img src="https://nodei.co/npm/dokdo.png"></a>
</p>
</div>

## About

Dokdo. Easy Discord bot debuging tool.

It's debugging tool for `discord.js` projects.

## Preview

![sh](assets/dokdo.gif)

## Installation

<details>
    <summary><strong>Using Discord.js v12?</strong></summary>

You could install `dokdo@0.4` by
    
```sh
  npm i dokdo@djsv12
```
</details>

### Stable

```sh
npm i dokdo@latest
```

### Dev

```sh
npm i wonderlandpark/dokdo#main
```



## Features

### Shell command on stdout update

![shell](assets/dokdo.gif)

### Easy shard broadcastEval manager

![shard](assets/shard.png)

## Example usage

```js
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] })

const Dokdo = require('dokdo')

const DokdoHandler = new Dokdo(client, { aliases: ['dokdo', 'dok'], prefix: '!' }) // Using Bot Application ownerID as default for owner option.

client.on('messageCreate', async message => {
  if (message.content === 'ping') return message.channel.send('Pong') // handle commands first
  DokdoHandler.run(message) // try !dokdo
})

client.login('super secret token')
```

## Contributing

Please check out it hasn't already been exists before you create issue, and check [the contribution guide](./.github/CONTRIBUTING.md) before you submit Pull Request.
