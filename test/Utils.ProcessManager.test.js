const assert = require('assert')
const { Client, Message } = require('discord.js')

const Dokdo = require('../src')
const ProcessManager = require('../src/utils/ProcessManager')

const secret = 'youshalln0tpa$$...'
const BotClient = new Client()
const dokdo = new Dokdo(BotClient, { secrets: [secret] })
const message = new Message()
const Manager = new ProcessManager(message, 'anystring', dokdo)

describe('filter secret', function () {
  it('Basic', function () {
    assert.strictEqual(Manager.filterSecret(`my password is ${secret}`), 'my password is [secret]')
    assert.doesNotMatch(Manager.filterSecret(`${secret}${secret} ${secret}`), /youshalln0tpa\$\$\.\.\./)
    assert.strictEqual(Manager.filterSecret((`${secret}${secret} ${secret}`)), '[secret][secret] [secret]')
  })
})
