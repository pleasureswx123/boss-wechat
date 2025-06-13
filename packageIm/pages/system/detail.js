import { getSystemDetail } from '../../../http/api'
import {viewActivityDetails} from '../../../http/versions'
var app = getApp()
Page({
  data: {
    title: '',
    content: '',
    id: null,
    type: null,
    notificationId: null,
    imageUrl: app.globalData.baseImgUrl, //图片路径
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
  },
  onLoad(options) {
    this.setData({
      id: options.id,
      type: options.type
    })
    if (options.notificationId !== 'null' && options.notificationId !== 'undefined') {
      this.setData({
        notificationId: options.notificationId
      })
    }
    this.getSystemDetail()
  },
  goBack() {
    wx.navigateBack()
  },
  async getSystemDetail() {
    if (this.data.type == 1) {
      let params = {
        activityId: this.data.id,
        id: this.data.notificationId ? this.data.notificationId : ''
      }
      const res = await viewActivityDetails(params)
      console.log(res,'平台活动补贴规则')
      let info=res.data.content
      info = info
          .replace(/<p([\s\w"=\/\.:;]+)((?:(style="[^"]+")))/ig, '<p')
          .replace(/<p([\s\w"=\/\.:;]+)((?:(class="[^"]+")))/ig, '<p')
          .replace(/<p>/ig, '<p class="p_class">')

          .replace(/<img([\s\w"-=\/\.:;]+)((?:(height="[^"]+")))/ig, '<img$1')
          .replace(/<img([\s\w"-=\/\.:;]+)((?:(width="[^"]+")))/ig, '<img$1')
          .replace(/<img([\s\w"-=\/\.:;]+)((?:(style="[^"]+")))/ig, '<img$1')
          .replace(/<img([\s\w"-=\/\.:;]+)((?:(alt="[^"]+")))/ig, '<img$1')
          .replace(/<img([\s\w"-=\/\.:;]+)/ig, '<img$1 class="pho"')
      this.setData({
        content: info
      })
      wx.setNavigationBarTitle({
        title: '平台活动补贴规则'
      })
    } else {
      getSystemDetail(this.data.id).then(res => {
        if (res.code == 200) {
          this.setData({
            content: res.data.content
          })
          wx.setNavigationBarTitle({
            title: res.data.title
          })
        }
      })
    }
  },
})