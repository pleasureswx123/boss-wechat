var app = getApp()
import { getUserInfo } from '../../../../http/login.js'
import { showToast } from '../../../../utils/util'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        firstPhone:'',
        lastPhone:'',
        baseImageUrl: app.globalData.baseImgUrl,
        phone: ''
    },
    goToPhone(){
       wx.navigateTo({
         url: './phone',
       }) 
    },
    getUserInfoM() {
        getUserInfo().then((result) => {
            console.log(result)
            if (result.code == 200) {
                wx.setStorageSync('userInfo', result.data)
                // let firstPhone = result.data.info.phone.substr(0,3)
                // let lastPhone = result.data.info.phone.substr(-4)
                // this.setData({firstPhone})
                // this.setData({lastPhone})
                let newPhone = this.maskPhoneNumber(result.data.info.phone)
                this.setData({
                  phone: newPhone
                })  
            } else {
                showToast(result.msg)
            }
        })
    },
    onShow(){
        this.getUserInfoM()
    },
    goZx(){
        wx.navigateTo({
          url: '/subpackPage/user/setup/account/logoff',
        })
    },
    maskPhoneNumber(phoneNumber) {
      // 假设 phoneNumber 是一个字符串，如 "18512345678"
      return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
    }
})