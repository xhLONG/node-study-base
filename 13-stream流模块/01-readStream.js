const fs = require('fs')

// 流
// 将一个大文件拆分成小模块进行读取，避免一次性读取整个模块，占用过多内存
const rs = fs.createReadStream('./videos.json', 'utf-8')

rs.on('data', (chunk) => {
  console.log('chunk-', chunk)
})

rs.on('end', () => {
  console.log('end')
})

rs.on('err', (err) => {
  console.log(err)
})