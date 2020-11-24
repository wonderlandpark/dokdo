module.exports = function type(argument) {
    const type = typeof argument
    if(argument instanceof RegExp) return 'regexp'
    if(type === 'function') return /^class[\s{]/.test(argument.toString()) ? 'class' : 'function'
    else if(type === 'object') {
        if(Array.isArray(argument)) return 'array'
        else if(argument === null) return 'null'
        else if(argument instanceof Map || argument instanceof WeakMap) return 'map'
        else if(argument instanceof Set || argument instanceof WeakSet) return 'set'
        else if(argument instanceof Error) return 'error'
        else if(argument instanceof Date) return 'date'
        else return 'object'
    }
    else if(argument === 'NaN') return 'nan'
    return type
}
