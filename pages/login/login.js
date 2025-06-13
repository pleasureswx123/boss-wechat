import {
    phoneLogin,
    getCheckCode,
    getUserInfo,
    wxlogin
} from '../../http/login.js'
import { apiDictionary } from '../../http/index'
import { showToast,urlBack } from '../../utils/util'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checked: true, //阅读并同意协议
        phoneShow: false, //手机号不正确
        codeShow: false, //验证码不正确
        gainShow: true, //获取验证
        second: 60, //验证码倒计时
        regexp: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, //手机号验证
        phoneValue: '', //手机号
        smscode: '', //验证码
        v: '', //验证手机号，返回的加密码
        imageUrl:app.globalData.baseImgUrl, //图片路径
    },

    //确定阅读并同意
    checkedTap() {
        this.setData({
            checked: true
        })
    },
    //取消选中阅读
    cenalCheckedTap() {
        this.setData({
            checked: false
        })
    },
    //输入的手机号
    handleInput(e) {
        this.setData({
            phoneValue: e.detail.value
        })
    },
    //输入的验证码
    handleCodeInput(e) {
        this.setData({
            smscode: e.detail.value
        })
    },
    //获取验证码
    async testCode() {
        let that = this
        let phone = that.data.phoneValue
        if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(phone)) {
            that.setData({
                phoneShow: true
            })
            return;
        }
        that.setData({
            phoneShow: false
        })
        if (!that.data.checked) {
            showToast('请阅读并勾选底部协议')
        }
        //验证手机号
        const {
            code,
            data,
            msg
        } = await phoneLogin({
            phone,
            dignity: 1,
            client: 'wx'
        })
        if (code != 200) {
            showToast(msg)
            return
        }
        this.setData({
            v: data.v
        })
        that.setData({
            gainShow: false,
            second: 60
        })
        let second = this.data.second
        setInterval(() => {
            if (second <= 0) {
                this.setData({
                    second: null
                })
                return
            }
            this.setData({
                second: second--
            })
        }, 1000)
    },
     // 字典数据
     async getDictionary() {
        let ids = ''
        ids = '1,2,3,4,5,6,34,38,39,33,40,46,48,60,80'//38企业性质
        const result = await apiDictionary(ids)
        wx.setStorageSync('dictionary', result.data)
    },
    //登录效验验证码
    getCheckCode() {
        let smscode = this.data.smscode
        getCheckCode({
            encryptedData: this.data.v,
            smscode
        }).then((res) => {
            if (res.code == 200) {
                wx.setStorageSync('token', res.data);
                this.getDictionary()
                this.setData({
                    codeShow: false
                })
                getUserInfo().then((result) => {
                    console.log(result)
                    if (result.code == 200) {
                        wx.setStorageSync('userInfo', result.data)
                        let step=result.data.step
                        // 1求职者   (0跳到首页，1跳到岗位录入页面,16未完善简历)
                        let url=urlBack(step)
                        wx.reLaunch({
                            url: url
                        })
                    } else {
                        showToast(result.msg)
                    }
                })
            } else {
                showToast(res.msg)
            }
        })

    },

    //微信授权登录
    goToBindPhone(event) {
        wx.login({
            success: (res) => {
                console.log(res)
                let code = res.code
                wxlogin({
                    code,
                    dignity: 1,
                    client: 'wx'
                }).then((res) => {
                    console.log(res,'绑定手机号')
                    if (res.code == 200) {
                        //next = 1 --未绑定手机号  next == 2 以绑定手机号
                        // enc  --  绑定加密串
                        if (res.data.next == 2) {
                            wx.setStorageSync('token', res.data.token);
                            this.setData({codeShow: false})
                            getUserInfo().then((result) => {
                                console.log(result)
                                if (result.code == 200) {
                                    wx.setStorageSync('userInfo', result.data)
                                    wx.redirectTo({
                                        url: '../index/index',
                                    })
                                } else {
                                    showToast(result.msg)
                                }
                            })
                        } else {
                            console.log(222222222222222222222222)
                            wx.navigateTo({
                                url: `../../subpackPage/index/bindPhone/index?enc=${ res.data.enc }`,
                            })
                        }
                    } else {
                        showToast(res.msg)
                    }
                })
            },
        })
    },
    goAgreePage(e){
        let type=e.currentTarget.dataset.type
        wx.navigateTo({
          url: `/subpackPage/index/webFile/index?type=${type}`,
        })
        // wx.navigateTo({
        //   url: '/subpackPage/user/customer/detail?param='+type,
        // })
    }
})