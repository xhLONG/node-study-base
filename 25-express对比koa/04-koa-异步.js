const Koa = require('koa')

const app = new Koa()

app.use(async(ctx, next) => {
  if(ctx.url === '/favicon.ico') return
  console.log(111);
  await next()
  console.log(444);
  ctx.body = 'hello world'
})

app.use(async(ctx, next) => {
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


// koa 洋葱模型 在执行中间件的过程中可以将执行权转移出去，等待外面任务结束再将执行权转移回来。
// 所以在上面例子的实际的输出是：111 222 444 333。