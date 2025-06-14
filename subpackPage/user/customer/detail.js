// subpackPage/user/customer/detail.js

import { getAboutDetail } from '../../../http/user'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item:{},
        about:false,
        content:{
            contentType:'txt',
            content:'所有协议均待完善'
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(options.param){
            this.setData({about:true})
            wx.setNavigationBarTitle({
                title: options.param
              })
            //   getAboutDetail(options.param).then(res=>{
            //       if(res.code == 200){
            //           this.setData({content:res.data})
            //       }
            //   })
            
        }else{
            this.setData({about:false})
            this.setData({item:JSON.parse(options.item)})
        }
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