import { getMyPageInfo, apigetBossStatus, getUserInfo, getNewNoticeTag, cancelNoticeTag } from '../../http/user'
import { showToast } from '../../utils/util'
import { getUnreadCount } from '../../http/api'
import { getAllTag, cancelRedis,notLoginActiveJQ,getWhetherActivePopUpJQ } from '../../http/versions'
var app = getApp()
const { Parser, Player } = require("../../libs/svgaplayer.weapp")
Page({
  data: {
    globalBottom: app.globalData.globalBottom,
    count: getApp().globalData.unReadMessageNum,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    // 胶囊
    capsule: {
      top: null,
      textTop: null,
      height: null
    },
    imageUrl: app.globalData.baseImgUrl, //图片路径
    imImages: app.globalData.imImages, //图片路径
    wrapTop: 10, //兼容不适配
    isLogin: false,
    userInfo: {}, //登录人信息数据
    formattedExpirationDate: null,
    data: {}, //沟通，收藏，面试，数据
    loginShow: false,
    isVersions: false,
    showCurrent: true,
    newNoticeTagObj: {
      recruitmentData: 0, // 招聘数据红点
      onlineResume: 0, // 在线简历红点
      attachmentResume: 0, // 附件简历红点
      jobIntention: 0, // 求职意向红点
      toolsMall: 0, // 道具商城（我的道具）红点
      resumeRefresh: 0, // 简历刷新红点
      jobRebate: 0, // 求职红包红点
      myWallet: 0, // 我的钱包红点
      myService: 0, // 我的客服红点
      feedback: 0, // 意见反馈红点
      about: 0, // 关于红点
      setting: 0, // 设置红点
    },
    guide: {
      guideMyShow: false,
      guideStep1: true,
      guideStep2: false,
      guideStep3: false,
      guideStep4: false,
      top1: 0,
      top2: 0,
      top3: 0
    },
    downAppList: [
      {
        icon: '/versions/loadApp2.gif',
        title: '3D地图求职快、面试实时提醒',
        tip: '功能强大丰富',
        buttonText: '去下载',
        type: 1
      },
      {
        icon: '/versions/loadApp1.gif',
        title: '我要招聘',
        tip: '您的同行都在这里招聘',
        buttonText: '去招聘',
        type: 2
      }
    ],
    current: 0,
    collectGuide: false,
    isReceive: true, // 未登录状态下获取是否有金秋活动(默认为true)
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    topOpacity: 0, // 顶部背景色透明度
  },
  // 滚动事件监听
  onPageScroll(e){
    // let {menuTop,menuHeight} = this.data.capsuleData
    this.setData({
      topOpacity: e.scrollTop / 140 > 0.8 ? 1 : e.scrollTop / 140
    })
    // console.log(this.data.topOpacity,'topOpacity')
  },

  startmessage(e) {
    console.log('startmessage=', e)
  },
  completemessage(e) {
    console.log('completemessage=', e)
  },
  //关闭收藏
  closeCollectGuide() {
    this.setData({
      collectGuide: false
    })
  },
  // 获取元素高度
  getPaddingTopFn() {
    let that = this
    //在线简历/道具商城
    wx.createSelectorQuery().selectAll('.common_fun_item').boundingClientRect(function (rects) {
      that.setData({
        ['guide.top1']: rects[0].top
      })
    }).exec();
    //求职红包
    wx.createSelectorQuery().selectAll('.qiuzhi').boundingClientRect(function (rects) {
      // const top2 = that.pxToRpx(rects[0].top);
      that.setData({
        ['guide.top2']: rects[0].top
      })
    }).exec();
    //版本切换
    wx.createSelectorQuery().selectAll('.banben').boundingClientRect(function (rects) {
      that.setData({
        ['guide.top3']: rects[0].top
      })
    }).exec();
    console.log(this.data.guide,'22222222222')
  },
  pxToRpx(px){
    const systemInfo = wx.getSystemInfoSync();
    return px / systemInfo.pixelRatio * (750 / systemInfo.windowWidth);
  },
  getUserInfo() {
    wx.removeStorageSync('userInfo')
    getUserInfo().then(result => {
      if (result.code == 200) {
        this.setData({
          userInfo: result.data
        })
        if (result.data.info.userVipExpire) {
          const date = new Date(result.data.info.userVipExpire.replace(/-/g, '/')); // 转换为JavaScript可识别的日期格式
          this.setData({
            formattedExpirationDate: `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`
          });
        }
        wx.setStorageSync('userInfo', result.data)
      }
    })
  },
  // 查看隐藏保护-boss权限
  async getBossStatus() {
    let userInfo = wx.getStorageSync('userInfo')
    const result = await apigetBossStatus({ userId: userInfo.info.userId })
    console.log(result, 'boss权限')
    this.setData({
      hideResumeFromBoss: result.data.hideResumeFromBoss
    })
  },
  //沟通过的数量数据
  async getMyPageInfo() {
    let userInfo = wx.getStorageSync('userInfo')
    // console.log(userInfo)
    let param = {
      currentDignity: 1,
      userId: userInfo.info.userId
    }
    const { code, data, msg } = await getMyPageInfo(param)
    if (code != 200) {
      showToast(msg)
      return
    }
    let joblist = wx.getStorageSync('dictionary')[34]
    this.setData({
      data: data,
      jobName: joblist[data.jobWantedStatus - 1]?.name
    })
    // console.log(code, data)
  },
  //切换版本
  changeBb() {
    this.setData({ isVersions: true })
  },
  //判断登录状态
  checkLogin() {
    let token = wx.getStorageSync('token')
    let versions = wx.getStorageSync('versions')
    let isLogin = token ? true : false
    this.setData({
      isLogin: isLogin,
      versions: versions
    })
  },
  //未登录点击跳转
  login() {
    this.setData({
      loginShow: true
    })
    // wx.navigateTo({
    //     url: '/pages/login/login',
    // })
  },
  // 简历/附件/求职/道具
  goOtherPage(e) {
    let page = `/pages/index/index`
    if (this.data.isLogin) {
      let type = e.currentTarget.dataset.type
      let myWallet = e.currentTarget.dataset.mywallet
      let _isValue = this.data.newNoticeTagObj[myWallet]
      let that = this
      this.setData({ myWallet })
      page = `/subpackPage/user/${type}/${type}?wayType=${myWallet}`
      wx.navigateTo({
        url: page,
        success: (res) => {
          console.log(res, '跳转成功', _isValue)
          // if (_isValue) {
          //   that.cancelTag()
          // }
        }
      })
    } else {
      this.setData({
        loginShow: true
      })
    }
  },
  goOtherPageIdx(e) {
    let page = `/pages/index/index`
    let type = e.currentTarget.dataset.type
    let myWallet = e.currentTarget.dataset.mywallet
    let _isValue = this.data.newNoticeTagObj[myWallet]
    this.setData({ myWallet })
    let that = this
    if (this.data.isLogin || type == 'customer' || type == 'about' || type == 'feedback') {
      page = `/subpackPage/user/${type}/index?wayType=${myWallet}`
      if (type == 'freeProp') {
        page = `/subpackPage/index/${type}/index?wayType=${myWallet}`
      }
      if (type == 'wallet') {
        page = `/subpackPage/user/recharge/index?wayType=${myWallet}`
      }
      wx.navigateTo({
        url: page,
        success: (res) => {
          if (myWallet == 'resumeRefresh') {
            if (_isValue) {
              that.cancelTag()
            }
          }
        }
      })
    } else {
      this.setData({
        loginShow: true
      })
    }
  },
  // 会员购买页面
  gotoMemberBuy() {
    if (this.data.isLogin) {
      if (this.data.userInfo.info.vip == 0 && !this.data.userInfo.info.userVipId) {
        wx.navigateTo({
          url: '/subpackPage/member/equities/index',
        })
      } else {
        wx.navigateTo({
          url: `/subpackPage/member/memberBuy/index`,
        })
      }
    } else {
      this.setData({
        loginShow: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.loadSvga()
    this.checkLogin()
    //从本地获取登录数据
    this.setData({ userInfo: wx.getStorageSync('userInfo').info })
    let that = this
    // 胶囊位置
    const capsule = wx.getMenuButtonBoundingClientRect()
    that.setData({
      ['capsule.top']: capsule.top,
      ['capsule.textTop']: capsule.top + Number(45),
      ['capsule.height']: capsule.height,
    })
    //未登录状态
    if (!this.data.isLogin && !wx.getStorageSync('guideMyShow')) {
      this.getPaddingTopFn()
      this.setData({
        ['guide.guideMyShow']: true
      })
    }

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
    let _isFirstSp = wx.getStorageSync('isFirstSp')
    this.setData({
      capsuleData: _capsuleData
    })
    //收藏小程序引导页
    if (!wx.getStorageSync('collectGuide') && !wx.getStorageSync('guideMyShow') && this.data.isLogin) {
      this.setData({
        collectGuide: true
      })
    }
  },
  // 引导页跳转
  goStep(e) {
    let step = e.currentTarget.dataset.step
    if (step == 1) {
      this.setData({
        ['guide.guideMyShow']: false
      })
      wx.setStorageSync('guideMyShow', 1)
    }
    for (let i = 1; i < 5; i++) {
      this.setData({
        [`guide.guideStep` + i]: false
      })
    }
    let name = `guide.guideStep` + step
    this.setData({
      [name]: true
    })
  },
  /**
  * 获取未读数
  */
  getUnread() {
    let _usrId = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.userId
    getUnreadCount({ userId: _usrId }).then(res => {
      if (res.code == 200) {
        this.setData({
          count: res.data
        })
        getApp().globalData.unReadMessageNum = res.data;
      }
    })
  },
  onShow() {
    if (this.data.isLogin) {
      //监听消息未读数
      let that = this
      that.getUnread()
      getApp().watch('unReadMessageNum', function () {
        that.setData({
          count: getApp().globalData.unReadMessageNum
        })
      })
      //查看数据
      this.getMyPageInfo()
      this.checkLogin()
      this.newNoticeTag()
      this.getBossStatus()
      this.getUserInfo()
      this.getWhetherActivePopUpJQFn()
      //从本地获取登录数据
      //this.setData({userInfo:wx.getStorageSync('userInfo').info})
    } else {
      // 未登录状态下获取是否有金秋活动
      this.notLoginActiveJQFn()
    }
  },
  goXq(event) {
    let { type } = event.currentTarget.dataset
    console.log(type, '11111', event)
    wx.navigateTo({
      url: `/subpackPage/user/shareZp/index?type=${type}`,
    })
  },
  weixinOnClose() {
    this.setData({
      loginShow: false
    })
  },

  // 获取更新红点
  async newNoticeTag() {
    // const res = await getNewNoticeTag()
    const res = await getAllTag('my')
    console.log(res, '红点')
    this.setData({
      newNoticeTagObj: {
        recruitmentData: 0, // 招聘数据红点
        onlineResume: 0, // 在线简历红点
        attachmentResume: 0, // 附件简历红点
        jobIntention: 0, // 求职意向红点
        toolsMall: 0, // 道具商城（我的道具）红点
        resumeRefresh: 0, // 简历刷新红点
        jobRebate: 0, // 求职红包红点
        myWallet: 0, // 我的钱包红点
        myService: 0, // 我的客服红点
        feedback: 0, // 意见反馈红点
        about: 0, // 关于红点
        setting: 0, // 设置红点
      }
    })
    if (res.code !== 200) return
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
  // 取消tag红点
  async cancelTag() {
    let myWallet = this.data.myWallet
    const res = await cancelRedis(myWallet)
  },
  // 监听轮播图的下标
  monitorCurrent(e) {
    let current = e.detail.current;
    this.setData({
      current: current
    })
  },

  async loadSvga() {
    try {
      const parser = new Parser();
      const player = new Player;
      await player.setCanvas('#demoCanvas')
      // const videoItem = await parser.load("https://cdn.jsdelivr.net/gh/svga/SVGA-Samples@master/angel.svga");
      const videoItem = await parser.load("https://gcjt-youpin-beijing.oss-cn-beijing.aliyuncs.com/resource/wechat/baseimages/my/jobSearchBenefits.svga")
      await player.setVideoItem(videoItem);
      player.startAnimation();
    } catch (error) {
      console.log(error);
    }
  },
  goQw() {
    wx.navigateTo({
      url: '/subpackPage/index/qiyeWx/index',
    })
  },
  gohd(){
    if(this.data.isLogin){
      wx.navigateTo({
        url: `/subpackPage/user/goldActivity/index`,
      })
    } else {
      this.setData({
        loginShow: true
      })
    }
  },

  // 未登录检测是否有金秋活动
  async notLoginActiveJQFn() {
    const result = await notLoginActiveJQ()
    console.log(result,'检测是否有金秋活动')
    if (result.code != 200) return
    this.setData({
      isReceive: result.data
    })
  },

  // 登录下检测是否有金秋活动
  async getWhetherActivePopUpJQFn() {
    const result = await getWhetherActivePopUpJQ()
    console.log(result,'检测是否有金秋活动111')
    if (result.code != 200) return
    this.setData({
      isReceive: result.data.hasActivity
    })
  },
})