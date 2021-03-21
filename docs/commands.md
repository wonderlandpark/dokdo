# Commands

In document, its using `!` as prefix and `dokdo` for command.

## Root Command

> `!dokdo`

### Non-sharded

![root](/root.png)

### Sharded

![root-shard](/root-shard.png)

## Shell

You could run your shell code.

- For Windows, it uses powershell.
- Others, it uses default shell

> `!dokdo <sh|bash|ps|powershell|shell|zsh> [Command]`

![shell](https://github.com/wonderlandpark/dokdo/raw/main/assets/dokdo.gif)

## Eval

You could eval your script.

### Variables

| VARIABLE | TYPE | DESCRIPTION |
|----------|------|-------------|
| message | <Docs type='Message' link='https://discord.js.org/#/docs/main/stable/class/Client' /> | Message on Discord |
| parent | [Dokdo](/docs/types.md#dokdo) | Dokdo class |
| client | <Docs type='Client' link='https://discord.js.org/#/docs/main/stable/class/Client' /> | DJS bot client | Discord | Discord Module | Discord Module (`require('discord.js')`) |

You could add variables by [DokdoOptions](/docs/types.md#dokdooptions).globalVariable
> `!dokdo <js|javascript> [script]`

![javascript](/javascript.png)