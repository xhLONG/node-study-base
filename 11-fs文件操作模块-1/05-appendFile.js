const fs = require('fs')

// 给文件追加内容
fs.appendFile('./avator2/user.txt', '\n你好', (err) => {
  console.log(err)
})