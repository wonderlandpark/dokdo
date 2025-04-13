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

# Dokdo

**Dokdo** is a powerful, extensible debugging toolkit for `discord.js`.
It allows you to evaluate JavaScript code, run shell commands, and inspect your bot in real-time directly from Discord.

> Inspired by [Jishaku](https://github.com/scarletcafe/jishaku) for `discord.py`.

## ✨ Features

- **Eval Command** – Run JavaScript code directly in the context of your bot.
![js](assets/js.png)

- **Shell Command** – Execute terminal commands through Discord. You could also abort running process.
![sh](assets/sh.gif)

- **Command Alias & Prefix System** – Define how and when Dokdo should respond to commands.

- **Easy to Customize** – Tailor prefixes, aliases, owners, variables, and permission error messages to fit your needs.

## 🚀 Installation

```bash
npm install dokdo
```

<details>
    <summary>Using Discord.js v12?</summary>

You could install `dokdo@0.4.1` by
    
```sh
  npm i dokdo@djsv12
```
</details>

<details>
    <summary>Using Discord.js v13?</summary>

You could install `dokdo@0.5.1` by
    
```sh
  npm i dokdo@djsv13
```
</details>

<details>
  <summary>Nightly Version?</summary>

[Github Packages](https://github.com/wonderlandpark/dokdo/pkgs/npm/dokdo)
(registry configuration needed)

```sh
npm i @wonderlandpark/dokdo@nightly
```
</details>



## 🛠️ Usage

```js
const Discord = require('discord.js')
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] })

const Dokdo = require('dokdo')

const DokdoHandler = new Dokdo.Client(client, { aliases: ['dokdo', 'dok'], prefix: '!' }) // Using Bot Application ownerID as default for owner option.

client.on('messageCreate', async message => {
  if (message.content === 'ping') return message.channel.send('Pong') // handle commands first
  DokdoHandler.run(message) // try !dokdo
})

client.login('super secret token')
```

## Notes

### Message contents intent not approved?

You can set the Dokdo prefix including mentions. This allows the client to read the message content.

Example:

```js
new Dokdo.Client(client, {  prefix: '<@285185716240252929>' })
```
Command Usage: `<@285185716240252929>dokdo`

## 📚 Documentation

Full documentation, examples, and advanced usage: 

👉 https://dokdo.js.org

## 🤝 Contributing

Pull requests and issues are welcome. Dokdo is open-source and built with developer experience in mind. Please check [the contribution guide](./.github/CONTRIBUTING.md) before you submit Pull Request.
