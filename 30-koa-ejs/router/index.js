const Router = require('koa-router')
const ListRouter = require('./ListRouter.js')
const UserRouter = require('./UserRouter.js')
const LoginRouter = require('./LoginRouter.js')
const HomeRouter = require('./HomeRouter.js')

const router = new Router()

// 路由级中间件

// 设置路由前缀
// router.prefix('/api')

/* api路由 start */
router.use('/list', ListRouter.routes(), ListRouter.allowedMethods())
router.use('/user', UserRouter.routes(), UserRouter.allowedMethods())
router.use('/api/login', LoginRouter.routes(), LoginRouter.allowedMethods())
/* api路由 end */

/* 页面路由 start */
router.use('/home', HomeRouter.routes(), HomeRouter.allowedMethods())
router.redirect('/', '/home')
/* 页面路由 end */

module.exports = router