function renderStatus(url) {
  const urls = ['/', '/home', '/user', '/api/list']
  return urls.includes(url) ? 200 : 404
}

module.exports = {
  renderStatus
}