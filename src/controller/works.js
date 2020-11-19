/**
 * @description works controller
 * @author 双越
 */

const { Op } = require('sequelize')
const {
    findWorksService,
    updateWorksService,
    getWorksCountService,
    getCreatedCountMonthlyService,
    getPublishedCountMonthlyService,
} = require('../service/works')
const { SuccessRes, ErrorRes } = require('../res-model/index')
const { DEFAULT_PAGE_SIZE } = require('../config/constant')
const { updateFailInfo } = require('../res-model/failInfo')
const { publishWorkClearCache } = require('../cache/works/publish')
const { parseNumberArr } = require('../utils/util')

/**
 * 查询作品列表
 * @param {string} keyword 搜索关键字
 * @param {object} pageOpt 分页
 */
async function getWorksList(keyword = '', pageOpt = {}) {
    // 查询条件
    let whereOpt = {}
    if (keyword) {
        const keywordOpt = { [Op.like]: `%${keyword}%` }
        whereOpt = {
            [Op.or]: [
                // 所有查询条件， or 拼接
                { id: keywordOpt },
                { title: keywordOpt },
                { author: keywordOpt },
            ],
        }
    }

    // 分页
    let { pageIndex, pageSize } = pageOpt
    pageIndex = parseInt(pageIndex, 10) || 0
    pageSize = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE

    // 执行查询
    const { list, count } = await findWorksService(whereOpt, { pageIndex, pageSize })

    return new SuccessRes({ list, count })
}

/**
 * 强制下线
 * @param {string}} ids 如 '1' '1,2,3'
 */
async function forceOffline(ids = '') {
    // 将 ids 字符串变为数组
    const idsArr = parseNumberArr(ids)
    if (idsArr.length === 0) return new ErrorRes(updateFailInfo)

    // 更新
    const result = await updateWorksService(
        {
            status: 3, // 3 即为强制下线
        },
        {
            id: {
                [Op.in]: idsArr,
            },
            status: 2, // 只有发布状态，才能强制下线
        }
    )

    if (!result) return new ErrorRes(updateFailInfo)

    // 清空 h5 的缓存
    idsArr.forEach(id => publishWorkClearCache(id))

    return new SuccessRes()
}

/**
 * 恢复
 * @param {string}} ids 如 '1' '1,2,3'
 */
async function undoForceOffline(ids = '') {
    // 将 ids 字符串变为数组
    const idsArr = parseNumberArr(ids)
    if (idsArr.length === 0) return new ErrorRes(updateFailInfo)

    // 更新
    const result = await updateWorksService(
        {
            status: 2, // 2 即正常上线
        },
        {
            id: {
                [Op.in]: idsArr,
            },
            status: 3, // 只有强制下线状态，才能恢复为上线
        }
    )

    if (result) return new SuccessRes()
    return new ErrorRes(updateFailInfo)
}

/**
 * 获取创建和发布的总数
 */
async function getCount() {
    const created = await getWorksCountService()
    const published = await getWorksCountService({ status: 2 })
    return new SuccessRes({
        created,
        published,
    })
}

/**
 * 获取每月创建和发布的总数
 */
async function getMonthlyCount() {
    // 一年的时间范围
    const d = new Date()
    const startTime = new Date(d.getTime() - 365 * 24 * 60 * 60 * 1000) // 一年之前
    const endTime = d

    // 获取每月创建的数量
    const createdResult = await getCreatedCountMonthlyService(startTime, endTime)

    // 获取每月发布的数量
    const publishedResult = await getPublishedCountMonthlyService(startTime, endTime)

    // 格式化数据
    const resDataObj = {}
    createdResult.forEach(item => {
        const { month, count = 0 } = item || {}
        if (!month) return
        if (resDataObj[month] == null) resDataObj[month] = {}

        const data = resDataObj[month]
        data.created = count
        if (data.published == null) data.published = 0
    })
    publishedResult.forEach(item => {
        const { month, count = 0 } = item || {}
        if (!month) return
        if (resDataObj[month] == null) resDataObj[month] = {}

        const data = resDataObj[month]
        data.published = count
        if (data.created == null) data.created = 0
    })
    const monthKeys = Object.keys(resDataObj)
    const resData = monthKeys.map(month => {
        return {
            month,
            data: resDataObj[month],
        }
    })

    return new SuccessRes(resData)
}

module.exports = {
    getWorksList,
    forceOffline,
    undoForceOffline,
    getCount,
    getMonthlyCount,
}
