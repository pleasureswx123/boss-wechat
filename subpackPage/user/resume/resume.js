import { getResumeNotes,getResumeNotesNoTimes } from '../../../http/user'
import { apiUserJobStatus, apiUserJobDetails } from '../../../http/api'
import { showToast,calculateAge } from '../../../utils/util'
import {getAllTag} from '../../../http/versions'
// import {
//     getUserInfo
// } from '../../../http/login.js'
var app = getApp()
Page({
  data: {
    show: false,
    statausData: [],
    ExpType: '请选择求职状态',
    info: {},
    jobYear: null, //工作年限
    birthday: null,//年龄
    educationList: [], //学历列表
    workExperienceList: [], //技能标签列表
    certificate: [],//资格证书,
    imageUrl: app.globalData.baseImgUrl,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    scrollIntoView: '',
    newNoticeTagObj: {
      personalAdvantage: 0, // 个人优势
      jobExperience: 0, // 工作经历
      educationExperience: 0, // 教育经历
      projectExperience: 0, // 项目经历
    },
  },
  //console.log(result,'获取求职状态')
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
  bindEwm() {
    let _userInfo = wx.getStorageSync('userInfo').info
    wx.navigateTo({
      url: `/subpackPage/user/setWxNumber/setWxNumber?val=${JSON.stringify(_userInfo)}`
    })
  },
  openExp() {
    let list = this.data.statausData
    list.map(res => {
      if (res.name == this.data.ExpType) {
        res.selected = true
      }
    })
    this.setData({
      show: true,
      statausData: list
    })
  },
  changeSel(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.statausData
    for (let i = 0; i < list.length; i++) {
      list[i].selected = false
    }
    list[index].selected = true
    this.setData({
      statausData: list,
      ExpType: list[index].name,
      show: false
    })
    apiUserJobDetails({ jobWantedStatus: list[index].code }).then(res => {
      if (res.code == 200) wx.showToast({
        title: '状态修改成功',
        icon: 'none'
      })
    })
  },
  onClose() {
    this.setData({
      show: false
    })
  },
  goOtherPage(e) {
    let type = e.currentTarget.dataset.type
    let val = e.currentTarget.dataset.val || ''
    let certificate = e.currentTarget.dataset.certificate
    if (type == "addWorkExper" || type == "addProjectExper" || type == "education") {
      let status = e.currentTarget.dataset.status
      let val = e.currentTarget.dataset.val || ''
      var page = `/subpackPage/user/${type}/${type}?type=${status}&id=${val}`
    } else if (type == "advantage" || type == "editJobExpOld") {
      if (type == "editJobExpOld") {
        let _num = this.data.info.jobExpectationList.length
        var page = `/subpackPage/user/${type}/editJobExp?val=${val}&num=${_num}`
      } else {
        let jobPostItem = wx.getStorageSync('userInfo').info.jobExpectationList && wx.getStorageSync('userInfo').info.jobExpectationList[0] || { postId: wx.getStorageSync('postId') }
        var page = `/subpackPage/user/${type}/${type}?val=${val}&jobPostItem=${JSON.stringify(jobPostItem)}`
      }
    } else {
      console.log(certificate,'传递参数')
      var page = `/subpackPage/user/${type}/${type}?certificate=` + certificate
    }
    wx.navigateTo({
      url: page
    })
  },
  //获取简历详情
  getResumeNotes() {
    let userInfo = wx.getStorageSync('userInfo')
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
      this.setData({ info: res.data,userInfo })
      //处理工作年限
      let year = new Date().getFullYear()
      if (this.data.info.startWorkDate) {
        this.setData({ jobYear: calculateAge(this.data.info.startWorkDate) })
      }
      //处理年龄
      if (this.data.info.birthday) {
        this.setData({ birthday: calculateAge(this.data.info.birthday) })
      }
      //工作经历
      this.data.info.workExperienceList.forEach((item, index) => {
        this.data.info.workExperienceList[index].tag = item.tag && item.tag.split(',')
        item.wokeDetails = item.wokeDetails && item.wokeDetails.replaceAll('\n', '<br/>')
        item.thenStartTime = item.thenStartTime && item.thenStartTime.replace(/-/g, "/")
        item.thenEndTime = item.thenEndTime && item.thenEndTime.replace(/-/g, "/")
      })
      this.setData({ workExperienceList: this.data.info.workExperienceList })
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

      this.newNoticeTag()
    })
  },

   async onShow() {
    let _statausData = wx.getStorageSync('dictionary')[34]
    this.setData({
      statausData: _statausData
    })
    await this.getResumeNotes()
    this.getApiUserJobStatus()
    await this.newNoticeTag()
  },
  /**
   * 生命周期函数--监听页面加载
   */
   onLoad(options) {
    if (options.step) {
      this.setData({
        step: options.step
      })
      wx.hideHomeButton()
    }
    if (options.wayType && options.wayType !== 'null' && options.wayType !== 'undefined') {
      this.setData({
        wayType: options.wayType
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    //学历列表
    this.setData({
      educationList: wx.getStorageSync('dictionary')[6].map(item => {
        return item.name
      })
    })
    this.getResumeNotes()
    if (options.selectorName) {
      this.setData({
        selectorName: options.selectorName
      })
    }
  },
  goWork() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
    //此处添加判读是否填写简历完毕
    // checkContent().then(res=>{
    //     if(res.code==200){
    //         if(res.data==0){
    //             //更新数据
    //             getUserInfo().then((result) => {
    //                 if (result.code == 200) {
    //                     wx.setStorageSync('userInfo', result.data)
    //                 }
    //             })
    //             wx.reLaunch({
    //                 url:'/pages/index/index'
    //             })
    //         }else{
    //             showToast(res.msg)
    //         }
    //     }
    // })
  },

  previewWx() {
    wx.previewImage({
      current: this.data.userInfo.info.wechat, // 图片的地址url
      urls: [this.data.userInfo.info.wechat] // 预览的地址url
    })
  },
  // 在线预览我的简历
  previewMyResume() {
    wx.navigateTo({
      url: `/subpackPage/user/previewResume/previewResume`,
    })
  },
  // 在线简历生成附件简历
  createResume() {
    wx.navigateTo({
      url: `/subpackPage/user/createResume/createResume`,
    })
  },
  // 获取更新红点
  async newNoticeTag() {
    const res = await getAllTag(this.data.wayType)
    console.log(res,'红点在线简历')
    if (res.code !== 200) return
    this.setData({
      newNoticeTagObj: {
        personalAdvantage: 0, // 个人优势
        jobExperience: 0, // 工作经历
        educationExperience: 0, // 教育经历
        projectExperience: 0, // 项目经历
      },
    })
    let _newNoticeTagObj = this.data.newNoticeTagObj
    for (let key in _newNoticeTagObj) {
      if (res.data[key]) {
        _newNoticeTagObj[key] = res.data[key]
      }
    }
    this.setData({
      newNoticeTagObj: _newNoticeTagObj
    })
  },
})