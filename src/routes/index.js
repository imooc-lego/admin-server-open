/**
 * @description routes index
 * @author 双越
 */

const router = require('koa-router')()
const { ENV } = require('../utils/env')
const { cacheGet, cacheSet } = require('../cache/index')
const testMysqlConn = require('../db/mysql2')
const packageInfo = require('../../package.json')

router.get('/api/db-check', async ctx => {
    // 测试 redis
    cacheSet('name', 'admin-server OK - by redis')
    const redisTestVal = await cacheGet('name')

    // 测试 mysql 连接
    const mysqlRes = await testMysqlConn()

    ctx.body = {
        errno: 0,
        data: {
            name: 'admin-server OK',
            version: packageInfo.version,
            ENV, // 测试环境量变量
            redisConn: redisTestVal != null,
            mysqlConn: mysqlRes.length > 0,
        },
    }
})

module.exports = router
