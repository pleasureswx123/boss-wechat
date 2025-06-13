// subpackPage/user/setup/noticeDetail/index.js
import { notification, setNotification } from '../../../../http/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstPhone: '',
    lastPhone: '',
    multiArray: [[], []],
    multiIndex: [7, 23],
    checked: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setTimeArr()
    this.setData({ userId: wx.getStorageSync('userInfo').info.userId })
    notification(this.data.userId).then(res => {
      console.log(res, '22222222222')
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
        })
        return
      }
      this.setData({ checked: res.data.recommendPosition == 1 ? true : false })
    })
  },
  async Chenge(e) {
    var param = e.currentTarget.dataset.type
    this.setData({ checked: !this.data.checked })
    let params = {
      [param]: this.data.checked ? 1 : 0,
      userId: this.data.userId
    }
    const res = await setNotification(params)
    if (res.code != 200) return showToast(res.msg)
    if (this.data.checked == 1) {
      wx.showToast({
        title: '开启成功',
        icon: 'none',
      })
    } else {
      wx.showToast({
        title: '关闭成功',
        icon: 'none',
      })
    }
  },
  // 时间段
  setTimeArr(number) {
    let arr = []
    let arr1 = []
    let _number = number || 23
    for (let i = 0; i <= _number; i++) {
      arr.push({ num: i, name: i + ':00' })
    }
    arr1[0] = arr
    arr1[1] = arr
    this.setData({
      multiArray: arr1
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let dtV = e.detail.value
    this.setData({
      multiIndex: e.detail.value
    })
    // setAllowPhoneTime({ startTime: dtV[0] + ':00', endTime: dtV[1] + ':00' }).then(res => {
    //   if (res.code == 200) {
    //     showToast('修改成功')
    //   }
    // })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    console.log(data.multiIndex);
    this.setData(data);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 操作一条系统通知为已读
  // getSystemDetail(id) {
  //   getSystemDetail(id).then(res => {
  //     // console.log(res,'数据')
  //     if (res.code !== 200) return showToast(res.msg)
  //   })
  // },
})