/**
 * @description users service
 * @author 双越
 */

const _ = require('lodash')
const UserModel = require('../models/UserModel')
const seq = require('../db/seq/seq')
const { formatDate } = require('../utils/util')

/**
 * 查询用户列表
 * @param {object} whereOpt 查询条件
 * @param {object} pageOpt 分页数据
 */
async function findUsersService(whereOpt = {}, pageOpt = {}) {
    const { pageSize, pageIndex } = pageOpt
    const pageSizeNumber = parseInt(pageSize, 10) // 有可能传入进来是 string 类型的
    const pageIndexNumber = parseInt(pageIndex, 10)

    const result = await UserModel.findAndCountAll({
        limit: pageSizeNumber, // 每页多少条
        offset: pageSizeNumber * pageIndexNumber, // 跳过多少条
        order: [
            ['id', 'desc'], // id 倒叙
        ],
        where: whereOpt,
    })
    // result.count 总数，忽略了 limit 和 offset
    // result.rows 查询结果，数组
    const list = result.rows.map(row => row.dataValues)

    return {
        count: result.count,
        list,
    }
}

/**
 * 修改用户
 * @param {object} updateData 要修改的数据
 * @param {object} whereOpt 条件
 */
async function updateUsersService(updateData = {}, whereOpt = {}) {
    // 校验数据
    if (_.isEmpty(updateData)) return false
    if (_.isEmpty(whereOpt)) return false

    const result = await UserModel.update(updateData, { where: whereOpt })

    return result[0] !== 0
}

/**
 * 获取总数
 * @param {object} whereOpt 条件
 */
async function getUsersCountService(whereOpt = {}) {
    const result = await UserModel.count({ where: whereOpt })
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

    const sql = `select count(id) as \`count\`,  DATE_FORMAT(createdAt, '%Y-%m') as \`month\`
        from users
        where createdAt >= '${startTimeStr}' and createdAt <= '${endTimeStr}'
        group by \`month\`;`

    const result = await seq.query(sql)
    if (result.length === 2) return result[0]
    return result
}

module.exports = {
    findUsersService,
    updateUsersService,
    getUsersCountService,
    getCreatedCountMonthlyService,
}
