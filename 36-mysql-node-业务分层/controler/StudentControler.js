const StudentService = require('../service/StudentService')

const StudentControler = {
  addStudent: async (ctx, next) => {
    const { name, score, class_id } = ctx.request.body
    try {
      await StudentService.addStudent(name, score, class_id)
      ctx.body = {ok: 1}
    } catch (err) {
      console.log(err)
      ctx.body = {ok: 0}
    }
  },
  delStudent: async (ctx, next) => {
    ctx.body = {ok: 0}
  },
  putStudent: async (ctx, next) => {
    ctx.body = {ok: 0}
  },
  getStudent: async (ctx, next) => {
    try {
      const students = await StudentService.getStudent()
      ctx.body = {ok: 1, data: students[0]}
    } catch (err) {
      console.log(err)
      ctx.body = {ok: 0}
    }
  }
}

module.exports = StudentControler


// controler 业务逻辑层 只处理业务相关的操作，处理接口请求，返回数据，具体的获取数据到service层处理