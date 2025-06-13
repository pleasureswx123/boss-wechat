// packageIm/comps/chat/msglist/type/topTip/topTip.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    userInfo: {
      type: Object,
      value: {},
    },
    statusResult: {
      type: Object,
      default: () => ({})
    },
    follow: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showBox: 1,
    baseImageUrl: app.globalData.baseImgUrl,
    imImages: app.globalData.imImages,
    isEmptyStatusResult:false
  },
  lifetimes: {
    attached(){
      console.log(this.data.statusResult,'对象')
      if(Object.keys(this.data.statusResult).length == 0){
        this.setData({
          isEmptyStatusResult: true
        })
      } else {
        this.setData({
          isEmptyStatusResult: false
        })
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    setShowBox() {
      this.setData({
        showBox: 0
      })
    },
    goPage() {
      console.log('去查看状态页面', this.data.statusResult.interviewStatus)
      let interviewStatus = this.data.statusResult.interviewStatus
      let interviewRecordId = this.data.statusResult.interviewRecordId
      wx.navigateTo({
        url: `/packageIm/pages/interview/interview?interviewStatus=` + interviewStatus + `&interviewRecordId=` + interviewRecordId
      })
    },
    setBlock() {
      wx.navigateTo({
        url: '/packageIm/pages/setChat/setChat?userInfo=' + JSON.stringify(this.data.userInfo)
      })
    },
    // 开启公众号
    openPublicAccount() {
      // wx.navigateTo({
      //   url: `/packageIm/pages/publicAccount/publicAccount`,
      // })
      wx.navigateTo({
        url: `/subpackPage/versions/webview/webview?type=1`,
      })
    }
  }
})
