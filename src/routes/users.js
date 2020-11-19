/**
 * @description users router
 * @author 双越
 */

const router = require('koa-router')()
// 中间件
const loginCheck = require('../middlewares/loginCheck')
const { userIdsSchema } = require('../validator/users')
const genValidator = require('../middlewares/genValidator')
// controller
const {
    getUserList,
    updateIsFrozen,
    getCount,
    getCreatedCountMonthly,
} = require('../controller/users')

// 路由前缀
router.prefix('/api/users')

// 获取用户列表
router.get('/', loginCheck, async ctx => {
    const { keyword = '', pageIndex, pageSize } = ctx.query
    const res = await getUserList(decodeURIComponent(keyword), { pageIndex, pageSize })
    ctx.body = res
})

// 冻结用户
router.post('/froze', loginCheck, genValidator(userIdsSchema), async ctx => {
    const { ids } = ctx.request.body
    const res = await updateIsFrozen(ids, true)
    ctx.body = res
})

// 解除冻结
router.post('/unFroze', loginCheck, genValidator(userIdsSchema), async ctx => {
    const { ids } = ctx.request.body
    const res = await updateIsFrozen(ids, false)
    ctx.body = res
})

// 获取总数
router.get('/getCount', loginCheck, async ctx => {
    const res = await getCount()
    ctx.body = res
})

// 按月统计
router.get('/getCreatedCountMonthly', loginCheck, async ctx => {
    const res = await getCreatedCountMonthly()
    ctx.body = res
})

module.exports = router
