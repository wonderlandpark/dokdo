const assert = require('assert')

const codeBlock = require('../src/utils/codeBlock')

describe('codeBlock', function () {
  const lang = 'ts'
  const code = 'console.log(\'Hello, World\');'
  const codeBlocked = `\`\`\`${lang}\n${code}\n\`\`\``
  it('Parse argument', function () {
    const result = codeBlock.parse(codeBlocked)
    assert.strictEqual(result[1], lang)
    assert.strictEqual(result[2], code)
  })
  it('Construct Codeblock', function () {
    assert.strictEqual(codeBlock.construct(code, lang), codeBlocked)
  })
})
