import { setInviteCode } from '../../../http/user'
import { showToast } from '../../../utils/util'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      inviteCode: '',
        loginShow:false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(options.come){
          this.setData({
            come:options.come,
            inviteCode:wx.getStorageSync('userInfo').info.inviteCode,
            inviteCodeGD:wx.getStorageSync('userInfo').info.inviteCode
          })
        }
        console.log(options, '传递的参数')
        let wxToken = wx.getStorageSync('token')
        let market = options.scene
        // 已登录
        if (wxToken) {
            // 已登录, 根据app传递的token并且携带自己的token去请求接口
            if (market) {
               this.setData({
                inviteCode:market
               })
            } 
        } else {
            //登陆操作
            this.setData({
              loginShow:true
            })
        }
    },
     // 微信快速登录关闭弹窗
     weixinOnClose() {
        this.setData({
            loginShow: false
        })
    },
    confirmValue(event) {
        if (event.detail.value.length == 15) {
            showToast('名称格式超出限制')
        }
        this.setData({
          inviteCode: event.detail.value
        })
    },
    setInviteCodeFun(){
      setInviteCode({inviteCode:this.data.inviteCode}).then(res=>{
        if(res.code==200){
          showToast('二维码绑定成功')
          if(this.data.come){
            wx.navigateBack()
          }else{
            wx.reLaunch({
                url: `/pages/index/index`
            })
          }
        }else{
          showToast(res.msg)
        }
      })
    }
})