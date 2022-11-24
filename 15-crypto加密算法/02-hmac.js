const crypto = require('crypto')

// hmac 一种hash加密算法

const hash = crypto.createHmac('sha256', 'xhlong')

hash.update('abc123bb')

console.log(hash.digest('hex'))