const ProcessManager = require('./ProcessManager')
const codeBlock = require('./codeBlock')
const HLJS = require('./hljs')
const system = require('./system')

const count = require('./count')
const djsDocs = require('./djsDocs')
const inspect = require('./inspect')
const table = require('./table')
const type = require('./type')
const isinstance = require('./isinstance')
const isGenerator = require('./isGenerator')
const RelativeTime = require('./RelativeTime')
const regexpEscape = require('./regexpEscape')

module.exports = {
  ProcessManager,
  codeBlock,
  HLJS,
  system,
  count,
  djsDocs,
  table,
  type,
  inspect,
  isinstance,
  isGenerator,
  RelativeTime,
  regexpEscape
}
