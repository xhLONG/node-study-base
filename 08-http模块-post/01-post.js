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
    case '/api/placeHolder':
      httpPost({
        host: 'm.xiaomiyoupin.com',
        port: 443,
        path: '/mtop/market/search/placeHolder',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }, (data) => {
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

function httpPost(options, callback) {
  let data = ''
  const req = https.request(options, (res) => {
    res.on('data', (chunk) => {
      data += chunk
    })
    res.on('end', () => {
      callback(data)
    })
  })
  req.write(JSON.stringify([{}, { "baseParam": { "ypClient": 1 } }]))
  req.end()
}