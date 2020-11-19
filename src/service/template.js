/**
 * @description template service
 * @author 双越
 */

const { findWorksService, updateWorksService, getWorksCountService } = require('./works')
const seq = require('../db/seq/seq')
const { formatDate } = require('../utils/util')

/**
 * 查询 作品/模板 列表
 * @param {object} whereOpt 查询条件
 * @param {object} pageOpt 分页数据
 */
async function findTemplateService(whereOpt = {}, pageOpt = {}) {
    const res = await findWorksService(
        {
            ...whereOpt,
            isTemplate: true, // 是模板
        },
        pageOpt
    )
    return res
}

/**
 * 修改 作品/模板
 * @param {object} updateData 要修改的数据
 * @param {object} whereOpt 条件
 */
async function updateTemplateService(updateData = {}, whereOpt = {}) {
    const res = await updateWorksService(updateData, {
        ...whereOpt,
        isTemplate: true, // 是模板
    })
    return res
}

/**
 * 获取总数
 * @param {object} whereOpt 条件
 */
async function getTemplateCountService(whereOpt = {}) {
    const res = await getWorksCountService({
        ...whereOpt,
        isTemplate: true, // 是模板
    })
    return res
}

/**
 * 获取使用次数的综合
 */
async function getCopiedCountService() {
    const sql = `select sum(copiedCount) as \`copiedCount\` from works where isTemplate=1`
    const result = await seq.query(sql)
    if (result.length === 2) return result[0]
    return result
}

/**
 * 按月，统计创建数量
 * @param {Date} startTime 开始时间
 * @param {Date} endTime 结束时间
 */
async function getCreatedCountMonthlyService(startTime, endTime) {
    // 使用世界标准时区
    const startTimeStr = formatDate(startTime)
    const endTimeStr = formatDate(endTime)

    const sql = `select count(id) as \`count\`,  DATE_FORMAT(latestPublishAt, '%Y-%m') as \`month\`
        from works
        where isTemplate=1 && latestPublishAt >= '${startTimeStr}' and latestPublishAt <= '${endTimeStr}'
        group by \`month\`;`

    const result = await seq.query(sql)
    if (result.length === 2) return result[0]
    return result
}

/**
 * 按月，统计发布数量
 * @param {Date} startTime 开始时间
 * @param {Date} endTime 结束时间
 */
async function getCopiedCountMonthlyService(startTime, endTime) {
    // 使用世界标准时区
    const startTimeStr = formatDate(startTime)
    const endTimeStr = formatDate(endTime)

    const sql = `select sum(copiedCount) as \`copiedCount\`,  DATE_FORMAT(latestPublishAt, '%Y-%m') as \`month\`
        from works
        where isTemplate=1 and latestPublishAt >= '${startTimeStr}' and latestPublishAt <= '${endTimeStr}'
        group by \`month\`;`

    const result = await seq.query(sql)
    if (result.length === 2) return result[0]
    return result
}

module.exports = {
    findTemplateService,
    updateTemplateService,
    getTemplateCountService,
    getCopiedCountService,
    getCreatedCountMonthlyService,
    getCopiedCountMonthlyService,
}
