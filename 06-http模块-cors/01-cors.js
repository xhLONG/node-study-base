const http = require('http')
const url = require('url')

// 后端通过设置响应头解决跨域问题

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json;charset=utf-8',
    'access-control-allow-origin': '*'
  })
  const urlObj = url.parse(req.url, true)
  switch (urlObj.pathname) {
    case '/api/user':
      res.write(`${JSON.stringify({
        name: 'lily',
        age: 18
      })}`)
      break
    default:
      res.write('404')
  }
  res.end()
})
server.listen(3000, () => {
  console.log('server start')
})