/**
 * @description 数据校验 template
 * @author 双越
 */

const templateDataSchema = {
    type: 'object',
    required: ['ids'],
    properties: {
        ids: {
            type: 'string',
            pattern: '^\\d+(,\\d+)*$', // 格式如 '1' 或 '1,2,3'
        },
        isPublic: {
            type: 'boolean',
        },
        isHot: {
            type: 'boolean',
        },
        isNew: {
            type: 'boolean',
        },
        orderIndex: {
            type: 'number',
        },
    },
}

module.exports = {
    templateDataSchema,
}
