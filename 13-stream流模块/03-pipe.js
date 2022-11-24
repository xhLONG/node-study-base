const fs = require('fs')

// 利用流 复制文件
const rs = fs.createReadStream('./videos.json', 'utf-8')
const ws = fs.createWriteStream('./pkg/videos2.json', 'utf-8')
rs.pipe(ws)