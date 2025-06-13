// subpackPage/user/recordStageDetail/index.js
import { getConsumeDetail } from '../../../http/recordApi.js'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      baseImageUrl: app.globalData.baseImgUrl,
      id: null, // 点击某一条数据的账单详情id
      billDetail: {}, // 账单详情
    },

    // 获取某一条数据的账单详情数据
    async consumeDetail(){
      let params = {
        id: this.data.id
      }
      const res = await getConsumeDetail(params)
      console.log(res,'账单详情')
      if(res.code !== 200) return
      this.setData({
        billDetail: res.data
      })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      console.log(options,'chuandi')
      if(options.id && options.id != 'undefined'){
        this.setData({id: options.id})
      }
      this.consumeDetail()
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