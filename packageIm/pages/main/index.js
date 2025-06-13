const app = getApp();
let WebIM = require("../../../utils/imUtils/WebIM")["default"];
let msgStorage = require("../../../utils/imUtils/msgstorage");
import {
  showToast
} from '../../../utils/util'
import {
  getNewPostList,
  chatSessionList,
  getLookList,
  getCollectedToMeList,
  getUnreadCount,
  getAllUnMsg,
  searchPostHome
} from '../../../http/api.js'
import {
  checkTime
} from '../../../utils/util'
import { apiJobExpectationList } from '../../../http/index'
import { getCheckIllegal } from '../../../http/versions'

import { notification } from '../../../http/user'
Page({
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    loginShow: false,
    title: '登录后查看信息',
    count: getApp().globalData.unReadMessageNum,
    sessionList: [{}],
    topSessionList: [],
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    globalBottom: app.globalData.globalBottom,
    active: 0,
    sActive: 0,
    isEllipsis: false,
    bigTabs: [{
      type: 0,
      name: '消息',
      num: 0
    }, {
      type: 1,
      name: '新职位',
      num: 0
    }, {
      type: 2,
      name: '对我感兴趣',
      num: 0
    }
      // , {
      //     type: 3,
      //     name: '看过我',
      //     num: 0
      // }
    ],
    // 条件筛选
    tabVal: 1,
    // termId:0,
    termId: -1, // 2023-10-19 ghy修改
    termVal: '我发起',
    navData: [
      {
        label: '未读消息',
        value: 5,
        type: 'unread',
        talentMark: 'all'
      },
      //  {
      //     label: '我发起',
      //     value: 0,
      //     type: 'owner',
      //     talentMark: 'all'
      // },
      // {
      //     label: '招聘官发起',
      //     value: 1,
      //     type: 'target',
      //     talentMark: 'all'
      // },
      // {
      //     label: '沟通中',
      //     value: 2,
      //     type: 'talking',
      //     talentMark: 'all'
      // },
      {
        label: '发过简历',
        value: 3,
        type: 'all',
        talentMark: 'resume'
      },
      {
        label: '约过面试',
        value: 4,
        type: 'all',
        talentMark: 'interview'
      }
    ],
    list: [{}],             //接收数据的数组
    windowHeight: "",     //适配设备的高度
    page: 1,              //记录加载数据的页数参数
    flag: true,            //记录是否请求数据的状态
    params: {
      dignity: 1,
      userId: null,
      //pageNum: 1,   //此处不传则传回来所有数据
      // pageSize: 10, //此处不传则传回来所有数据
      hxUsername: null,
      talentMark: "all",
      msgType: "all"
    },
    postParams: {
      pageNum: 1,
      pageSize: 10
    },
    listTotal: 0,
    token: 1,
    dropdown_menu: null,
    show: false,
    tabActive: 'all',
    showLoading: true,
    postList: [], // 当前登陆人的求职期望
    postActive: 0, // 求职期望高亮
    msgNumArr: [],
    isFirstlook: 1, //是否第一次看
    isShowContact: false, // 简历有问题弹窗
    jlShInfo: {},
    collectGuide: false,
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    showPushBox: true,
  },
  onLoad(options) {
    let token = wx.getStorageSync('token')
    let versions = wx.getStorageSync('versions')
    this.setData({
      token: token,
      versions: versions
    })
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
      capsuleData: _capsuleData
    })
    if (token) {
      let isFirstlook = wx.getStorageSync('isFirstlook')
      this.setData({
        title: '暂无消息记录',
        isFirstlook: isFirstlook === 0 ? 0 : 1
      })
      this.getDictionary()
      // 2023-10-18ghy添加
      this.getApiJobExpectationList()
      // 2024-03-23ghy添加
      this.getCheckIllegal1()
      // 2024-09-27ghy添加
      this.getNotification()
      //收藏小程序引导页
      if (!wx.getStorageSync('collectGuide') && this.data.token) {
        this.setData({
          collectGuide: true
        })
      }
    }
  },
  closeCollectGuide() {
    this.setData({
      collectGuide: false
    })
  },
  onShow() {
    // 获取用户信息登录环信
    const hxaccount = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.hxUname || '';
    const hxpassword = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.hxPass || '';
    if (hxaccount && hxpassword && !WebIM.conn.isOpened()) {
      WebIM.conn.open({
        apiUrl: WebIM.config.apiURL,
        user: hxaccount,
        pwd: hxpassword,
        grant_type: 'password',
        appKey: wx.getStorageSync('appKey') || WebIM.config.appkey
      })
    }
    let token = wx.getStorageSync('token')
    if (token) {
      //监听消息未读数
      let that = this
      getApp().watch('unReadMessageNum', function () {
        that.setData({
          count: getApp().globalData.unReadMessageNum
        })
      })
      //监听消息
      that.onReadyFun()
      that.getUnread()
      that.getAllUnMsgData()
      if (wx.getStorageSync('userInfo').info) {
        this.setData({
          ['params.userId']: wx.getStorageSync('userInfo').info.userId,
          ['params.hxUsername']: wx.getStorageSync('userInfo').info.hxUname,
          sessionList: [],
          // ['params.pageNum']: 1
        })
      }
      this.getData()
      // 2024-03-23ghy添加
      this.getCheckIllegal1()
      wx.$event.on('updateMsg', this, this.getData)
    }
  },
  onReadyFun() {
    let that = this
    //监听新消息
    msgStorage.on("newChatMsg", function dispMsg(renderableMsg, type, curChatMsg, sesskey) {
      let pages = getCurrentPages(); // 获取页面指针数组
      let currentPage = pages[pages.length - 1]; // 获取当前页
      if (currentPage.route != 'packageIm/pages/main/index') return
      //监听会话列表
      let _list = that.data.sessionList
      _list.map(item => {
        if (renderableMsg.info.from == item.targetUsername || renderableMsg.info.to == item.targetUsername) {
          if (renderableMsg.id == item.mid) return
          item.mid = renderableMsg.id
          that.setReadNum(1, renderableMsg.info.from)
        }
      })
      that.setData({
        sessionList: _list
      })
      //监听置顶消息
      let _topSessionList = that.data.topSessionList
      _topSessionList.map(item => {
        if (renderableMsg.info.from == item.targetUsername || renderableMsg.info.to == item.targetUsername) {
          if (renderableMsg.id == item.mid) return
          item.mid = renderableMsg.id
          that.setReadNum(1, renderableMsg.info.from)
        }
      })
      that.setData({
        sessionList: _topSessionList
      })
    });
  },
  /**
      * 导航消息红点
      */
  getAllUnMsgData() {
    getAllUnMsg().then(res => {
      if (res.code == 200) {
        this.setData({
          [`bigTabs[1].num`]: res.data.data.postNewCount,
          [`bigTabs[2].num`]: res.data.data.collectNewCount,
          // [`bigTabs[3].num`]: res.data.data.lookNewCount
        })
      }
    })
  },
  /**
    * 获取未读数
    */
  getUnread() {
    let _usrId = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.userId
    getUnreadCount({ userId: _usrId }).then(res => {
      if (res.code == 200) {
        console.log(res.data, '返回获取未读数')
        this.setData({
          count: res.data,
          [`bigTabs[0].num`]: res.data
        })
        getApp().globalData.unReadMessageNum = res.data;
      }
    })
  },
  //清除未读数
  setReadNum(e, fromHx) {
    let _sessionList = this.data.sessionList
    let _topSessionList = this.data.topSessionList
    _sessionList.map(item => {
      if (e == 1) {
        if (item.targetUsername == fromHx) {
          item.unReadNum++
        }
      } else {
        if (item.id == e.detail) {
          item.unReadNum = 0
        }
      }
    })
    _topSessionList.map(item => {
      if (e == 1) {
        if (item.targetUsername == fromHx) {
          item.unReadNum++
        }
      } else {
        if (item.id == e.detail) {
          item.unReadNum = 0
        }
      }
    })
    this.setData({
      sessionList: _sessionList,
      topSessionList: _topSessionList
    })
  },
  getData(param) {
    if (param?.detail == 'edit') {
      this.setData({
        // ['params.pageNum']: 1,
        listTotal: null
      })
    }
    let _params = this.data.params
    if (param && param.pageNum > 0) {
      _params = param
    }
    if (this.data.sessionList.length < this.data.listTotal || !this.data.listTotal)
      chatSessionList(_params).then((res) => {
        console.log(res,12345678)
        if (res.code == 200) {
          res.data.sessionList.records.map(item => {
            item.msgTimestamp = checkTime(item.msgTimestamp, 'main')
          })
          res.data.topSessionList.map(item => {
            item.msgTimestamp = checkTime(item.msgTimestamp, 'main')
          })

          // if (_params.pageNum == 1) {
          console.log(res.data.sessionList, 'shshjjska')
          this.setData({
            showLoading: false,
            // sessionList: res.data.sessionList.records
            // 2023-10-19 ghy添加
            sessionList: res.data.sessionList.records.map(item => {
              return {
                ...item,
                islongpressModel: false
              }
            })
          })
          // } else {
          // this.setData({
          //   showLoading: false,
          //   sessionList: this.data.sessionList.concat(res.data.sessionList.records)
          // })
          // }
          this.setData({
            showLoading: false,
            // ['params.pageNum']: res.data.sessionList.pages,
            ['listTotal']: res.data.sessionList.total,
            topSessionList: res.data.topSessionList
          })
        } else {
          this.setData({
            showLoading: false
          })
        }
      });
  },
  onChange(e) {
    if (this.data.token) {
      let type = e.currentTarget.dataset.type
      this.setData({
        active: type,
        dataList: [],
        showLoading: true,
        ["bigTabs[" + type + "].num"]: 0
      })
      this.getPostList(type)
    } else {
      this.goLogin()
    }
  },
  closeYd() {
    this.setData({
      isFirstlook: 0
    })
    wx.setStorageSync('isFirstlook', 0)
  },
  getPostList(type) {
    this.setData({
      showLoading: true,
      dataList: []
    })
    if (type == 2) {
      getCollectedToMeList(this.data.postParams).then(res => {
        this.setDataFormate(res.data.publishPostParam.list)
      })
    } else if (type == 3) {
      getLookList(this.data.postParams).then(res => {
        this.setDataFormate(res.data.publishPostParam.list)
      })
    } else if (type == 1) {
      let _postId = this.data.postActive
      let params = {
        edition: wx.getStorageSync('versions') == 2 ? 1 : 2,
        // postId: _postId,
        // module:wx.getStorageSync('versions')==2?2:4
        jobExpectation: _postId,
        module: wx.getStorageSync('versions') == 2 ? 21 : 4
      }
      //getNewPostList({ postId: _postId }).then(res => {
      searchPostHome(params).then(res => {
        this.setDataFormate(res.data.list)
      })
    } else {
      this.setData({
        showLoading: false
      })
    }
  },
  // 字典数据
  getDictionary() {
    if (wx.getStorageSync('dictionary')) {
      let resultData = wx.getStorageSync('dictionary')
      this.setData({
        sufferList: this.mapData(resultData[33]),
        scaleList: this.mapData(resultData[5]),
        financingList: this.mapData(resultData[4]),
        typeList: this.mapData(resultData[39])
      })
    }
  },

  // 处理筛选数据的函数
  mapData(data) {
    let add = data.map(item => {
      let isActive = false
      if (item.name == '不限') {
        isActive = true
      } else {
        isActive = false
      }
      return {
        ...item,
        isActive: isActive
      }
    })
    return add
  },
  //设置数据格式
  setDataFormate(resData) {
    let _dataList = []
    resData && resData.map(item => {
      _dataList.push({
        post: item.title,
        num: this.data.typeList[item.type].name,
        year: this.data.sufferList[item.experience].name,
        companyName: item.corporationName,
        city: item.city,
        province: item.province,
        tag: item.tag && item.tag.split(','),
        username: item.belonger,
        isH: item.redPacket,
        moneyType: item.moneyType,
        maximumMoney: item.maximumMoney,
        lowestMoney: item.lowestMoney,
        monthMoney: item.monthMoney,
        postId: item.id,
        bossUserId: item.belonger,
        outName: item.outName,
        avatar: item.avatar,
        outPost: item.outPost,
        stage: this.data.financingList[item.financeStage] && this.data.financingList[item.financeStage].name,
        corporationId: item.corporationId,
        //需要改字段，字段为scale
        scale: this.data.scaleList[item.scale].name
      })
    })
    this.setData({
      dataList: _dataList,
      showLoading: false
    })
  },
  loadMore() {
    //根据请求状态flag请求数据
    if (this.data.params.pageNum <= this.data.listTotal) {
      this.getData();
    }
  },
  changePage(type) {
    let _active = 0
    if (type.detail.type == 'interested') {
      _active = 2
    } else if (type.detail.type == 'have_see_you') {
      _active = 3
    } else if (type.detail.type == 'post_new_position') {
      _active = 1
    } else if (type.detail.type == 'system_notification') {
      // 携带一个type
      wx.navigateTo({
        url: `/packageIm/pages/system/system?systemType=${type.detail.specialNoticeType}`,
      })
    } else if (type.detail.type == 'not_interested') {
      wx.navigateTo({
        url: '/packageIm/pages/notInterested/index',
      })
    }
    this.setData({
      active: _active
    })
    this.getPostList(_active)
  },
  goLogin() {
    this.setData({
      loginShow: true
    })
  },
  weixinOnClose() {
    this.setData({
      loginShow: false
    })
  },
  changeTerm(e) {
    // 2023-10-19 ghy修改
    this.setData({
      termId: -1
    })
    let value = e.currentTarget.dataset.val
    let param = this.data.params
    if (this.data.tabVal == 2 && value == 2) {
      this.setData({
        termShow: true,
        show_mask: true
      })
    } else if (this.data.tabVal == 1 && value == 2) {
      this.setData({
        tabVal: value,
        ['params.msgType']: this.data.navData[this.data.termId].type || 'owner',
        ['params.talentMark']: this.data.navData[this.data.termId].talentMark || 'all'
      })
      this.close_mask()
      param.pageNum = 1
      this.getData(param)
    } else {
      this.setData({
        tabVal: value,
        ['params.msgType']: 'all',
        ['params.talentMark']: 'all',
        sessionList: []
      })
      this.close_mask()
      param.pageNum = 1
      this.getData(param)
    }
  },
  navClick(e) {
    // 2023-10-19 ghy修改
    this.setData({
      tabVal: 0
    })
    //筛选条件
    let val = e.currentTarget.dataset.item
    let param = this.data.params
    this.setData({
      termId: val.value,
      termVal: val.label,
      ['params.msgType']: val.type,
      ['params.talentMark']: val.talentMark,
      sessionList: []
    })
    this.close_mask()
    param.pageNum = 1
    this.getData(param)
  },
  close_mask: function () {
    this.setData({
      termShow: false,
      show_mask: false
    });
  },


  // 2023-10-18 ghy添加
  // 获取求职期望
  async getApiJobExpectationList() {
    this.setData({ postList: [] })
    let { code, data, msg } = await apiJobExpectationList()
    if (code != 200) return showToast(msg);
    let _val = data[0].baseCityName
    let _postId = data[0].postId
    let noSame = 0
    data.map(item => {
      if (_postId == item.postId && _val != item.baseCityName) {
        noSame++
      }
      item.baseCityName = item.baseCityName && item.baseCityName.replace(/市|城区$/, '');
    })
    this.setData({
      postList: data,
      postActive: data[0].id,
      noSame: noSame
    })
  },
  // 切换
  changePost(event) {
    let { id } = event.currentTarget.dataset
    this.setData({
      postActive: id
    })
    this.getPostList(1)
  },

  // 判断是否违规
  async getCheckIllegal1() {
    const res = await getCheckIllegal()
    console.log(res, '00000')
    if (res.code != 200) return showToast(res.msg)
    if (!res.data) {
      this.setData({
        isShowContact: false
      })
    } else {
      this.setData({
        isShowContact: true
      })
    }
    if (res.data) {
      this.setData({
        jlShStatus: res.data,
        jlShInfo: res.data
      })
    }
  },
  onClose() {
    this.setData({ isShowContact: false })
  },
  // 关闭职位推送图片
  push_close() {
    this.setData({
      showPushBox: false
    })
    wx.setStorageSync('isShowPushBox', 1)
  },
  gotoPushDetail() {
    wx.navigateTo({
      // url: '/subpackPage/user/setup/noticeDetail/index',
      url: '/subpackPage/user/setup/notice/index'
    })
  },
  // 查询是否开启职位信息推送
  async getNotification() {
    if (wx.getStorageSync('isShowPushBox') == 1) return this.setData({
      showPushBox: false
    })
    const result = await notification(wx.getStorageSync('userInfo').info.userId)
    console.log(result, '查询是否开启职位信息推送')
    // 打开了就关闭，关闭了就打开
    this.setData({
      showPushBox: result.data.recommendPosition == 1 ? false : true
    })
  }
});
