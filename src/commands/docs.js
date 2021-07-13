const { djsDocs: { docs } } = require('../utils')

module.exports = async function djs (message, parent) {
  if (!message.data.args) return message.channel.send('Missing Argument.')
  return message.channel.send(await docs(message.data.args))
}
