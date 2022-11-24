const fs = require('fs')

fs.readFile('./avator2/user.txt', 'utf-8', (err, data) => {
  console.log(data)
})