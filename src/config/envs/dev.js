/**
 * @description dev 配置
 * @author 双越
 */

module.exports = {
    // mongodb 连接配置
    mongodbConf: {
        host: 'localhost',
        port: '27017',
        dbName: 'testdb',
    },

    // redis 连接配置
    redisConf: {
        port: '6379',
        host: '127.0.0.1',
    },

    // mysql 连接配置
    mysqlConf: {
        host: 'localhost',
        user: 'root',
        password: 'xxxx',
        port: '3306',
        database: 'testdb',
    },

    // cors origin
    corsOrigin: '*',

    // 短信验证码缓存时间，单位 s
    msgVeriCodeTimeout: 60,

    // jwt 过期时间
    jwtExpiresIn: '1d', // 1. 字符串，如 '1h' '2d'； 2. 数字，单位是 s

    // 发布出来的 h5 域名
    h5Origin: 'http://localhost:3001',
}
