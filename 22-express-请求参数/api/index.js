const express = require('express')

const router = express.Router()

router.get('/login_get', (req, res) => {
  console.log(req.query)
  res.send({ok: 1})
})

router.post('/login_post', (req, res) => {
  console.log(req.body)
  res.send({ok: 1})
})


module.exports = router