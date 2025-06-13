// subpackPage/index/freeProp/index.js
var app = getApp()
import { comfinmHelp, help, index, notLogin } from '../../../http/help'
import { wxlogin, getUserInfo } from '../../../http/login'
import { propUsing } from '../../../http/user'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.globalData.baseImgUrl,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    fingerStyle: '',
    avatar: '', // 当前分享人头像
    show: false, // 助力弹窗
    active: {},
    currentHelpInfo: {}, // 当前助力人信息
    receiveAwardModal: false, // 控制领取弹窗
    topOpacity: 0, // 顶部背景色透明度
  },
  goBack() {
    wx.navigateBack()
  },

  onClose() {
    this.setData({
      show: false,
      receiveAwardModal: false
    })
  },
  // 去首页(当前助力人/已经助力,其他人再次点击链接看到)
  async draw() {
    let versions = wx.getStorageSync('versions')
    // 如果已经选择好版本了
    if (versions) {
      if (versions == 1) {
        wx.reLaunch({
          url: `/pages/index/index`
        })
      } else {
        wx.reLaunch({
          url: `/subpackPage/versions/index/index`
        })
      }
    } else {
      // wx.setStorageSync('currentPageIdx', 1)
      // 如果没有选择版本
      wx.reLaunch({
        url: `/pages/index/index`
      })
      wx.setStorageSync('versions', 1) // 存储当前选择的版本(1为至臻版 / 2为经典版)
    }
  },

  // 邀请人领取道具
  async receiveAward() {
    const res = await comfinmHelp(this.data.currentHelpInfo.activityId)
    console.log(res, '领取道具')
    if (res.data.code !== 0) return wx.showToast({
      title: res.data.msg,
      icon: 'none'
    })
    wx.showToast({
      title: '领取成功',
      icon: 'none'
    })
    this.setData({
      receiveAwardModal: true
    })
    // 再次查询一下
    // this.helpIndex(this.data.currentHelpInfo.activityId)
    this.helpIndex(null) // 只查询自己的(因为需要道具id去使用页面)
  },
  // 去使用当前获取的道具
  gotoResumeRefresh() {
    let id = this.data.currentHelpInfo.prop.belongId
    console.log(id, '获取的道具id')
    propUsing(1).then(res => {
      console.log(res, '查看')
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      if (res.data > 0) {
        wx.showToast({
          title: '您有道具正在使用',
          icon: 'none'
        })
        return
      } else {
        wx.navigateTo({
          // url: `/echartsPage/pages/resumeRefresh/resumeRefresh?id=${id}&propType=1&used=0`
          url: `/subpackPage/user/resumeRefresh/resumeRefresh?id=${id}&propType=1&used=0`
        })
      }
    })
  },
  // 查询助力
  async helpIndex(activeId) {
    if (!activeId) {
      activeId = ''
    }
    let active = {
      activityId: activeId
    }
    const res = await index(active)
    console.log(res, '查询')
    if (res.code !== 200) return
    this.setData({
      currentHelpInfo: res.data.data
    })
    // 当前人发起助力
    if (this.data.currentHelpInfo.creater == 1 && this.data.currentHelpInfo.helpers.length == 0) {

    } else if (this.data.currentHelpInfo.creater == 1 && this.data.currentHelpInfo.helpers.length > 0) {
      // 当前人领取免费道具(已有助力)
    } else if (this.data.currentHelpInfo.creater == 0 && this.data.currentHelpInfo.helpers.length == 0) {
      // 助力人点开链接准备助力
      this.setData({ show: true })
    } else if (this.data.currentHelpInfo.creater == 0 && this.data.currentHelpInfo.helpers.length > 0) {
      // 已有人助力,展示助力完成
      this.setData({ show: false })
    }
  },
  // 未登录时查询助力信息
  async helpNotLogin(activeId) {
    if (!activeId) {
      activeId = ''
    }
    let active = {
      activityId: activeId
    }
    const res = await notLogin(active)
    console.log(res, '未登录时查询')
    if (res.code !== 200) return
    this.setData({
      currentHelpInfo: res.data.data
    })
    if (this.data.currentHelpInfo.helpers.length == 0) {
      // 助力人点开链接准备助力
      this.setData({ show: true })
    } else if (this.data.currentHelpInfo.helpers.length > 0) {
      // 已有人助力,展示助力完成
      this.setData({ show: false })
    }
  },
  // 不管当前点击链接是否登录
  inviteFriend: function () {
    let wxToken = wx.getStorageSync('token')
    // 已登录(可以助力)
    if (wxToken) {
      // 成功授权可直接助力
      this.nowHelp()
    } else {
      // 否则去登录
      let that = this
      wx.login({
        success: (res) => {
          wx.showLoading({
            title: '正在登录...',
          })
          let code = res.code
          wxlogin({
            code,
            dignity: 1,
            client: 'wx'
          }).then((res) => {
            if (res.code == 200) {
              if (res.data.code != null) return wx.showToast({
                title: res.data.msg,
                icon: "none"
              })
              //next = 1 --未绑定手机号  next == 2 以绑定手机号
              // enc  --  绑定加密串
              if (res.data.next == 2) {
                wx.setStorageSync('token', res.data.token);
                getUserInfo().then((result) => {
                  console.log(result)
                  if (result.code == 200) {
                    wx.hideLoading()
                    wx.setStorageSync('userInfo', result.data)
                    let activeId = wx.getStorageSync('activeId')
                    wx.redirectTo({
                      url: '/subpackPage/index/freeProp/index?activeId=' + activeId,
                    })
                  } else {
                    showToast(result.msg)
                  }
                })
              } else {
                // 绑定手机号
                wx.navigateTo({
                  url: `/subpackPage/index/bindPhone/index?enc=${res.data.enc}`,
                })
              }
            } else {
              showToast(res.msg)
            }
          })
        },
      })
    }
  },
  // 立即助力
  async nowHelp() {
    const res = await help(this.data.activityId)
    console.log(res, '助力开始')
    if (res.code !== 200) return
    wx.showToast({
      title: '助力成功',
      icon: 'none'
    })
    this.setData({
      show: false
    })
    // 再次查询一下
    this.helpIndex(this.data.currentHelpInfo.activityId)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let wxToken = wx.getStorageSync('token')
    // 有token代表已登录 (助力人/发起人)
    if (wxToken) {
      console.log(options.activeId, '助力id')
      // 有助力id则证明是别人点击链接进来
      if (options.activeId) {
        // console.log(options.activeId, '助力id')
        this.setData({ activityId: options.activeId })
        // 查询助力(助力人)
        this.helpIndex(options.activeId)
        // wx.setStorageSync('activeId', options.activeId)
      } else {
        this.setData({ activityId: '' })
      }
      // 查询助力(当前人)
      this.helpIndex(options.activeId)
    } else {
      console.log('为登录', options.activeId)
      this.helpNotLogin(options.activeId)
      wx.setStorageSync('activeId', options.activeId)
      // 未登录(也去查询)
      // this.helpIndex(options.activeId)
    }
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
  onShareAppMessage(res) {
    return this.confirmSharing(res.target.dataset.activeid);
  },
  // 点击确认分享
  confirmSharing(id) {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const currentPath = currentPage.route;
    const fullPath = `${currentPath}?activeId=${id}`;
    return {
      title: '分享得免费道具',
      path: fullPath,
    }
  },

  // 滚动事件监听
  onPageScroll(e) {
    console.log(e.scrollTop,'e.scrollTop')
    this.setData({
      topOpacity: e.scrollTop / 110 > 0.9 ? 1 : e.scrollTop / 110
    })
    // console.log(this.data.topOpacity,'topOpacity')
  },
})