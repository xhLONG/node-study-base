const express = require('express')

const app = express()

app.use(async(req, res, next) => {
  if(req.url === '/favicon.ico') return
  console.log(111);
  await next()
  console.log(444);
  res.send('hello world')
})

app.use(async(req, res, next) => {
  console.log(222);
  await delay(1000);
  console.log(333);
})

app.listen(3000, () => {
  console.log('server start')
})

function delay(time) {
  return new Promise((resolve, reject) => setTimeout(resolve, time))
}


// express 是流水线型的中间件，在处理完一个中间件任务后就应该将执行权转交给下一个中间件。
// 在上面的例子，我们觉得理想的输出是：111 222 333 444，但是实际的输出是：111 222 444 333。说明express并不会等待
// 中间件中异步任务完成后再将执行权移交回来，而是流水式的往下走。