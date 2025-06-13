// subpackPage/user/setup/boss/index.js
const app = getApp();
import { privacyProtectionBoss, setPrivacyProtectionBoss } from '../../../../http/user'
import { showToast } from '../../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked1: false,
    checked2: false,
    checked3: false,
    checked4: false,
    userId: null,
    baseImageUrl: app.globalData.baseImgUrl,
    checkedShow: false, // 全部弹窗控制项
    showTextType: ''
  },

  cloneShow() {
    this.setData({checkedShow: false})
  },
  //设置开关状态
  async chenge(e) {
    console.log(e.detail)
    var param = e.currentTarget.dataset.type

    if (!e.detail) {
      if (param == 'hideResumeFromBoss') {
        this.setData({ checked1: false })
      } else if (param == 'homepageHideResume') {
        this.setData({ checked2: false })
      } else if (param == 'hideJobPreferencesFormBoss') {
        this.setData({ checked3: false })
      } else if (param == 'hideActivityFromBoss') {
        this.setData({ checked4: false })
      }
      let params = {
        [param]: 0,
        userId: this.data.userId
      }
      const res = await setPrivacyProtectionBoss(params)
      if (res.code != 200) return showToast(res.msg)
      showToast('取消成功')
    } else {
      this.setData({ checkedShow: true, showTextType: param })
    }
  },
  //确定按钮
  async identifyHandle(e) {
    // var param = e.currentTarget.dataset.type
    let param = this.data.showTextType
    let params = {
      userId: this.data.userId,
      [param]: 1
    }
    const res = await setPrivacyProtectionBoss(params)
    if (res.code !== 200) return showToast('设置失败')
    if (param == 'hideResumeFromBoss') {
      this.setData({ checked1: true })
    } else if (param == 'homepageHideResume') {
      this.setData({ checked2: true })
    } else if (param == 'hideJobPreferencesFormBoss') {
      this.setData({ checked3: true })
    } else if (param == 'hideActivityFromBoss') {
      this.setData({ checked4: true })
    }
    this.setData({ checkedShow: false })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({ userId: wx.getStorageSync('userInfo').info.userId })
    privacyProtectionBoss(this.data.userId).then(res => {
      console.log(res)
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
        })
        return
      }
      this.setData({ checked1: res.data.hideResumeFromBoss == 1 ? true : false })
      this.setData({ checked2: res.data.homepageHideResume == 1 ? true : false })
      this.setData({ checked3: res.data.hideJobPreferencesFormBoss == 1 ? true : false })
      this.setData({ checked4: res.data.hideActivityFromBoss == 1 ? true : false })
    })
  }
}) 