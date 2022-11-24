const { EventEmitter } = require('events')

// 发布订阅模式
const event = new EventEmitter()
event.on('play', (data) => {
  console.log('play', data)
})
event.emit('play', 'ball')