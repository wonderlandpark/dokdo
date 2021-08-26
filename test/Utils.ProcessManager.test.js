const assert = require('assert')
const { Client, Message, SnowflakeUtil } = require('discord.js')

const Dokdo = require('../src')
const ProcessManager = require('../src/utils/ProcessManager')

const secret = 'youshalln0tpa$$...'
// Mock Client
const BotClient = new Client({ intents: [] })
const dokdo = new Dokdo(BotClient, { secrets: [secret] })
// Mock Message
const message = new Message(BotClient, { id: SnowflakeUtil.generate(), channel_id: SnowflakeUtil.generate() })
const Manager = new ProcessManager(message, 'anystring', dokdo)

describe('filter secret', function () {
  it('Basic', function () {
    assert.strictEqual(Manager.filterSecret(`my password is ${secret}`), 'my password is [secret]')
    assert.doesNotMatch(Manager.filterSecret(`${secret}${secret} ${secret}`), /youshalln0tpa\$\$\.\.\./)
    assert.strictEqual(Manager.filterSecret((`${secret}${secret} ${secret}`)), '[secret][secret] [secret]')
  })
})
