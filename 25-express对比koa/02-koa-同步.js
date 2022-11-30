const Koa = require('koa')

const app = new Koa()

app.use((ctx, next) => {
  if(ctx.url === '/favicon.ico') return
  console.log(111);
  next()
  console.log(333);
  ctx.body = 'hello world'
})

app.use((ctx, next) => {
  console.log(222);
})

app.listen(3000, () => {
  console.log('server start')
})