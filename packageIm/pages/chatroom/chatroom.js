let msgStorage = require("../../../utils/imUtils/msgstorage");
let WebIM = require("../../../utils/imUtils/WebIM")["default"];
const app = getApp();
let msgType = require("../../../utils/imUtils/msgtype");
import { getUseful, historyMessage, messageChatDetail, resumeFileList, messageChatSession, rmresult, readMessageChatDetail, getUnreadCount, updateCustomMsgStatus, changeAlreadyReadStatus } from "../../../http/api";
import { getUserInfo } from '../../../http/user'
import { checkTime, showToast } from "../../../utils/util"
import {checkOfficial} from '../../../http/bind'
import { isFirstChat } from '../../../http/index'
Page({
  data: {
    KeyBoardHeight: 0,
    //面试结果状态
    msResultStatus: null,
    isShowMsResultStatus: false,
    msResult: false,
    //是否显示表情
    showEmoji: false,
    //是否显示发送简历
    jlShow: false,
    __comps__: {
      main: null,
      image: null,
      emoji: null
    },
    bottomId: 'bottomView',
    isShowUse: false,
    isShowAdd: true,
    topList: [
      {
        type: 1,
        name: 't_p',
        status: 0,
        isShow: true,
        title: '换电话'
      },
      {
        type: 1,
        name: 't_w',
        status: 0,
        isShow: true,
        title: '微信号'
      },
      {
        type: 1,
        name: 't_jl',
        status: 0,
        isShow: true,
        title: '发简历'
      },
      {
        type: 1,
        name: 't_more',
        status: 0,
        isShow: true,
        title: '更多'
      }],
    List: [],
    patientId: '',
    // 刷新加载配置
    triggered: false,
    searchLoadingComplete: false,
    scrollTop: 20,
    ok: 10,
    //会话列表
    chatMsg: [],
    pageNum: null,
    pageSize: 10,
    imageUrl: app.globalData.imImages,
    baseImgUrl: app.globalData.baseImgUrl,
    //自定义类型
    customType: null,
    statusResult: {},
    globalBottom: app.globalData.globalBottom,
    offerShow: true,
    messageDisabled: true, // 是否禁用聊天中的一系列操作（在简历有违规后禁用）
    isShensu:false
  },
  closeOffer() {
    this.setData({
      offerShow: false
    })
  },
  changeJp(e) {
    this.scrollBottom()
  },
  //发送语音
  toggleRecordModal: function () {
    console.log(2222222, '是否触发')
    this.executeRecord()
  },
  executeRecord:function(){
    wx.getSetting({
        success: (res) => {
          let recordAuth = res.authSetting['scope.record']
          if (recordAuth == false) { //已申请过授权，但是用户拒绝
              wx.openSetting({
                success: function (res) {
                  let recordAuth = res.authSetting['scope.record']
                  if (recordAuth == true) {
                    wx.showToast({
                      title: "授权成功",
                      icon: "success"
                    })
                  } else {
                    wx.showToast({
                      title: "请授权录音",
                      icon: "none"
                    })
                  }
                }
              })
          } else if (recordAuth == true) { // 用户已经同意授权
            this.data.__comps__.audio.toggleRecordModal();
            this.setData({
              isShowAdd: true
            })
          } else { // 第一次进来，未发起授权
            wx.authorize({
                scope: 'scope.record',
                success: () => {//授权成功
                    wx.showToast({
                  title: "授权成功",
                  icon: "success"
                })
                }
            })
          }
      },
      fail: function () {
          wx.showToast({
            title: "鉴权失败，请重试",
            icon: "none"
          })
        }
    })
  },
  //用户下拉动作
  onScrollRefresh: function () {
    var that = this;
    let _pageNum = that.data.pageNum
    if (_pageNum <= that.data.total) {
      that.setData({
        pageNum: _pageNum
      })
      that.getHistoryChatMsg()
    } else {
      showToast('没有更多历史记录')
    }
    setTimeout(function () {
      that.setData({
        triggered: false,
      })
    }, 1000);
  },
  //上拉加载
  bindscrolltolowerFn: function () {
    // 暂时不需要上拉功能
    console.log("====上拉加载======")
  },
  getUserInfo() {
    getUserInfo().then(result => {
      console.log(result, 1111)
      if (result.code == 200) {
        this.setData({
          infoArr: result.data
        })
        wx.setStorageSync('userInfo', result.data)
        this.checkOfficialFn(result.data)
      }
    })
  },
  setAck(receiveMsg) {
    // 处理未读消息回执
    var bodyId = receiveMsg.id; // 需要发送已读回执的消息id
    var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
    ackMsg.set({
      id: bodyId,
      to: receiveMsg.info.from
    });
    WebIM.conn.send(ackMsg.body);
  },
  onLoad(options) {
    let that = this;
    let userInfo = JSON.parse(options.userInfo)
    console.log(userInfo, '信息')
    this.setData({
      userInfo: userInfo,
      username: {
        myName: userInfo.myHx,
        your: userInfo.your
      }
    });

    wx.setNavigationBarTitle({
      title: userInfo.targetName + '_' + userInfo.targetCompany
    });
    // 获取用户信息登录环信
    const hxaccount = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.hxUname || '';
    const hxpassword = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.hxPass || '';
    if (hxaccount && hxpassword && !WebIM.conn.isOpened()) {
      WebIM.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: hxaccount,
        pwd: hxpassword,
        grant_type: 'password',
        appKey: wx.getStorageSync('appKey') || WebIM.config.appkey
      })
    }
    //第一次发起会话，发送打招呼语 后续根据简历id或者岗位id来分别判断是谁发起的,暂时先按
    this.getIsFirstChat()
    //获取常用语列表
    this.getUseful()
    //进入页面获取最后一页历史聊天记录
    this.getHistoryChatMsg('first')
  },
  onShow() {
    //获取状态
    this.getStatus()
    //获取用户信息
    this.getUserInfo();
    //设置eventbus自定义事件
    wx.$event.on('onCloseSs', this, this.onCloseSs)
    wx.$event.on('redAppealEvent', this, this.goRedAppeal)
    wx.$event.on('sendCustomMsg', this, this.sendCustomMsg)
    wx.$event.on('resetMsg', this, function (msgid) {
      console.log('resetMsg', msgid)
      let _chatMsg = this.data.chatMsg
      if (_chatMsg.length > 0) {
        _chatMsg.find((m, idx) => {
          if (m.msgId == msgid) {
            m.msg.customExts.customMsgStatus = 1
          }
        })
        this.setData({
          chatMsg: _chatMsg
        })
      }
    })
    wx.$event.on('sendFileArgee', this, function (msgObj) {
      console.log('resetMsg', msgObj)
      //选择文件发送文件修改状态
      this.setData({
        jlShow: true,
        jlList: msgObj.jlList,
        isComefileArgee: true,
        comefileArgeeMsgId: msgObj.msgId
      })
    })
    wx.$event.on('sendImMsg', this, this.sendImMsg)
    wx.$event.on('sendAddrReply', this, this.sendAddrReply)
    wx.$event.on('sendMsg', this, this.sendMsg)
    wx.$event.on('getStatus', this, this.getStatus)
    //监听消息
    this.onReadyFun()
    this.getStatus()
  },
  goRedAppeal(msid){
    this.setData({
      isShensu:true,
      msId:msid
    })
  },
  onCloseSs(){
    this.setData({
      isShensu:false
    })
  },
   //获取是否沟通过
   async getIsFirstChat() {
    let userInfo = this.data.userInfo
    const {
      code,
      data,
      msg
    } = await isFirstChat({
      jobSeekerId: userInfo.fromUserId,
      postId: userInfo.jobId,
      recruiterId: userInfo.targetUserIds,
      currentDignity: 1
    })
    // 需要获取到聊天中上一次沟通的岗位,并在聊天页面中的判断是否相同,相同则不提示
    console.log(data, '沟通过')
    if (code == 200) {
      // this.setData({
      //   isfirstChat: data.isFirstChat == true ? 1 : 2,
      //   greeting: data.greetings,
      //   chatSessionId: data.chatSessionId
      // })
      let _firstChat=data.isFirstChat == true ? 1 : 2
      if (userInfo.firstChat == 1 && _firstChat==1) {
        userInfo.firstChat = 2
        this.setData({
          customType: 'greet_job_info'
        })
        this.sendGreet(1);
      } else if (userInfo.changePositionId) {
        wx.showModal({
          content: '是否更换为' + userInfo.jobTitle + '岗位',
          success: (res) => {
            if (res.confirm) {
              this.setData({
                customType: 'change_job'
              })
              this.sendGreet(2)
            } else if (res.cancel) {
              console.log('用户点击取消');
            }
          }
        });
      }
    }
  },
  //修改消息状态
  updateCustomMsgStatus(param) {
    updateCustomMsgStatus(param).then(res => {
      if (res.code == 200) {
        console.log('状态已修改')
      }
    })
  },
  //消息设置已读
  setChangeAlreadyReadStatus() {
    if(this.data.userInfo.chatId){
      changeAlreadyReadStatus(this.data.userInfo.chatId).then(res => {
        if (res.code == 200) {
          console.log('状态已修改')
        }
      })
    }
  },
  sendCustomMsg(opt) {
    this.setData({
      customType: opt.customType
    })
    //简历拒绝
    this.sendApi()
  },
  onReadyFun() {
    let comps = this.data.__comps__;
    comps.main = this.selectComponent("#chat-suit-main");
    comps.image = this.selectComponent("#chat-suit-image");
    comps.emoji = this.selectComponent("#chat-suit-emoji");
    comps.audio = this.selectComponent("#chat-suit-audio");
    let me = this;
    let username = this.data.username;
    let myName = wx.getStorageSync("myUsername") || wx.getStorageSync('userInfo').info.hxUname;
    let sessionKey = username.your + myName;
    //监听新消息
    msgStorage.on("newChatMsg", function dispMsg(renderableMsg, type, curChatMsg, sesskey) {
      // 判断是否属于当前会话
      if (renderableMsg.info.from == username.your || renderableMsg.info.to == username.your) {
        let pages = getCurrentPages(); // 获取页面指针数组
        let currentPage = pages[pages.length - 1]; // 获取当前页
        if (currentPage.route == 'packageIm/pages/chatroom/chatroom') {
          if (sesskey == sessionKey) {
            console.log(renderableMsg, '新消息')
            //重复消息不添加
            if (me.data.chatMsg.filter(m => (m.msgId == renderableMsg.id || m.id == renderableMsg.id)).length > 0) return
            me.sendMsg(renderableMsg, 'newMsg')
            me.setAck(renderableMsg)
            //当消息为自定义消息的时候获取下状态
            if (renderableMsg.msg.type == "custom") {
              me.getStatus()
              if (renderableMsg.msg.customEvent == "message_recall") {
                me.recallMsg(renderableMsg.msg.customExts.msgId)
              }
            }
          }
        }
      }
    });
    //监听对方是否已读
    msgStorage.on("readMsg", function dispMsg(readMsg) {
      if (readMsg.from == username.your || readMsg.to == username.your) {
        let pages = getCurrentPages(); // 获取页面指针数组
        let currentPage = pages[pages.length - 1]; // 获取当前页
        if (currentPage.route == 'packageIm/pages/chatroom/chatroom') {
          me.setChangeAlreadyReadStatus()
          let _chatMsg = me.data.chatMsg
          _chatMsg.map(item => {
            item.isAckRead = 1
          })
          me.setData({
            chatMsg: _chatMsg
          })
        }
      }
    });
  },
  //撤回消息
  recallMsg(msg) {
    const _chatMsg = this.data.chatMsg
    const index = _chatMsg.findIndex(obj => obj.msgId === msg || obj.id === msg);
    if (index !== -1) {
      _chatMsg.splice(index, 1);
    }
    this.setData({
      chatMsg: _chatMsg
    })
  },
  //第一次求职者发送打招呼语信息
  sendGreet(isFirst) {
    let financingList = wx.getStorageSync('dictionary')[4]
    let param = this.data.userInfo
    let extParams = {
      jobCompanyFinancing: param.jobCompanyFinancing && financingList[param.jobCompanyFinancing].name || '未知',           //岗位公司融资情况
      jobCompanyName: param.targetCompany,                      //岗位公司名称
      jobId: param.jobId,                                       //岗位id
      jobRecruiterAvatar: param.targetAvatar,                   //岗位招聘者头像
      jobRecruiterJob: param.targetJob,                         //岗位招聘者职位
      jobRecruiterName: param.targetName,                       //岗位招聘者姓名
      jobRedEnvelope: param.jobRedEnvelope,                     //岗位红包(是否有红包)
      jobSalary: param.jobSalary,                               //岗位薪资
      jobTag: param.jobTag,                                     //岗位标签
      jobTitle: param.jobTitle,                                 //岗位标题
      jobTitleTag: param.jobTitleTag,                           //岗位标题标签
      resumeAvatar: param.resumeAvatar,                         //简历头像
      resumeEducation: param.resumeEducation,                   //简历最高学历
      resumeGender: param.resumeGender,                          //简历性别
      resumeId: param.resumeId,                                  //简历Id
      resumeName: param.resumeName,                              //简历姓名
      resumeSalary: param.resumeSalary,                          //简历薪资（缺字段）
      resumeWorkExperience: param.resumeWorkExperience,          //简历工作经历（此处传数组）
      resumeWorkStatus: param.resumeWorkStatus,                  //简历工作状态
      resumeWorkYear: param.resumeWorkYear,                       //简历工作年限（此处需要确定）
      targetUserIds: param.targetUserIds,
      activitySubsidy:param.activitySubsidy,                             //是否汽车岗
      jobRedEnvelope:param.jobRedEnvelope,
      bigRedPacket:param.bigRedPacket
    };
    let extMsg = {
      publishPostId: param.jobId,
      resumeId: param.resumeId,
      fromUserDignity: 1,
      fromUserId: param.fromUserId,
      targetUserIds: param.targetUserIds
    }
    //处理下greet打招呼语
    let _greet = WebIM.filterGreet(param)
    this.sendApi(extParams, extMsg, _greet, isFirst)
  },
  sendCustom(e) {
    // if(!this.data.messageDisabled) return showToast('您当前简历需要修改')
    let item = e.currentTarget.dataset.item
    let me = this
    if (item.name == 't_p') {
      if (item.status == 0) {
        wx.showModal({
          content: "确定与对方交换联系方式吗？",
          success: function (res) {
            if (res.confirm) {
              me.setData({
                customType: 'exchange_phone_initiator'
              })
              var customExts = {
                customMsgStatus: 0
              }
              me.sendApi(customExts)
            }
          }
        });
      } else if (item.status == 2) {
        me.setData({
          customType: 'card_exchange_phone'
        })
        me.sendApi()
        // let params = this.setParams()
        // this.sendMsg(params)
      }
    } else if (item.name == 't_w') {
      if (item.status == 0) {
        if (!this.data.infoArr.info.wechat) {
          wx.showModal({
            content: '请先设置微信号',
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/subpackPage/user/setWxNumber/setWxNumber?val=' + JSON.stringify(this.data.infoArr)
                })
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
          return
        }
        wx.showModal({
          content: "确定与对方交换微信吗？",
          success: function (res) {
            if (res.confirm) {
              me.setData({
                customType: 'exchange_wechat_initiator'
              })
              var customExts = {
                customMsgStatus: 0
              }
              me.sendApi(customExts)
            }
          }
        });
      } else if (item.status == 2) {
        me.setData({
          customType: 'card_exchange_wechat'
        })
        me.sendApi()
        // let params = this.setParams()
        // this.sendMsg(params)
      }
    } else if (item.name == 't_jl') {
      resumeFileList({ type: 0 }).then(res => {
        res.data.map(item => {
          item.size = (item.size / 1048576).toFixed(2)
          item.updateTime = item.updateTime.substr(0, 10)
        })
        this.setData({
          jlList: res.data
        })
        if (res.data.length > 0) {
          wx.showModal({
            content: "确定发送简历吗？",
            success: function (res) {
              if (res.confirm) {
                me.setData({
                  customType: 'send_resume_initiator',
                  jlShow: true
                })
              }
            }
          });
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
      })
    } else if (item.name == 't_more') {
      console.log('设置')
      wx.navigateTo({
        url: '/packageIm/pages/setChat/setChat?userInfo=' + JSON.stringify(this.data.userInfo)
      })
      return
    }
  },
  sendCommit() {
    if (this.data.customType == 'send_resume_initiator') {
      return
    } else {
      this.sendImMsg()
    }
  },
  //撤回消息
  sendMsgRecall(e) {
    this.setData({
      customType: 'message_recall'
    })
    var customExts = {
      msgId: JSON.parse(e.detail).msgId,
      msgText:JSON.parse(e.detail).msg.data[0].data,
      msgType:JSON.parse(e.detail).msg.data[0].type
    }
    this.sendApi(customExts)
    this.recallMsg(JSON.parse(e.detail).msgId)
  },
  //发送文件
  sendImMsg(fileItem) {
    //该判断是从消息点击同意过来的类型
    if (this.data.isComefileArgee) {
      this.setData({
        customType: 'request_resume_agree'
      })
    }
    var customExts = { customMsgStatus: 0 }
    if (fileItem) {
      customExts = {
        resumeFileId: fileItem.id,
        resumeFileName: fileItem.fileName,
        resumeFileUrl: fileItem.url,
        customMsgStatus: 0
      }
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
        fromUserId: this.data.userInfo.fromUserId,
        publishPostId: this.data.userInfo.publishPostId,
        targetUserIds: this.data.userInfo.targetUserIds,
        fromUserDignity: 1
      },
      from: this.data.userInfo.myHx,
      targetType: "users",
      to: [
        this.data.userInfo.your
      ],
      type: msgType.CUSTOM
    };
    return params
  },
  sendApi(customExts, extMsg, greet, isFirst) {
    // 获取用户信息登录环信
    const hxaccount = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.hxUname || '';
    const hxpassword = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.hxPass || '';
    if (hxaccount && hxpassword && !WebIM.conn.isOpened()) {
      WebIM.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: hxaccount,
        pwd: hxpassword,
        grant_type: 'password',
        appKey: wx.getStorageSync('appKey') || WebIM.config.appkey
      })
    }
    let that = this
    // 发送自定义消息
    let params = this.setParams(customExts, extMsg)
    messageChatDetail(params).then(res => {
      if (res.code == 200) {
        console.log('发送成功')
        // 请求发送成功后修改下请求状态
        this.getStatus()
        params.msgId = res.data.hxMsgId
        //this.sendMsg(params)
        //发送岗位成功之后发送打招呼信息
        if (res.data.chatSessionId) {
          if (isFirst == 1 && greet) { //如果是第一次打招呼带打招呼语,否则为换岗位
            that.data.__comps__.main.sendGeet(greet);
          }
        }
        //同意发送简历发送完成后操作
        if (this.data.isComefileArgee) {
          let param = {
            customMsgStatus: 1,
            hxMsgId: this.data.comefileArgeeMsgId
          }
          this.updateCustomMsgStatus(param)
          let _chatMsg = this.data.chatMsg
          if (_chatMsg.length > 0) {
            _chatMsg.find((m, idx) => {
              if (m.msgId == this.data.comefileArgeeMsgId) {
                m.msg.customExts.customMsgStatus = 1
              }
            })
            this.setData({
              chatMsg: _chatMsg
            })
          }
          this.setData({
            isComefileArgee: false,
            comefileArgeeMsgId: null
          })
        }
      } else {
        showToast(res.msg)
      }
    })
  },
  //切换状态
  changeStatus(e) {
    console.log("子组件传来的值", e.detail);
    let _isShow = true
    if (e.detail == 1) {
      //获取常用语列表
      this.getUseful()
      if (this.data.isShowUse) {
        _isShow = false
      }
      this.setData({
        isShowUse: _isShow,
        showEmoji: false,
        isShowAdd: true
      })
    } else if (e.detail == 2) {
      if (this.data.isShowAdd) {
        _isShow = false
      }
      this.setData({
        isShowAdd: _isShow,
        showEmoji: false,
        isShowUse: false
      })
    } else if (e.detail == 3) {
      if (this.data.showEmoji) {
        _isShow = false
      }
      this.setData({
        showEmoji: _isShow,
        isShowAdd: true,
        isShowUse: false
      })
    }
    this.scrollBottom()
  },
  //获取常用语列表
  getUseful() {
    getUseful().then(res => {
      if (res.code == 200) {
        this.setData({
          useFulList: res.data
        })
      }
    })
  },
  //滚动到底部
  scrollBottom() {
    var that = this;
    that.setData({
      bottomId: 'bottomView',
    })
  },
  goPage(e) {
    let val = e.target.dataset.val;
    let _url = `/packageIm/pages/useful/useful`;
    if (val == 1) {
      _url = `/packageIm/pages/useful/addUseful`
    }
    wx.navigateTo({
      url: _url
    })
    this.setData({
      isShowUse: false
    })
  },
  openCamera() {
    this.data.__comps__.image.openCamera();
    // this.setData({
    //     isShowAdd: true
    // })
  },

  sendImage() {
    this.data.__comps__.image.sendImage();
    // this.setData({
    //     isShowAdd: true
    // })
  },

  //数据库获取数据
  getMsgData(sendableMsg, type) {
    if (type == msgType.TEXT) {
      return WebIM.parseEmoji(sendableMsg.text.replace(/\n/gm, ""));
    } else if (type == msgType.EMOJI) {
      return sendableMsg.text;
    } else if (
      type == msgType.IMAGE ||
      type == msgType.VIDEO ||
      type == msgType.AUDIO ||
      type == msgType.FILE
    ) {
      return sendableMsg.url;
    }
    return "";
  },
  //处理时间显示
  handleTime(item, index, resData) {
    if (index != 0) {
      let long = resData[index].msgTimestamp - resData[index - 1].msgTimestamp
      if (Math.floor(long / (1000 * 60) >= 10)) {
        return checkTime(item)
      }
    } else {
      return checkTime(item)
    }
  },
  //获取历史消息
  getHistoryChatMsg(type) {
    // wx.showLoading({
    //   title: '加载中'
    // })
    let me = this
    let params = {
      chatSessionId: this.data.userInfo.chatId,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    }
    historyMessage(params).then(res => {
      if (res.code == 200) {
        // wx.hideLoading()
        if (res.data.records.length > 0)
          res.data.records.map((item, index) => {
            item.chatType = 'singleChat',
              item.id = item.msgId,
              item.info = {
                from: item.fromId,
                to: item.targetIds
              },
              item.mid = item.msgType + item.msgId,
              item.msg = {
                data: this.getMsgData(item, item.msgType),
                ext: item.ext,
                customEvent: item.customEvent,
                customExts: item.customExts && JSON.parse(item.customExts),
                type: item.msgType
              },
              item.style = this.data.userInfo.fromUserId == item.fromUserId ? "self" : '',
              item.time = item.msgTimestamp,
              item.showTime = this.handleTime(item.msgTimestamp, index, res.data.records)
              item.showReset  = this.jsTime(item.msgTimestamp)
              item.username = item.targetIds,
              item.yourname = item.fromId
          })
        let _chatMsg = []
        if (me.data.pageNum == null) {
          _chatMsg = res.data.records
        } else {
          _chatMsg = res.data.records.concat(me.data.chatMsg)
        }
        me.setData({
          chatMsg: _chatMsg,
          pageNum: res.data.current + 1,
          total: res.data.pages
        })
        console.log(_chatMsg,'_chatMsg')
        if (type == 'first') {
          me.scrollBottom()
        }
      }
    })
  },
  jsTime(time){
      let long = new Date().getTime() - new Date(time).getTime();
      if (Math.floor(long / 1000 / 60) > 10) {
        return true
      }
  },
  //子组件发送消息
  sendMsg(msg, type) {
    console.log(msg,'type',type)
    let _msg = msg.detail || msg
    let _chatMsg = this.data.chatMsg
    _chatMsg.push(this.handleData(_msg, type))
    this.setData({
      chatMsg: _chatMsg
    })
    this.scrollBottom()
  },
  //处理发送数据
  handleData(msg, type) {
    if (type == 'newMsg') {
      return {
        chatType: 'singleChat',
        id: msg.id,
        msgId: msg.id,
        info: {
          from: msg.info.from,
          to: msg.info.to
        },
        mid: msg.msg.type + new Date().getTime(),
        msg: {
          data: msg.msg.data,
          ext: msg.ext,
          customEvent: msg.msg.customEvent,
          customExts: msg.msg.customExts,
          type: msg.msg.type,
          duration: msg.msg.length
        },
        style: this.data.userInfo.fromUserId == msg.ext.fromUserId ? "self" : '',
        time: msg.time,
        showTime: this.handleTime(msg.time, this.data.chatMsg.length > 0 ? this.data.chatMsg.length - 1 : 0, this.data.chatMsg),
        username: msg.username,
        yourname: msg.yourname
      }
    } else {
      return {
        chatType: 'singleChat',
        id: msg.msgId,
        msgId: msg.msgId,
        info: {
          from: msg.from,
          to: msg.to[0]
        },
        mid: msg.type + new Date().getTime(),
        msg: {
          data: this.getlocalMsg(msg, msg.type),
          ext: msg.ext,
          customEvent: msg.body.customEvent,
          customExts: msg.body.customExts,
          type: msg.type,
          duration: msg.body.length
        },
        style: this.data.userInfo.fromUserId == msg.ext.fromUserId ? "self" : '',
        time: new Date().getTime(),
        showTime: this.handleTime(new Date().getTime(), this.data.chatMsg.length > 0 ? this.data.chatMsg.length - 1 : 0, this.data.chatMsg),
        username: msg.to[0],
        yourname: msg.from
      }
    }
  },
  //本地数据发送
  getlocalMsg(sendableMsg, type) {
    if (type == msgType.TEXT) {
      return WebIM.parseEmoji(sendableMsg.body.msg.replace(/\n/gm, ""));
    } else if (type == msgType.EMOJI) {
      return sendableMsg.body.msg;
    } else if (
      type == msgType.IMAGE ||
      type == msgType.VIDEO ||
      type == msgType.AUDIO ||
      type == msgType.FILE
    ) {
      return sendableMsg.body.url;
    }
    return "";
  },
  //发送地址回复消息借用常用语
  sendAddrReply(msg) {
    this.data.__comps__.main.sendUseful(msg);
  },
  //发送常用语消息
  sendUseful(e) {
    let _use = e.currentTarget.dataset.use
    this.data.__comps__.main.sendUseful(_use);
    this.setData({
      isShowUse: false
    })
  },
  closeFun(event) {
    let istrigger = event.currentTarget.dataset.istrigger
    if (istrigger) {
      const childComponent = this.selectComponent('#chat-suit-main');
      childComponent.showChangText()
    }
    this.setData({
      isShowUse: false,
      showEmoji: false,
      isShowAdd: true
    })
    this.data.__comps__.audio.toggleRecordClose();
  },
  //输出表情
  emojiAction(evt) {
    this.data.__comps__.main.emojiAction(evt.detail.msg);
  },
  // 发送简历
  sendFile(e) {
    let fileItem = e.currentTarget.dataset.item
    this.sendImMsg(fileItem)
    this.setData({
      jlShow: false
    })
  },
  onClose() {
    this.setData({
      jlShow: false,
      isShowMsResultStatus: false
    })
    this.rmresult()
  },
  //查看面试
  openIntervalRes() {
    this.setData({
      isShowMsResultStatus: true
    })
  },
  getStatus() {
    let _topList = this.data.topList
    messageChatSession({ chatSessionId: this.data.userInfo.chatId || '' }).then(res => {
      _topList.map(item => {
        if (item.name == 't_p') {
          item.status = res.data.exchangePhoneStatus
        } else if (item.name == 't_w') {
          item.status = res.data.exchangeWechatStatus
        } else if (item.name == 't_jl') {
          item.status = res.data.resumeStatus
        }
      })
      this.setData({
        topList: _topList,
        statusResult: res.data,
        msResultStatus: res.data.interviewResult
      })
    })
  },
  //清除面试结果弹框
  rmresult() {
    rmresult(this.data.statusResult.interviewRecordId).then(res => {
      if (res.code == 200) {
        console.log('清除成功')
        this.getStatus()
      }
    })
  },
  goInterviewPage(e) {
    let interviewRecordId = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `/packageIm/pages/interview/interview?interviewRecordId=` + interviewRecordId
    })
    this.rmresult()
  },
  goofferPage(e) {
    let offerRecordId = e.currentTarget.dataset.item
    let offerStatus = e.currentTarget.dataset.status
    wx.navigateTo({
      url: `/packageIm/pages/offer/offer?offerRecordId=` + offerRecordId + `&offerStatus=` + offerStatus
    })
  },
  onUnload: function () {
    console.log('清除已读数')
    this.setChangeAlreadyReadStatus();
    this.setReadMessageChat();
    let _usrId = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.userId
    getUnreadCount({ userId: _usrId }).then(res => {
      if (res.code == 200)
        getApp().globalData.unReadMessageNum = res.data;
    })
  },
  //该会话消息全部设为已读
  setReadMessageChat: function () {
    let nameList = this.data.username
    readMessageChatDetail(nameList.myName, nameList.your).then(res => {
      if (res.code == 200) {
        console.log('>>>>>>>>设为已读')
      }
    })
  },

  // 检测用户是否关注了公众号
  async checkOfficialFn(userInfo){
    let params = {
      userId: userInfo.info.userId
    }
    const res = await checkOfficial(params)
    console.log(res,'是否关注公众号')
    if (res.code !== 200) return
    this.setData({
      follow: res.data.follow
    })
  },

  KeyBoardHeight(height){
    console.log(height.detail, '父组件接收高度')
    this.setData({
      KeyBoardHeight: height.detail
    })
  },
  blur(){
    this.setData({
      KeyBoardHeight: 0
    })
  }
});
