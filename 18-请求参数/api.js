function render(res, data, type = 'application/json;charset=utf-8') {
  res.writeHead(200, { 'Content-Type': `${type}`})
  res.write(data)
  res.end()
}

const apiRoute = {
  '/api/user': (req, res) => {
    render(res, JSON.stringify({name: 'lily', id: 0}))
  },
  // 获取get请求的参数
  '/api/login': (req, res) => {
    const url = new URL(req.url, 'http://127.0.0.1')
    const username = url.searchParams.get('username')
    const password = url.searchParams.get('password')
    if (username == 'root' && password == 'admin') {
      render(res, JSON.stringify({ok: 1}))
    } else {
      render(res, JSON.stringify({ok: 0}))
    }
  },
  // 获取post请求的参数
  '/api/loginpost': (req, res) => {
    let post = ''
    req.on('data', (chunk) => {
      post += chunk
    })
    req.on('end', () => {
      post = JSON.parse(post)
      if (post.username == 'root' && post.password == 'admin') {
        render(res, JSON.stringify({ok: 1}))
      } else {
        render(res, JSON.stringify({ok: 0}))
      }
    })
  },
}

module.exports = apiRoute