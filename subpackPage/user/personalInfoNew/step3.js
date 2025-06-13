var app = getApp()
import { apiUserJobDetails } from '../../../http/api'
import {
  ossUpload
} from '../../../miniprogram-6/utils/oss.js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      imageUrl: app.globalData.baseImgUrl,
      imgUrl:null,
      showAvatar:false,
      radioNum:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    //单选事件
    onChange(e) {
      let { imageurl,num } = e.currentTarget.dataset
      this.setData({ 
        imgUrl: imageurl,
        radioNum:num
      })
    },
      //上传图片
  uploadImage1() {
    this.setData({ show: false })
    let userId = wx.getStorageSync('userInfo').info.userId
    var that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: async (res) => {
        console.log(res)

        const result = await ossUpload(res.tempFiles[0].tempFilePath, 'image', userId, 1)
        that.setData({
          imgUrl: result.full
        })
      }
    })
  },
  //上传图片
  uploadImage() {
    this.setData({ show: false })
    let userId = wx.getStorageSync('userInfo').info.userId
    var that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: async (res) => {
        console.log(res)
        console.log(userId, '9999')
        const result = await ossUpload(res.tempFiles[0].tempFilePath, 'image', userId, 1)
        that.setData({
          imgUrl: result.full
        })
      }
    })
  },
    //弹出层隐藏
    onClose() {
      this.setData({ show: false})
    },
    openAvatar(){
      this.setData({ show: true})
    },
    getSave(param) {
      apiUserJobDetails({avatar:this.data.imgUrl}).then(res => {
        if (res.code == 200) {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      });
    },
})