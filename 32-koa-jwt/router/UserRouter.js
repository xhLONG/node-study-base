const Router = require('koa-router')
const JWT = require('../util/JWT')
const router = new Router()

router.post('/login', (ctx, next) => {
  const params = ctx.request.body
  console.log('/user/login>>>post params>>>>', params)
  if (params.username === 'xhlong') {
    // 生成加密token，并在响应头中返回给客户端
    const token = JWT.generate({
      username: params.username
    }, '10s')
    ctx.set('Authorization', token)
    ctx.body = { "code": 200 }
  } else {
    ctx.body = { "code": 401 }
  }
})
.get('/login', (ctx, next) => {
  console.log('/user/login>>>get params>>>>', ctx.query)
  ctx.body = {"ok": 0}
})

router.post('/', (ctx, next) => {
  ctx.body = '["aaa"]'
})
.del('/:id', (ctx, next) => {
  ctx.body = "{ok: 1}"
})
.post('/:id', (ctx, next) => {
  ctx.body = "{ok: 1}"
})
.get('/', (ctx, next) => {
  ctx.body = "['aaa', 'bbb', 'ccc']"
})

module.exports = router