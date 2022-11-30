const Koa = require('koa')
const indexRouter = require('./router/index')

const app = new Koa()

// 应用级中间件
app.use(indexRouter.routes())
app.use(indexRouter.allowedMethods())  // 当使用get请求获取post请求的内容时，就会返回405状态码，当前请求方法不存在

app.listen(3000, () => {
  console.log('server start')
})