const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

router.post('/list', (ctx, next) => {
  ctx.body = '["aaa"]'
})
.del('/list/:id', (ctx, next) => {
  ctx.body = "{ok: 1}"
})
.post('/list/:id', (ctx, next) => {
  ctx.body = "{ok: 1}"
})
.get('/list', (ctx, next) => {
  ctx.body = "['aaa', 'bbb', 'ccc']"
})

app.use(router.routes())
app.use(router.allowedMethods())  // 当使用get请求获取post请求的内容时，就会返回405状态码，当前请求方法不存在
app.listen(3000, () => {
  console.log('server start')
})