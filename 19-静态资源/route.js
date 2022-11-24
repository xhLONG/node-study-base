const fs = require('fs')
const path = require('path')
const mime = require('mime')

function render(res, path, type = 'text/html;charset=utf8') {
  res.writeHead(200, { 'Content-Type': `${type};charset=utf8`})
  res.write(fs.readFileSync(path, 'utf-8'))
  res.end()
}
const route = {
  '/home': (req, res) => {
    render(res, './static/home.html')
  },
  '/login': (req, res) => {
    render(res, './static/login.html')
  },
  '/404': (req, res) => {
    if (readStaticFile(req, res)) {
      return true
    }
    res.writeHead(404, { 'Content-Type': 'text/html;charset=utf8'})
    res.write(fs.readFileSync('./static/404.html', 'utf-8'))
  }
}

// 访问静态资源
function readStaticFile(req, res) {
  const url = new URL(req.url, 'http://127.0.0.1')
  if(url.pathname == '/') return false
  const pathname = path.join(__dirname, '/static', url.pathname)
  if (fs.existsSync(pathname)) {
    // mime自动获取不同文件类型的content-type
    const fileType = url.pathname.split('.').pop()
    render(res, pathname, mime.getType(fileType))
    return true
  }
  return false
}

module.exports = route