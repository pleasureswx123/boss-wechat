const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    chatMsg: {
      type: Array,
      observer: (newVal)=>{
        console.log(newVal, 'newValnewValnewVal')
      }
    },
    statusResult: {
      type: Object
    },
    username: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    longressMsgId: '',
    imageUrl: app.globalData.imImages,
    baseImgUrl: app.globalData.baseImgUrl,
    avatar: wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.avatar,
    defaultImage: '?x-oss-process=image/resize,w_100/quality,q_50', // 图片压缩
  },
  /**
   * 组件的方法列表
   */
  methods: {
    previewImage(event) {
      console.log(this.data.chatMsg, '000')
      let _urls = []
      this.data.chatMsg.map(item=>{
        if(item.msg.type == 'img'){
          _urls.push(item.msg.data)
        }
      })
      var url = event.currentTarget.dataset.url;
      wx.previewImage({
        urls: _urls, // 需要预览的图片 http 链接列表
        current: url
      });
    },
    bingLongTap(event) {
      var msg = event.currentTarget.dataset.msg;
      let long = new Date().getTime() - new Date(msg.time).getTime();
      if (Math.floor(long / 1000 / 60) < 2) {
        this.setData({
          longressMsgId: msg.msgId
        })
      }
    },
    bingcancelTap(event) {
      console.log(event, '00::::::::::::')
      this.setData({
        longressMsgId: ''
      })
    },
    // 详情(求职者为个人简历/招聘者为当前职位详情数据)
    gotoDetail(event) {
      // type (1为点击的求职者头像/2为点击的招聘者头像)
      let { type } = event.currentTarget.dataset
      console.log(this.data.username,'00000')
      let page = ``
      if (type == 1) {
        page = `/subpackPage/user/resume/resume`
      } else {
        page = `/subpackPage/index/job_detail/index?postId=${this.data.username.publishPostId}&bossuserid=${this.data.username.targetUserIds}`
      }
      wx.navigateTo({
        url: page
      })
    },
    sendReCall(event) {
      //发送撤回消息
      let msg = event.currentTarget.dataset.msg;
      this.triggerEvent('sendMsgRecall', JSON.stringify(msg))
    },
    // 图片加载成功
    onImageLoad(event) {
      const { detail } = event;
      if (detail.width > 0 && detail.height > 0) {
        console.log('加载成功')
      }
    },
    // 图片加载失败
    onImageError() {
      console.log('加载失败')
    }
  }
})
