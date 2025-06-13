import { changeWxCount, apiWxNo } from '../../../http/api'
import { showToast } from '../../../utils/util'
import {getUserInfo} from '../../../http/user'
import {
  ossUpload
} from '../../../miniprogram-6/utils/oss.js'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    wxNumber: '',
    ewmPicUrl: '',
    wxQrcode: -1,
    baseImageUrl: app.globalData.baseImgUrl,
    inputShow: false,
    qrcodeShow: false,
    clearable: false
  },
  confirmValue(event) {
    this.setData({
      wxNumber: event.detail.value,
      clearable: true
    })
  },
  goBtn() {
    if (!this.data.wxNumber && !this.data.qrcodeShow) return showToast('请输入您的微信号')
    if (!(/^[a-zA-Z][a-zA-Z0-9_-]{5,19}$/).test(this.data.wxNumber) && this.data.wxQrcode != 1) {
      showToast('微信号格式错误')
      return
    } else {
      console.log(this.data.wxNumber)
    }
    if (this.data.wxQrcode == 1 && !this.data.ewmPicUrl) {
      showToast('上传微信二维码名片')
      return
    }
    let number = this.data.wxNumber
    if (this.data.wxQrcode == 1) {
      number = this.data.ewmPicUrl
    }
    apiWxNo({ wxNo: number, first: this.data.first, wxQrcode: this.data.wxQrcode }).then(res => {
      if (res.code == 200) {
        this.getUserInfo()
        showToast('设置成功')
        setTimeout(() => {
          wx.navigateBack()
        }, 1000);
      }
    });
  },
  //上传图片
  uploadImage() {
    this.setData({ show: false })
    let userId = wx.getStorageSync('userInfo').info.userId
    var that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        console.log(res)
        console.log(userId, '9999')
        const result = await ossUpload(res.tempFiles[0].tempFilePath, 'image', userId, 1)
        that.setData({
          ewmPicUrl: result.full
        })
      }
    })
  },
  onLoad(options) {
    console.log(options,'val')
    let _first = true
    if (options.val) {
      _first = false
    }
    this.setData({
      userInfo: JSON.parse(options.val),
      first: _first
    })
    if (JSON.parse(options.val).wechat) {
      this.setData({
        wxQrcode:JSON.parse(options.val).wechatQrcode,
      })
      if(JSON.parse(options.val).wechatQrcode == 0){
        this.setData({inputShow: true,wxNumber: JSON.parse(options.val).wechat,clearable: true})
      } else {
        this.setData({qrcodeShow: true,ewmPicUrl: JSON.parse(options.val).wechat})
      }
    }
    this.getCount()
  },
  getCount() {
    changeWxCount().then(res => {
      if (res.code == 200) {
        this.setData({
          base: res.data.base,
          leave: res.data.leave
        })
      }
    })
  },
  goClick(e) {
    let val = e.currentTarget.dataset.val || ''
    this.setData({
      wxQrcode: val
    })

    if (val == 0) {
      this.setData({
        inputShow: true
      })
    } else {
      this.setData({
        qrcodeShow: true
      })
    }
  },

  onClose() {
    console.log(1111)
    this.setData({ inputShow: false, qrcodeShow: false })
  },
  cancel(){
    this.setData({ inputShow: false, qrcodeShow: false })
  },
  // 清除输入框中的内容
  clearWxNumber(){
    this.setData({wxNumber: '',clearable: false})
  },
  // 获取用户信息
  getUserInfo() {
    getUserInfo().then(result => {
      console.log(result, 1111)
      if (result.code == 200) {
        wx.setStorageSync('userInfo', result.data)
      }
    })
  },
})