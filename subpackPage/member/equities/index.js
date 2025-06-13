import { getViprightsList } from "../../../http/user"
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        navBarHeight: app.globalData.navBarHeight,
        baseImageUrl: app.globalData.baseImgUrl,
        defaultImage: '?x-oss-process=image/resize,w_100/quality,q_90',
        globalBottom: app.globalData.globalBottom,
        detail: [],
        vipInfo:[{name:'专属标识',num:'免费',price:'0'}],
        vipObj:[],
        unitArr:wx.getStorageSync('dictionary')[60] || []
    },
    back() {
        wx.navigateBack()
    },
    // 支付
    gotoPay() {
      let vipObj=this.data.vipObj
        // 测试
        wx.navigateTo({
            url: `/subpackPage/user/pay/index?propId=${vipObj.vipId}&title=${vipObj.name}&type=${'memberBuy'}`,
        })
    },
    stopTouchMove: function (e) {
        return false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let detail = this.data.detail
        for (let i = 0; i < detail.length; i++) {
            detail[i].name = detail[i].name.substring(0, detail[i].name.length - 3) + '***'
        }
        this.setData({
            detail: detail
        })
        this.getViprights()
    },
    getViprights(){
      getViprightsList().then(res=>{
        if(res.code==200){
          this.setData({
            vipInfo:[...this.data.vipInfo,...res.data.vipPropList],
            vipObj:res.data.vip,
            detail:res.data.tips
          })
        }
      })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

})