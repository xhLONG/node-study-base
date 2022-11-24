const fs = require('fs')

// 修改文件夹
fs.rename('./avator', './avator2', (err) => {
  console.log(err)
})