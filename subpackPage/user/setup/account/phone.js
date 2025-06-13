// subpackPage/user/setup/account/phone.js
import { changePhone,phoneBind,changePhoneCount } from '../../../../http/user'
import { getUserInfo} from '../../../../http/login.js' 
import { showToast } from '../../../../utils/util'
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        firstPhone:'',
        lastPhone:'',
        phoneNum:1,
        phone:'',
        second:0,
        secondShow:0,
        code:'',
        userInfo:null,
        tipsShow: true,
        baseImageUrl: app.globalData.baseImgUrl
    },
    phoneInput(e){
        this.setData({phone:e.detail.value})
    },
    codeInput(e){
        this.setData({code:e.detail.value})
    },
    changePhoneCount(){
        changePhoneCount().then(res=>{
            this.setData({
                phoneNum:res.data
            })
        })
    },
    //获取验证码
    checkCode(){
        let phone = this.data.phone
        if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(phone)) {
            showToast('请输入正确的手机号')
            return;
        }
        phoneBind({phone}).then(res =>{
            if(res.code !== 200) return showToast(res.msg)
            this.setData({secondShow:1,second:59})
            let second = this.data.second
            this.timer=setInterval(()=>{
                if (second <= 0) {
                    this.setData({second:0})
                    clearInterval(this.timer)
                    return
                }
                this.setData({
                    second:second--
                })
            },1000)
        }) 
    },
    //修改手机号保存
    subBtnHandle(){
        let param = {
            phone:this.data.phone,
            smscode:this.data.code
        }
        changePhone(param).then(res =>{
            if(res.code != 200){
                wx.showToast({
                  title: res.msg,
                  icon:'none'
                })
                return
            }
            wx.removeStorageSync('userInfo')
            getUserInfo().then(result =>{
                console.log(result)
                if(result.code == 200){
                 wx.setStorageSync('userInfo', result.data)
                 wx.showToast({
                   title: '修改成功',
                 })
                 setTimeout(()=>{
                    wx.navigateBack()  
                 },500)
                }else{
                    wx.showToast({
                     title: result.msg,
                     icon:'none'
                   })
                }
               
            })
        })
    },
    // 关闭tips元素结构
    closeTipsDom(){
      this.setData({tipsShow: false})
    },
    onLoad(){
        this.changePhoneCount()
        let firstPhone = wx.getStorageSync('userInfo').info.phone.substr(0,3)
        let lastPhone = wx.getStorageSync('userInfo').info.phone.substr(-4)
        this.setData({firstPhone})
        this.setData({lastPhone})
    }

})