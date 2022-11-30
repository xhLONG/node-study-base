const Router = require('koa-router')
const router = new Router()

router.post('/', (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = `{"ok": 1}`
})
.del('/:id', (ctx, next) => {
  ctx.body = `{"ok": 1}`
})
.post('/:id', (ctx, next) => {
  ctx.body = `{"ok": 1}`
})
  .get('/', (ctx, next) => {
  console.log(ctx.query, ctx.querystring)
  ctx.body = `{"ok": 1}`
})

module.exports = router