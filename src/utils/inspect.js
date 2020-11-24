const util = require('util')
module.exports = function inspect (value, depth=0) {
    return util.inspect(value, { depth })
}