const fs = require('fs')

// 删除文件
fs.unlink('./avator2/user.txt', (err) => {
  console.log(err)
})