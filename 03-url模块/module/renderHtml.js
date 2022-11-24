function renderHtml(url) {
  switch (url) {
    case '/':
      return `
        <html>
          <div>home</div>
        </html>
      `
    case '/home':
      return `
        <html>
          <div>home</div>
        </html>
      `
    case '/user':
      return `
        <html>
          <div>user</div>
        </html>
      `
    case '/api/list':
      return `
        ['lily', 'jack', 'cicy']
      `
    default:
      return `
        <html>
          <div>404</div>
        </html>
      `
  }
}

module.exports = {
  renderHtml
}