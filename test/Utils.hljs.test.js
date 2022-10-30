const assert = require('assert')

const { HLJS } = require('../dist')

describe('Highlight.js', function () {
  it('Get Language', function () {
    assert.strictEqual(HLJS.getLang('js'), 'js')
    assert.strictEqual(HLJS.getLang('python'), 'python')
  })

  it('Invalid Test', function () {
    assert.strictEqual(HLJS.getLang(''), undefined)
    assert.strictEqual(HLJS.getLang(1), undefined)
  })
})
