import { apiLogoff } from '../../../../http/login.js'
import { showToast } from '../../../../utils/util'
Page({

    data: {
      outShow:false,
      outShowMsg:"个人账户一旦注销将不可撤销，账户内所有信息和 数据将无法找回。请确认是否要注销账号？"
    },
    onLoad(options) {

    },
    cloneShow(){
      this.setData({
        outShow:false
      })
    },
    writeOff(){
      this.setData({
        outShow:true
      })
    },
    comfirmBtn() {
      this.setData({
        outShow:false
      })
      wx.navigateTo({
          url: `/subpackPage/user/phoneCode/phoneCode`,
      })
    },
    // 打开注销协议
    writeOffAgreement() {
        wx.navigateTo({
            url: `/subpackPage/versions/webview/webview?url=https://guochuanyoupin.com/static/zxxy.html`,
        })
    },
    // 发送验证码页面注销,此不注销
})