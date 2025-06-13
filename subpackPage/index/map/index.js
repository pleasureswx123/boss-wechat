var app = getApp()
import {apiGetAddress } from '../../../http/index'
const INIT_MARKER = {
  // callout: {
  //   content: '',
  //   padding: 10,
  //   borderRadius: 2,
  //   display: 'ALWAYS'
  // },
  id: 0,
  latitude: '',
  longitude: '',
  width: '16px',
  height: '34px',
  iconPath: 'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/index_img/location1.png',
  // rotate: 0,
  // alpha: 1
};
Page({
  data: {
    latitude: null,
    longitude: null,
    mapContext: null,
    baseImageUrl: app.globalData.baseImgUrl,
    markers: [{
      ...INIT_MARKER
    }],
    type: 1,
    addressObj: {}, // 地址信息
  },
  // 获取当前map组件实例对象
  mapContext() {
    let that = this
    let mapContext = wx.createMapContext('gcMap', that)
    this.setData({
      mapContext: mapContext
    })
    console.log(mapContext, 'map')
    // that.setLocMarkerIcon()
    that.moveToLocation()
  },
  // 设置标点图片
  setLocMarkerIcon() {
    this.data.mapContext.setLocMarkerIcon({
      iconPath: `https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/index_img/location1.png`,
      complete: function (res) {
        console.log(res)
      }
    })
  },
  // 地图中心移置当前定位点
  moveToLocation() {
    this.data.mapContext.moveToLocation({
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      success: function (res) {
        console.log(res, '移动')
      }
    })
  },
  // 拉起地图APP选择导航
  openMapApp() {
    console.log(this.data.latitude, this.data.longitude, '定位')
    this.data.mapContext.openMapApp({
      latitude: Number(this.data.latitude),
      longitude: Number(this.data.longitude),
      // destination: this.data.info.corporationName,
      destination: this.data.info.postAddress,
      success: function (res) {
        console.log(res, '拉起地图APP选择导航')
      }
    })
  },
  onLoad(options) {
    let params = JSON.parse(options.param)
    console.log(params)
    this.setData({
      info: params,
      latitude: params.latitude,
      longitude: params.longitude,
      ['markers[0].latitude']: params.latitude,
      ['markers[0].longitude']: params.longitude
    })
    if (options.type && options.type !== 'null' && options.type !== 'undefined') {
      this.setData({
        type: options.type
      })
    }
    this.mapContext()
    this.apiGetAddressFn()
  },
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        scale: true,
        active: true
      })
    } else {
      this.setData({
        scale: false,
        active: false
      })
    }
  },
  async apiGetAddressFn(){
    let params = {
      lon: this.data.longitude,
      lat: this.data.latitude
    }
    const result = await apiGetAddress(params)
    if(result.code !== 200) return
    console.log(result,'result')
    this.setData({
      addressObj: result.data
    })
  }
})
