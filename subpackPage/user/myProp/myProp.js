// subpackPage/user/collect/collect.js
import { getProp, propUsing,saveaProp } from '../../../http/user'
var app = getApp()
import { showToast } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    propList: [],
    imageUrl: app.globalData.baseImgUrl,
    outShow:false,
    outShowMsg:'激活成功，去逛逛机会'
  },
  //去激活
  goActive(e){
    let _id = e.currentTarget.dataset.id
    let _type=e.currentTarget.dataset.type
    let _msg=""
    if(_type==7){
      _msg="激活成功，AI智能帮你完善简历"
    }
    this.setData({
      outShowMsg:_msg,
      tmpType:_type
    })
    let _typeName='PHONE_JOB_SEEKER'
    if(_type==7){
      _typeName='AI_JOB_SEEKER'
    }
    let params = {
      belongId: _id,
      type: _typeName
    }
    //立即使用
    saveaProp(params).then(res => {
      if (res.code == 200) {
        if (res.data.code !== 0) return showToast(res.data.msg)
        //打开提示框
        this.setData({
          outShow:true
        })
        this.getProp(0)
      }
    })
  },
  //提示卡确定
  identifyHandle(){
    this.setData({
      outShow:false
    })
    if(this.data.tmpType==9){
      if(this.data.version==1){
        wx.reLaunch({
          url: '/pages/index/index',
        })
      }else{
        wx.reLaunch({
          url: '/subpackPage/versions/index/index',
        })
      }
    }else if(this.data.tmpType==7){
      wx.navigateTo({
        url: '/subpackPage/user/advantage/advantage',
      })
    }
  },
  cloneShow(){
    this.setData({
      outShow:false
    })
  },
  //去使用
  goUsing(e) {
    console.log(e, '111111')
    let id = e.currentTarget.dataset.id
    let propType = e.currentTarget.dataset.type
    propUsing(propType).then(res => {
      console.log(res, '查看')
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      if (res.data > 0) {
        wx.showToast({
          title: '您有道具正在使用',
          icon: 'none'
        })
        return
      } else {
        wx.navigateTo({
          url: `/subpackPage/user/resumeRefresh/resumeRefresh?id=${id}&propType=${propType}&used=0`
          // url: `/echartsPage/pages/resumeRefresh/resumeRefresh?id=${id}&propType=${propType}&used=0`,
        })
      }
    })
  },
  //查看
  goEcharts(e) {
    var id = e.currentTarget.dataset.id
    let propType = e.currentTarget.dataset.type
    let status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: `/subpackPage/user/resumeRefresh/resumeRefresh?id=${id}&propType=${propType}&used=1&status=${status}`,
    })
  },
  // positionCollect(e){
  //     this.getProp(0)
  // },
  // companyCollect(e){
  //     this.getProp(2)
  // },

  //顶部导航切换
  changeTabs(event) {
    console.log(event)
    this.setData({
      active: event.detail.index
    })
    if (event.detail.index == 1) {
      this.getProp(2)
    } else {
      this.getProp(event.detail.index)
    }
  },


  // 获取设备屏幕高度
  systemType() {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  tabChange(event) {
    this.setData({
      active: event.detail.current
    })
  },

  //获取我的道具列表
  getProp(type) {
    getProp({ status: type }).then(res => {
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      if (type == 0) {
        this.setData({ propList: res.data })
        console.log(this.data.propList)
      } else {
        this.setData({ propList: res.data })
        console.log(this.data.propList)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.systemType()
    this.getProp(0)
    this.setData({
      version:wx.getStorageSync('versions')
    })
  }
})