const crypto = require('crypto')

// aes 一种对称加密算法

function encrypt(key, iv, data) {
  const dep = crypto.createCipheriv('aes-128-cbc', key, iv)
  return dep.update(data, 'binary', 'hex') + dep.final('hex')
}

function decrypt(key, iv, crypted) {
  crypted = Buffer.from(crypted, 'hex').toString('binary')
  let dep = crypto.createDecipheriv('aes-128-cbc', key, iv)
  return dep.update(crypted, 'binary', 'utf8') + dep.final('utf8')
}


const key = 'xhlong1234567890' // 16位
const iv = 'abcdef1234567890' // 16位
const data = 'lilyjucijack'

const crypted = encrypt(key, iv, data)
console.log('加密-', crypted)
const decrypted = decrypt(key, iv, crypted)
console.log('解密-', decrypted)