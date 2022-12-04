const Koa = require('koa')
const static = require('koa-static')
const KoaBodyParser = require('koa-bodyparser')
const path = require('path')
const KoaViews = require('koa-views')
const indexRouter = require('./routes/index')

const app = new Koa()

// 配模版引擎
app.use(KoaViews(path.join(__dirname, 'view'), {extension: 'ejs'}))

app.use(KoaBodyParser())
app.use(static(path.join(__dirname, 'public')))
app.use(indexRouter.routes(), indexRouter.allowedMethods())

app.listen(3000, () => {
  console.log('srever start: http://localhost:3000')
})