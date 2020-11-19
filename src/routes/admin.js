/**
 * @description admin router
 * @author 双越
 */

const router = require('koa-router')()
const { SuccessRes } = require('../res-model/index')
const { isPrd } = require('../utils/env')

// 中间件
const loginCheck = require('../middlewares/loginCheck')
const genValidator = require('../middlewares/genValidator')
const { adminInfoSchema } = require('../validator/admin')

// controller
const { login, register } = require('../controller/admin')

// 路由前缀
router.prefix('/api/admin')

// 获取用户信息
router.get('/getUserInfo', loginCheck, async ctx => {
    // 经过了 loginCheck ，用户信息在 ctx.userInfo 中
    ctx.body = new SuccessRes(ctx.userInfo)
})

// 登录
router.post('/login', genValidator(adminInfoSchema), async ctx => {
    const { username, password } = ctx.request.body
    const res = await login(username, password)
    ctx.body = res
})

// 初始化几个管理员账号
;(async function createTestAdminForDev() {
    if (isPrd) {
        // 生产环境下
    } else {
        // 非生产环境
        const username = 'hello'
        const password = '你猜？'
        await register(username, password)
        console.log(
            `================== 管理员账户：用户名 ${username} 密码 ${password} ==================`
        )
    }
})()

module.exports = router
