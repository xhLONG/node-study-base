const http = require('http')
const url = require('url')
const Router = {}

function use(obj) {
  Object.assign(Router, obj)
}

function start() {
  http.createServer((req, res) => {
    const urlObj = url.parse(req.url)
    try {
      Router[urlObj.pathname](req, res)
    } catch (err) {
      Router['/404'](req, res)
    }
  }).listen(3000, () => {
    console.log('server start')
  })
}

module.exports = {
  start,
  use
}