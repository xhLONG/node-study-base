const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx, next) => {
  await ctx.render('upload')  // 自动读取 view/upload.ejs文件
})

module.exports = router