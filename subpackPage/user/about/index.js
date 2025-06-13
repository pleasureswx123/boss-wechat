// import {
//     getPlatform
// } from '../../../http/api.js'
import { getAllTag ,cancelRedis} from '../../../http/versions'
var app = getApp()
Page({
  data: {
    list: [{
      name: '用户服务协议',
      type: 1,
      typeStr: 'userServiceAgreement',
      userServiceAgreement: null,
      flag: false
    }, {
      name: '用户隐私协议',
      type: 2,
      typeStr: 'userPrivacyAgreement',
      userPrivacyAgreement: null,
      flag: false
    }, {
      name: '营业执照',
      type: 3,
      typeStr: 'businessLicense',
      businessLicense: null,
      flag: false
    }, {
      name: '人力资源许可证',
      type: 4,
      typeStr: 'humanResourcesLicense',
      humanResourcesLicense: null,
      flag: false
    }],
    logo: '',
    imageUrl: app.globalData.baseImgUrl, //图片路径
  },

  goToDetail(e) {
    let param = e.currentTarget.dataset.index
    let typeIndex = e.currentTarget.dataset.typeindex
    let myWallet = e.currentTarget.dataset.mywallet
    let _isValue = this.data.list[typeIndex].typeStr
    let that = this
    this.setData({ myWallet })
    // wx.navigateTo({
    //   url: `../customer/detail?param=${param}`,
    // })
    wx.navigateTo({
      url: `/subpackPage/index/webFile/index?type=${param}`,
      success: (res) => {
        console.log(res, '跳转成功', _isValue)
        if (_isValue) {
          that.cancelTag()
        }
      }
    })
  },
  // 获取更新红点
  async newNoticeTag() {
    const res = await getAllTag(this.data.wayType)
    console.log(res, '红点关于')
    let _list = this.data.list.map(item=>{
      if(res.data[item.typeStr]){
        item[item.typeStr] = res.data[item.typeStr]
      }
      item.flag = res.data[item.typeStr] ? true : false
      return {...item}
    })
    this.setData({list: _list})
  },
  // 取消tag红点
  async cancelTag() {
    let myWallet = this.data.myWallet
    const res = await cancelRedis(myWallet)
  },

  onLoad(options){
    if (options.wayType && options.wayType !== 'null' && options.wayType !== 'undefined') {
      this.setData({
        wayType: options.wayType
      })
    }
  },
  onShow(){
    this.newNoticeTag()
  }
})