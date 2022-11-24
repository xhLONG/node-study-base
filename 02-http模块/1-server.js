const http = require('http')
const {renderHtml} = require('./module/renderHtml')
const {renderStatus} = require('./module/renderStatus')

const server = http.createServer()
server.on('request', (req, res) => {
  // req 请求的内容
  // res 响应的内容
  console.log(req.url)
  res.writeHead(renderStatus(req.url), { 'Content-Type': 'text/html;charset=utf-8' })
  res.write(renderHtml(req.url))
  res.end()
})
server.listen(3000, () => {
  console.log('server start localhost:3000')
})