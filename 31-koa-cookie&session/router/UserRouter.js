const Router = require('koa-router')
const router = new Router()

router.post('/login', (ctx, next) => {
  const params = ctx.request.body
  console.log('/user/login>>>post params>>>>', params)
  if (params.username === 'xhlong') {
    // 设置sessionid
    ctx.session.user = {
      username: params.username
    }
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