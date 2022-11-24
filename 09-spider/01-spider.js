const http = require('http')
const https = require('https')
const url = require('url')
const fs = require('fs')

const cheerio = require('cheerio')

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
    case '/api/mao':
      httpGet('https://i.maoyan.com', (data) => {
        res.end(spider(data))
      })
      break
    default:
      res.end('404')
  }
})
server.listen(3000, () => {
  console.log('server start localhost:3000')
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

function spider(data) {
  const $ = cheerio.load(data)
  const $videosList = $('.list-wrap .item')
  const result = []
  $videosList.each((idx, value) => {
    result.push({
      link: $(value).src,
      title: $(value).find('.title').text()
    })
  })
  fs.writeFile('./videos.json', JSON.stringify(result), (err) => {
    console.log(err)
  })
  console.log(result)
  return data
}

