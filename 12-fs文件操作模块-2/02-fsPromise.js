const fs = require('fs').promises

// fs模块结合promise来使用
fs.readdir('../12-fs模块-2').then(async res => {
  console.log(res)
  await Promise.all(res.filter(item => {
    if (item.includes('avator')) {
      return fs.rmdir(`./${item}`)
    }
  }))
  console.log('delete success')
})