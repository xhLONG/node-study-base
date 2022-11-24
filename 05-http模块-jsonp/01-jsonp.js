const http = require('http')
const url = require('url')
const server = http.createServer((req, res) => {
  const urlObj = url.parse(req.url, true)
  switch (urlObj.pathname) {
    case '/api/user':
      res.end(`${urlObj.query.callback} (
        ${JSON.stringify({
          name: 'lily',
          age: 18
        })}
      )`)
    default:
      res.end('404')
  }
})
server.listen(3000, () => {
  console.log('server start')
})