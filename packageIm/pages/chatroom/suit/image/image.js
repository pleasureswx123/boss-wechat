// let WebIM = require("../../../../../utils/imUtils/WebIM")["default"];
// let msgType = require("../../../../../utils/imUtils/msgtype");
import { showToast } from "../../../../../utils/util"
import { messageChatDetail } from "../../../../../http/api"
import {
  ossUpload
} from '../../../../../miniprogram-6/utils/oss.js'
Component({
	properties: {
		userInfo: {
			type: Object,
			value: {},
		}
	},
	data: {

	},
	methods: {
		openCamera(){
      var that = this
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sizeType: ['compressed'],
            sourceType: ['camera'],
            success: async (res) => {
                // const result = await ossUpload(res.tempFiles[0].tempFilePath, 'image')
                const result = await ossUpload(res.tempFiles[0].tempFilePath, 'im',that.data.userInfo.chatId)
                that.upLoadImage(result);
            }
        })
		},

		sendImage(){
      var that = this
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: async (res) => {
                const result = await ossUpload(res.tempFiles[0].tempFilePath, 'im',that.data.userInfo.chatId)
                that.upLoadImage(result);
            }
        })
		},

		getSendToParam(){
			return this.data.username.your;
		},

		upLoadImage(resUrl){
      var me = this;
      //后台发送
      let params={
        body: {
                filename: resUrl.shot,
                size: {
                    height: '100',
                    width: '100'
                },
                url: resUrl.full
            },
            ext:{
                fromUserDignity:1,
                fromUserId:me.data.userInfo.fromUserId,
                publishPostId:me.data.userInfo.publishPostId,
                targetUserIds:me.data.userInfo.targetUserIds
            },
            from: me.data.userInfo.myHx,
            targetType: "users",
            to: [
                me.data.userInfo.your
            ],
            type: "img"
      }
      messageChatDetail(params).then(res=>{
          if(res.code==200){
            params.msgId = res.data.hxMsgId
              me.triggerEvent('sendMsg',params)
          }else{
              showToast(res.msg)
          }
      })
		},
	},
});
