/**
 * @description admin controller
 * @author 双越
 */

const { ErrorRes, SuccessRes } = require('../res-model/index')
const { loginFailInfo } = require('../res-model/failInfo')
const doCrypto = require('../utils/cryp')
const { jwtSign } = require('../utils/jwt')
const { findOneAdminService, createAdminService } = require('../service/admin')

/**
 * 登录
 * @param {string} username username
 * @param {string} password username
 */
async function login(username, password = '') {
    const info = await findOneAdminService(
        username,
        doCrypto(password) // 密码要加密
    )
    if (info == null) {
        // 登录未成功
        return new ErrorRes(loginFailInfo)
    }
    // 登录成功
    return new SuccessRes({
        token: jwtSign(info),
    })
}

/**
 * 注册用户
 * @param {string} username username
 * @param {string} password username
 */
async function register(username, password = '') {
    const adminInfo = await findOneAdminService(username, doCrypto(password))
    if (adminInfo != null) return adminInfo

    const newAdmin = await createAdminService({ username, password: doCrypto(password) })
    return newAdmin
}

module.exports = {
    login,
    register,
}
