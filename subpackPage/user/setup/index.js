// subpackPage/user/setup/index.js
const app = getApp();
import {supervisoryOfflineUser} from '../../../http/versions'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    outShow: false,
    baseImageUrl: app.globalData.baseImgUrl,
  },
  //账户与安全
  goToAccount() {
    wx.navigateTo({
      url: './account/index',
    })
  },
  //通知与提醒
  goToNotice() {
    wx.navigateTo({
      url: './notice/index',
    })
  },
  //隐私保护
  goToPrivacy() {
    wx.navigateTo({
      url: './privacy/index',
    })
  },
  //打招呼语
  goToGreet() {
    wx.navigateTo({
      url: './greet/index',
    })
  },
  // 地址管理
  goToSetAddress() {
    wx.navigateTo({
      url: '/subpackPage/index/setAddress/index',
    })
  },
  //绑定邀请码
  goToSetBind(){
    wx.navigateTo({
      url: '/subpackPage/user/bindEwm/index?come=1',
    })
  },
  //退出登录
  outLogin() {
    this.setData({ outShow: true })
  },
  async identifyHandle() {
    let dic = wx.getStorageSync('dictionary')
    let avatar = wx.getStorageSync('avatar') // 分享使用
    let postAddress = wx.getStorageSync('postAddress')
    let versions = wx.getStorageSync('versions') // 获取版本
    let yd1 = wx.getStorageSync('guideMyShow') // 引导
    let yd2 = wx.getStorageSync('guideIdxShow') // 引导
    let yd3 = wx.getStorageSync('guideZzShow') // 引导
    let collectGuide = wx.getStorageSync('collectGuide') // 引导
    // 等待通知后台需要给我推送后继续向下走
    await this.supervisoryOfflineUserFn()
    wx.clearStorageSync()
    wx.setStorageSync('dictionary', dic)
    wx.setStorageSync('avatar', avatar) // 用于分享
    wx.setStorageSync('postAddress', postAddress) // 用于首页地址弹窗
    wx.setStorageSync('guideMyShow', yd1)
    wx.setStorageSync('guideIdxShow', yd2)
    wx.setStorageSync('guideZzShow', yd3)
    wx.setStorageSync('collectGuide', collectGuide)
    if (versions) {
      wx.setStorageSync('versions', versions) // 版本(默认为1)
    }
    
    const keys = wx.getStorageInfoSync().keys
    // 暂时修改,测试使用
    // if(keys.length == 3){
    wx.showToast({
      title: '退出成功',
      icon: 'none',
    })
    
    setTimeout(() => {
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
        // 如果没有选择版本
        wx.reLaunch({
          url: `/pages/index/index`
        })
      }
    }, 1000)
  },
  cloneShow() {
    this.setData({ outShow: false })
  },

  // 提示后台用户下线，需要给我推送
  async supervisoryOfflineUserFn(){
    let params = {
      userId: wx.getStorageSync('userInfo').info.userId
    }
    const res = await supervisoryOfflineUser(params)
    console.log(res,'下线')
  }
})