const fs = require('fs')

function route(res, pathname) {
  switch (pathname) {
    case '/home':
      res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8'})
      res.write(fs.readFileSync('./static/home.html', 'utf-8'))
      break
    case '/login':
      res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8'})
      res.write(fs.readFileSync('./static/login.html', 'utf-8'))
      break
    default:
      res.writeHead(200, { 'Content-Type': 'text/html;charset=utf8'})
      res.write(fs.readFileSync('./static/404.html', 'utf-8'))
  }
}

module.exports = route