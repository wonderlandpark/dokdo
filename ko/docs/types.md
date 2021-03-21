# Typings

## Dokdo

Dokdo의 메인 객체입니다.

`parent` 변수로 js(eval) 명령어에서 접근할 수 있습니다.

### Constructor

```js
new Dokdo(client, options)
```

> | PARAMETER | TYPE | OPTIONAL | DEFAULT | DESCRIPTION |
> |-----------|------|----------|---------|-------------|
> | client | <Docs type='Client' link='https://discord.js.org/#/docs/main/stable/class/Client' /> | | *none* | DJS 봇 클라이언트 |
> | options | <Docs type='DokdoOptions' link='#dokdooptions' /> |  | *none* | Dokdo 옵션 |

### Properties

#### .client

DJS 봇 클라이언트

> Type: <Docs type='Client' link='https://discord.js.org/#/docs/main/stable/class/Client' />

#### .options

Dokdo 옵션

> Type: <Docs type='DokdoOptions' link='#dokdooptions' />

#### .owners

`dokdo` 사용을 허용할 유저 ID

> Type: <Docs type='String' />[]

### Methods

#### .run(`message`)

dokdo 명령어를 실행합니다.
>
> | PARAMETER | TYPE | DESCRIPTION |
> |-----------|------|-------------|
> | message | <Docs type='Message' link='https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=clearImmediate' /> | 디스코드 메세지 |
>
> Returns: <Docs type='void' link='https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/undefined' />

## DokdoOptions

### Types

- <Docs type='Object' />

### Properties

> | PARAMETER | TYPE | OPTIONAL | DEFAULT | DESCRIPTION | EXAMPLE |
> |-----------|------|----------|---------|-------------|---------|
> | prefix | <Docs type='String' /> |  | *none* | 봇 접두사 | `'!'` |
> | aliases | <Docs type='String' />[] | ✅ | `['dokdo', 'dok']` | `dokdo` 명령어 별칭 | `['debug']` |
> | owners | <Docs type='String' />[] | ✅ | Discord API에서 소유자를 패치해옵니다 | `dokdo` 사용을 허용할 유저 ID | `['285185716240252929']` |
> | secrets | any[] | ✅ | `[]` | 출력에서 숨길 정보 | `['superSecretPassword', 'youshallnotpass']` |
> | globalVariable | <Docs type='Object' /> | ✅ | `{}` | eval에서 사용할 커스텀 전역 변수 | `{ db: DatabaseQuery }` |
> | disableAttachmentExecution | <Docs type='Boolean' /> | ✅ | `true` | 첨부 파일로 명령어 실행 비활성화 여부 | `false` |
