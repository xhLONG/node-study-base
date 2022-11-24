const http = require('http')
const url = require('url')
const route = require('./route.js')

http.createServer((req, res) => {
  const urlObj = url.parse(req.url)
  route(res, urlObj.pathname)
  res.end()
}).listen(3000, () => {
  console.log('server start')
})