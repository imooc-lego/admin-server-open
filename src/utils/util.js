/**
 * @description 工具函数
 * @author 双越
 */

const { format } = require('date-fns')

/**
 * 字符串 '1,2' 转换为数组 [1, 2]
 * @param {string} ids 格式如 '1' 或 '1,2,3'
 */
function parseNumberArr(ids = '') {
    const arr = ids
        .split(',')
        .filter(i => i.length > 0)
        .map(i => parseInt(i, 10))
    return arr
}

/**
 * 格式化时间 yyyy-MM-dd HH:mm:ss
 * @param {Date} d 时间
 */
function formatDate(d) {
    return format(d, 'yyyy-MM-dd HH:mm:ss')
}

module.exports = {
    parseNumberArr,
    formatDate,
}
