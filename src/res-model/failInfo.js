/**
 * @description res 错误信息配置
 * @author 双越
 */

module.exports = {
    // 登录校验失败
    loginCheckFailInfo: {
        errno: 10001,
        message: '登录校验失败',
    },

    // 登录失败
    loginFailInfo: {
        errno: 10002,
        message: '用户名或密码错误',
    },

    // ctx.request.body 格式验证失败
    validateFailInfo: {
        errno: 10003,
        message: '输入数据的格式错误',
    },

    // 修改数据出错
    updateFailInfo: {
        errno: 10004,
        message: '修改数据出错，请重试',
    },
}
