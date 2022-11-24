const http = require('http')
const fs = require('fs')
const zlib = require('zlib')

// gzip压缩文件后再传输。减少流量消耗，提高访问速度。

const readStream = fs.createReadStream('./index.js', 'utf-8')
const gzib = zlib.createGzip()
http.createServer((req, res) => {
  // res 本身也是一个可写流

  res.writeHead(200, {'Content-type': 'application/x-javascript;charset=utf-8', 'Content-Encoding': 'gzip'})
  readStream.pipe(gzib).pipe(res)
}).listen(3000, () => {
  console.log('server start')
})