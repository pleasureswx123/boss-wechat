var app = getApp()
import { fastMate, getUnreadCount } from "../../http/api"
import { showToast } from "../../utils/util"
import { searchPostHome } from '../../http/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentSwiperIndex: 0,
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    baseImageUrl: app.globalData.baseImgUrl,
    imageUrl: app.globalData.imImages,
    globalBottom: app.globalData.globalBottom,
    datalist: [{}],
    isFirstSp: 1,
    isClick: true,
    collectGuide: false,
    versions: null, // 版本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let token = wx.getStorageSync('token')
    let _versions = wx.getStorageSync('versions')
    const that = this;
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
    let _isFirstSp = wx.getStorageSync('isFirstSp')
    that.setData({
      capsuleData: _capsuleData,
      token: token,
      datalist: [],
      isFirstSp: _isFirstSp !== 0 ? 1 : 0,
      versions: _versions
    })
    this.dictionaryData()
    this.fastMate()

    //收藏小程序引导页
    if (!wx.getStorageSync('collectGuide') && !this.data.isFirstSp && token) {
      this.setData({
        collectGuide: true
      })
    }
  },
  //关闭收藏
  closeCollectGuide() {
    this.setData({
      collectGuide: false
    })
  },
  /**
  * 获取未读数
  */
  getUnread() {
    let _usrId = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.userId
    getUnreadCount({ userId: _usrId }).then(res => {
      if (res.code == 200) {
        this.setData({
          count: res.data
        })
        getApp().globalData.unReadMessageNum = res.data;
      }
    })
  },
  closefirstSp() {
    this.setData({
      isFirstSp: 0
    })
    wx.setStorageSync('isFirstSp', 0)
  },

  swiperBindchange(e) {
    this.setData({
      currentSwiperIndex: e.detail.current
    })
  },
  // 今日速配数据
  async fastMate() {
    let params = {
      dignity: 1,
      edition: this.data.versions == 1 ? 2 : 1,
      module: wx.getStorageSync('token') ? 12 : 11
    }
    let { code, data, msg } = await searchPostHome(params)
    if (code != 200) return showToast(msg);
    data = data.list
    data.map(item => {
      item.tag = item.tag && item.tag.split(',')
      item.postDuty = item.postDuty && item.postDuty.replaceAll('\n', '<br/>')
    })
    data.push({}) // 追加一条空数据
    let _data = data.map(item => {
      return {
        ...item,
        // postDuty: item.postDuty + `<span class="lookBtn" style="color: red">...查看详情</span>`
      }
    })
    this.setData({
      datalist: _data,
      totalnum: data.length
    })
  },

  // 字典数据赋值
  dictionaryData() {
    let data = wx.getStorageSync('dictionary')
    this.setData({
      experienceList: data[33],
      educationList: data[6]
    })
  },

  // 暂不考虑
  changeSwiperIndex() {
    this.setData({
      isClick: false     //在点击一次后，点击状态变为关闭，默认为开启
    })
    this.setData({
      currentSwiperIndex: this.data.currentSwiperIndex + 1
    })
    setTimeout(() => {
      this.setData({
        isClick: true
      })
    }, 500)
  },

  // 查看详情
  goDetail() {
    // 当前点击的这一项的id和bossid
    let { belonger, id } = this.data.datalist[this.data.currentSwiperIndex]
    if (!id) return
    wx.navigateTo({
      url: `/subpackPage/index/job_detail/index?postId=${id}&bossuserid=${belonger}`,
    })
  },

  gotoHome() {
    // 如果已经选择好版本了
    if (this.data.versions) {
      if (this.data.versions == 1) {
        wx.reLaunch({
          url: `/pages/index/index`
        })
      } else {
        wx.reLaunch({
          url: `/subpackPage/versions/index/index`
        })
      }
    } else {
      wx.setStorageSync('currentPageIdx', 1)
      // 如果没有选择版本
      wx.reLaunch({
        url: `/pages/index/index`
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (this.data.token && this.data.versions == 1) {
      this.getUnread()
    }
    let _versions = wx.getStorageSync('versions')
    this.setData({
      versions: _versions
    })
  },
  // 经典版跳转到今日速配返回事件
  navigateBack() {
    wx.navigateBack()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})