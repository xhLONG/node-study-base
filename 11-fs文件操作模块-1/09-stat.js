const fs = require('fs')

// 获取文件信息
fs.stat('./avator2/user.txt', (err, stats) => {
  console.log(stats)
})