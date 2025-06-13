// subpackPage/user/previewResume/previewResume.js
import { getResumeNotes } from '../../../http/user'
import { apiUserJobStatus, apiUserJobDetails } from '../../../http/api'
import { showToast } from '../../../utils/util'
let currentMonth = new Date().getMonth() + 1;
let currentDay = new Date().getDate(); // 获取当前日
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentMonth,
    currentDay,
    tabsList: [
      { text: '在线简历', index: 0 },
      { text: '推荐卡片', index: 1 },
      { text: '沟通卡片', index: 2 }
    ],
    visitList: [], // 数组
    baseImageUrl: app.globalData.baseImgUrl,
    imageUrl: app.globalData.baseImgUrl,
    distance: 0, // 动画距离（100为一个单位，初始为0）
    tabsId: 0, //默认选型为装备
    ExpType: '请选择求职状态',
    info: {},
    jobYear: null, //工作年限
    birthday: null,//年龄
    educationList: [], //学历列表
    workExperienceList: [], //技能标签列表
    certificate: [],//资格证书,
  },
  // 切换
  changeTab(event) {
    this.setData({
      //拿到当前索引并动态改变
      tabsId: event.currentTarget.dataset.index
    })
  },
  // 滑动时触发的事件
  slideOn(e) {
    // 拿到当前索引并动态改变
    this.setData({
      tabsId: e.detail.current
    })
  },
  //获取简历详情
  getResumeNotes() {
    let userInfo = wx.getStorageSync('userInfo').info
    getResumeNotes({
      jobUserId: wx.getStorageSync('userInfo').info.userId,
      resumeId: wx.getStorageSync('userInfo').info.resumeId
    }).then(res => {
      wx.hideLoading()
      if (res.code != 200) {
        showToast(res.msg)
        return
      }
      console.log(res.data, '简历详情111')
      this.setData({ info: res.data, userInfo })
      //处理工作年限
      let year = new Date().getFullYear()
      if (this.data.info.startWorkDate) {
        this.setData({ jobYear: year - this.data.info.startWorkDate.substr(0, 4) })
      }
      //处理年龄
      if (this.data.info.birthday) {
        this.setData({ birthday: year - this.data.info.birthday.substr(0, 4) })
      }
      //工作经历
      this.data.info.workExperienceList.forEach((item, index) => {
        this.data.info.workExperienceList[index].tag = item.tag && item.tag.split(',')
        item.wokeDetails = item.wokeDetails && item.wokeDetails.replaceAll('\n', '<br/>')
        item.thenStartTime = item.thenStartTime && item.thenStartTime.replace(/-/g, "/")
        item.thenEndTime = item.thenEndTime && item.thenEndTime.replace(/-/g, "/")
      })
      if(this.data.info.workExperienceList.length > 0 && this.data.info.workExperienceList[0].tag.length > 0){
        // this.data.info.workExperienceList[0].tag = this.data.info.workExperienceList[0].tag.slice(0,3)
        this.data.recommendList = this.data.info.workExperienceList[0].tag.slice(0,3)
      }
      this.setData({ workExperienceList: this.data.info.workExperienceList,recommendList: this.data.recommendList })
      //项目经历
      this.data.info.projectExperienceList.forEach((item, index) => {
        item.startTime = item.startTime && item.startTime.replace(/-/g, "/")
        item.endTime = item.endTime && item.endTime.replace(/-/g, "/")
        item.details = item.details && item.details.replaceAll('\n', '<br/>')
      })
      this.setData({ 'info.projectExperienceList': this.data.info.projectExperienceList })
      //教育经历
      this.data.info.educationExperienceList.forEach((item, index) => {
        item.schoolStartTime = item.schoolStartTime && item.schoolStartTime.replace(/-/g, "/")
        item.schoolEndTime = item.schoolEndTime && item.schoolEndTime.replace(/-/g, "/")
        item.schoolExperience = item.schoolExperience && item.schoolExperience.replaceAll('\n', '<br/>')
      })
      this.setData({ 'info.educationExperienceList': this.data.info.educationExperienceList })
      //资格证书处理
      let shool = this.data.info.certificate
      if (shool && shool.length > 0) {
        this.setData({ certificate: shool?.split(',') })
      } else {
        this.setData({ certificate: [] })
      }
      //滚动
      this.setData({
        scrollIntoView: this.data.selectorName
      })
    })
  },
  // 求职期望跳转
  goOtherPage(e) {
    let type = e.currentTarget.dataset.type
    var page = `/subpackPage/user/${type}/${type}`
    wx.navigateTo({
      url: page
    })
  },
  getApiUserJobStatus() {
    apiUserJobStatus().then(res => {
      if (res.code == 200) {
        let statausData = this.data.statausData
        let _num = null
        if (res.data || res.data === 0) {
          if (res.data - 1 >= 0)
            _num = statausData[res.data - 1].name
          this.setData({
            ExpType: _num
          })
          console.log(res.data, '获取求职状态')
        }
      }
    })
  },
  // 去购买简历置顶道具
  rechargeOrstageBuy() {
    wx.navigateTo({
      url: `/subpackPage/user/stageBuy/index?type=${5}`,
    })
  },
  back(){
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let _statausData = wx.getStorageSync('dictionary')[34]
    this.setData({
      statausData: _statausData,
      educationList: wx.getStorageSync('dictionary')[6].map(item => {
        return item.name
      })
    })
    this.getResumeNotes()
    this.getApiUserJobStatus()
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