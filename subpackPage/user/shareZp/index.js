var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.globalData.baseImgUrl,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    show: false,
    AppImageUrl: '/image/orcode.png',
    QRCodeurl: '', // 官网链接
    list: [{ type: 1, name: '求职端' }, { type: 2, name: '招聘端' }],
    active: 1,
    current: 0, // 当前展示的图片
    backgroundArr: [0, 1, 2, 3, 4],
    autoplay: true,
    imgUrls: [{ type: 1, name: '/myCard/qz1.png' }, { type: 1, name: '/myCard/qz2.png' }, { type: 1, name: '/myCard/qz3.png' }, { type: 1, name: '/myCard/qz4.png' }, { type: 1, name: '/myCard/qz5.png' }, { type: 2, name: '/myCard/zp1.png' }, { type: 2, name: '/myCard/zp2.png' }, { type: 2, name: '/myCard/zp3.png' }, { type: 2, name: '/myCard/zp4.png' }, { type: 2, name: '/myCard/zp5.png' }, { type: 2, name: '/myCard/zp6-1.png' }],
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    lookAppShow: false
  },
  // 保留
  onLongTap: function (e) {
    console.log(e,'识别图片')
    var that = this
    // wx.showActionSheet({
    //     itemList: ['识别图中二维码', '保存图片到相册'],
    //     success: function (res) {
    //         console.log(res.tapIndex) // 点击的索引
    //         if (res.tapIndex == 0) {
    //             wx.scanCode({
    //                 success: function (res) {
    //                     console.log(res.result)

    //                 },
    //                 fail: function (res) {
    //                     console.log(res)
    //                 }
    //             })
    //         } else {
    //             // 保存图片到本地
    //             wx.saveImageToPhotosAlbum({
    //                 filePath: that.data.AppImageUrl,
    //                 success: function (res) {
    //                     wx.showToast({
    //                         title: '保存成功',
    //                     })
    //                 },
    //                 fail: function (res) {
    //                     wx.showToast({
    //                         title: '保存失败',
    //                         icon: 'none'
    //                     })
    //                 }
    //             })
    //         }
    //     }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,'1112222')
    if (options.type && options.type !== 'null' && options.type !== 'undefined') {
      this.setData({
        active: options.type
      })
    }
    let that = this
    //获取地导航
    wx.getSystemInfo({
      success: res => {
          console.log('宽度：' + res.screenWidth)
          console.log('高度：' + res.screenHeight)
          that.setData({
            screenHeight: res.screenHeight,
            screenWidth: res.screenWidth
          })
      }
  })
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
      isIphone678: this.data.screenHeight < 740 ? true : false
    })
  },
  //监听轮播图的下标
  monitorCurrent(e) {
    // console.log(e.detail.current)
    let current = e.detail.current;
    let source =e.detail.source;
    // 判断swiper的change事件是通过什么来触发的（autoplay： 自动 / touch：用户 ）
    if (source === 'autoplay' || source === 'touch') {
      this.setData({
        current: current
      })
    }
  },
  changeTab(e) {
    this.setData({
      active: e.currentTarget.dataset.type
    })
  },
  goBack() {
    wx.navigateBack()
  },
  openEwm() {
    this.setData({
      show: true
    })
  },
  onClose() {
    this.setData({
      show: false,
      lookAppShow: false
    })
  },
  openLook(){
    this.setData({lookAppShow: true})
  }
})