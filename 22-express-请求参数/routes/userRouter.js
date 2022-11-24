const express = require('express')

const router = express.Router()

// 路由级中间件
router.get('/a', (req, res) => {
  res.send('aaaa')
})
router.get('/b', (req, res) => {
  res.send('bbbb')
})


module.exports = router