const express = require('express')
const homeRouter = require('./routes/homeRouter')
const userRouter = require('./routes/userRouter')

const app = new express()

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

// 拦截404
app.use((req, res, next) => {
  res.status(404).send('404 not found')
})


app.listen(3000, () => {
  console.log('server start')
})