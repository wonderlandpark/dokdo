---
lang: en-US
title: Dokdo Documentation
description: Easy Discord bot debugging tool.
---

# Welcome to Dokdo Documentation

This is the official documentation for Dokdo, an easy-to-use Discord bot debugging tool.

## Getting Started

### Installation

You could install `dokdo` by this command:

<code-group>
<code-block title="YARN">
```bash
yarn add dokdo
```
</code-block>

<code-block title="NPM">
```bash
npm i dokdo
```
</code-block>
</code-group>

### Adding Dokdo to Project

Just add a few lines of code.

```js
const Dokdo = require('dokdo')

const DokdoHandler = new Dokdo(client, { prefix: '!' })
```

You could check Dokdo class options [here](/docs/types.md#dokdooptions).

At Message Handler:

```js
client.on('message', async (message) => {
  await DokdoHandler.run(message)
  // your command code
})
```

## Examples

You could check some examples [here](examples)

## Contributing

Contributing is always welcomed!

[Github](https://github.com/wonderlandpark/dokdo)