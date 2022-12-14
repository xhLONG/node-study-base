const Koa = require('koa')
const static = require('koa-static')
const KoaBodyParser = require('koa-bodyparser')
const KoaViews = require('koa-views')
const session = require('koa-session-minimal')
const path = require('path')
const indexRouter = require('./router/index')

const app = new Koa()

// 应用级中间件
app.use(KoaBodyParser())  // 解析post请求过来的参数
app.use(static(path.join(__dirname, 'public')))

// 配模版引擎
app.use(KoaViews(path.join(__dirname, 'view'), { extension: 'ejs' }))

// 配备session
app.use(session({
  key: 'session_id',
  cookie: {
    maxAge: 1000 * 60 * 10  // 有效时长
  }
}))
// session 拦截判断
app.use(async (ctx, next) => {
  if (ctx.url.includes('login')) {
    // 请求路径中包含login 放行
    await next()
    return
  }
  if (ctx.session.user) {
    // 已登录用户 放行
    ctx.session.date = Date.now() // 每次访问接口都刷新cookie的时间
    await next()
  } else {
    // 未登录用户 重定向到login
    ctx.redirect('/login')
  }
})

app.use(indexRouter.routes())
app.use(indexRouter.allowedMethods())  // 当使用get请求获取post请求的内容时，就会返回405状态码，当前请求方法不存在

app.listen(1122, () => {
  console.log('server start')
})


// cookie 校验用户登录
// 用户登录成功 =》 服务器设置cookie并返回 =》 客户端每次发送同源请求都会自动携带上cookie =》 服务端通过cookie判断用户是否已经登录，已登录用户则更新cookie时间并放行，未登录用户则重定向到登录页

// 缺点：单一cookie验证，容易被利用cookie冒充用户