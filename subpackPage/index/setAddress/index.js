// subpackPage/index/setAddress/index.js
var app = getApp()
import { apiGetUserAddress } from '../../../http/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseImageUrl: app.globalData.baseImgUrl,
        locationAddress: '',
        id: '',
        addressObj: {}, // 当前登录人信息
    },
    // 去设置和添加地址页面
    gotoAddress(){
        wx.navigateTo({
          url: `/subpackPage/index/addAddress/index?locationAddress=${this.data.locationAddress}&adcode=${this.data.id}&id=${this.data.addressObj.id}`,
        })
    },
    // 选择设置住址的城市
    gotoCity(){ 
        wx.navigateTo({
          url: `/subpackPage/index/city/index`,
        })
    },
    // 查询当前登陆人的住址信息
    async getUserAddress(){
        const {code,data,msg} =  await apiGetUserAddress()
        console.log(data,'当前登录人住址信息')
        if(!data){
            this.setData({
                addressObj: ''
            })
            return
        }
        this.setData({
            addressObj: data
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        
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
        let current_Position = wx.getStorageSync('current_Position')
        console.log(current_Position)
        // this.setData({
        //     locationAddress: current_Position.addressComponent.city,
        //     id: current_Position.addressComponent.id,
        // })
        this.getUserAddress()
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