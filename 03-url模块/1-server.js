const http = require('http')
const url = require('url')
const {renderHtml} = require('./module/renderHtml')
const {renderStatus} = require('./module/renderStatus')

const server = http.createServer()
server.on('request', (req, res) => {
  // req 请求的内容
  // res 响应的内容
  const urlObj = url.parse(req.url, true)
  const pathname = urlObj.pathname
  console.log(urlObj)
  res.writeHead(renderStatus(pathname), { 'Content-Type': 'text/html;charset=utf-8' })
  res.write(renderHtml(pathname))
  res.end()
})
server.listen(3000, () => {
  console.log('server start localhost:3000')
})

// 新版url的用法
const myUrl = new URL('https://www.bilibili.com/video/BV1rA4y1Z7fd/?p=13&spm_id_from=pageDriver&vd_source=f8795597e7f0c295202e6a13de041b09')
console.log(myUrl)