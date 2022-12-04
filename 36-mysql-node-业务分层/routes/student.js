const Router = require('koa-router')
const router = new Router()
const StudentControler = require('../controler/StudentControler')

router.post('/', StudentControler.addStudent)
.del('/:id', StudentControler.delStudent)
.put('/:id', StudentControler.putStudent)
.get('/', StudentControler.getStudent)

module.exports = router