/**
 * @description works router
 * @author 双越
 */

const router = require('koa-router')()
// 中间件
const loginCheck = require('../middlewares/loginCheck')
const { worksIdsSchema } = require('../validator/works')
const genValidator = require('../middlewares/genValidator')
// controller
const {
    getWorksList,
    forceOffline,
    undoForceOffline,
    getCount,
    getMonthlyCount,
} = require('../controller/works')

// 路由前缀
router.prefix('/api/works')

// 获取作品列表
router.get('/', loginCheck, async ctx => {
    const { keyword = '', pageIndex, pageSize } = ctx.query
    const res = await getWorksList(decodeURIComponent(keyword), { pageIndex, pageSize })
    ctx.body = res
})

// 强制下线
router.post('/forceOffline', loginCheck, genValidator(worksIdsSchema), async ctx => {
    const { ids } = ctx.request.body
    const res = await forceOffline(ids, true)
    ctx.body = res
})

// 恢复强制下线
router.post('/undoForceOffline', loginCheck, genValidator(worksIdsSchema), async ctx => {
    const { ids } = ctx.request.body
    const res = await undoForceOffline(ids, true)
    ctx.body = res
})

// 获取发布和创建的 count
router.get('/getCount', loginCheck, async ctx => {
    const res = await getCount()
    ctx.body = res
})

// 按月，获取创建和发布的数量
router.get('/getMonthlyCount', loginCheck, async ctx => {
    const res = await getMonthlyCount()
    ctx.body = res
})

module.exports = router
