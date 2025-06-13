import { jobSeekerInterviewSchedule, getInterviewAll } from '../../../http/api'
import { formatDate } from '../../../utils/util'
var app = getApp()
Page({

  data: {
    datalist: [],
    pageNum: 1,
    pageSize: 10,
    baseImageUrl: app.globalData.baseImgUrl, //图片路径
    defaultImage: '?x-oss-process=image/resize,w_80/quality,q_50',
    interviewAllList: [], // 全部面试结果
    title: '', // 区分
  },
  gotoDetail(event) {
    let { id } = event.currentTarget.dataset
    //debugger
    wx.navigateTo({
      url: `/packageIm/pages/interview/interview?comeFrom=1&interviewRecordId=` + id
    })
  },
  beforeChange(event) {
    this.setData({
      pageNum: 1,
      pageSize: 10,
      title: event.detail.title
    })
    if (event.detail.title == '面试记录') {
      this.setData({
        interviewAllList: []
      })
      this.getInterviewAllList()
    } else if (event.detail.title == '待面试') {
      this.setData({
        datalist: []
      })
      this.getJobSeekerJobRecord()
    }
  },
  getJobSeekerJobRecord() {
    let param = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      userId: wx.getStorageSync('userInfo').info.userId
    }
    let _records = this.data.datalist
    jobSeekerInterviewSchedule(param).then(res => {
      if (res.code == 200) {
        res.data.records && res.data.records.map((item, index) => {
          // item.interviewTime = item.interviewTime.split(' ')[0].split('-')[1] + "月" + item.interviewTime.split(' ')[0].split('-')[2] + "日"
          //item.interviewTime = formatDate(item.interviewTime,'M-D h:m')
          item.interviewTimeMD = ''
          if (index == 0) {
            item.interviewTimeMD = formatDate(item.interviewTime, 'M-D')
          } else {
            if (res.data.records[index - 1].interviewTimeMD != formatDate(item.interviewTime, 'M-D')) {
              item.interviewTimeMD = formatDate(item.interviewTime, 'M-D')
            }
          }
          item.interviewTimeHM = formatDate(item.interviewTime, 'h:m')
        })
        if (this.data.pageNum < res.data.pages) {
          this.setData({
            pageNum: res.data.current + 1
          })
        }
        this.setData({
          pages: res.data.pages,
          datalist: _records.concat(res.data.records)
        })
      }
    })
  },
  async getInterviewAllList() {
    let params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      userId: wx.getStorageSync('userInfo').info.userId,
      type: 5
    }
    let _interviewAllList = this.data.interviewAllList
    const res = await getInterviewAll(params)
    console.log(res, '全部面试结果')
    if (res.code !== 200) return
    res.data.interviewRecords.records && res.data.interviewRecords.records.map((item, index) => {
      // item.interviewTime = item.interviewTime.split(' ')[0].split('-')[1] + "月" + item.interviewTime.split(' ')[0].split('-')[2] + "日"
      //item.interviewTime = formatDate(item.interviewTime,'M-D h:m')
      item.interviewTimeMD = ''
      if (index == 0) {
        item.interviewTimeMD = formatDate(item.interviewTime, 'M-D')
      } else {
        if (formatDate(res.data.interviewRecords.records[index - 1].interviewTime, 'M-D') != formatDate(item.interviewTime, 'M-D')) {
          item.interviewTimeMD = formatDate(item.interviewTime, 'M-D')
        }
      }
      item.interviewTimeHM = formatDate(item.interviewTime, 'h:m')
    })
    if (this.data.pageNum < res.data.pages) {
      this.setData({
        pageNum: res.data.interviewRecords.current + 1
      })
    }
    this.setData({
      pages: res.data.pages,
      interviewAllList: _interviewAllList.concat(res.data.interviewRecords.records)
    })
  },
  onLoad(options) {
    this.getJobSeekerJobRecord()
    let dictionary = wx.getStorageSync('dictionary')
    this.setData({
      clearing: dictionary[48]
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    if (this.data.pageNum <= this.data.pages) {
      if (this.data.title == '待面试') {
        console.log(1111)
        this.getJobSeekerJobRecord()
      } else if (this.data.title == '面试记录') {
        this.getInterviewAllList()
      }
    }
  },
  // 去首页
  gotoIndex() {
    let versions = wx.getStorageSync('versions')
    // 如果已经选择好版本了
    if (versions) {
      if (versions == 1) {
        wx.reLaunch({
          url: `/pages/index/index`
        })
      } else {
        wx.reLaunch({
          url: `/subpackPage/versions/index/index`
        })
      }
    } else {
      // 如果没有选择版本
      wx.reLaunch({
        url: `/pages/index/index`
      })
    }
  }
})