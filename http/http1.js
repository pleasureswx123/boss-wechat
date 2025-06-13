// 引入env中的url
const baseUrl = 'https://api.guochuanyoupin.com'
// 引入封装的加密方法
const ase = require('../utils/aes')
 
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
}