const server = require('./server.js')
const route = require('./route.js')
const api = require('./api.js')

server.use(route)
server.use(api)
server.start()