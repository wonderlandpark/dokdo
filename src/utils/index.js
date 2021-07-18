const ProcessManager = require('./ProcessManager')
const codeBlock = require('./codeBlock')
const HLJS = require('./hljs')
const system = require('./system')
const DateFormatting = require('./DateFormatting')

const count = require('./count')
const djsDocs = require('./djsDocs')
const inspect = require('./inspect')
const table = require('./table')
const type = require('./type')
const isinstance = require('./isinstance')
const isGenerator = require('./isGenerator')
const regexpEscape = require('./regexpEscape')

module.exports = {
  ProcessManager,
  codeBlock,
  HLJS,
  system,
  DateFormatting,
  count,
  djsDocs,
  table,
  type,
  inspect,
  isinstance,
  isGenerator,
  regexpEscape
}
