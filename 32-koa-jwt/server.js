const Koa = require('koa')
const static = require('koa-static')
const KoaBodyParser = require('koa-bodyparser')
const KoaViews = require('koa-views')
const session = require('koa-session-minimal')
const path = require('path')
const indexRouter = require('./router/index')
const JWT = require('./util/JWT')

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
  const token = ctx.headers['authorization']?.split(' ')[1]
  if (token) {
    const payload = JWT.verify(token)
    if (payload) {
      // 验证成功 放行
      const newToken = JWT.generate(payload.data, '20s')
      ctx.set('Authorization', newToken)
      await next()
    } else {
      ctx.status = 401
      ctx.body = {errCode: -1, errMsg: '登录过期'}
    }
  } else {
    // 这里设置的有点不合理，请求头不带Authorization的就放行了，本意是想放行页面路由，但是其他接口万一不带上请求头Authorization岂不是也放行了
    await next()
  }
})

app.use(indexRouter.routes())
app.use(indexRouter.allowedMethods())  // 当使用get请求获取post请求的内容时，就会返回405状态码，当前请求方法不存在

app.listen(3000, () => {
  console.log('server start')
})


// token 校验用户登录
// 用户登录成功 =》 服务器设置token并返回 =》 客户端接受到token，并保存到本地缓存 =》 客户端每次发送请求都从本地缓存中读取token，并添加token到请求头上 =》服务端校验客户端传来的token是否有效 =》校验成功，重新生成token返回给客户端
