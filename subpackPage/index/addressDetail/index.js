// subpackPage/index/addressDetail/index.js
import { seekerCollectAddress } from '../../../http/index'
import { showToast } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressId: '',
    addressName: '',
    lon: '',
    lat: '',
    addressValue: '', // 编辑详情地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, '0000')
    if (options.id) {
      this.setData({
        addressId: options.id
      })
      this.seekerCollectAddressDetail(1)
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  // 返回
  back() {
    const eventChannel = this.getOpenerEventChannel()
    if(eventChannel){
      eventChannel.emit('someEvent');
    }
    wx.navigateBack({ delta: 1 })
  },
  // 跳转地图
  gotoAddressMap() {
    let that = this
    wx.navigateTo({
      url: `/subpackPage/index/addressMap/index`,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        someEvent: function (data) {
          console.log(data, '7777')
          if (data) {
            that.setData({
              addressName: data.name,
              addressValue: '',
              lon: data.location.split(',')[0],
              lat: data.location.split(',')[1],
            })
          }
        }
      },
    })
  },
  async seekerCollectAddressDetail(index) {
    let params = {
      id: this.data.addressId
    }
    let res = await seekerCollectAddress(params, index)
    if (res.code !== 200) return
    this.setData({
      addressName: res.data.title,
      addressValue: res.data.details,
      lon: res.data.lon,
      lat: res.data.lat,
    })
  },
  // 地址编辑保存
  confirmSave() {
    // 修改
    if (this.data.addressId) {
      this.seekerCollectAddressUpdata(3)
    } else {
      // 新增
      this.seekerCollectAddressUpdata(2)
    }
  },

  input(event) {
    this.setData({
      addressValue: event.detail.value
    })
  },

  // 修改地址
  async seekerCollectAddressUpdata(index) {
    let params = {
      details: this.data.addressValue,
      title: this.data.addressName,
      lon: this.data.lon,
      lat: this.data.lat,
      id: this.data.addressId
    }
    if (!params.title) return showToast('请选择工作地点')
    // if(!params.details) return showToast('请输入地址详情')
    let res = await seekerCollectAddress(params, index)
    if (res.code !== 200) return
    this.back()
  }
})