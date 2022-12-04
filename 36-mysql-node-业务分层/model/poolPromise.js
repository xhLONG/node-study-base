const mysql = require('mysql2')
const dbConfig = require('../config/dbConfig')

const poolPromise = mysql.createPool(dbConfig).promise()

module.exports = poolPromise