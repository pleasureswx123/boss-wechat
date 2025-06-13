// subpackPage/user/phoneCode/phoneCode.js
import { apiLogoff,getlogooff } from '../../../http/login' 
Page({

    /**
     * 页面的初始数据
     */
    data: {
        smsnumber: "",
        cursorVisible: true,
        smsnumber_arr: '',
        phone: '',
        phoneCode: ''
    },
    // 输入框
    bindPhotoCode: function (e) {
        let { value, keyCode } = e.detail
        this.setData({
            smsnumber: e.detail.value,
            smsnumber_arr: [...value],
        })

        if(value.length === 6){
            console.log(5555)
            this.logoffFn()
        }
    },
    inputFocus() {
        this.setData({
            cursorVisible: this.data.smsnumber.length < 6
        })
    },
    // 注销账号
    async logoffFn() {
        const result = await apiLogoff(this.data.smsnumber)
        console.log(result, '注销账号')
        if (result.code !== 200){
            wx.showToast({
              title: '注销失败请重试',
              icon: "none"
            })
            return
        }else{
          wx.showToast({
            title: '注销成功',
            icon: "none"
          })
          let dic = wx.getStorageSync('dictionary')
          let avatar = wx.getStorageSync('avatar') // 分享使用
          let postAddress = wx.getStorageSync('postAddress')
          let versions = wx.getStorageSync('versions') // 获取版本
          let collectGuide = wx.getStorageSync('collectGuide') // 引导
          // 调用store中清除用户信息以及token,并跳转到首页
          wx.clearStorageSync()
          wx.setStorageSync('dictionary', dic)
          wx.setStorageSync('avatar', avatar) // 用于分享
          wx.setStorageSync('postAddress', postAddress) // 用于首页地址弹窗
          wx.setStorageSync('collectGuide', collectGuide)
          if (versions) {
            wx.setStorageSync('versions', versions) // 版本(默认为1)
          }
          setTimeout(() => {
            // 如果已经选择好版本了
            if (versions) {
              if (versions == 1) {
                wx.reLaunch({
                  url: `/pages/index/index`
                })
              } else {
                wx.reLaunch({
                  url: `/subpackPage/versions/index/index`
                })
              }
            } else {
              // 如果没有选择版本
              wx.reLaunch({
                url: `/pages/index/index`
              })
            }
          }, 1000)
        }
    },

    inputFocus() {

    },
    // 处理手机号
    maskPhoneNumber(phoneNumber) {
        const prefix = phoneNumber.slice(0, 3); // 截取前四位
        const suffix = phoneNumber.slice(-4); // 截取后四位
        return `${prefix}****${suffix}`;
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getPhoneCode()
    },
    getPhoneCode(){
      let userInfo = wx.getStorageSync('userInfo')
        let phone = userInfo.info.phone
        if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(phone)) {
            return;
        }
        this.setData({phone: phone,second:59})
         //验证手机号
         getlogooff({
            phone
        }).then(res=>{
          if(res.code==200)
          wx.showToast({
            title: '验证码已发送',
            icon: 'none'
          })
          let second = this.data.second
          this.timer=setInterval(()=>{
              if (second <= 0) {
                  this.setData({secondShow:1,second:0})
                  clearInterval(this.timer)
                  return
              }
              this.setData({
                  second:second--
              })
          },1000)
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})