const app = getApp();
let WebIM = require("../../../../utils/imUtils/WebIM")["default"];
import {
    topMessageChatDetail,
    delMessageChatDetail,
    readMessageChatDetail
} from '../../../../http/api.js'
Component({
    properties: {
        datalist: Array
    },
    data: {
        imageUrl: app.globalData.imImages,
        baseImgUrl: app.globalData.baseImgUrl,
        defaultImage: '?x-oss-process=image/resize,w_80/quality,q_50',
        cancelPressModel:true
    },
    methods: {
        imClickfun(e) {
            let detail = e.currentTarget.dataset.item
            console.log(detail,'11111111111111111111')
            let myUserInfo = wx.getStorageSync('userInfo').info
            var nameList = {
                myHx: myUserInfo.hxUname, //自己环信id
                chatId: detail.id,
                your: detail.targetUsername,
                targetName: detail.targetName || detail.targetUsername,
                targetJob: detail.targetJob,
                targetCompany: detail.targetCompany,
                targetAvatar: detail.targetAvatar,
                fromUserId: myUserInfo.userId, //自己用户id
                targetUserIds: detail.targetUserId,
                publishPostId: detail.positionId,
                resumeId: detail.resumeId
            };
            //清除未读数
            if (detail.unReadNum > 0) {
                this.setReadMessageChat(nameList);
                this.setAck({ id: detail.id, from: detail.targetUsername });
                this.triggerEvent("clearRead", detail.id)
            }
            wx.navigateTo({
                url: `/packageIm/pages/chatroom/chatroom?userInfo=` + JSON.stringify(nameList)
            });
        },
        //打开消息进入聊天页面如果有未读消息发送消息回执
        setAck(receiveMsg) {
            // 处理未读消息回执
            var bodyId = receiveMsg.id; // 需要发送已读回执的消息id
            var ackMsg = new WebIM.message("read", WebIM.conn.getUniqueId());
            ackMsg.set({
                id: bodyId,
                to: receiveMsg.from
            });
            WebIM.conn.send(ackMsg.body);
        },
        closeModel(){
          this.setData({
            cancelPressModel:false
          })
        },
        goPage(e) {
            let type = e.currentTarget.dataset.type
            let specialNoticeType = e.currentTarget.dataset.specialnoticetype
            this.triggerEvent('changePage', {type,specialNoticeType})
        },
        top_chat(event) {
            console.log('>>>>>>>>置顶会话列表', event)
            let detail = event.currentTarget.dataset.item;
            let me = this;
            let name = '';
            let tip = '';
            if (detail.topStatus == 0) {
                name = '确认置顶？'
                tip = '置顶成功'
            } else {
                name = '确认取消置顶？'
                tip = '取消置顶成功'
            }
            wx.showModal({
                title: name,
                confirmText: "确认",
                success: function (res) {
                    if (res.confirm) {
                        let params = {
                            id: detail.id,
                            topStatus: detail.topStatus == 0 ? 1 : 0
                        }
                        topMessageChatDetail(params).then(res => {
                            if (res.code == 200) {
                                // debugger
                                me.triggerEvent("getData", 'edit')
                            }
                        })
                        let _datalist = me.data.datalist.map(item => {
                            if (item.id == detail.id) {
                                item.islongpressModel = false
                            }
                            return {
                                ...item
                            }
                        })
                        me.setData({
                            datalist: _datalist
                        })
                    } else if (res.cancel) {
                        let _datalist = me.data.datalist.map(item => {
                            if (item.id == detail.id) {
                                item.islongpressModel = false
                            }
                            return {
                                ...item
                            }
                        })
                        me.setData({
                            datalist: _datalist
                        })
                    }
                },
                fail: function (err) {
                    console.log('置顶列表', err);
                },
            });
        },
        //删除会话
        del_chat(event) {
            console.log('>>>>>>>>删除会话列表', event)
            let detail = event.currentTarget.dataset.item;
            let me = this;
            wx.showModal({
                title: "确认删除？",
                confirmText: "删除",
                success: function (res) {
                    if (res.confirm) {
                        let param = {
                            channel: detail.targetUsername,
                            delete_roam: true,
                            type: 'chat'
                        }
                        let hxUname = wx.getStorageSync('userInfo').info.hxUname
                        delMessageChatDetail(hxUname, param).then(res => {
                            if (res.code == 200) {
                                me.triggerEvent("getData", 'edit')
                            }
                        })
                        let _datalist = me.data.datalist.map(item => {
                            if (item.id == detail.id) {
                                item.islongpressModel = false
                            }
                            return {
                                ...item
                            }
                        })
                        me.setData({
                            datalist: _datalist
                        })
                    } else if (res.cancel) {
                        let _datalist = me.data.datalist.map(item => {
                            if (item.id == detail.id) {
                                item.islongpressModel = false
                            }
                            return {
                                ...item
                            }
                        })
                        me.setData({
                            datalist: _datalist
                        })
                    }
                },
                fail: function (err) {
                    console.log('删除列表', err);
                }
            });
        },
        //该会话消息全部设为已读
        setReadMessageChat: function (nameList) {
            readMessageChatDetail(nameList.myHx, nameList.your).then(res => {
                if (res.code == 200) {
                    console.log('>>>>>>>>设为已读')
                }
            })
        },


        // 2023-10-19 ghy添加
        longpress(event) {
            console.log(this.data.datalist, '000022')
            let { id } = event.currentTarget
            let _datalist = this.data.datalist.map(item => {
                if (item.id == id) {
                    item.islongpressModel = true
                } else {
                    item.islongpressModel = false
                }
                return {
                    ...item
                }
            })
            this.setData({
                datalist: _datalist,
                cancelPressModel:true
            })
        }
    }
})
