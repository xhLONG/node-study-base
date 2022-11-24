const fs = require('fs')

// 创建文件夹
fs.mkdir('./avator', (err) => {
  if(!err) return
  if (err.code === 'EEXIST') {
    console.log('err: 文件夹已存在')
  }
})