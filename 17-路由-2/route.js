const fs = require('fs')

function render(res, path, type = 'text/html;charset=utf8') {
  res.writeHead(200, { 'Content-Type': `${type}`})
  res.write(fs.readFileSync(path, 'utf-8'))
  res.end()
}
const route = {
  '/home': (res) => {
    render(res, './static/home.html')
  },
  '/login': (res) => {
    render(res, './static/login.html')
  },
  '/favicon.ico': (res) => {
    render(res, './static/favicon.ico', 'image/vnd.microsoft.icon')
  },
  '/404': (res) => {
    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf8'})
    res.write(fs.readFileSync('./static/404.html', 'utf-8'))
  }
}

module.exports = route