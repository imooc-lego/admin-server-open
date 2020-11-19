/**
 * @description admin model
 * @author 双越
 */

const seq = require('../db/seq/seq')
const { STRING } = require('../db/seq/types')

const Admin = seq.define('admin', {
    username: {
        type: STRING,
        allowNull: false,
        unique: 'username', // 不要用 `unique: true`, https://www.chaoswork.cn/1064.html
        comment: '用户名，唯一',
    },
    password: {
        type: STRING,
        allowNull: false,
        comment: '密码',
    },
    nickName: {
        type: STRING,
        comment: '昵称',
    },
})

module.exports = Admin
