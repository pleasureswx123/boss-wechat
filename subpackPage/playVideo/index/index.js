// subpackPage/playVideo/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      globalData: {
        navBarHeight: 0, // 导航栏高度
        menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
        menuTop: 0, // 胶囊距顶部间距
        menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      },
      videoUrl: 'http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400'
    },
    gotoBack(){
      wx.navigateBack()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      console.log(options,'传递')
      if(options.url != 'undefined' && options.url != ''){
        this.setData({videoUrl:options.url})
      }
      const _globalData = { ...this.data.globalData }
      const that = this;
      // 获取系统信息
      const systemInfo = wx.getSystemInfoSync();
      // 胶囊按钮位置信息
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
      // 导航栏高度 = 状态栏高度 + 44
      _globalData.navBarHeight = systemInfo.statusBarHeight + 44;
      _globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
      _globalData.menuTop = menuButtonInfo.top;
      _globalData.menuHeight = menuButtonInfo.height;
      this.setData({
        globalData: _globalData
      })
      console.log(this.data.globalData, '', menuButtonInfo)
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