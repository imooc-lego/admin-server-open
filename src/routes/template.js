/**
 * @description template router
 * @author 双越
 */

const router = require('koa-router')()
// 中间件
const loginCheck = require('../middlewares/loginCheck')
const { templateDataSchema } = require('../validator/template')
const genValidator = require('../middlewares/genValidator')
// controller
const {
    getTemplateList,
    updateIsPublic,
    updateIsHot,
    updateIsNew,
    updateOrderIndex,
    getCount,
    getMonthlyCount,
} = require('../controller/template')

// 路由前缀
router.prefix('/api/template')

// 获取模板列表
router.get('/', loginCheck, async ctx => {
    const { keyword = '', pageIndex, pageSize } = ctx.query
    const res = await getTemplateList(decodeURIComponent(keyword), { pageIndex, pageSize })
    ctx.body = res
})

// 设置 isPublic
router.patch('/isPublic', loginCheck, genValidator(templateDataSchema), async ctx => {
    const { ids, isPublic } = ctx.request.body
    const res = await updateIsPublic(ids, isPublic)
    ctx.body = res
})

// 设置 isHot
router.patch('/isHot', loginCheck, genValidator(templateDataSchema), async ctx => {
    const { ids, isHot } = ctx.request.body
    const res = await updateIsHot(ids, isHot)
    ctx.body = res
})

// 设置 isNew
router.patch('/isNew', loginCheck, genValidator(templateDataSchema), async ctx => {
    const { ids, isNew } = ctx.request.body
    const res = await updateIsNew(ids, isNew)
    ctx.body = res
})

// 设置 orderIndex
router.patch('/orderIndex', loginCheck, genValidator(templateDataSchema), async ctx => {
    const { ids, orderIndex } = ctx.request.body
    const res = await updateOrderIndex(ids, orderIndex)
    ctx.body = res
})

// 获取总数
router.get('/getCount', loginCheck, async ctx => {
    const res = await getCount()
    ctx.body = res
})

// 按月统计
router.get('/getMonthlyCount', loginCheck, async ctx => {
    const res = await getMonthlyCount()
    ctx.body = res
})

module.exports = router
