module.exports = function type (argument) {
  if (typeof argument === 'number' && isNaN(argument)) return 'NaN'
  const parsed = Object.prototype.toString.apply(argument)
  const obj = parsed.slice(1, 7)
  if (obj !== 'object') return typeof argument
  const type = parsed.slice(8, parsed.length - 1)
  if (type === 'Function') return /^class[\s{]/.test(String(argument)) ? 'Class' : 'Function'
  else return type
}
