# Typings

## Dokdo

The main class of Dokdo.

You could access by `parent` variable in js(eval) command.

### Constructor

```js
new Dokdo(client, options)
```

> | PARAMETER | TYPE | OPTIONAL | DEFAULT | DESCRIPTION |
> |-----------|------|----------|---------|-------------|
> | client | <Docs type='Client' link='https://discord.js.org/#/docs/main/stable/class/Client' /> | | *none* | DJS bot client |
> | options | <Docs type='DokdoOptions' link='#dokdooptions' /> |  | *none* | Options of Dokdo |

### Properties

#### .client

DJS bot client

> Type: <Docs type='Client' link='https://discord.js.org/#/docs/main/stable/class/Client' />

#### .options

Options of Dokdo

> Type: <Docs type='DokdoOptions' link='#dokdooptions' />

#### .owners

User ID to allow to use `dokdo`

> Type: <Docs type='String' />[]

### Methods

#### .run(`message`)

Runs dokdo command
>
> | PARAMETER | TYPE | DESCRIPTION |
> |-----------|------|-------------|
> | message | <Docs type='Message' link='https://discord.js.org/#/docs/main/stable/class/Client' /> | Message on Discord |
>
> Returns: <Docs type='void' link='https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined' />

## DokdoOptions

### Types

- <Docs type='Object' />

### Properties

> | PARAMETER | TYPE | OPTIONAL | DEFAULT | DESCRIPTION | EXAMPLE |
> |-----------|------|----------|---------|-------------|---------|
> | prefix | <Docs type='String' /> |  | *none* | Prefix of Bot | `'!'` |
> | aliases | <Docs type='String' />[] | ✅ | `['dokdo', 'dok']` | `dokdo` command aliases | `['debug']` |
> | owners | <Docs type='String' />[] | ✅ | Fetch Application Owner(s) from Discord API | User ID to allow to use `dokdo` | `['285185716240252929']` |
> | secrets | any[] | ✅ | `[]` | Secrets to hide at output | `['superSecretPassword', 'youshallnotpass']` |
> | globalVariable | <Docs type='Object' /> | ✅ | `{}` | Custom global variable to use at eval | `{ db: DatabaseQuery }` |
> | disableAttachmentExecution | <Docs type='Boolean' /> | ✅ | `true` | Disable command execution by attachment | `false` |
