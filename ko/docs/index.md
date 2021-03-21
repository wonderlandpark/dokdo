# 독도에 오신 것을 환영합니다!

Dokdo는 간편한 디스코드봇 디버깅 툴입니다.

간단하게 스크립트를 실행할 수도 있고 디버깅 그 이상을 자신에 디스코드봇에 추가할 수 있습니다.

## 시작하기

### 설치

다음 명령어로 `dokdo`를 설치할 수 있습니다.:

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

### Dokdo를 프로젝트에 적용하기

몇 줄에 코드만 추가하면 됩니다.

```js
const Dokdo = require('dokdo')

const DokdoHandler = new Dokdo(client, { prefix: '!' })
```

Dokdo 객채의 옵션을 더 확인해보고 싶으시다면 [이곳](/ko/docs/types.md#dokdooptions)을 참고해주세요.

메세지 핸들러:

```js
client.on('message', async (message) => {
  await DokdoHandler.run(message)
  // 명령어 코드
})
```

## 예시

[이곳](examples)에서 예시를 확인할 수 있습니다.

## 기여하기

기여는 항상 환영입니다!

[Github](https://github.com/wonderlandpark/dokdo)