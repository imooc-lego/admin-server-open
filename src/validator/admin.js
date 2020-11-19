/**
 * @description 数据校验 admin
 * @author 双越
 */

const adminInfoSchema = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
        username: {
            type: 'string',
            pattern: '^\\w+$', // 字母数字下划线
            maxLength: 255,
        },
        password: {
            type: 'string',
            maxLength: 255,
        },
    },
}

module.exports = {
    adminInfoSchema,
}
