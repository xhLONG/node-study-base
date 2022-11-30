const express = require('express')

const app = express()

app.use((req, res, next) => {
  if(req.url === '/favicon.ico') return
  console.log(111);
  next()
  console.log(333);
  res.send('hello world')
})

app.use((req, res, next) => {
  console.log(222);
})

app.listen(3000, () => {
  console.log('server start')
})