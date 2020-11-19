/**
 * @description 连接 redis
 * @author 双越
 */

const redis = require('redis')
const { redisConf } = require('../config/index')

// 创建客户端
const { port, host, password } = redisConf
const opt = {}
if (password) {
    opt.password = password // prd 环境需要密码
}
const redisClient = redis.createClient(port, host, opt)
redisClient.on('error', err => {
    console.error('redis connect error', err)
})

module.exports = redisClient
