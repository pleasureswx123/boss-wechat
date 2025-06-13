// subpackPage/user/setup/notice/index.js
import { notification, setNotification } from '../../../../http/user'
import { showToast } from '../../../../utils/util'
import { checkOfficial } from '../../../../http/bind'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    checked2: false,
    checked3: false,
    checked4: false, // 消息免打扰
    popShow: false,
    postShow: false,
    userId: null,
    baseImageUrl: app.globalData.baseImgUrl,
    showTextType: '',
    checkedShow: false, // 全部弹窗控制项
    multiArray: [[], []],
    multiIndex: [7, 23],
  },
  async goOpen() {
    if (!this.data.checked3) {
      this.setData({
        checked3: true
      })
      wx.navigateTo({
        url: `/subpackPage/versions/webview/webview?type=1`,
      })
    } else {
      let params = {
        allowWxMsg: 0,
        userId: this.data.userId
      }
      const res = await setNotification(params)
      if (res.code != 200) return showToast(res.msg)
      showToast('关闭成功')
      this.setData({
        checked3: false
      })
    }
  },
  //开关状态
  async Chenge(e) {
    var param = e.currentTarget.dataset.type
    if (!e.detail) {
      this.setData({ checkedShow: true, showTextType: param })
    } else {
      if (param == 'chatNotify') {
        this.setData({ checked: true })
      } else if (param == 'recommendPosition') {
        this.setData({ checked2: true })
      } else if (param == 'allowMessageTimeFlag') {
        this.setData({ checked4: true })
      }
      let params = {
        [param]: 1,
        userId: this.data.userId
      }
      const res = await setNotification(params)
      if (res.code != 200) return showToast(res.msg)
      showToast('设置成功')
    }
  },
  async chatInfoChange(e){
    var param = e.currentTarget.dataset.type
    if (e.detail) {
      this.setData({ checkedShow: true, showTextType: param })
    } else {
      this.setData({ checked4: false })
      let params = {
        [param]: 0,
        userId: this.data.userId
      }
      const res = await setNotification(params)
      if (res.code != 200) return showToast(res.msg)
      showToast('设置成功')
    }
  },
  //弹窗取消
  cloneShow() {
    this.setData({ checkedShow: false })
  },
  // 检测用户是否关注了公众号
  async checkOfficialFn() {
    let params = {
      userId: this.data.userId
    }
    const res = await checkOfficial(params)
    console.log(res, '是否关注公众号')
    if (res.code !== 200) return
    this.setData({
      checked3: res.data.follow
    })
  },
  //弹窗确认
  async identifyHandle(e) {
    let param = this.data.showTextType
    let params = null
    if(this.data.showTextType == 'allowMessageTimeFlag'){
      params = {
        [param]: 1,
        userId: this.data.userId
      }
    } else {
      params = {
        [param]: 0,
        userId: this.data.userId
      }
    }
    const res = await setNotification(params)
    if (res.code != 200) return showToast(res.msg)
    showToast('设置成功')
    if (param == 'recommendPosition') {
      this.setData({ checked2: false })
    } else if (param == 'chatNotify') {
      this.setData({ checked: false })
    } else if(param == 'allowMessageTimeFlag'){
      this.setData({ checked4: true })
    }
    this.cloneShow()
  },
  //电话助手授权
  // goAccredit(){
  //   wx.navigateTo({
  //     url: '/subpackPage/user/setPhone/setPhone',
  //   })
  // },

  onLoad() {
    this.setTimeArr()
    this.setData({ userId: wx.getStorageSync('userInfo').info.userId })
    notification(this.data.userId).then(res => {
      console.log(res)
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
        })
        return
      }

      this.setData({
        checked: res.data.chatNotify == 1 ? true : false,
        checked2: res.data.recommendPosition == 1 ? true : false,
        checked4: res.data.allowMessageTimeFlag == 1 ? true : false
      })
      if(res.data.allowMessageTimeFlag == 1){
        let startTime = res.data.allowMessageTime.split(',')[0]
        let endTime = res.data.allowMessageTime.split(',')[1]
        this.setData({ multiIndex: [Number(startTime.split(':')[0]), Number(endTime.split(':')[0])] })
      }
    })
    // this.checkOfficialFn()
  },

  gotoDetail() {
    wx.navigateTo({
      url: '/subpackPage/user/setup/noticeDetail/index',
    })
  },

  // 时间段
  setTimeArr(number) {
    let arr = []
    let arr1 = []
    let _number = number || 23
    for (let i = 0; i <= _number; i++) {
      arr.push({ num: i, name: i<10 ? `0${i}:00` : `${i}:00` })
    }
    arr1[0] = arr
    arr1[1] = arr
    this.setData({
      multiArray: arr1
    })
  },
  async bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let dtV = e.detail.value
    this.setData({
      multiIndex: e.detail.value
    })
    let params = {
      allowMessageTime: `${dtV[0]}:00,${dtV[1]}:00`,
      userId: this.data.userId
    }
    const res = await setNotification(params)
    if (res.code != 200) return showToast(res.msg)
    showToast('设置成功')
  },
  bindMultiPickerColumnChange: function (e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    this.setData(data);
  },
})