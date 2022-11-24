function render(res, data, type = 'application/json;charset=utf-8') {
  res.writeHead(200, { 'Content-Type': `${type}`})
  res.write(data)
  res.end()
}

const apiRoute = {
  '/api/user': (res) => {
    render(res, JSON.stringify({name: 'lily', id: 0}))
  }
}

module.exports = apiRoute