const http = require('http')
const https = require('https')
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
      res.end(`${JSON.stringify({
        name: 'lily',
        age: 18
      })}`)
      break
    case '/api/hot':
      httpGet(`https://i.maoyan.com/api/mmdb/movie/v3/list/hot.json?ct=%E5%B9%BF%E5%B7%9E&ci=20&channelId=4`, (data) => {
        res.end(data)
      })
      break
    default:
      res.end('404')
  }
})
server.listen(3000, () => {
  console.log('server start')
})

function httpGet(url, callback) {
  let data = ''
  https.get(url, (res) => {
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      callback(data)
    })
  })
}