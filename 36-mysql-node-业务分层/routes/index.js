const Router = require('koa-router')
const studentRoute = require('./student')

const router = new Router()
router.use('/student', studentRoute.routes(), studentRoute.allowedMethods())


router.get('/student-manage', async (ctx, next) => {
  await ctx.render('studentmanage')
})

module.exports = router
