import { getSystemMsg, oneClickRead } from '../../../http/api'
var app = getApp()
Page({
  data: {
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    baseImageUrl: app.globalData.baseImgUrl,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    navTagView: '', // 通知nav切换
    active: 0,
    type: 0,
    pageNum: 1,
    sizeNum: 10,
    navList: [{
      type: 0,
      value: 0,
      name: '道具通知'
    }, {
      type: 1,
      value: 1,
      name: '活动通知'
    }, {
      type: 2,
      value: 2,
      name: '系统通知'
    }, {
      type: 3,
      value: 3,
      name: '职位通知'
    }, {
      type: 4,
      value: 4,
      name: '会员通知'
    }, {
      type: 5,
      value: 5,
      name: '举报通知'
    }, {
      type: 6,
      value: 6,
      name: '审批通知'
    }, {
      type: 7,
      value: 7,
      name: '开票通知'
    }]
  },
  changeTab(e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      active: type,
      type: this.data.navList[type].value,
      datalist: [],
      navTagView: 'navTagView' + type
    })
    this.getSystemMsg()
  },
  // 获取系统通知数据
  getSystemMsg() {
    let _userId = wx.getStorageSync('userInfo').info.userId
    let param = {
      userId: _userId,
      pageNum: this.data.pageNum,
      sizeNum: this.data.sizeNum,
      type: this.data.type
    }
    getSystemMsg(_userId, param).then(res => {
      if (res.code == 200) {
        let newArr = res.data.records.map(item => {
          return {
            ...item,
            contentJson: JSON.parse(item.contentJson)
          }
        })
        this.setData({
          datalist: newArr
        })
      }
    })
  },
  onShow(options) {
    this.getSystemMsg()
  },
  goDetail(e) {
    let id = e.currentTarget.dataset.id
    let smallType = e.currentTarget.dataset.smalltype
    let contentjson = e.currentTarget.dataset.contentjson
    if (smallType == '2-1') {
      // 去开启虚拟电话页面
      wx.navigateTo({
        url: `/subpackPage/user/setPhone/setPhone?id=${id}`,
      })
    } else if (smallType == '1-4') {
      wx.navigateTo({
        url: `./detail?id=${contentjson.activitiesId}&notificationId=${id}&type=${1}`,
      })
    } else {
      wx.navigateTo({
        url: './detail?id=' + id,
      })
    }
  },
  goBack() {
    wx.navigateBack()
  },
  clearFun() {
    oneClickRead().then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '所有消息均设为已读',
          icon: 'none'
        })
        this.getSystemMsg()
      }
    })
  },
  onLoad(options) {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const _capsuleData = { ...this.data.capsuleData }
    // 导航栏高度 = 状态栏高度 + 44
    _capsuleData.navBarHeight = systemInfo.statusBarHeight + 44;
    _capsuleData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    _capsuleData.menuTop = menuButtonInfo.top;
    _capsuleData.menuHeight = menuButtonInfo.height;
    _capsuleData.menuWidth = menuButtonInfo.width
    this.setData({
      capsuleData: _capsuleData,
    })
    console.log(options, '传递的参数')
    if (options.systemType !== 'null' && options.systemType !== 'undefined') {
      this.setData({
        active: options.systemType,
        type: this.data.navList[Number(options.systemType)].value,
        navTagView: 'navTagView' + options.systemType
      })
    }
  }
})