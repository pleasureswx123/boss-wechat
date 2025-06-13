import { getVipCenterRights,getUserInfo } from '../../../http/user'
const app = getApp();
Page({
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        navBarHeight: app.globalData.navBarHeight,
        baseImageUrl: app.globalData.baseImgUrl,
        defaultImage: '?x-oss-process=image/resize,w_100/quality,q_90',
        globalBottom:app.globalData.globalBottom,
        vipInfo:{},
        vipProps:[{name:'专属标识',num:'免费',price:'0'}],
        userInfo:{},
        formattedExpirationDate: null
    },
    back(){
        wx.navigateBack()
    },
    memberRecord(){
      wx.redirectTo({
          url: `/subpackPage/member/record/index`,
      })
    },
    gotoBuy(){
      wx.navigateTo({
        url: `/subpackPage/member/equities/index`,
    })
    },
    // 支付
    gotoPay(){
       // 测试
        wx.navigateTo({
            url: `/subpackPage/user/pay/index?propId=${1}&price=${10}&title=${'会员'}&type=${'memberBuy'}`,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      // this.setData({
      //   userInfo:wx.getStorageSync('userInfo').info
      // })
      this.getUserInfo()
      this.getCenterRights()
    },
    getCenterRights(){
      this.setData({
        vipProps:[{name:'专属标识',num:'免费',price:'0'}]
      })
      getVipCenterRights().then(res=>{
        if(res.code==200){
          this.setData({
            vipInfo:res.data,
            vipProps:[...this.data.vipProps,...res.data.vipProps]
          })
        }
      })
    },

    getUserInfo() {
      wx.removeStorageSync('userInfo')
      getUserInfo().then(result => {
        if (result.code == 200) {
          this.setData({
            userInfo: result.data.info
          })
          if (result.data.info.userVipExpire) {
            const date = new Date(result.data.info.userVipExpire.replace(/-/g, '/')); // 转换为JavaScript可识别的日期格式
            this.setData({
              formattedExpirationDate: `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
            });
          }
          wx.setStorageSync('userInfo', result.data)
        }
      })
    },
})