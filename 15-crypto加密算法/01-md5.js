const crypto = require('crypto')

const hash = crypto.createHash('md5')

hash.update('abc123bb')

console.log(hash.digest('hex'))