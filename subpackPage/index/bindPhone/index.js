var app = getApp()
import {
    bind,
    bindPhone,
    getUserInfo
} from '../../../http/login'
import { apiDictionary } from '../../../http/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        checked: false, //阅读并同意协议
        phoneShow: false, //手机号不正确
        codeShow: false, //验证码不正确
        gainShow: true, //获取验证
        second: 60, //验证码倒计时
        enc: '',
        baseImageUrl: app.globalData.baseImgUrl
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
        // if (!that.data.checked) {
        //     wx.showToast({
        //         title: '请阅读并勾选底部协议',
        //         icon: 'none'
        //     })
        //     return
        // }
        //验证手机号
        const {
            code,
            data,
            msg
        } = await bind({
            phone
        })
        if (code != 200) {
            wx.showToast({
                title: msg,
                icon: 'none'
            })
            return
        }
        that.setData({
            gainShow: false,
            second: 60
        })
        let second = this.data.second
        let timerId = setInterval(() => {
            if (second <= 0) {
                this.setData({
                    second: null
                })
                clearInterval(timerId);
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
    //拒绝的时候返回上一页
    goBack(){
      wx.navigateBack()
    },
    //确定绑定手机号
    getCheckCode() {
        let versions = wx.getStorageSync('versions')
        let param = {
            encryptedData: this.data.enc,
            phone: this.data.phoneValue,
            smscode: this.data.smscode,
            maketCode: getApp().globalData.maketCode || null
        }
        bindPhone(param).then(res => {
            if (res.code != 200) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return
            }
            wx.setStorageSync('token', res.data.token);
            this.getDictionary()
            getUserInfo().then((result) => {
                console.log(result)
                if (result.code == 200) {
                    wx.setStorageSync('userInfo', result.data)
                    let step=result.data.step
                    let url=''
                    // 1求职者   (0跳到首页，1跳到岗位录入页面,16未完善简历)
                    switch (step) {
                        case 1:
                            // 1跳到添加求职期望
                            if(versions==1){
                              url = "/subpackPage/user/editJobExp/editJobExp?step=1"
                            }else{
                              //经典版跳转到选择地址页面
                              url = "/subpackPage/index/cityIndexEdition/index?step=1"
                              //url = "/subpackPage/versions/sclectPost/sclectPost"
                            }
                            break;
                        case 16:
                            // 16未完善简历
                            if(versions==1){
                              url = "/subpackPage/user/resume/resume?step=1"
                            }else{
                              url = "/subpackPage/versions/jobManage/jobManage"
                            }
                            break;
                        default:
                            // 0跳到企业招聘者首页
                            url = "/pages/index/index"
                            break;
                    }
                    wx.reLaunch({
                        url: url
                    })
                } else {
                    wx.showToast({
                        title: result.msg,
                        icon: 'none'
                    })
                }

            })
            // wx.setStorageSync('token', res.data);
            // this.setData({
            //     codeShow: false
            // })
            // getUserInfo().then((result) => {
            //     console.log(result)
            //     if (result.code == 200) {
            //         wx.setStorageSync('userInfo', result.data)
            //         setTimeout(() => {
            //             wx.redirectTo({
            //                 url: '/pages/index/index',
            //             })
            //         }, 1000)
            //     } else {
            //         wx.showToast({
            //             title: result.msg,
            //             icon: 'none'
            //         })
            //     }

            // })

        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            enc: options.enc
        })
        console.log(options)
    },

})