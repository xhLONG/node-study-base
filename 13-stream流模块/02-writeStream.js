const fs = require('fs')

const ws = fs.createWriteStream('./user.txt', 'utf-8')
ws.write('31fs32')
ws.write('wfsgsd')
ws.write('484092')
ws.end()