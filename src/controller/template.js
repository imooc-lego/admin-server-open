/**
 * @description template controller
 * @author 双越
 */

const { Op } = require('sequelize')
const {
    findTemplateService,
    updateTemplateService,
    getTemplateCountService,
    getCopiedCountService,
    getCreatedCountMonthlyService,
    getCopiedCountMonthlyService,
} = require('../service/template')
const { SuccessRes, ErrorRes } = require('../res-model/index')
const { DEFAULT_PAGE_SIZE } = require('../config/constant')
const { updateFailInfo } = require('../res-model/failInfo')
const { parseNumberArr } = require('../utils/util')

/**
 * 更新模板
 * @param {object} data 要更新的数据
 * @param {Array} idArr id 数组
 */
async function updateTemplate(data = {}, idsArr = []) {
    const result = await updateTemplateService(data, {
        id: {
            [Op.in]: idsArr,
        },
    })

    if (result) return new SuccessRes()
    return new ErrorRes(updateFailInfo)
}

/**
 * 查询模板列表
 * @param {string} keyword 搜索关键字
 * @param {object} pageOpt 分页
 */
async function getTemplateList(keyword = '', pageOpt = {}) {
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
    const { list, count } = await findTemplateService(whereOpt, { pageIndex, pageSize })

    return new SuccessRes({ list, count })
}

/**
 * 设置 isPublic
 * @param {string} ids 如 '1' '1,2,3'
 * @param {boolean} isPublic isPublic
 */
async function updateIsPublic(ids = '', isPublic = false) {
    // 将 ids 字符串变为数组
    const idsArr = parseNumberArr(ids)
    if (idsArr.length === 0) return new ErrorRes(updateFailInfo)

    // 更新
    const res = await updateTemplate({ isPublic }, idsArr)
    return res
}

/**
 * 设置 isHot
 * @param {string} ids 如 '1' '1,2,3'
 * @param {boolean} isHot isHot
 */
async function updateIsHot(ids = '', isHot = false) {
    // 将 ids 字符串变为数组
    const idsArr = parseNumberArr(ids)
    if (idsArr.length === 0) return new ErrorRes(updateFailInfo)

    // 更新
    const res = await updateTemplate({ isHot }, idsArr)
    return res
}

/**
 * 设置 isNew
 * @param {string} ids 如 '1' '1,2,3'
 * @param {boolean} isNew isNew
 */
async function updateIsNew(ids = '', isNew = false) {
    // 将 ids 字符串变为数组
    const idsArr = parseNumberArr(ids)
    if (idsArr.length === 0) return new ErrorRes(updateFailInfo)

    // 更新
    const res = await updateTemplate({ isNew }, idsArr)
    return res
}

/**
 * 设置 orderIndex
 * @param {string} ids 如 '1' '1,2,3'
 * @param {number} orderIndex orderIndex
 */
async function updateOrderIndex(ids = '', orderIndex = 0) {
    // 将 ids 字符串变为数组
    const idsArr = parseNumberArr(ids)
    if (idsArr.length === 0) return new ErrorRes(updateFailInfo)

    // 更新
    const res = await updateTemplate({ orderIndex }, idsArr)
    return res
}

/**
 * 获取总数
 */
async function getCount() {
    const count = await getTemplateCountService()
    const copiedResult = await getCopiedCountService()
    const obj = copiedResult[0] || {}

    return new SuccessRes({
        count,
        use: parseInt(obj.copiedCount, 10) || 0,
    })
}

/**
 * 按月统计创建和使用量
 */
async function getMonthlyCount() {
    // 一年的时间范围
    const d = new Date()
    const startTime = new Date(d.getTime() - 365 * 24 * 60 * 60 * 1000) // 一年之前
    const endTime = d

    // 获取每月创建的数量
    const createdResult = await getCreatedCountMonthlyService(startTime, endTime)

    // 获取使用的数量
    const copiedCountResult = await getCopiedCountMonthlyService(startTime, endTime)

    // 格式化数据
    const resDataObj = {}
    createdResult.forEach(item => {
        const { month, count = 0 } = item || {}
        if (!month) return
        if (resDataObj[month] == null) resDataObj[month] = {}

        const data = resDataObj[month]
        data.count = count
        if (data.use == null) data.use = 0
    })
    copiedCountResult.forEach(item => {
        const { month, copiedCount = 0 } = item || {}
        if (!month) return
        if (resDataObj[month] == null) resDataObj[month] = {}

        const data = resDataObj[month]
        data.use = parseInt(copiedCount, 10)
        if (data.count == null) data.count = 0
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
    getTemplateList,
    updateIsPublic,
    updateIsHot,
    updateIsNew,
    updateOrderIndex,
    getCount,
    getMonthlyCount,
}
