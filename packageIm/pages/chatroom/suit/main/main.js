let WebIM = require("../../../../../utils/imUtils/WebIM")["default"];
let msgType = require("../../../../../utils/imUtils/msgtype");
const app = getApp();
import { messageChatDetail } from "../../../../../http/api";
import { showToast } from "../../../../../utils/util"

Component({
  properties: {
    userInfo: {
      type: Object,
      value: {},
    }
  },
  data: {
    mgBtm: 0,
    bottom: 0, // 输入框距离页面底部距离（键盘高度px）
    inputMessage: "",		// render input 的值
    userMessage: "",		// input 的实时值
    imageUrl: app.globalData.imImages,
    isFocus: false, // 展示常用语标识
    isFingerboard: false, // 展示键盘标识
    auto_focus: false, // 是否使textarea自动聚焦
    KeyBoardHeight: 0
  },

  methods: {
    /**
     * @name: 编辑器初始化完成时触发
     */
    onEditorReady() {
      let self = this;
      this.triggerEvent("onEditorReady");
      // 获取编辑器实例
      self
        .createSelectorQuery()
        .select("#editor")
        .context((res) => {
          self.editorCtx = res.context;
          self.setContents(self.properties.richTextContents); //设置富文本内容
        })
        .exec();
    },
    /**
       * @name: 设置富文本内容
      */
    setContents(rechtext) {
      this.editorCtx.setContents({
        html: rechtext,
        success: (res) => {
          // 富文本内容设置成功
          console.log("[setContents success]", res);
        },
      });
    },
    /**
     * @name: 富文本编辑器输入时，获取值
     */
    getEditorContent() {
      let self = this;
      // 富文本编辑器获取内容方法
      self.editorCtx.getContents({
        success: (res) => {
          let array = [];
          array["html"] = res.html;
          array["index"] = self.properties.index;
          this.setData({
            userMessage: res.text,
            inputMessage: res.text
          });
        },
      });
    },
    sendGeet(str) {
      this.setData({
        userMessage: str,
        inputMessage: str
      })
      // this.setContents(str)
      this.sendMessage()
    },
    sendUseful(str) {
      this.setData({
        userMessage: str,
        inputMessage: str
      })
      // this.setContents(str)
      //this.sendMessage()
    },
    openFunModal(e) {
      let type = e.currentTarget.dataset.type;
      this.triggerEvent("changeStatus", type);
      this.setData({
        isFingerboard: true // 展示键盘标识，并且会触发失焦事件（会自动将常用语标识设置成false）
      })
    },
    openFunModalFingerboard(e) {
      let type = e.currentTarget.dataset.type;
      let changeFoucs = e.currentTarget.dataset.changefoucs;
      this.triggerEvent("changeStatus", type);
      if (changeFoucs) {
        this.setData({
          // isFocus: !this.data.isFocus,
          // auto_focus: true, // textarea聚焦
          // isFingerboard: !this.data.isFingerboard
          isFocus: true,
          auto_focus: true, // textarea聚焦
          isFingerboard: false
        })
      }
    },
    // 父组件调用
    // 展示常用语按钮，关闭其他展示并且不聚焦
    showChangText() {
      this.setData({
        isFingerboard: false,
        isFocus: false
      })
    },
    focusFun() {
      this.triggerEvent('scrollBottom')
    },
    focus(e) {
      console.log('触发', e)
      // wx.onKeyboardHeightChange(res => {
      //   this.setData({
      //     mgBtm: res.height,
      //   })
        // setTimeout(() => {
        //   this.triggerEvent("changeJp", res.height)
        // }, 300)
      // })
      this.setData({ isFocus: true })
      if (this.data.isFingerboard) {
        this.setData({ isFingerboard: false })
      }
      this.triggerEvent("closeFun");
    },

    blur(event) {
      console.log('失去焦点')
      this.setData({
        mgBtm: 0,
        isFocus: false, // 失去焦点关闭常用语图标
        KeyBoardHeight: 0
      })
      this.triggerEvent("blur");
    },
    // 键盘高度发生变化触发
    getKeyBoardHeight(event) {
      let height = event?.detail?.height || 0
      console.log(height, '键盘高度发生变化触发')
      this.triggerEvent("KeyBoardHeight", height);
      setTimeout(() => {
        this.triggerEvent("changeJp")
      }, 300)
      this.setData({
        KeyBoardHeight: height,
        // mgBtm: height
      })
    },
    // bindinput 不能打冒号！
    bindMessage(e) {
      this.setData({
        userMessage: e.detail.value
      });
    },
    emojiAction(emoji) {
      var str;
      var msglen = this.data.userMessage.length - 1;
      if (emoji && emoji != "[del]") {
        str = this.data.userMessage + emoji;
      }
      else if (emoji == "[del]") {
        let start = this.data.userMessage.lastIndexOf("[");
        let end = this.data.userMessage.lastIndexOf("]");
        let len = end - start;
        if (end != -1 && end == msglen && len >= 3 && len <= 4) {
          str = this.data.userMessage.slice(0, start);
        }
        else {
          str = this.data.userMessage.slice(0, msglen);
        }
      }
      //暂时表情直接发送出去，方案可待定
      this.setData({
        userMessage: str,
        inputMessage: str
      });
    },
    // emojiAction(emoji){
    //         let _emoji=WebIM.Emoji.map[emoji]
    //         let str;
    //         let _str;
    //         if(emoji){
    //           str = this.data.userMessage + emoji;
    //           let url=this.data.imageUrl+'/faces/'+_emoji
    //           _str = this.data.inputMessage + '<img src='+url+' width="20" height="20"/>';
    //         }
    //         //暂时表情直接发送出去，方案可待定
    //         this.setData({
    //           userMessage: str,
    //           inputMessage: _str
    //         });
    //         this.setContents(_str)
    //         // this.setData({
    //         //     userMessage:str
    //         // })
    //        // this.sendMessage()
    // },

    sendMessage() {
      console.log(this.data.userMessage, '输入:::::::::::::')
      // 获取用户信息登录环信
      const hxaccount = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.hxUname || '';
      const hxpassword = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.hxPass || '';
      if (hxaccount && hxpassword && !WebIM.conn.isOpened()) {
        console.log('重新连接')
        WebIM.conn.open({
          apiUrl: WebIM.config.apiURL,
          user: hxaccount,
          pwd: hxpassword,
          grant_type: 'password',
          appKey: wx.getStorageSync('appKey') || WebIM.config.appkey
        })
      }
      if (this.data.userMessage.trim() == '') return
      let params = {
        body: {
          msg: this.data.userMessage
        },
        customExts: {
          customMsgStatus: 0
        },
        ext: {
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
        type: "txt"
      }
      messageChatDetail(params).then(res => {
        if (res.code == 200) {
          params.msgId = res.data.hxMsgId
          setTimeout(() => {
            this.triggerEvent('scrollBottom')
          }, 300)
          //本地直接发出
          //this.triggerEvent('sendMsg',params)
          this.setData({
            inputMessage: '',
            userMessage: ''
          })
          //this.setContents('')
        } else {
          showToast(res.msg)
        }
      })
    }
  }
});
