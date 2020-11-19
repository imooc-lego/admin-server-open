/**
 * @description 数据校验 users
 * @author 双越
 */

const userIdsSchema = {
    type: 'object',
    required: ['ids'],
    properties: {
        ids: {
            type: 'string',
            pattern: '^\\d+(,\\d+)*$', // 格式如 '1' 或 '1,2,3'
        },
    },
}

module.exports = {
    userIdsSchema,
}
