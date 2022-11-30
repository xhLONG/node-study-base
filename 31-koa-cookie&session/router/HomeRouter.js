const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx, next) => {
  await ctx.render('home', {username: 'lily'})  // 自动读取 view/home.ejs文件
})

module.exports = router