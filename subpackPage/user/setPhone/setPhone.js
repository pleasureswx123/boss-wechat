import { getAllowPhoneTime, setAllowPhoneTime, setUserContactMeWay, getUserContactMeWay } from '../../../http/versions'
import { getSystemDetail } from '../../../http/api'
import { showToast } from '../../../utils/util'
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
    let phone = wx.getStorageSync('userInfo').info.phone
    let firstPhone = phone.substr(0, 3)
    let lastPhone = phone.substr(-4)
    this.setData({
      firstPhone,
      lastPhone
    })
    this.setTimeArr()
    this.getPhoneTime()
    this.getContactMeWay()


    if (options.id && options.id != 'null' && options.id != 'undefined') {
      this.getSystemDetail(options.id)
    }
  },
  async Chenge() {
    this.setData({ checked: !this.data.checked })
    let _status = this.data.checked ? 1 : 0
    const res = await setUserContactMeWay({ status: _status })
    if (res.code !== 200) return showToast(res.msg)
    if (_status == 1) {
      showToast('虚拟电话开启成功')
    } else {
      showToast('虚拟电话关闭成功')
    }
  },
  // 获取联系我的方式
  async getContactMeWay() {
    const res = await getUserContactMeWay()
    console.log(res, '00000')
    if (res.code != 200) return showToast(res.msg)
    this.setData({ checked: res.data ? true : false })
  },
  // 获取联系我的方式
  async getPhoneTime() {
    const res = await getAllowPhoneTime()
    console.log(res, '00000')
    if (res.code != 200) return showToast(res.msg)
    this.setData({ multiIndex: [Number(res.data.startTime.split(':')[0]), Number(res.data.endTime.split(':')[0])], multiObject: res.data })
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

  goEdit() {
    wx.navigateTo({
      url: '/subpackPage/user/setup/account/phone',
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let dtV = e.detail.value
    this.setData({
      multiIndex: e.detail.value
    })
    setAllowPhoneTime({ startTime: dtV[0] + ':00', endTime: dtV[1] + ':00' }).then(res => {
      if (res.code == 200) {
        showToast('修改成功')
      }
    })
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
  getSystemDetail(id) {
    getSystemDetail(id).then(res => {
      // console.log(res,'数据')
      if (res.code !== 200) return showToast(res.msg)
    })
  },
})