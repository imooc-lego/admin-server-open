/**
 * @description admin service
 * @author 双越
 */

const _ = require('lodash')
const AdminModel = require('../models/AdminModel')

/**
 * 查询单个数据
 * @param {string} username username
 * @param {string} password password
 */
async function findOneAdminService(username, password) {
    // 拼接查询条件
    const whereOpt = {}
    if (username) {
        Object.assign(whereOpt, { username })
    }
    if (password) {
        // 用户名和密码在一块，因为密码可能重复
        Object.assign(whereOpt, { username, password })
    }

    // 无查询条件，则返回空
    if (_.isEmpty(whereOpt)) return null

    // 查询
    const result = await AdminModel.findOne({
        where: whereOpt,
    })
    if (result == null) {
        // 未查到用户
        return result
    }

    // 返回查询结果
    return result.dataValues
}

/**
 * 创建管理员
 * @param {object} adminInfo adminInfo
 */
async function createAdminService({ username, password, nickName = '' }) {
    const result = await AdminModel.create({
        username,
        password, // 密码要加密
        nickName,
    })
    return result.dataValues
}

module.exports = {
    findOneAdminService,
    createAdminService,
}
