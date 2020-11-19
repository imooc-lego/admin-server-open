/**
 * @description pm2 配置文件，线上环境
 * @author 双越
 */

const appConf = require('./pm2AppConf')

module.exports = {
    apps: [appConf],

    // deploy: {
    //     production: {
    //         user: 'SSH_USERNAME',
    //         host: 'SSH_HOSTMACHINE',
    //         ref: 'origin/master',
    //         repo: 'GIT_REPOSITORY',
    //         path: 'DESTINATION_PATH',
    //         'pre-deploy-local': '',
    //         'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
    //         'pre-setup': '',
    //     },
    // },
}
