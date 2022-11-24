const fs = require('fs')

// 删除文件夹
fs.rmdir('./avator', (err) => {
  console.log(err)
})