// 引入request请求
const {
    request
} = require('./http')
module.exports = {
    // 登录
    wxlogin: (params) => {
        return request('login/wx', 'post', params)
    },
    //手机号验证登录
    phoneLogin: (params) => {
        return request('login/phone', 'post', params)
    },
    //登录验证验证码
    getCheckCode: (params) => {
        return request('login/checkcode', 'post', params)
    },
    //获取用户信息
    getUserInfo: () => {
        return request('user/info', 'get')
    },
    //绑定手机号
    bindPhone: (params) => {
        return request('login/bindphone', 'post',params)
    },
    //绑定手机号发送验证
    bind: (params) => {
        return request('sms/bind', 'get',params)
    },
    //注销
    apiLogoff:(code)=>{
        return request(`user/set/logoff?code=${code}`, 'get')
    },
    //绑定手机号发送验证
    getlogooff: (params) => {
      return request('sms/logoff', 'get',params)
  }
}