const Koa = require('koa')
const Router = require('koa-router')
const mysql = require('mysql2')

const app = new Koa()
const router = new Router()

router.get('/students/update', async (ctx, next) => {
  const poolPromise = mysql.createPool(getDbConfig()).promise()
  try {
    const students = await poolPromise.query(`UPDATE students SET name = 'chenpi' WHERE (id = 9)`)
    ctx.body = {ok: 1, data: students[0]}
  } catch (err) {
    console.log(err)
    ctx.body = {ok: 0}
  }
})

app.use(router.routes())

app.listen(3000, () => {
  console.log('server start')
})


function getDbConfig() {
  return {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'node-mysql-test',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
}