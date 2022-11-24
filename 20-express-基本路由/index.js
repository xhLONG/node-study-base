const express = require('express')

const app = new express()

app.get('/', (req, res) => {
  res.send({
    ok: 1
  })
})

app.get('/home', (req, res) => {
  res.write('home')
  res.end()
})

// : 可匹配任意参数
app.get('/detail/:id', (req, res) => {
  res.write('detail')
  res.end()
})

// ？ 匹配0个或1个
app.get('/ab?c', (req, res) => {
  res.write('ab?c')
  res.end()
})

// + 匹配1个或多个个
app.get('/aab+c', (req, res) => {
  res.write('aab+c')
  res.end()
})

// * 匹配任意个任意字符
app.get('/cc*lily', (req, res) => {
  res.write('cc*lily')
  res.end()
})

// 正则匹配
app.get(/^\/cars$/, (req, res) => {
  res.send('/^\/cars$/')
})
app.get(/^\/cars\/*/, (req, res) => {
  res.write('/^\/cars\/*/')
  res.end()
})

app.get('/user', [checkToken], (req, res) => {
  res.send('user')
})

app.listen(3000, () => {
  console.log('server start')
})


function checkToken(req, res, next) {
  let isValid = Math.random() > 0.5
  if (isValid) {
    next()
  } else {
    res.send('error')
  }
}