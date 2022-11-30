const Koa = require('koa')
const static = require('koa-static')
const KoaBodyParser = require('koa-bodyparser')
const path = require('path')
const indexRouter = require('./router/index')

const app = new Koa()

// 应用级中间件
app.use(KoaBodyParser())  // 解析post请求过来的参数
app.use(static(path.join(__dirname, 'public')))
app.use(indexRouter.routes())
app.use(indexRouter.allowedMethods())  // 当使用get请求获取post请求的内容时，就会返回405状态码，当前请求方法不存在

app.listen(3000, () => {
  console.log('server start')
})