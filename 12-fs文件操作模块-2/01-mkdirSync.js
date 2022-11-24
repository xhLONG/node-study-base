const fs = require('fs')


console.log(1)
// 异步创建文件夹
fs.mkdir('./avator3', (err) => {
  console.log(err)
  console.log(5)
})
console.log(2)
// 同步操作创建文件夹，会阻塞后面代码
fs.mkdirSync('./avator4')
console.log(4)