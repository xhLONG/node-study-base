const fs = require('fs')

// 新增文件or覆盖文件内容
fs.writeFile('./avator2/user.txt', 'hello world', (err) => {
  console.log(err)
})