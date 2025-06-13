
const baseUrl = 'http://127.0.0.1:8081'
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
            // if (isShowLoad) {
                wx.showLoading({
                    title: '加载中···',
                    mask: true
                })
            // }
            wx.request({
                url: _url,
                data: data,
                timeout: 100000,
                header: {
                    'YouPin': "422fa3e2-6653-415f-8338-709df829a0cb"
                },
                method: method,
                success: (res) => {
                    // if (isShowLoad) {
                        wx.hideLoading()
                    // }
                    if (res.data.code == 200) {
                        resolve(res.data)
                    } else if (res.data.code == 403) {
                        wx.removeStorageSync('token')
                        wx.reLaunch({
                            url: '/pages/index/index',
                        })
                    } else if (res.data.code == 401) {
                        wx.removeStorageSync('token')
                        wx.reLaunch({
                            url: '/pages/index/index',
                        })
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