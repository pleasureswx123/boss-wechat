const app = getApp();
import Dialog from '@vant/weapp/dialog/dialog';
import { showToast, timesDiff, getDistance, formatDate, getTimeFormater } from "../../../utils/util"
import { messageChatDetail, getInterviewRecord,agreeInterview } from "../../../http/api";
import { appealSave } from "../../../http/user"
let msgType = require("../../../utils/imUtils/msgtype");
import {
  interviewRecord,
  rmInvite,
  rmresult
} from '../../../http/api.js'
import {
  ossUpload
} from '../../../miniprogram-6/utils/oss.js'
Page({
  data: {
    imImages: app.globalData.imImages,
    baseImgUrl: app.globalData.baseImgUrl,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    active: 1,
    steps: [
      {
        text: '接受面试',
        desc: '已接受面试，预祝面试顺利'
      },
      {
        text: '面试签到',
        // desc: '到达面试地点，面试过程中有任何问题可以<span style="color:red">投诉</span><br />'
        // desc: '面试过程中有任何问题可以<span style="color:red">投诉</span><br />'
        desc: `面试过程中有任何问题可以 <span style="color:red">投诉</span><br />`
      },
      {
        text: '面试结束',
        // desc: '面试过程中，如有任何问题您可以<span style="color:red">投诉</span>'
        desc: '点击「获取面试结果」催促面试官尽快反馈'
      },
      {
        text: '面试结果',
        // desc: '完成面试后 30 天内您可向招聘官获取面试结果'
        desc: '反馈面试结果后，立即发放面试红包'
      },
    ],
    resultType: 1,
    askResult: null,
    showTip: true,
    showYq: false,
    isShenSu: false,
    ImageArr: [],
    despText: '',
    interviewRecordList: [], // 求职者面试记录
    showInterviewRecordList: [], // 页面中展示的
    showInterviewRecord:false, // 弹窗展示面试记录
  },
  closeShowYq() {
    this.setData({
      showYq: false
    })
  },
  onClose() {
    this.setData({
      isShenSu: false
    })
  },
  goSs() {
    this.setData({
      isShenSu: true
    })
  },
  makeCall(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.contact,
    })
  },
  //文本框输入数量内容
  textareaInput(e) {
    this.setData({
      despText: e.detail.value
    })
  },
  //上传图片
  uploadImage() {
    var that = this
    let userId = wx.getStorageSync('userInfo').info.userId
    let _length = 3 - this.data.ImageArr.length
    wx.chooseMedia({
      count: _length,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFiles = res.tempFiles
        var imageList = that.data.ImageArr
        for (let i = 0; i < tempFiles.length; i++) {
          console.log(tempFiles[i])
          const result = await ossUpload(tempFiles[i].tempFilePath, 'image', userId)
          imageList.push(result.full)
        }
        that.setData({
          ImageArr: imageList
        })
      }
    })
  },
  //删除上传的图片
  removeImage(e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    let imgArr = this.data.ImageArr
    var imageList = imgArr.splice(0, 1)
    console.log(imageList)
    this.setData({
      ImageArr: imgArr
    })
  },
  appealSave() {
    let params = {
      imgUrls: this.data.ImageArr.join(","),
      interviewRecordId: this.data.interviewRecordId,
      reasonContent: this.data.despText,
      typeId: 1
    }
    appealSave(params).then(res => {
      if (res.code == 200) {
        showToast('申诉成功')
        setTimeout(() => {
          this.onClose()
        }, 500)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      interviewStatus: options.interviewStatus,
      interviewRecordId: options.interviewRecordId
    })
    if (options.comeFrom) {
      this.setData({
        comeFrom: options.comeFrom
      })
    }
    this.getInterviewRecord()
    this.rmInvite(options.interviewRecordId)
    this.rmresult(options.interviewRecordId)
  },
  closeTip() {
    this.setData({
      showTip: false
    })
  },
  //通过面试id获取面试信息
  getInterviewRecord() {
    let me = this
    interviewRecord(this.data.interviewRecordId).then(res => {
      console.log(res,'sssssssss')
      let _msInfo = res.data
      this.msInfo = _msInfo
      let _interviewStatus = res.data.interviewRecordResult.interviewStatus
      let _signInType = res.data.interviewRecordResult.signInType
      let _interviewRecordResult = res.data.interviewRecordResult
      let _appealStatus = res.data.interviewRecordResult.appealStatus
      let _interviewTimeFormat = res.data.interviewRecordResult.interviewEndTime ? formatDate(res.data.interviewRecordResult.interviewTime, 'Y-M-D h:m') + '-' + formatDate(res.data.interviewRecordResult.interviewEndTime, "h:m") : formatDate(res.data.interviewRecordResult.interviewTime, 'Y-M-D h:m')
      let _interviewTime = getTimeFormater(res.data.interviewRecordResult.interviewTime)
      let _askResult = res.data.interviewRecordResult.askResult  //是否询问面试结果
      let _resultType = res.data.interviewRecordResult.resultType  //面试结果
      let _signInConfirm = res.data.interviewRecordResult.signInConfirm
      let _current = 0
      if (_interviewStatus == 4 && _signInType == 1) {
        _current = 1
      } else if (_interviewStatus == 6) {
        _current = 2
      } else if (_interviewStatus == 7) {
        _current = 3
      }
      if(_interviewRecordResult.redEnvelopeType!=1){
        this.setData({
          ['steps[1].desc']:'面试过程中有任何问题可以<span style="color:red">投诉</span>',
          ['steps[3].desc']:'面试通过 ｜ 面试不通过 ｜ 考虑中',
        })
      } else {
         this.setData({
          ['steps[1].desc']:'面试过程中有任何问题可以<span style="color:red">投诉</span><br />签到后由企业确认可获得面试红包',
        })
      }
      if(res.data.activitySubsidy==1){
        if (_interviewRecordResult.redEnvelopeType == 1) {
          // <span style="color:red">签到后即将获得求职福利，平台核实无误发放求职福利</span>'
          this.setData({
            ['steps[1].desc']:'面试过程中有任何问题可以<span style="color:red">投诉</span><br />签到后由企业确认可获得面试红包<br /><span style="color:#999">签到后平台核实无误发放求职福利</span>',
          })
        } else { 
          this.setData({
            ['steps[1].desc']:'面试过程中有任何问题可以<span style="color:red">投诉</span><br /><span style="color:#999">签到后平台核实无误发放求职福利</span>',
          })
        }
      }
      this.setData({
        msInfo: _msInfo,
        interviewStatus: _interviewStatus,
        signInType: _signInType,
        interviewRecordResult: _interviewRecordResult,
        interviewTimeFormat: _interviewTimeFormat,
        interviewTime: _interviewTime,
        askResult: _askResult,
        resultType: _resultType,
        active: _current,
        appealStatus: _appealStatus,
        signInConfirm:_signInConfirm,
        activitySubsidy:res.data.activitySubsidy,
        subsidyMoney: res.data.subsidyMoney
      })

      this.getInterviewRecordList()
    })
  },

  goBack() {
    wx.navigateBack()
  },
  refuse() {
    Dialog.confirm({
      title: '',
      message: '是否确认拒绝面试',
      confirmButtonText: '确定'
    })
      .then(() => {
        this.sendmsReject()
        if (!this.data.comeFrom) {
          wx.navigateBack()
        }
      })
      .catch(() => {
        // on cancel
      });
  },
  //面试同意
  sendmsAgree(interviewRecordId) {
    this.setData({
      customType: 'interview_agree'
    })
    var customExts = {
      interviewRecordId: interviewRecordId
    }
    this.sendJsApi(customExts)
  },
  //面试签到
  sendmsSign(interviewRecordId) {
    this.setData({
      customType: 'interview_sign_in'
    })
    var customExts = {
      interviewRecordId: interviewRecordId
    }
    this.sendApi(customExts)
  },
  //获取面试结果
  sendmsResult(interviewRecordId) {
    this.setData({
      customType: 'interview_request_result'
    })
    var customExts = {
      interviewRecordId: interviewRecordId
    }
    this.sendApi(customExts)
  },
  //面试拒绝
  sendmsReject() {
    this.setData({
      customType: 'interview_refuse'
    })
    var customExts = {
      interviewRecordId: this.data.interviewRecordId
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
        fromUserId: this.data.msInfo.jobSeekerInfoResult.jobSeekerId,
        publishPostId: this.data.msInfo.interviewRecordResult.positionId,
        targetUserIds: this.data.msInfo.recruiterInfoResult.recruiterId,
        fromUserDignity: 1
      },
      from: this.data.msInfo.jobSeekerInfoResult.jobSeekerHxUsername,
      targetType: "users",
      to: [
        this.data.msInfo.recruiterInfoResult.recruiterHxUsername,
      ],
      type: msgType.CUSTOM
    };
    return params
  },
  // 发送自定义消息
  sendJsApi(customExts) {
    let params = this.setParams(customExts)
    agreeInterview(params).then(res => {
      if (res.code == 200) {
        console.log('发送成功')
        if (!this.data.comeFrom) {
          wx.navigateBack()
        }
      }else if(res.code===60007){
        wx.showModal({
          title: '温馨提示',
          content: '当前未完成实名认证，前往APP认证',
          confirmText: '去认证',  // 设置确认按钮文案
          cancelText: '放弃补贴',      // 设置取消按钮文案
          complete: (res) => {
            if (res.cancel) {
              this.setData({
                customType: 'interview_agree'
              })
              var customExts = {
                interviewRecordId: this.data.interviewRecordId,
                btn:3
              }
              this.sendJsApi(customExts)
            }
            if (res.confirm) {
              //去认证
            }
          }
        })
      }else if(res.code==50008){
        wx.showModal({
          title: '温馨提示',
          content: '账号参与过本次活动',
          confirmText: '放弃补贴',  // 设置确认按钮文案
          cancelText: '取消',      // 设置取消按钮文案
          complete: (res) => {
            if (res.cancel) {
              //取消操作
            }
            if (res.confirm) {
              this.setData({
                customType: 'interview_agree'
              })
              var customExts = {
                interviewRecordId: this.data.interviewRecordId,
                btn:4
              }
              this.sendJsApi(customExts)
            }
          }
        })
      } else {
        showToast(res.msg)
      }
    })
  },
  // 发送自定义消息
  sendApi(customExts, extMsg) {
    let that = this
    let params = this.setParams(customExts, extMsg)
    messageChatDetail(params).then(res => {
      if (res.code == 200) {
        console.log('发送成功')
        if (this.data.comeFrom == 1) {
          // 请求发送成功后修改下请求状态
          this.getInterviewRecord()
        } else {
          params.msgId = res.data.hxMsgId
          // wx.$event.emit('sendMsg', params)
          wx.$event.emit('getStatus', params)
        }
      } else {
        showToast(res.msg)
      }
    })
  },
  sendMsg(e) {
    let rt = 0
    if (e) {
      rt = e.currentTarget.dataset.type
    }
    if (rt == 1) {
      console.log('接受')
      this.sendmsAgree(this.data.interviewRecordId)
      // if (!this.data.comeFrom) {
      //   wx.navigateBack()
      // }
    } else if (rt == 2) {
      let ntime = new Date(this.msInfo.interviewRecordResult.interviewTime)
      let now = new Date();
      // if (now >= ntime) {
      //   showToast('面试签到已超时')
      //   this.getInterviewRecord()
      //   return
      // }
      let time = timesDiff(this.msInfo.interviewRecordResult.interviewTime)
      if (time.days > 0 || (time.days <= 0 && time.hours >= 1)) {
        showToast('面试前60分钟可签到')
        return
      }
      console.log('面试签到')
      // 2024.03.29 ghy 补充
      let metes = null
      let that = this
      wx.getLocation({
        type: 'gcj02',
        geocode: true,
        success(res) {
          console.log(res, '定位位置');
          metes = getDistance(res.longitude, res.latitude, Number(that.data.msInfo.interviewRecordResult.workPlaceLng), Number(that.data.msInfo.interviewRecordResult.workPlaceLat))
          //metes = getDistance(res.longitude, res.latitude, res.longitude, res.latitude)
          console.log(metes, '距离')
          if (metes > 0.5) return showToast('请在500米内签到')
          that.sendmsSign(that.data.interviewRecordId)
          if (!that.data.comeFrom) {
            wx.navigateBack()
          }
        },
        fail(err) {
          console.log(err, '错误');
        }
      });

    } else if (rt == 3) {
      console.log('询问面试结果')
      this.sendmsResult(this.data.interviewRecordId)
      if (!this.data.comeFrom) {
        wx.navigateBack()
      }
    } else {
      console.log('拒绝')
      this.sendmsReject(this.data.interviewRecordId)
      if (!this.data.comeFrom) {
        wx.navigateBack()
      }
    }
  },

  //清除邀请弹框
  rmInvite(interviewRecordId) {
    rmInvite(interviewRecordId).then(res => {
      if (res.code == 200) {
        console.log('清除成功')
      }
    })
  },
  //清除面试结果弹框
  rmresult(interviewRecordId) {
    rmresult(interviewRecordId).then(res => {
      if (res.code == 200) {
        console.log('清除成功')
      }
    })
  },
  //步骤
  goTots(e) {
    if (e.detail == 1) {
      wx.navigateTo({
        url: '/packageIm/pages/report/index?respondent=' + this.data.interviewRecordResult.recruiterId + '&positionId=' + this.data.interviewRecordResult.positionId
      })
    }
  },

  // 求职者获取面试记录
  async getInterviewRecordList() {
    let params = {
      pageNum: 1,
      pageSize: 999,
      corporationId: this.data.msInfo.interviewRecordResult.corporationId
    }
    const res = await getInterviewRecord(params)
    if (res.code !== 200) return
    let interviewRecordList = res.data.records && res.data.records.map((item, index) => {
      item.interviewTimeMD = ''
      if (index == 0) {
        item.interviewTimeMD = formatDate(item.interviewTime, 'M-D')
      } else {
        if (res.data.records[index - 1].interviewTimeMD != formatDate(item.interviewTime, 'M-D')) {
          item.interviewTimeMD = formatDate(item.interviewTime, 'M-D')
        }
      }
      item.interviewTimeHM = formatDate(item.interviewTime, 'M-D h:m')

      return {
        ...item
      }
    })
    this.setData({
      interviewRecordList: interviewRecordList,
      showInterviewRecordList: [interviewRecordList[0]]
    })
  },


  openPropModel(){
    this.setData({
      showInterviewRecord: true
    })
  },
  onCloseInterviewRecord(){
    this.setData({
      showInterviewRecord: false
    })
  }
})