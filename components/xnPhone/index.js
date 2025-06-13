var app = getApp()
import { setUserContactMeWay, getAllowPhoneTime } from '../../http/versions'
import { showToast } from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShowContact: {
      type: Boolean,
      value: false
    },
    contactStatus: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageUrl: app.globalData.baseImgUrl
  },
  attached() {
    let _userInfo = wx.getStorageSync('userInfo').info
    this.setData({ userInfo: _userInfo })
    let _phone = this.maskPhoneNumber(_userInfo.phone)
    this.setData({
      ['userInfo.phone']: _phone
    })
    this.getPhoneTime()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取联系我的方式
    async getPhoneTime() {
      const res = await getAllowPhoneTime()
      console.log(res, '00000')
      if (res.code != 200) return showToast(res.msg)
      this.setData({ multiObject: res.data })
    },
    onClose() {
      this.triggerEvent('close')
    },
    // 联系方式修改
    async contactWayChange() {
      let _status = this.data.contactStatus ? 0 : 1
      const res = await setUserContactMeWay({ status: _status })
      if (res.code !== 200) return showToast(res.msg)
      showToast('修改成功')
      this.triggerEvent('close')
    },
    goEditPhone() {
      wx.navigateTo({
        url: '/subpackPage/user/setup/account/phone',
      })
    },
    maskPhoneNumber(phoneNumber) {
      // 首先确保输入的是正确的手机号格式
      if (/^1[3-9]\d{9}$/.test(phoneNumber)) {
        // 截取出前后部分
        let prefix = phoneNumber.slice(0, 3); // 取前三位
        let suffix = phoneNumber.slice(-4); // 取后四位
        // 中间四位替换为星号
        let maskedMiddle = '*'.repeat(4);

        // 返回处理后的手机号
        return prefix + maskedMiddle + suffix;
      } else {
        // 如果输入的不是有效的手机号，返回原始输入
        return phoneNumber;
      }
    }

  }
})
