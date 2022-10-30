const assert = require('assert')

const { Utils } = require('../dist')

describe('Highlight.js', function () {
  it('Get Language', function () {
    assert.strictEqual(Utils.HLJS.getLang('js'), 'js')
    assert.strictEqual(Utils.HLJS.getLang('python'), 'python')
  })

  it('Invalid Test', function () {
    assert.strictEqual(Utils.HLJS.getLang(''), undefined)
    assert.strictEqual(Utils.HLJS.getLang(1), undefined)
  })
})
