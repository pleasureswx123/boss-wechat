// 引入request请求
const {
    request
} = require('./http')
module.exports = {
    //获取用户信息
    ossGetToken: () => {
        return request('aliyun/upload/credential', 'get')
    }
}