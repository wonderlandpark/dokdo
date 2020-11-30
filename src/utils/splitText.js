module.exports = function splitText (text, opt) {
  const { maxLength, char } = { maxLength: opt.maxLength || 2000, char: opt.char || '\n' }

  text = typeof text === 'string' ? text : Array.isArray(text) ? text.join('\n') : String(text)
  if (text.length < maxLength) return [text]
  const splitted = text.split(char)
  const values = []
  let msg = ''
  for(const el of splitted) {
    if((msg + char + el).length > maxLength) // what r u doing
    return // to pass eslint error
  }
}
