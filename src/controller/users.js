/**
 * @description users controller
 * @author 双越
 */

const { Op } = require('sequelize')
const {
    findUsersService,
    updateUsersService,
    getUsersCountService,
    getCreatedCountMonthlyService,
} = require('../service/users')
const { SuccessRes, ErrorRes } = require('../res-model/index')
const { DEFAULT_PAGE_SIZE } = require('../config/constant')
const { updateFailInfo } = require('../res-model/failInfo')
const { parseNumberArr } = require('../utils/util')

/**
 * 查询用户列表
 * @param {string} keyword 搜索关键字
 * @param {object} pageOpt 分页
 */
async function getUserList(keyword = '', pageOpt = {}) {
    // 查询条件
    let whereOpt = {}
    if (keyword) {
        const keywordOpt = { [Op.like]: `%${keyword}%` }
        whereOpt = {
            [Op.or]: [
                // 所有查询条件， or 拼接
                { id: keywordOpt },
                { username: keywordOpt },
                { phoneNumber: keywordOpt },
                { nickName: keywordOpt },
            ],
        }
    }

    // 分页
    let { pageIndex, pageSize } = pageOpt
    pageIndex = parseInt(pageIndex, 10) || 0
    pageSize = parseInt(pageSize, 10) || DEFAULT_PAGE_SIZE

    // 执行查询
    const { list, count } = await findUsersService(whereOpt, { pageIndex, pageSize })

    // 屏蔽掉密码
    const listWithoutPassword = list.map(u => {
        const u1 = u
        delete u1.password
        return u1
    })

    return new SuccessRes({ list: listWithoutPassword, count })
}

/**
 * 修改 isFrozen
 * @param {string} ids 如 '1' '1,2,3'
 * @param {boolean} isFrozen 是否冻结
 */
async function updateIsFrozen(ids = '', isFrozen = false) {
    // 将 ids 字符串变为数组
    const idsArr = parseNumberArr(ids)
    if (idsArr.length === 0) return new ErrorRes(updateFailInfo)

    // 更新
    const result = await updateUsersService(
        { isFrozen },
        {
            id: {
                [Op.in]: idsArr,
            },
        }
    )

    if (result) return new SuccessRes()
    return new ErrorRes(updateFailInfo)
}

/**
 * 获取总数
 */
async function getCount() {
    // 总数
    const count = await getUsersCountService()

    // 活跃人数，最后登录时间在 3 个月以内的
    const d = new Date()
    const limitDate = new Date(d.getTime() - 90 * 24 * 60 * 60 * 1000) // 90 天之前
    const active = await getUsersCountService({
        latestLoginAt: {
            [Op.gte]: limitDate,
        },
    })

    return new SuccessRes({
        count,
        active,
    })
}

/**
 * 按月统计创建量
 */
async function getCreatedCountMonthly() {
    // 一年的时间范围
    const d = new Date()
    const startTime = new Date(d.getTime() - 365 * 24 * 60 * 60 * 1000) // 一年之前
    const endTime = d

    const result = await getCreatedCountMonthlyService(startTime, endTime)

    return new SuccessRes(result)
}

module.exports = {
    getUserList,
    updateIsFrozen,
    getCount,
    getCreatedCountMonthly,
}
