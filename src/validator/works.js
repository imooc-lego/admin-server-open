/**
 * @description 数据校验 works
 * @author 双越
 */

const worksIdsSchema = {
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
    worksIdsSchema,
}
