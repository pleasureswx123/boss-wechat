const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemObj: {
      type: Object,
      default: () => ({})
    },
    statusResult: {
      type: Object,
      default: () => ({})
    },
    hhInfo: {
      type: Object,
      default: () => ({})
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imageUrl: app.globalData.imImages,
    baseImgUrl: app.globalData.baseImgUrl,
    avatar: wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.avatar,
    defaultImage: '?x-oss-process=image/resize,w_100/quality,q_50' // 图片压缩
  },
  /**
   * 组件的方法列表
   */
  methods: {
    lookInterView(e) {
      let interviewRecordId = this.data.itemObj.msg.customExts.interviewRecordId
      wx.navigateTo({
        url: `/packageIm/pages/interview/interview?interviewRecordId=` + interviewRecordId
      })
    },
    lookLy(e) {
      console.log('查看录用TA')
      let offerRecordId = this.data.itemObj.msg.customExts.offerRecordId
      let offerStatus = this.data.statusResult.offerStatus
      wx.navigateTo({
        url: `/packageIm/pages/offer/offer?offerRecordId=` + offerRecordId + `&offerStatus=` + offerStatus
      })
    },
    // 详情(求职者为个人简历/招聘者为当前职位详情数据)
    gotoDetail(event) {
      console.log(this.data.hhInfo, '00::::::::::::')
      // type (1为点击的求职者头像/2为点击的招聘者头像)
      let { type } = event.currentTarget.dataset
      console.log(type, '::::::::::::::')
      let page = ``
      if (type == 1) {
        page = `/subpackPage/user/resume/resume`
      } else {
        let postId = this.data.hhInfo.publishPostId
        let bossuserid = this.data.hhInfo.targetUserIds
        page = `/subpackPage/index/job_detail/index?postId=${postId}&bossuserid=${bossuserid}&formType="1"`
      }
      wx.navigateTo({
        url: page
      })
    },
    //重新编辑
    resetEdit(event) {
      let { text } = event.currentTarget.dataset
      wx.$event.emit('sendAddrReply', text)
    }
  }
})
