const assert = require('assert')
const Discord = require('discord.js')

const count = require('../src/utils/count')

describe('count function', function () {
  it('Invalid Test', function () {
    assert.strictEqual(count('string'), null)
    assert.strictEqual(count(1), null)
    assert.strictEqual(count({ }), null)
  })
  it('Array', function () {
    const numbers = [0, 1, 2, 3, 4, 5]
    const stringsAndNumbers = [0, '1', 2, '3', '4', 5]
    const others = [0, '1', {}, new Error(), /RegExp/, function () { }]
    let result = count(numbers)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].name, 'Number')
    assert.strictEqual(result[0].count, numbers.length)
    assert.strictEqual(result[0].ratio, '100.0')
    result = count(stringsAndNumbers)
    assert.strictEqual(result.length, 2)
    assert.strictEqual(result[1].count, 3)
    result = count(others)
    assert.strictEqual(result.length, 6)
    assert.strictEqual(result.find(el => el.name === 'RegExp').count, 1)
  })
  it('Collection', function () {
    const numbers = new Discord.Collection([['zero', 0], ['one', 1], ['two', 2], ['three', 3], ['four', 4], ['five', 5]])
    const stringsAndNumbers = new Discord.Collection([['zero', 0], ['one', '1'], ['two', 2], ['three', '3'], ['four', 4], ['five', '5']])
    const others = new Discord.Collection([['number', 0], ['string', '1'], ['object', {}], ['error', new Error()], ['regexp', /RegExp/], ['function', function () { }]])
    let result = count(numbers)
    assert.strictEqual(result.length, 1)
    assert.strictEqual(result[0].name, 'Number')
    assert.strictEqual(result[0].count, numbers.size)
    assert.strictEqual(result[0].ratio, '100.0')
    result = count(stringsAndNumbers)
    assert.strictEqual(result.length, 2)
    assert.strictEqual(result[1].count, 3)
    result = count(others)
    assert.strictEqual(result.length, 6)
    assert.strictEqual(result.find(el => el.name === 'RegExp').count, 1)
  })
})
