const app = getApp();
import { getMsgUserInfo, updateCustomMsgStatus, resumeFileList } from '../../../../../http/api'
import { showToast } from '../../../../../utils/util'
var amapFile = require('../../../../../libs/amap-wx.js')
Component({
  properties: {
    type: {
      type: String
    },
    itemObj: {
      type: Object,
      observer: function (newVal) {
        if (newVal.msg.customEvent == 'card_work_address') {
          let lon = newVal.msg.customExts.longitude
          let lat = newVal.msg.customExts.latitude
          this.creaMapImgFn(lon, lat)
        }
      }
    },
    statusResult: {
      type: Object
    },
    hhInfo: {
      type: Object
    },
  },

  data: {
    imageBaseUrl: app.globalData.baseImgUrl,
    imImages: app.globalData.imImages,
    userInfo: {},
    jobTag: null,
    myWechat: null
  },
  lifetimes: {
    attached: function () {
      // console.log(this.data.itemObj.customExts,'1111111111:::::::::::::::')
      console.log(this.data.itemObj,'this.data.itemObj')
      // 在组件实例进入页面节点树时执行
      this.getMsgUserInfo()
      // if (this.data.itemObj.msg.customEvent == 'change_job') {
      //   let _jobTag = this.data.itemObj.msg.customExts.jobTitleTag && this.data.itemObj.msg.customExts.jobTitleTag.split(',')
      //   this.setData({
      //     jobTag: _jobTag
      //   })
      // }
      let _jobTag = this.data.itemObj.msg.customExts.jobTag && this.data.itemObj.msg.customExts.jobTag.split(',')
        this.setData({
          jobTag: _jobTag
        })
      this.setData({
        myWechat: wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.wechat
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  methods: {
    downloadImage: function (e) {
      const url = e.currentTarget.dataset.url;
      wx.previewImage({
        urls: [url] // 需要预览的图片列表
      })
      // wx.downloadFile({
      //   url: url,
      //   success: function (res) {
      //     if (res.statusCode === 200) {
      //       // 下载成功，可以将文件保存到本地
      //       wx.showToast({
      //         title: '二维码保存成功',
      //         icon:'none'
      //       })
      //     } else {
      //       // 下载失败
      //     }
      //   }
      // });
    },
    //获取用户信息
    getMsgUserInfo() {
      if (this.data.hhInfo && this.data.hhInfo.targetUserIds) {
        getMsgUserInfo(this.data.hhInfo.targetUserIds).then(res => {
          this.setData({
            userInfo: res.data
          })
        })
      }
    },
    // 复制文本到粘贴板
    copy(e) {
      let value = e.currentTarget.dataset.value
      //提示模板
      wx.showModal({
        content: value, //模板中提示的内容
        confirmText: '复制内容',
        success: (res) => { //点击复制内容的后调函数
          if (res.confirm) {
            wx.setClipboardData({
              data: value, //要被复制的内容
              success: () => { //复制成功的回调函数
                console.log('复制成功')
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      });
    },
    call(e) {
      let phone = e.currentTarget.dataset.value
      wx.makePhoneCall({
        phoneNumber: phone,
        success: function () {
          // wx.showToast({
          //     title: '拨打电话成功！',
          // })        
        },
        fail: function () {
          // wx.showToast({
          //     title: '拨打电话失败！',
          //     icon: "none"
          // })    
        }
      })
    },
    //查看红包
    goLookBtn(){
      wx.navigateTo({
        url: '/subpackPage/user/wanted/index',
      })
    },
    //去申诉
    goSs(){
      console.log('去申诉')
      let interviewRecordId = this.data.itemObj.msg.customExts.interviewRecordId
      wx.$event.emit('redAppealEvent',interviewRecordId)
    },
    //查看面试
    lookMs() {
      console.log('查看面试')
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
    reject(e) {
      console.log('拒绝')
      if (this.data.type == 'phone') {
        // if(this.data.statusResult.exchangePhoneStatus!=1) return
        this.setData({
          customType: 'exchange_phone_refuse',
          ['statusResult.exchangePhoneStatus']: 0
        })
        let msgId = e.currentTarget.dataset.msgid
        let param = {
          customMsgStatus: 2,
          hxMsgId: msgId
        }
        wx.$event.emit('resetMsg', msgId)
        this.updateCustomMsgStatus(param)
      } else if (this.data.type == 'chat') {
        //if(this.data.statusResult.exchangeWechatStatus!=1) return
        this.setData({
          customType: 'exchange_wechat_refuse',
          ['statusResult.exchangeWechatStatus']: 0
        })
        let msgId = e.currentTarget.dataset.msgid
        let param = {
          customMsgStatus: 2,
          hxMsgId: msgId
        }
        wx.$event.emit('resetMsg', msgId)
        this.updateCustomMsgStatus(param)
      } else if (this.data.type == 'file') {
        this.setData({
          customType: 'request_resume_refuse'
        })
        let msgId = e.currentTarget.dataset.msgid
        wx.$event.emit('resetMsg', msgId)
        let param = {
          customMsgStatus: 2,
          hxMsgId: msgId
        }
        this.updateCustomMsgStatus(param)
      }
      wx.$event.emit('sendCustomMsg', { customType: this.data.customType })
      //this.sendCommit()
    },
    async agree(e) {
      console.log('同意')
      if (this.data.type == 'phone') {
        //if(this.data.statusResult.exchangePhoneStatus!=1) return
        this.setData({
          customType: 'exchange_phone_agree',
          ['statusResult.exchangePhoneStatus']: 2
        })
        let msgId = e.currentTarget.dataset.msgid
        let param = {
          customMsgStatus: 2,
          hxMsgId: msgId
        }
        wx.$event.emit('resetMsg', msgId)
        this.updateCustomMsgStatus(param)
      } else if (this.data.type == 'chat') {
        //是否有微信号
        if (!this.data.myWechat) {
          showToast('请前往个人中心设置可交换二维码')
          return
        }
        //if(this.statusResult.exchangeWechatStatus!=1) return
        this.setData({
          customType: 'exchange_wechat_agree',
          ['statusResult.exchangeWechatStatus']: 2
        })
        let msgId = e.currentTarget.dataset.msgid
        let param = {
          customMsgStatus: 2,
          hxMsgId: msgId
        }
        wx.$event.emit('resetMsg', msgId)
        this.updateCustomMsgStatus(param)
      } else if (this.data.type == 'file') {
        this.setData({
          customType: 'request_resume_agree',
        })
        const { code, data, msg } = await resumeFileList({ type: 0 })
        if (code == 200)
          data.map(item => {
            item.size = (item.size / 1048576).toFixed(2)
            item.updateTime = item.updateTime.substr(0, 10)
          })
        if (data.length > 0) {
          //同意之后调用发送简历方法
          let msgId = e.currentTarget.dataset.msgid
          wx.$event.emit('sendFileArgee', { msgId: msgId, jlList: data })
        } else {
          wx.showModal({
            content: '请先去添加附件简历',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/subpackPage/user/resumeAnnex/resumeAnnex'
                })
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        }
        return
      }
      wx.$event.emit('sendCustomMsg', { customType: this.data.customType })
    },
    //修改消息状态
    updateCustomMsgStatus(param) {
      updateCustomMsgStatus(param).then(res => {
        if (res.code == 200) {
          console.log('状态已修改')
        }
      })
    },
    //职位跳转链接
    goToPostDetail(e) {
      // let obj = e.currentTarget.dataset.item
      console.log(this.data.hhInfo, '7777')
      let {targetUserIds,publishPostId,jobId} = this.data.hhInfo
      // let _targetUserIds = obj.fromUserId
      // obj.msg.customExts.jobId
      console.log(targetUserIds,publishPostId, '99999')
      let _publishPostId = publishPostId || jobId
      wx.navigateTo({
        url: `/subpackPage/index/job_detail/index?postId=` + _publishPostId + `&bossuserid=` + targetUserIds + `&formType=1`
      })
    },
    //发送地址消息
    sendaddrMsg(e) {
      let obj = e.currentTarget.dataset
      let msgId = obj.msgid
      let type = obj.type
      wx.$event.emit('resetMsg', msgId)
      if (type == 1) {
        console.log('暂不考虑')
        let param = {
          customMsgStatus: 2,
          hxMsgId: msgId
        }
        this.updateCustomMsgStatus(param)
        wx.$event.emit('sendAddrReply', '暂不考虑')
      } else {
        console.log('可以接受')
        let param = {
          customMsgStatus: 1,
          hxMsgId: msgId
        }
        this.updateCustomMsgStatus(param)
        wx.$event.emit('sendAddrReply', '可以接受')
      }
    },

    // 去地图导航页面
    gotoMapNavigation(event) {
      let _msg = event.currentTarget.dataset.msg
      let param = {
        postAddress: _msg.customExts.address,
        latitude: _msg.customExts.latitude,
        longitude: _msg.customExts.longitude,
        // corporationName: this.data.postDetailInfo.corporationName
      }
      wx.navigateTo({
        url: `/subpackPage/index/map/index?param=${JSON.stringify(param)}&type=2` 
      })
    },

    // 初始化地图第一帧图片链接
    creaMapImgFn(lon, lat) {
      var myAmapFun = new amapFile.AMapWX({ key: 'e2aa80247b4bd8dc47dfc12728480744' });
      let that = this
      let _itemObj = this.data.itemObj
      myAmapFun.getStaticmap({
        location: lon + ',' + lat,
        zoom: 14,
        size: '247*150',
        scale: 2,
        markers: `-1,https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/index_img/location1.png,0:` + lon + ',' + lat,
        success: function (data) {
          _itemObj.msg.customExts.src = data.url
          that.setData({
            itemObj: _itemObj
          })
        },
        fail: function (info) {
          wx.showModal({ title: info.errMsg })
        }
      })
    }
  }
})
