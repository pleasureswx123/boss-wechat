let WebIM = require("../../../../../utils/imUtils/WebIM")["default"];
let msgType = require("../../../../../utils/imUtils/msgtype");
import { messageChatDetail } from "../../../../../http/api"
import { showToast } from "../../../../../utils/util"
import {
  ossUpload
} from '../../../../../miniprogram-6/utils/oss.js'
var app = getApp()
let RECORD_CONST = require("record_status");
console.log(RECORD_CONST, 'ashhdsdhsakjs')
let RecordStatus = RECORD_CONST.RecordStatus;
let RecordDesc = RECORD_CONST.RecordDesc;
let RunAnimation = false
const InitHeight = [50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50]
Component({
  properties: {
    userInfo: {
      type: Object,
      value: {},
    }
  },
  data: {
    baseImgUrl: app.globalData.baseImgUrl,
    changedTouches: null,
    recordStatus: RecordStatus.HIDE,
    RecordStatus,
    RecordDesc,		// 模板中有引用
    radomheight: InitHeight,
    recorderManager: wx.getRecorderManager(),
    recordClicked: false
  },
  methods: {
    toggleWithoutAction(e) {
      // 阻止 tap 冒泡
    },

    toggleRecordClose() {
      this.setData({
        recordStatus: RecordStatus.HIDE
      });
    },
    toggleRecordModal() {
      this.setData({
        recordStatus: this.data.recordStatus == RecordStatus.HIDE ? RecordStatus.SHOW : RecordStatus.HIDE,
        radomheight: InitHeight,
      });
      console.log(RecordStatus.HIDE, RecordStatus.HIDE)
      console.log('执行次数', this.data.recordStatus, RECORD_CONST)
    },

    handleRecordingMove(e) {
      var touches = e.touches[0];
      var changedTouches = this.data.changedTouches;
      if (!changedTouches) {
        return;
      }

      if (this.data.recordStatus == RecordStatus.SWIPE) {
        if (changedTouches.pageY - touches.pageY < 20) {
          this.setData({
            recordStatus: RecordStatus.HOLD
          });
        }
      }
      if (this.data.recordStatus == RecordStatus.HOLD) {
        if (changedTouches.pageY - touches.pageY > 20) {
          this.setData({
            recordStatus: RecordStatus.SWIPE
          });
        }
      }
    },

    handleRecording(e) {
      let me = this;
      me.setData({
        recordClicked: true
      })
      setTimeout(() => {
        if (me.data.recordClicked == true) {
          executeRecord()
        }
      }, 350)
      function executeRecord() {
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
                  me.setData({
                    isLongPress: false
                  })
                }
              })
            } else if (recordAuth == true) { // 用户已经同意授权
              startRecord()
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
      }

      function startRecord() {
        me.data.changedTouches = e.touches[0];
        me.setData({
          recordStatus: RecordStatus.HOLD
        });
        RunAnimation = true;
        me.myradom();

        let recorderManager = me.data.recorderManager || wx.getRecorderManager();
        recorderManager.onStart(() => {
          // console.log("开始录音...");
        });
        recorderManager.start({
          format: "mp3"
        });
        // 超时
        setTimeout(function () {
          me.handleRecordingCancel();
          RunAnimation = false
        }, 100000);
      }
    },

    handleRecordingCancel() {
      RunAnimation = false
      let recorderManager = this.data.recorderManager;
      let that = this
      // 向上滑动状态停止：取消录音发放
      if (this.data.recordStatus == RecordStatus.SWIPE) {
        this.setData({
          recordStatus: RecordStatus.RELEASE
        });
      }
      else {
        this.setData({
          recordStatus: RecordStatus.HIDE,
          recordClicked: false
        });
      }

      recorderManager.onStop((res) => {
        // console.log("结束录音...", res);
        if (this.data.recordStatus == RecordStatus.RELEASE) {
          console.log("user canceled");
          this.setData({
            recordStatus: RecordStatus.HIDE
          });
          return;
        }
        if (res.duration < 1000) {
          wx.showToast({
            title: "录音时间太短",
            icon: "none"
          })
        } else {
          // 上传
          //this.uploadRecord(res.tempFilePath, res.duration);
          ossUpload(res.tempFilePath, 'im', this.data.userInfo.chatId).then(result => {
            let resBody = {
              filename: result.shot,
              length: Math.ceil(res.duration / 1000),
              url: result.full
            }
            that.upLoadVideo(resBody)
          })
          //接收消息对象
        }
      });
      // 停止录音
      recorderManager.stop();
    },

    // uploadRecord(tempFilePath, dur){
    // 	var str = wx.getStorageSync('appKey').split("#");
    // 	var me = this;
    // 	var token = WebIM.conn.context.accessToken
    // 	var domain = WebIM.conn.apiUrl
    // 	wx.uploadFile({
    // 		url: domain + "/" + str[0] + "/" + str[1] + "/chatfiles",
    // 		filePath: tempFilePath,
    // 		name: "file",
    // 		header: {
    // 			"Content-Type": "multipart/form-data",
    // 			Authorization: "Bearer " + token
    // 		},
    // 		success(res){
    // 			var dataObj = JSON.parse(res.data);
    // 			//接收消息对象
    //       let resBody={
    //         filename:tempFilePath,
    //         length:Math.ceil(dur / 1000),
    //         url:dataObj.uri + "/" + dataObj.entities[0].uuid
    //       }
    //       me.upLoadVideo(resBody)
    // 		}
    // 	});
    // },
    upLoadVideo(resBody) {
      var me = this;
      //后台发送
      let params = {
        body: {
          filename: resBody.filename,
          length: resBody.length,
          url: resBody.url
        },
        ext: {
          fromUserDignity: 1,
          fromUserId: me.data.userInfo.fromUserId,
          publishPostId: me.data.userInfo.publishPostId,
          targetUserIds: me.data.userInfo.targetUserIds
        },
        from: me.data.userInfo.myHx,
        targetType: "users",
        to: [
          me.data.userInfo.your
        ],
        type: "audio"
      }

      messageChatDetail(params).then(res => {
        if (res.code == 200) {
          params.msgId = res.data.hxMsgId
          // 本地直接发出（因在app.js中已经监听到了消息所以暂时注释 2025-02-21 ghy）
          // me.triggerEvent('sendMsg',params)
        } else {
          showToast(res.msg)
        }
      })
    },

    myradom() {
      const that = this;
      var _radomheight = that.data.radomheight;
      for (var i = 0; i < that.data.radomheight.length; i++) {
        //+1是为了避免为0
        _radomheight[i] = (100 * Math.random().toFixed(2)) + 10;
      }
      that.setData({
        radomheight: _radomheight
      });
      if (RunAnimation) {
        setTimeout(function () { that.myradom(); }, 500);
      } else {
        return
      }
    }
  },

  // lifetimes
  created() { },
  attached() { },
  moved() { },
  detached() { },
  ready() { },
});
