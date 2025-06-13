// subpackPage/index/qiyeWx/index.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    globalBottom: app.globalData.globalBottom,
    url1: '',
    url2: '',
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const _capsuleData = { ...this.data.capsuleData }
     // 导航栏高度 = 状态栏高度 + 44
     _capsuleData.navBarHeight = systemInfo.statusBarHeight + 44;
     _capsuleData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
     _capsuleData.menuTop = menuButtonInfo.top;
     _capsuleData.menuHeight = menuButtonInfo.height;
     _capsuleData.menuWidth = menuButtonInfo.width

    this.setData({
      capsuleData: _capsuleData,
    })
    setTimeout(() => {
      this.setData({
        url1: 'https://work.weixin.qq.com/gm/37ac991edd4de069a132fd4ea8d3d045',
        url2: 'https://work.weixin.qq.com/gm/b7fd491c2067f0fd139b7f1f56b09b46'
      })
    }, 500)
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

  },

  navigateBack(){
    wx.navigateBack()
  }
})