var app = getApp()
// import {showToast} from '@/utils/util'
import {showToast} from '../../utils/util'
import {
    getUserInfo,
    wxlogin
} from '../../http/login.js'
import {supervisoryOnlineUser} from '../../http/versions'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 是否展示登录弹框
        show: {
            type: Boolean,
            value: false,
            observer: function (newVal) {
                
            }
        },
        // 位置
        position: {
            type: String,
            value: 'bottom'
        },
        // 关闭icon
        closeable: {
            type: Boolean,
            value: true
        },
        // 圆角
        round: {
            type: Boolean,
            value: true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        slelct: false,
        type: 1,
        baseImageUrl: app.globalData.baseImgUrl
    },

    /**
     * 组件的方法列表
     */
    methods: {
        //微信授权登录
        goToBindPhone(event) {
            wx.login({
                success: (res) => {
                    wx.showLoading({
                        title: '正在登录...',
                    })
                    let code = res.code
                    console.log('app.globalData.maketCode=', app.globalData.maketCode)
                    wxlogin({
                        code,
                        dignity: 1,
                        client: 'wx',
                        maketCode: app.globalData.maketCode ? app.globalData.maketCode : ''
                    }).then((res) => {
                        if (res.code == 200) {
                            if (res.data.code != null) return showToast(res.data.msg) 
                            console.log(res,'登录成功')
                            
                            //next = 1 --未绑定手机号  next == 2 以绑定手机号
                            // enc  --  绑定加密串
                            if (res.data.next == 2) {
                                wx.setStorageSync('token', res.data.token);
                                this.setData({ codeShow: false })
                                getUserInfo().then((result) => {
                                    console.log(result)
                                    if (result.code == 200) {
                                        wx.hideLoading()
                                        this.supervisoryOnlineUserFn(result.data)
                                        wx.setStorageSync('userInfo', result.data)
                                        let versions = wx.getStorageSync('versions')
                                        if(versions == 1){
                                            // 至臻版首页
                                            wx.redirectTo({
                                                url: '/pages/index/index',
                                            })
                                        } else if(versions == 2){
                                            // 精简版首页
                                            wx.redirectTo({
                                                url: '/subpackPage/versions/index/index',
                                            })
                                        } else {
                                            // 未选择版本
                                            // 至臻版首页
                                            wx.redirectTo({
                                                url: '/pages/index/index',
                                            })
                                        }
                                    } else {
                                        wx.showToast({
                                            title : result.msg,
                                            icon:"none"
                                        })
                                    }

                                })
                            } else {
                               wx.hideLoading()
                               this.onClose()
                                wx.navigateTo({
                                    url: `/subpackPage/index/bindPhone/index?enc=${res.data.enc}`,
                                })
                            }
                        } else {
                            console.log('登录失败',res)
                            wx.showToast({
                                title : res.msg,
                                icon:"none"
                            })
                        }
                    })
                },
            })
        },
        // 关闭弹窗
        onClose() {
            this.triggerEvent('onClose')
            this.setData({
                checked: false,
                type: 1
            })
        },
        // 微信登录
        weixinLogin() {
            if (this.data.checked) {
                // this.triggerEvent('weixinLogin')
                this.goToBindPhone()
            } else {
                this.setData({
                    type: 2
                })
            }
        },

        weixinLoginA() {
            this.goToBindPhone()
        },
        //确定阅读并同意
        checkedTap() {
            this.setData({
                checked: !this.data.checked
            })
        },
        //取消选中阅读
        // cenalCheckedTap() {
        //     this.setData({
        //         checked: false
        //     })
        // },
        //跳转协议
        goAgreePage(e) {
            let type = e.currentTarget.dataset.type
            let url = e.currentTarget.dataset.url
            wx.navigateTo({
              url: `/subpackPage/versions/webview/webview?url=${url}`,
            })
        },
        // 提示后台用户上线，不需要再次给我推送
        async supervisoryOnlineUserFn(userInfo){
          let params = {
            userId: userInfo.info.userId
          }
          const res = await supervisoryOnlineUser(params)
          console.log(res,'上线')
        }
    }
})
