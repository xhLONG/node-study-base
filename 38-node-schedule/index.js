const schedule = require('node-schedule');

let count = 1
const job = schedule.scheduleJob('30 * * * * *', function(){
  console.log(count++, 'The answer to life, the universe, and everything!');
});