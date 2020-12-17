const assert = require('assert')

const HLJS = require('../src/utils/hljs')

describe('Highlight.js', function () {
  it('Get Language', function () {
    assert.strictEqual(HLJS.getLang('js'), 'js')
    assert.strictEqual(HLJS.getLang('python'), 'python')
  })

  it('Invalid Test', function () {
    assert.strictEqual(HLJS.getLang(''), null)
    assert.strictEqual(HLJS.getLang(1), null)
  })
})
