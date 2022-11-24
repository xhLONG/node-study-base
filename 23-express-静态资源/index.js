const express = require('express')
const homeRouter = require('./routes/homeRouter')
const userRouter = require('./routes/userRouter')
const api = require('./api/index')

const app = new express()

// 使用中间件处理参数
app.use(express.urlencoded({extended: false}))  // 处理post参数 - username=lily&password=123456
app.use(express.json())  // 处理post参数 - {username: lily, password: 123456}

// 使用中间件处理静态资源
app.use(express.static('public'))

// 应用级中间件
app.use((req, res, next) => {
  console.log('check token')
  const isValid = true
  if (isValid) {
    next()
  } else {
    res.send('error')
  }
})

// 应用级中间件
app.use('/home', homeRouter)
app.use('/user', userRouter)
app.use('/api', api)

// 拦截404
app.use((req, res, next) => {
  res.status(404).send('404 not found')
})


app.listen(3000, () => {
  console.log('server start')
})