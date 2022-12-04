const poolPromise = require('../model/poolPromise')

const StudentService = {
  addStudent: (name, score, class_id) => {
    return poolPromise.query(`INSERT INTO students (name, score, class_id) VALUES ('${name}', ${score}, ${class_id})`)
  },
  getStudent: (name, score, class_id) => {
    return poolPromise.query(`SELECT * FROM students`)
  }
}

module.exports = StudentService



// series 层获取数据