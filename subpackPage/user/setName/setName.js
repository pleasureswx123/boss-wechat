import { updateNick, changeNickCount } from '../../../http/api'
import { showToast } from '../../../utils/util'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    base: 0,
    leave: 0,
    baseImageUrl: app.globalData.baseImgUrl,
    clearable: false
  },
  confirmValue(event) {
    if (event.detail.value.length == 15) {
      showToast('名称格式超出限制')
    }
    this.setData({
      name: event.detail.value
    })
  },
  goBtn() {
    let { nickName } = wx.getStorageSync('userInfo').info
    if (nickName == this.data.name) {
      showToast('姓名和上一次相同')
      return
    } else {
      updateNick({ nickName: this.data.name, first: this.data.first }).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '修改成功',
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1000);
        }
      });
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, '传递')
    let _first = true
    let _clearable = true
    if (options.val !== '') {
      _first = false
    }
    this.setData({
      name: options.val,
      first: _first,
      clearable: _clearable
    })
    this.getCount()
  },
  getCount() {
    changeNickCount().then(res => {
      if (res.code == 200) {
        this.setData({
          base: res.data.base,
          leave: res.data.leave
        })
      }
    })
  },
  clearCont() {
    this.setData({
      name: '',
      clearable: false
    })
  }
})