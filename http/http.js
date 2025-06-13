// 引入env中的url
//const baseUrl = 'https://saas.gcjtqy.com/zd-api'
//const baseUrl = 'http://192.168.110.126:8082'
//const baseUrl = 'http://192.168.110.244:8082'

// const baseUrl = 'https://api.guochuanyoupin.com/yp-api'
const baseUrl = 'https://api.test.guochuanyoupin.com/yp-api'

// 引入封装的加密方法
const ase = require('../utils/aes')
console.log(ase.Decrtpt("xVx0De4w256+eg/tdp/MhNdOOHMEioB0BRNRL5NZkF2t/KBcKyFHq91LWz2Bqf8zYuc2vWz7QwZH2aJbIU7kzxV/4vMRA4Euu1bbp0aNT1w0ytjtjlAuoIrEy2PB7axmwZfvRxBpSdqdFb5Vaoz028P1/dXxgmTXEAGWDe6lKmnrW+Rg5+WCgY8U3B5Yk6McaQvThkPdnf3W7v4LzS0ujogVaNnpZ0dZhIDiED5s477rQAqxUv8jKljNHPurLafz2oJjQ9Hpw2XBRstyW8w3O8ltD8Uc04dolnAn5ANJiNg="),'00000000000000:')
 
// 专属域名
const subDomain = '域名'
module.exports = {
    baseUrl: baseUrl,
    //ImgUrl: ImgUrl,
    /**二次封装wx.request()
     * url:请求的接口地址
     * method:请求方式
     * data传参
     * */
    request: (url, method = 'GET', data = {}, isShowLoad) => {
        let _url = `${baseUrl}/${url}`
        return new Promise((resolve, reject) => {
            if (isShowLoad) {
                wx.showLoading({
                    title: '加载中···',
                    mask: true
                })
            }
            let versions = wx.getStorageSync('versions')
            wx.request({
                url: _url,
                data: data,
                timeout: 100000,
                header: {
                    'platform':3,
                    'YouPin': wx.getStorageSync('token')
                },
                method: method,
                success: (res) => {
                    if(res.header['Youpin-Encrypt']==1){
                      //debugger
                      res.data=JSON.parse(ase.Decrtpt(res.data))
                    }
                    if (isShowLoad) {
                        wx.hideLoading()
                    }
                    if (res.data.code == 200) {
                        resolve(res.data)
                    } else if (res.data.code == 403) {
                        wx.removeStorageSync('token')
                        if (versions) {
                            if (versions == 1) {
                                wx.reLaunch({
                                    url: '/pages/index/index',
                                })
                            } else {
                                wx.reLaunch({
                                    url: '/subpackPage/versions/index/index',
                                })
                            }
                        } else {
                            wx.reLaunch({
                                url: '/pages/index/index',
                            })
                        }
                    } else if (res.data.code == 401) {
                        wx.removeStorageSync('token')
                        if (versions) {
                            if (versions == 1) {
                                wx.reLaunch({
                                    url: '/pages/index/index',
                                })
                            } else {
                                wx.reLaunch({
                                    url: '/subpackPage/versions/index/index',
                                })
                            }
                        } else {
                            wx.reLaunch({
                                url: '/pages/index/index',
                            })
                        }
                    } else {
                        resolve(res.data)
                    }
                },
                fail: () => {
                    wx.hideLoading()
                    // wx.showToast({
                    //     title: '网络错误',
                    //     icon: 'none'
                    // })
                }
            })
        })
    },
    //   图片上传
    uploadFile(opt) {
        opt.url = `${baseUrl}/${opt.url}`
        return wx.uploadFile(opt)
    }
}