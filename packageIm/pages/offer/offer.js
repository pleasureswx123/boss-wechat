const app =  getApp();
import { offerRecord,messageChatDetail } from "../../../http/api";
import {formatDate } from "../../../utils/util"
let msgType = require("../../../utils/imUtils/msgtype");
Page({
    data: {
        imImages:app.globalData.imImages,
        statusBarHeight: app.globalData.statusBarHeight,
        baseImageUrl: app.globalData.baseImgUrl,
        navBarHeight: app.globalData.navBarHeight
    },

    onLoad(options) {
        let offerRecordId=options.offerRecordId
        this.setData({
            offerRecordId:offerRecordId
        })
        this.getofferRecord(offerRecordId)
    },
    goBack(){
        wx.navigateBack()
    },
    getofferRecord(offerRecordId){
        offerRecord(offerRecordId).then(res=>{
            if(res.code==200){
                this.setData({
                    offerInfo : res.data,
                    state : res.data.offerStatus,
                    targetName : res.data.jobSeekerInfoResult.jobSeekerName,
                    postName : res.data.positionName,
                    companyName : res.data.recruiterInfoResult.companyName,
                    companyLogo : res.data.recruiterInfoResult.companyLogo,
                    recruiterName : res.data.recruiterInfoResult.recruiterName,
                    recruiterAvatar : res.data.recruiterInfoResult.recruiterAvatar,
                    currentTime:formatDate(res.data.createTime,'Y-M-D')
                })
                
            }
        })
    },
    //offer同意
    sendofferAgree() {
      this.setData({
          customType: 'offer_agree'
      })
      var customExts = {
        offerRecordId: this.data.offerRecordId
      }
      this.sendApi(customExts)
  },
     //offer拒绝
     sendofferReject() {
        this.setData({
            customType: 'offer_refuse'
        })
        var customExts = {
          offerRecordId: this.data.offerRecordId
        }
        this.sendApi(customExts)
    },
    setParams(customExts, extMsg) {
      let params = {
          body: {
              customEvent: this.data.customType,
              customExts: customExts || {}
          },
          ext: extMsg || {
              targetUserIds:this.data.offerInfo.recruiterInfoResult.recruiterId,
              publishPostId:this.data.offerInfo.positionId,
              fromUserId:this.data.offerInfo.jobSeekerInfoResult.jobSeekerId,
              fromUserDignity: 1
          },
          from: this.data.offerInfo.jobSeekerInfoResult.jobSeekerHxUsername,
          targetType: "users",
          to: [
              this.data.offerInfo.recruiterInfoResult.recruiterHxUsername
          ],
          type: msgType.CUSTOM
      };
      return params
  },
    sendApi(customExts, extMsg) {
      let that = this
      // 发送自定义消息
      let params = this.setParams(customExts, extMsg)
      messageChatDetail(params).then(res => {
          if (res.code == 200) {
              console.log('发送成功')
              wx.navigateBack()
              params.msgId = res.data.hxMsgId
              wx.$event.emit('sendMsg',params)
              wx.$event.emit('getStatus',params)
          } else {
              showToast(res.msg)
          }
      })
  },
})