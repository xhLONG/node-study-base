var jwt = require('jsonwebtoken');

const secret = 'xhlong'

const JWT = {
  generate: function(data, expires) {
    return jwt.sign({data}, secret, { expiresIn: expires });
  },
  verify: function (token) {
    try {
      return jwt.verify(token, secret)
    } catch (err) {
      return false
    }
  }
}

module.exports = JWT