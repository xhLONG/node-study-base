const Router = require('koa-router')
const router = new Router()

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