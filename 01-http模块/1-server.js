const http = require('http')

http.createServer((req, res) => {
  // req 请求的内容
  // res 响应的内容
  res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8'})
  res.write(`
    <html>
      <b>hello world</b>
      <p>你好</p>
    </html>
  `)
  res.end()
}).listen(3000, () => {
  console.log('server start localhost:3000')
})