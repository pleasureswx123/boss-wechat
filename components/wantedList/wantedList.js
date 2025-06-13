// components/infomationList/infomationList.js
var app = getApp()
import { timesDiff, getDistance, showToast } from '../../utils/util'
import { messageChatSign } from "../../http/api";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dataList: Array,
    value: [],
    tab: Number,
    // 区分是列表还是签到列表(默认是列表)
    type: {
      type: Number,
      value: 1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    defaultImage: '?x-oss-process=image/resize,w_100/quality,q_50',
    scaleList: [], //规模列表
    financingList: [], //融资阶段列表
    experienceList: [], //经验列表
    educationList: [], //学历
    clearing: [],//结算方式
    versions: '', // 版本
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goSs(e){
      let item = e.currentTarget.dataset.type
      this.triggerEvent('ssEvent',JSON.stringify(item))
    },
    // 职位详情
    jump(event) {
      // 当前点击的这一项的id和bossid
      let item = event.currentTarget.dataset.item
      if (item.id && item.belonger)
        wx.navigateTo({
          url: `/subpackPage/index/job_detail/index?postId=${item.id}&bossuserid=${item.belonger}`,
        })
      else
        wx.showToast({
          title: '该招聘用户数据为空',
          icon: 'none'
        })
    },
    // 面试签到
    sendMsg(e) {
      let me=this
      let rt = e.currentTarget.dataset.type
      let userInfo = wx.getStorageSync('userInfo').info
      let metes = null
      console.log(rt, '9999')
      let time = timesDiff(rt.interviewTime)
      console.log(time, '000')
      if (time.days > 0 || (time.days <= 0 && time.hours >= 1)) {
        showToast('面试前60分钟可签到')
        return
      }
      // 2024.03.29 ghy修改
      wx.getLocation({
        type: 'gcj02',
        geocode: true,
        success(res) {
          console.log(res, '定位位置');
          metes = getDistance(res.longitude, res.latitude, rt.longitude, rt.latitude)
          console.log(metes, '距离')
          if (metes > 50) return showToast('请在1千米内签到')
          messageChatSign(userInfo.userId, rt.interviewRecordId).then(res => {
            if (res.code == 200) {
              console.log('发送成功')
              me.triggerEvent('confirm',0)
              showToast('签到成功')
            }
          })
        },
        fail(err) {
          console.log(err, '错误');
        }
      });
      // let time = timesDiff(rt.interviewTime)
      // console.log(time, '000')
      // if (time.days > 0 || (time.days > 0 && time.hours >= 2)) {
      //   showToast('面试前2小时可签到')
      //   return
      // }
      // messageChatSign(userInfo.userId, rt.interviewRecordId).then(res => {
      //   if (res.code == 200) {
      //     console.log('发送成功')
      //     showToast('签到成功')
      //   }
      // })
    },
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      //获取字典数据
      let dictionary = wx.getStorageSync('dictionary')
      let versions = wx.getStorageSync('versions')
      this.setData({
        scaleList: dictionary[5].map(item => {
          return item.name
        }),
        financingList: dictionary[4].map(item => {
          return item.name
        }),
        experienceList: dictionary[33].map(item => {
          return item.name
        }),
        educationList: dictionary[6].map(item => {
          return item.name
        }),
        clearing: dictionary[48].map(item => {
          return item.name
        }),
        versions: versions
      })
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  }
})
