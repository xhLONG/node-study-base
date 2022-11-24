const fs = require('fs')

// 读取文件夹
fs.readdir('./avator2', (err, files) => {
  console.log(files)
})