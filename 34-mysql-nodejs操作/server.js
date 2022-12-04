const express = require('express')
const mysql = require('mysql2')

const app = express()

app.get('/students', async (req, res, next) => {
  const poolPromise = mysql.createPool(getDbConfig()).promise()
  try {
    const students = await poolPromise.query('SELECT * FROM students')
    res.send({ok: 1, data: students[0]})
  } catch (err) {
    console.log(err)
    res.send({ok: 0})
  }
})

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