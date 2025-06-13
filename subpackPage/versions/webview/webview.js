// subpackPage/versions/webview/webview.js
import { getOauth2Url, checkWx } from '../../../http/bind'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type && options.type !== 'null' && options.type !== 'undefined') {
      if (options.appUserId) {
        this.setData({
          userId: options.appUserId
        })
      } else {
        this.setData({
          userId: wx.getStorageSync('userInfo').info.userId
        })
      }
      this.unloginFun()
      this.getOauth2UrlFn()
    } else {
      const url = decodeURIComponent(options.url);
      this.setData({
        url: url
      });
    }
  },
  // 获取授权url
  async getOauth2UrlFn() {
    let params = {
      userId: this.data.userId
    }
    const res = await getOauth2Url(params)
    console.log(res,'111111222')
    if (res.code !== 200) return
    this.setData({
      url: res.msg
    })
  },
  // 判断当前是否是统一微信
  unloginFun() {
    let that = this
    wx.login({
      success: async (res) => {
        let code = res.code
        let params = {
          code: code, // wx登录的code
          userId: that.data.userId
        }
        const result = await checkWx(params)
        console.log(result, '0000')
        if (result.code !== 200) return
        if (!result.data.checkCode) { // 账号不一致
          wx.showModal({
            title: '微信号已绑定其他知城优聘账号',
            cancelText: '关闭',
            content: `当前微信号已与知城优聘账号（${result.data.phone}）绑定，你可以登录知城优聘App解除后，在尝试绑定当前账号`,
            success: function (res) {
              if (res.confirm) {//这里是点击了确定以后
                console.log('用户点击确定')

              } else if (res.cancel) {//这里是点击了取消以后
                console.log('用户点击取消')
              }
            }
          })
        } else {
          console.log('账号一致')
        }
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})