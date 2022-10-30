const assert = require('assert')

const { Utils } = require('../dist')

describe('codeBlock', function () {
  const lang = 'ts'
  const code = "console.log('Hello, World');"
  const codeBlocked = `\`\`\`${lang}\n${code}\n\`\`\``
  it('Parse argument', function () {
    const result = Utils.codeBlock.parse(codeBlocked)
    assert.strictEqual(result[1], lang)
    assert.strictEqual(result[2], code)
  })
  it('Construct Codeblock', function () {
    assert.strictEqual(Utils.codeBlock.construct(code, lang), codeBlocked)
  })
})
