// components/infomationList/infomationList.js
var app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataList: Array,
    value: [],
    token: {
      type: String,
      value: null,
      observer: function (newVal) {
        console.log(newVal, 'token')
      }
    },
    nearBy: {
      type: Boolean,
      value: false
    },
    isShowTime: {
      type: String,
      value: 0
    },
  },
  lifetimes: {
    attached() {
      let versions = wx.getStorageSync('versions')
      this.setData({
        versions: versions
      })
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    defaultImage: '?x-oss-process=image/resize,w_80/quality,q_50',
    baseImageUrl: app.globalData.baseImgUrl,
    imageUrl: app.globalData.imImages,
    versions: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 职位详情
    jump(event) {
      // if(!wx.getStorageSync('token')) {
      //     this.triggerEvent('showLogin')
      //     return
      // }
      // 当前点击的这一项的id和bossid
      let { bossuserid, id, distance } = event.currentTarget.dataset
      console.log(id, bossuserid, distance)
      wx.navigateTo({
        url: `/subpackPage/index/job_detail/index?postId=${id}&bossuserid=${bossuserid}`,
      })
    }
  }
})
