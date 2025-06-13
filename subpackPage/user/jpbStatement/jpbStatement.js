// subpackPage/user/jpbStatement/jpbStatement.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl:app.globalData.baseImgUrl
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    goPage(){
        wx.redirectTo({
          url: '/subpackPage/user/jobManage/jobManage',
        })
    }
})