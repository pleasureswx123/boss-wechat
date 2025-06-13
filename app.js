let disp = require("./utils/imUtils/broadcast");
let WebIM = require("./utils/imUtils/WebIM")["default"];
const hostUrl = 'https://imgcdn.guochuanyoupin.com';
let msgStorage = require("./utils/imUtils/msgstorage");
let msgType = require("./utils/imUtils/msgtype");
import "./utils/eventBus"
import { getUnreadCount } from './http/api'
import { imappkey } from './http/api.js'
import { supervisoryOnlineUser, supervisoryOfflineUser } from './http/versions'
import { helpActivityHandler } from './utils/helpActivity'
// function ack(receiveMsg) {
//     // 处理未读消息回执
//     var bodyId = receiveMsg.id; // 需要发送已读回执的消息id
//     var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
//     ackMsg.set({
//         id: bodyId,
//         to: receiveMsg.from
//     });
//     WebIM.conn.send(ackMsg.body);
// }

function onMessageError(err) {
  if (err.type === "error") {
    wx.showToast({
      title: err.errorText
    });
    return false;
  }
  return true;
}
// 包含陌生人版本
function calcUnReadSpot(message) {
  setTimeout(() => {
    let _usrId = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.userId
    getUnreadCount({ userId: _usrId }).then(res => {
      if (res.code == 200)
        getApp().globalData.unReadMessageNum = res.data;
      wx.$event.emit('updateMsg')
    })
  }, 0);
}
App({
  //设置系统状态栏高度
  setStatusBarHeight() {
    try {
      const res = wx.getSystemInfoSync()
      this.globalData.statusBarHeight = res.statusBarHeight
    } catch (error) {
      console.log(error)
    }
  },
  //设置导航栏height
  setNavBar() {
    let res = wx.getMenuButtonBoundingClientRect()
    let navBarPadding = (res.top - this.globalData.statusBarHeight) * 2
    this.globalData.navBarHeight = res.height + navBarPadding
  },
  async onLaunch(options) {
    console.log(options, '分享吗')
    // || options.scene === 1001
    if (options.scene === 1007 || options.scene === 1008 || options.scene === 1069) {
      // let app = wx.getStorageSync('app')
      if (options.query.path == 'webview') {
        wx.reLaunch({
          url: `/subpackPage/versions/webview/webview?type=1?appUserId=${options.query.appUserId}`,
        })
      } else if (options.query.appToken && options.query.appUserId) {
        wx.reLaunch({
          url: `/subpackPage/index/appUpload/index?appToken=${options.query.appToken}&appUserId=${options.query.appUserId}`
        });
      } else if (options.path == "subpackPage/index/freeProp/index") {
        wx.reLaunch({
          url: `/subpackPage/index/freeProp/index?activeId=${options.query.activeId}`
        });
      }
    } else if ((options.scene === 1036 || options.scene === 1047 || options.scene === 1048 || options.scene === 1049 || options.scene == 1011 || options.scene == 1012) && options.path == "subpackPage/index/job_detail/index") {
      if ((options.scene === 1047 || options.scene === 1048 || options.scene === 1049) && options.query.scene) {
        // 圆形
        options.query.postId = options.query.scene.split('&')[1].split('b=')[1]
        options.query.bossuserid = options.query.scene.split('&')[0].split('p=')[1]
      }
      wx.reLaunch({
        url: `/subpackPage/index/job_detail/index?postId=${options.query.postId}&bossuserid=${options.query.bossuserid}`
      });
    } else if ((options.scene === 1047 || options.scene === 1048 || options.scene === 1049) && options.path == "subpackPage/user/bindEwm/index") { //绑定二维码
      wx.reLaunch({
        url: `/subpackPage/user/bingEwm/index?market=${options.query.scene}`
      });
    } else if ((options.scene === 1047 || options.scene === 1048 || options.scene === 1049) && options.path == "subpackPage/index/qiyeWx/index") { //企微群入口页面
      wx.reLaunch({
        url: `/subpackPage/index/qiyeWx/index`
      });
    } else if (options.scene === 1007 || options.scene === 1008 || options.scene === 1069 || options.scene === 1036 || options.scene === 1047 || options.scene === 1048 || options.scene === 1049 || options.scene == 1011 || options.scene == 1012) {
      if (scene.split('=')[0] == 'maketCode') {
        this.globalData.maketCode = scene.split('=')[1]
        console.log(Number(scene.split('=')[1]), 'maketCode:::')
      }
    } else if (options.scene === 1167) { //家园h5<wx-open-launch-weapp>
      if (options.query.maketCode) {
        this.globalData.maketCode = options.query.maketCode
      }
    } else {
      let versions = wx.getStorageSync('versions')
      let userInfoStep = wx.getStorageSync('userInfo').step || null
      let userInfoName = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.nickName || null
      let userInfoWork = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.startWorkDate || null
      // 如果已经选择好版本了
      if (versions) {
        if (versions == 1) {
          if (userInfoStep == 1) {
            wx.reLaunch({
              url: `/subpackPage/user/editJobExp/editJobExp?step=1`
            })
          } else if (userInfoStep == 16) {
            if (userInfoName && !userInfoWork) {
              wx.reLaunch({
                url: `/subpackPage/user/personalInfoNew/step2`
              })
            } else if (userInfoName && userInfoWork) {
              wx.reLaunch({
                url: `/subpackPage/user/personalInfoNew/step3`
              })
            } else {
              wx.reLaunch({
                url: `/subpackPage/user/personalInfoNew/step1`
              })
            }
          } else {
            wx.reLaunch({
              url: `/pages/index/index`
            })
          }
        } else {
          if (userInfoStep == 1) {
            wx.reLaunch({
              url: `/subpackPage/index/cityIndexEdition/index?step=1`
            })
          } else if (userInfoStep == 16) {
            wx.reLaunch({
              url: `/subpackPage/versions/jobManage/jobManage`
            })
          } else {
            wx.reLaunch({
              url: `/subpackPage/versions/index/index`
            })
          }
        }
      } else {
        wx.setStorageSync('currentPageIdx', 1)
        // 如果没有选择版本
        wx.reLaunch({
          url: `/pages/index/index`
        })
      }
    }
    //获取地导航
    wx.getSystemInfo({
      success: res => {
        console.log('DPR：' + res.pixelRatio)
        console.log('宽度：' + res.screenWidth)
        console.log('高度：' + res.screenHeight)
        this.globalData.globalBottom = res.screenHeight - res.safeArea.bottom
      }
    })
    this.setStatusBarHeight()
    this.setNavBar()
    //后台配置appkey
    imappkey().then(res => {
      if (res.code == 200 && res.data) {
        WebIM.conn.appKey = res.data;
        wx.setStorageSync('appKey', res.data)
      } else {
        wx.setStorageSync('appKey', WebIM.config.appkey)
      }
    });


    //wx.setStorageSync('appKey', WebIM.config.appkey)

    //环信
    let me = this
    disp.on("em.main.ready", function () {
      calcUnReadSpot();
    });
    disp.on("em.chatroom.leave", function () {
      calcUnReadSpot();
    });
    disp.on("em.chat.session.remove", function () {
      calcUnReadSpot();
    });
    disp.on('em.chat.audio.fileLoaded', function () {
      calcUnReadSpot()
    });

    disp.on('em.main.deleteFriend', function () {
      calcUnReadSpot()
    });
    disp.on('em.chat.audio.fileLoaded', function () {
      calcUnReadSpot()
    });
    // 获取用户信息登录环信
    const hxaccount = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.hxUname || '';
    const hxpassword = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.hxPass || '';
    if (hxaccount && hxpassword) {
      this.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: hxaccount,
        pwd: hxpassword,
        grant_type: 'password',
        appKey: wx.getStorageSync('appKey') || WebIM.config.appkey
      })
    }
    WebIM.conn.listen({
      onOpened(message) {
        console.log('im登录成功')
        //WebIM.conn.setPresence();
        me.globalData.state = true
      },
      onReconnect() {
        wx.showToast({
          title: "重连中...",
          duration: 2000
        });
      },
      onSocketConnected() {
        wx.showToast({
          title: "socket连接成功",
          duration: 2000
        });
      },
      onClosed() {
        // wx.showToast({
        //     title: "网络已断开",
        //     icon: 'none',
        //     duration: 2000
        // });
        me.conn.closed = true;
        WebIM.conn.close();
      },
      onReadMessage(message) {
        console.log('已读', message)
        if (message) {
          msgStorage.saveReadMsg(message)
        }
      },
      onVideoMessage(message) {
        if (message) {
          msgStorage.saveReceiveMsg(message, msgType.VIDEO);
        }
        calcUnReadSpot(message);
        //ack(message);
      },
      onAudioMessage(message) {
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.AUDIO);
          }
          calcUnReadSpot(message);
          //ack(message);
        }
      },
      onCustomMessage(message) {
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.CUSTOM);
          }
          calcUnReadSpot(message);
          //ack(message);
        }
      },
      onCmdMessage(message) {
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.CMD);
          }
          calcUnReadSpot(message);
          //ack(message);
        }
      },
      onTextMessage(message) {
        // debugger
        console.log('onTextMessage', message)
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.TEXT);
          }
          calcUnReadSpot(message);
          //ack(message);

          if (message.ext.msg_extension) {
            let msgExtension = JSON.parse(message.ext.msg_extension)
            let conferenceId = message.ext.conferenceId
            let password = message.ext.password
            disp.fire("em.xmpp.videoCall", {
              msgExtension: msgExtension,
              conferenceId: conferenceId,
              password: password
            });
          }
        }
      },
      onEmojiMessage(message) {
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.EMOJI);
          }
          calcUnReadSpot(message);
          //ack(message);
        }
      },

      onPictureMessage(message) {
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.IMAGE);
          }
          calcUnReadSpot(message);
          //ack(message);
        }
      },

      onFileMessage(message) {
        if (message) {
          if (onMessageError(message)) {
            msgStorage.saveReceiveMsg(message, msgType.FILE);
          }
          calcUnReadSpot(message);
          //ack(message);
        }
      },
      onDeliveredMessage(message) {
        console.log(message);
      },
      // 各种异常
      onError(error) {
        console.log(error)
        // 16: server-side close the websocket connection
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_DISCONNECTED) {

        }
        // 8: offline by multi login
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_SERVER_ERROR) {
          wx.showToast({
            title: "offline by multi login",
            duration: 3000
          });
          wx.removeStorage({
            key: 'token',
          })
          wx.redirectTo({
            url: "../index/index"
          });
        }
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_OPEN_ERROR) {
          wx.hideLoading()
          disp.fire("em.xmpp.error.passwordErr");
          // wx.showModal({
          // 	title: "用户名或密码错误",
          // 	confirmText: "OK",
          // 	showCancel: false
          // });
        }
        if (error.type == WebIM.statusCode.WEBIM_CONNCTION_AUTH_ERROR) {
          wx.hideLoading()
          disp.fire("em.xmpp.error.tokenErr");
        }
        if (error.type == 'socket_error') { ///sendMsgError
          console.log('socket_errorsocket_error', error)
          // wx.showToast({
          //     title: "网络已断开",
          //     icon: 'none',
          //     duration: 3000
          // });
          disp.fire("em.xmpp.error.sendMsgErr", error);
        }
      }
    });

    // 处理H5唤起场景
    if (options.scene === 1069) { // H5唤起小程序的场景值
      const { shareCode } = options.query;
      if (shareCode) {
        helpActivityHandler.handleShareCode(shareCode)
          .then(jumpResult => {
            // 根据跳转服务接口返回的页面进行跳转
            if (jumpResult && jumpResult.path) {
              wx.navigateTo({
                url: jumpResult.path
              });
            }
          })
          .catch(error => {
            console.error('处理H5唤起失败:', error);
            // 处理错误，可以跳转到错误页面
            wx.navigateTo({
              url: '/pages/error/error'
            });
          });
      }
    }
  },
  conn: {
    closed: false,
    curOpenOpt: {},
    open(opt) {
      this.curOpenOpt = opt;
      WebIM.conn.open(opt);
      this.closed = false;
    },
    reopen() {
      if (this.closed) {
        //this.open(this.curOpenOpt);
        WebIM.conn.open(this.curOpenOpt);
        this.closed = false;
      }
    }
  },
  // 微信小程序热更新
  updateManager() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate(res => { });
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: "更新提示",
        content: "新版本已经准备好，是否重启应用？",
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate();
          }
        }
      });
    });

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: "更新提示",
        content: "新版本下载失败",
        showCancel: false
      });
    });
  },
  globalData: {
    globalBottom: 0,
    state: false,
    statusBarHeight: 20,
    navBarHeight: 44,
    baseImgUrl: hostUrl + '/resource/wechat/baseimages',
    imImages: hostUrl + '/resource/wechat/imimages',
    isLogin: false,
  },
  watch(key, method) {
    var obj = this.globalData
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (val) {
        this._name = val
        method(val)
      },
      get: function () {
        return this._name
      }
    })
  },

  async onHide() {
    let token = wx.getStorageSync('token')
    if (token) {
      let params = {
        userId: wx.getStorageSync('userInfo').info.userId
      }
      console.log('小程序进入后台', token)
      const res = await supervisoryOfflineUser(params)
      console.log(res, '下线')
    }
  },
  async onShow() {
    let token = wx.getStorageSync('token')
    if (token) {
      let params = {
        userId: wx.getStorageSync('userInfo').info.userId
      }
      console.log('小程序进入前台', token)
      const res = await supervisoryOnlineUser(params)
      console.log(res, '上线')
    }
    wx.loadFontFace({
      family: "DouyinSansBold",
      source: `url("https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/font/DouyinSansBold.ttf")`,
      global: true,
      success(res) {
        console.log("字体加载成功", res);
      },
      fail: function (err) {
        console.error("字体加载失败", err);
      },
      complete: function (err) {
        console.log("字体加载完成", err);
      },
    })
  },
  // 登录成功后的回调
  loginSuccess: function() {
    this.globalData.isLogin = true;
    
    // 处理助力活动相关逻辑
    helpActivityHandler.handleAfterLogin()
      .then(result => {
        if (result) {
          // 可以显示助力结果等
          wx.showToast({
            title: '助力成功',
            icon: 'success'
          });
        }
      })
      .catch(error => {
        console.error('登录后处理助力失败:', error);
      });
  },
});