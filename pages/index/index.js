import {
  showToast,
  urlBack
} from '../../utils/util'
import { apiJobExpectationList, apiDictionary, apiGetAddress, getListByHomeNoLogin, getMaparound } from '../../http/index'
import { getUserInfo } from '../../http/login.js'
import { getVipExpireAlert, getVipExpireAlertBtn } from '../../http/user'
import { getUnreadCount, searchPostHome } from '../../http/api'
import { getAllTag } from '../../http/versions'
import { getWhetherActivePopUp, getWhetherActivePopUpJQ, getDrawInterests } from '../../http/versions'
// 引入lottie npm包
// import lottie from 'lottie-miniprogram'
var app = getApp()
const { Parser, Player } = require("../../libs/svgaplayer.weapp")
Component({
  data: {
    indexHeadHeight: 0, // 首页顶部高度
    addShow: false,
    token: null,
    count: getApp().globalData.unReadMessageNum,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    baseImageUrl: app.globalData.baseImgUrl,
    globalBottom: app.globalData.globalBottom,
    list: [],// 产品列表
    locationAddress: '不限', // 定位地址
    differentAddress: '廊坊', // 不同定位
    maximumLoan: '',
    searchNum: 0, // 控制全部/附近/最新的高亮显示
    post_index: 0, // 控制期望职位
    dataList: [], // 岗位数据
    postList: [], // 求职列表
    latitude: '', // 纬度
    longitude: '', // 经度
    pathValue: '',
    pageNum: 1, // 当前页码
    pages: 0, // 页
    total: 0, // 总条数
    postId: '', // 岗位id
    jobCityName: '', // 岗位名称
    textData: [], // 期望薪资
    industryList: [{ name: '不限', isActive: true, code: null }], // 行业
    sufferList: [], // 经验
    scaleList: [], // 公司规模
    financingList: [], // 融资
    educationList: [], // 学历
    natureList: [], // 企业性质
    typeList: [], // 招聘类型
    jsList: [],//结算方式,
    clearing: [], // 兼职薪资
    screen: {}, // 筛选数据
    isSticky: false, // 初始状态为非吸顶状态: 0
    searchBarStyle: '',
    show: false,
    popupHeight: 0, // 筛选弹框高度
    dataAll: {},
    searchStyle: '',
    marginTop: 12,
    currentJob: '', // 当前职位
    currentTab: {
      tab_name: '全部',
      tab_val: ''
    },
    jobTabStatus: {}, // 用于保存职位选择的列表tab状态
    showLoading: false,
    red: false, // 红包岗位
    latest: false, // 最新岗位
    nearBy: false, // 附近岗位
    loginShow: false,
    isAddShow: false,
    page_show: false,
    navHeight: '',
    menuButtonInfo: {},
    searchMarginTop: 0, // 搜索框上边距
    searchWidth: 0, // 搜索框宽度
    searchHeight: 0,// 搜索框高度
    isAddressModel: false,
    isRefreshing: false,//是否下拉刷新状态
    isFinish: false,//是否加载完全部数据
    sxNum: 0,
    jobExpectation: '', // 求职期望id
    isVersions: false, // 选择版本弹窗
    memberProp: null,
    areaId: '', // 区域id
    currentAddId: 0,
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    isRefreshingText: false, // 是否展示文字
    guide: {
      guideZzShow: false,
      guideStep1: true,
      guideStep2: false,
      guideStep3: false,
      top1: 0,
      top2: 0
    },
    collectGuide: false,
    activityPopUpShow: false,
    activityPopUpShow_JQ: false, // 金秋活动
    saveMoney: '0', // 节省金额
    activityEquityList: [], // 权益列表
    activityUrl: '',
    showType: -1,
    activityId: ''
  },
  methods: {
    // 获取元素高度
    getPaddingTopFn() {
      let that = this
      //在线简历/道具商城
      wx.createSelectorQuery().selectAll('.addPost').boundingClientRect(function (rects) {
        that.setData({
          ['guide.top1']: rects[0].top
        })
      }).exec();
      //求职红包
      wx.createSelectorQuery().selectAll('.tabNav_left').boundingClientRect(function (rects) {
        that.setData({
          ['guide.top2']: rects[0].top
        })
      }).exec();
    },
    // 引导页跳转
    goStep(e) {
      let step = e.currentTarget.dataset.step
      if (step == 1) {
        this.setData({
          ['guide.guideZzShow']: false
        })
        wx.setStorageSync('guideZzShow', 1)
      }
      for (let i = 1; i < 4; i++) {
        this.setData({
          [`guide.guideStep` + i]: false
        })
      }
      let name = `guide.guideStep` + step
      this.setData({
        [name]: true
      })
    },
    showLogin() {
      this.setData({ loginShow: true })
    },
    onPullDownRefresh: function () {
      // 下拉刷新时执行
    },
    // 搜索
    gotoSearch: function (event) {
      // if (!this.data.token) {
      //     this.setData({ loginShow: true })
      //     return
      // }
      wx.navigateTo({
        url: `/subpackPage/index/search/index?storageType=${'history'}`,
      })
      wx.removeStorageSync('screenArr')
      this.setData({ sxNum: 0 })
    },
    // 选择城市
    gotoCity() {
      let that = this
      // if (that.data.token) {
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.userLocation']) {
            wx.openSetting({
              success(res) {
                if (!res.authSetting['scope.userLocation']) {
                  // 用户没有授权位置信息，执行相关操作
                  showToast('需要开启位置定位授权才能使用地址功能')
                }
              }
            })
          } else {
            wx.navigateTo({
              url: `/subpackPage/index/cityIndex/index?currentAddId=${that.data.currentAddId}&addressNameNologin=${that.data.locationAddress}storageType=addressDetail`,
              events: {
                changeTab: function (data) {
                  let addressDetail = wx.getStorageSync('addressDetail')
                  that.setData({
                    showLoading: true,
                    pageNum: 1,
                    dataList: [],
                    locationAddress: addressDetail[that.data.currentAddId].jobCityName || addressDetail[that.data.currentAddId].name,
                    areaId: addressDetail[that.data.currentAddId].jobCityId,
                    postList: addressDetail,
                  })
                  that.getListByHome(false)
                }
              }
            })
          }
        }
      })
      //} else {
      //this.setData({ loginShow: true })
      //}
    },
    // 全部/附近/最新/红包岗/切换
    searchTab(event) {
      if (!this.data.token) return this.setData({ loginShow: true })
      this.setData({
        showLoading: true,
        red: false,
        nearBy: false,
        latest: false,
        pageNum: 1,
      })
      const tab = event.currentTarget.dataset.tab; // 获取tab名称
      const currentJob = this.data.currentJob; // 当前职位
      const _this = this
      function tab_val() {
        let tab_val = ''
        console.log('tab1=', tab)
        if (tab === '附近') {
          tab_val = _this.data.currentTab.tab_val && _this.data.currentTab.tab_val === 'asc' ? 'desc' : 'asc'
        }
        console.log('tab_val1=', tab_val)
        return tab_val
      }
      this.setData({
        currentTab: {
          tab_name: tab,
          tab_val: tab_val()
        }, // 展示高亮
        jobTabStatus: {
          ...this.data.jobTabStatus,
          [currentJob]: {
            tab_name: tab,
            tab_val: tab_val()
          }
        },
        dataList: [],
      });
      if (tab == '全部') return this.getListByHome()
      this.changeTabFn(tab)
    },
    // 职位切换展示
    post_TabNav(event) {
      wx.removeStorageSync('screenArr')
      this.setData({
        showLoading: true,
        red: false,
        nearBy: false,
        latest: false,
        pageNum: 1,
        sxNum: 0,
        areaId: ''
      })
      let addressDetail = wx.getStorageSync('addressDetail') // 取出
      const job = event.currentTarget.dataset.job;
      let { item } = event.currentTarget.dataset
      let index = event.currentTarget.id // 展示高亮
      const currentTab = this.data.jobTabStatus[job] || {
        tab_name: '全部',
        tab_val: ''
      };
      if (currentTab.tab_name == '全部' || currentTab.tab_name == '红包' || currentTab.tab_name == '兼职') {
        if (currentTab.tab_name == '红包') {
          this.setData({ red: true })
        }
      } else if (currentTab.tab_name == '附近') {
        this.setData({ nearBy: true })
      } else if (currentTab.tab_name == '最新') {
        this.setData({ latest: true })
      }
      let name = addressDetail[index].name
      this.setData({
        currentAddId: index,
        currentJob: job,
        currentTab: currentTab,
        post_index: index,
        postId: item.postId,
        jobType: item.jobType,
        pageNum: 1,
        sxNum: 0,
        areaId: item.jobCityId ? item.jobCityId : '',
        locationAddress: item.jobCityName ? item.jobCityName : name,
        latitude: item.lat || this.data.latitude,
        longitude: item.lon || this.data.longitude
      });
      // 推荐时没有求职期望id
      if (index == 0) {
        this.setData({ jobExpectation: '' })
      } else {
        this.setData({ jobExpectation: item.id })
      }
      this.getListByHome(false)
      this.getWhetherActivePopUpFn() // 获取活动弹窗
    },
    // 添加求职期望
    addPost() {
      let that = this
      if (!this.data.token) return this.setData({ loginShow: true }) // 打开登录弹窗
      wx.navigateTo({
        url: `/subpackPage/user/jobManage/jobManage`,
        events: {
          changeTab: async (data) => {
            let addressDetail = wx.getStorageSync('addressDetail')
            addressDetail[0] = { ...wx.getStorageSync('location'), postName: '推荐' }
            that.setData({
              showLoading: true,
              pageNum: 1,
              jobExpectation: '',
              dataList: [],
              post_index: 0,
              areaId: addressDetail[0].jobCityId,
              locationAddress: addressDetail[0].name,
              postList: addressDetail
            })
            wx.setStorageSync('addressDetail', addressDetail)
            // wx.setStorageSync('addressDetail', addressDetail)
            await that.getApiJobExpectationList(1)
            await that.getListByHome(false)
          }
        }
      })
    },
    // 微信快速登录关闭弹窗
    weixinOnClose() {
      this.setData({
        loginShow: false
      })
    },
    // 获取求职期望
    async getApiJobExpectationList(type) {
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
      if (type == 1) {
        this.setData({ postList: this.data.postList.slice(0, 1) })
      }
      let _postList = this.data.postList
      _postList.push(...data)
      wx.setStorageSync('addressDetail', _postList)
      let addressDetail = wx.getStorageSync('addressDetail')
      this.setData({
        postList: addressDetail,
        postId: data[0].postId,
        jobType: data[0].jobType,
        latitude: data[0].lat,
        longitude: data[0].lon,
        post_index: 0,
        noSame: noSame,
      })
      this.setData({ currentJob: this.data.postList[0].postName }) // 获取当前职位
      wx.setStorageSync('postId', data[0].postId)
    },
    // 获取首页列表(全部岗位)
    async getListByHome(isBeachBottom) {
      // let info = {
      //   pageNum: this.data.pageNum,
      //   pageSize: 5,
      //   latitude: this.data.latitude || null, // 纬度
      //   longitude: this.data.longitude || null, // 经度
      //   red: this.data.red, // 只看红包岗位
      //   latest: this.data.latest, // 最新岗位
      //   nearBy: this.data.nearBy, // 附近岗位
      //   areaId: this.data.areaId, // 区域id
      //   jobExpectation: this.data.jobExpectation, // 求职期望id
      //   ...this.data.screen
      // }
      let _module = 1
      let _type = 1
      // 如果不是推荐
      if (this.data.post_index != 0) {
        _module = 1
        _type = 2
      } else {
        // 如果是推荐
        _module = 5
      }
      if (_type == 2 && this.data.latest) {
        _module = 4
      } else if (_type == 2 && this.data.nearBy) {
        _module = 3
      } else if (_type == 2 && this.data.red) {
        _module = 2
      } else if (_type == 1 && this.data.red) {
        _module = 6
      } else if (_type == 1 && this.data.latest) {
        _module = 8
      } else if (_type == 1 && this.data.nearBy) {
        _module = 7
      }
      let info = {
        edition: 2,
        module: _module,
        pageNum: this.data.pageNum,
        pageSize: 5,
        distanceSort: this.data.currentTab.tab_val,
        latitude: this.data.latitude || null, // 纬度
        longitude: this.data.longitude || null, // 经度
        areaId: this.data.areaId, // 区域id
        jobExpectation: this.data.jobExpectation, // 求职期望id
        ...this.data.screen
      }
      setTimeout(async () => {
        let result = null
        result = await searchPostHome(info)
        if (result.code !== 200) {
          wx.showToast({
            title: result.msg,
            icon: 'none'
          })
          this.setData({ showLoading: false })
          this.setData({ dataList: [] })
          return
        }
        if (isBeachBottom) {
          let arr = this.setListData(result.data.list)
          this.setData({ showLoading: false })
          this.setData({
            dataList: [...this.data.dataList, ...arr],
          })
        } else {
          let newArr = result.data.list || []
          let arr = []
          arr = this.setListData(newArr)
          this.setData({ showLoading: false })
          this.setData({
            dataList: arr,
          })
        }
        this.setData({
          isRefreshingText: true,
          // isRefreshing: false,//关闭下拉刷新
          isFinish: this.data.dataList.length >= result.data.total //全部加载完毕
        })
        setTimeout(() => {
          this.setData({
            isRefreshingText: false,
            isRefreshing: false,//关闭下拉刷新
          })
        }, 1000)
      }, 0);


    },
    //列表数据结构整理
    setListData(newArr) {
      let activityTagsCopy = true
      return newArr.map(item => {
        if (item.activityTags.length > 0 && item.activityTags.indexOf(1) > -1) {
          activityTagsCopy = true
        } else {
          activityTagsCopy = false
        }
        return {
          post: item.title,
          num: this.data.typeList[item.type]?.name,
          year: this.data.sufferList[item.experience]?.name || '',
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
          stage: this.data.financingList[item.financeStage]?.name,
          corporationId: item.corporationId,
          //需要改字段，字段为scale
          scale: this.data.scaleList[item.scale]?.name,
          // distance: item.distance?.substring(0, 4),
          distance: item.distance,
          clearing: item.settlementUnit && this.data.clearing[item.settlementUnit - 1] ? this.data.clearing[item.settlementUnit - 1].name : '元/时', // 兼职结算方式
          looked: item.looked,
          activation: item.activation || '',
          online: item.online,
          urgent: item.urgent,
          activityTags: activityTagsCopy
        }
      })
    },
    // 字典数据
    getDictionary() {
      let resultData = {}
      if (wx.getStorageSync('dictionary')) {
        resultData = wx.getStorageSync('dictionary')
        this.setDataGs(resultData)
      } else {
        let ids = ''
        ids = '1,2,3,4,5,6,34,38,39,33,40,46,48,60,80,99,100'//38企业性质
        apiDictionary(ids).then(result => {
          wx.setStorageSync('dictionary', result.data)
          resultData = result.data
          this.setDataGs(resultData)
        })
      }
    },
    setDataGs(resultData) {
      resultData[6].unshift({ name: '不限' })
      this.setData({
        sufferList: resultData[33],
        textData: resultData[3],
        scaleList: resultData[5],
        financingList: resultData[4],
        educationList: resultData[6],
        natureList: resultData[38],
        typeList: resultData[39],
        jsList: resultData[46],
        clearing: resultData[48], // 结算方式
      })
    },
    // 筛选
    shaixuan() {
      if (!this.data.token) {
        this.setData({ loginShow: true })
        return
      }
      this.setData({ show: true })
    },
    // 筛选弹窗关闭
    onClose() {
      this.setData({ show: false })
    },
    // 筛选组件筛选完成后的数据
    screenEvent(event) {
      this.setData({
        screen: event.detail,
        show: false,
        showLoading: true
      })
      this.getListByHome(false)
    },
    screenNum(event) {
      this.setData({
        sxNum: event.detail
      })
    },
    // 获取当前位置信息
    async getAddress() {
      let params = {
        lon: this.data.longitude,
        lat: this.data.latitude
      }
      const result = await apiGetAddress(params)
      // result.data.cityName = '北京市'
      if (result.code !== 200) return showToast(result.msg)
      wx.setStorageSync('addressCityId', result.data.cityId)
      wx.setStorageSync('cityId', result.data.districtId)
      wx.setStorageSync('postArea', { name: result.data.streetName, id: result.data.streetId })
      const res = await getMaparound({ location: `${this.data.longitude},${this.data.latitude}`, radius: 500 })
      if (res.code !== 200) return
      // wx.setStorageSync('location', { ...res.data[0], jobCityId: result.data.streetId })
      wx.setStorageSync('longitude', {longitude: this.data.longitude, latitude: this.data.latitude})
      let _postList = this.data.postList
      _postList.push({ postName: '推荐', ...res.data[0], jobCityId: result.data.streetId }) // 追加定位周边第一个地址
      this.setData({ currentAddId: 0, areaId: result.data.streetId, postList: _postList })
      this.setData({ locationAddress: _postList[0].name }) // 修改搜索框展示的名称
      let postAddress = wx.getStorageSync('postAddress') // 取出之前定位存储的城市名字
      if (!postAddress) { // 判断当前是否存储过
        wx.setStorageSync('postAddress', result.data.cityName) // 存储
      } else {
        // 判断当前接口请求数据地址是否一致
        if (postAddress !== result.data.cityName) {
          this.setData({ isAddressModel: true }) // 如果不一致,则弹出检测定位弹出(询问用户是否更改)
          // 如果更改,则处理余下逻辑
        }
      }
    },
    // 处理tab函数
    changeTabFn(tab) {
      let that = this
      if (tab == '红包') {
        this.setData({ red: true })
        this.getListByHome(false)
      } else if (tab == '附近') {
        wx.getSetting({
          success(res) {
            if (!res.authSetting['scope.userLocation']) {
              wx.openSetting({
                success(res) {
                  that.setData({ nearBy: true })
                  if (!res.authSetting['scope.userLocation']) {
                    // 用户没有已经授权位置信息，执行相关操作
                    that.setData({
                      latitude: '',
                      longitude: '',
                    })
                  }
                }
              })
            } else {
              that.setData({ nearBy: true })
              that.getListByHome(false)
            }
          }
        })
      } else if (tab == '最新') {
        this.setData({ latest: true })
        this.getListByHome(false)
      }
    },
    onLoad(options) {
      const that = this;
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
      // 2024-12-31 新年版
      const windowWidth = systemInfo.screenWidth; // 窗口宽度
      console.log(windowWidth, 'menuButtonInfo')
      that.setData({
        capsuleData: _capsuleData
      })
      // wx.createSelectorQuery().select('#c0').node(res => {
      //   const canvas = res.node
      //   const context = canvas.getContext('2d')
      //   canvas.width = windowWidth //设置宽高，也可以放到wxml中的canvas标签的style中
      //   // canvas.hight = 80
      //   lottie.setup(canvas)//要执行动画，必须调用setup,传入canvas对象

      //   lottie.loadAnimation({//微信小程序给的接口，调用就完事了，原理不太懂
      //     loop: true,//是否循环播放（选填）
      //     autoplay: true,//是否自动播放（选填）
      //     path: 'https://gcjt-youpin-beijing.oss-cn-beijing.aliyuncs.com/resource/wechat/index_year.json',//lottie json包的网络链接，可以防止小程序的体积过大，要
      //     rendererSettings: {
      //       context//es6语法：等同于context:context（必填）
      //     }
      //   })
      // }).exec()
      // ------- 分隔
      let token = wx.getStorageSync('token')
      this.setData({
        token: token
      })
      if (token) {
        this.getParamsFn()
        this.loadEvent()
        this.getDictionary()
        this.getVipAlert()
      } else {
        this.setData({ showLoading: true })
        this.getListByHomeNoLogin(false)
        this.getLocationAsync()
      }
      wx.setStorageSync('currentPageIdx', 1)
      let versions = wx.getStorageSync('versions')
      if (!versions) {
        this.setData({ isVersions: true })
      } else {
        this.setData({ isVersions: false })
      }
      //字典数据空时获取字典
      var systeminfo = wx.getSystemInfoSync()
      this.setData({
        movehight: systeminfo.windowHeight,
        movehight2: systeminfo.windowHeight - 100,
        menuButtonInfo: wx.getMenuButtonBoundingClientRect()
      })
      const { top, width, height, right } = this.data.menuButtonInfo
      wx.getSystemInfo({
        success: (res) => {
          const { statusBarHeight } = res
          const margin = top - statusBarHeight
          this.setData({
            navHeight: (height + statusBarHeight + (margin * 2)),
            searchMarginTop: statusBarHeight + margin, // 状态栏 + 胶囊按钮边距
            searchHeight: height,  // 与胶囊按钮同高
            searchWidth: right - width - 20// 胶囊按钮右边坐标 - 胶囊按钮宽度 = 按钮左边可使用宽度
          })
        }
      })
      if (!wx.getStorageSync('guideZzShow') && this.data.token) {
        this.setData({
          ['guide.guideZzShow']: true
        })
        this.getPaddingTopFn()
      }
      //收藏小程序引导页
      if (!wx.getStorageSync('collectGuide') && wx.getStorageSync('guideZzShow') && this.data.token) {
        this.setData({
          collectGuide: true
        })
      }
    },
    closeCollectGuide() {
      this.setData({
        collectGuide: false
      })
    },
    onShow() {
      this.showEvent()
      if (this.data.token) {
        let isChange = wx.getStorageSync('isChange')
        if (isChange || isChange === 0) {
          let addressDetail = wx.getStorageSync('addressDetail')
          if (addressDetail) {
            this.setData({
              showLoading: true,
              pageNum: 1,
              postList: addressDetail,
              locationAddress: addressDetail[isChange].jobCityName || addressDetail[isChange].name,
              areaId: addressDetail[isChange].jobCityId
            })
            this.getListByHome(false) // 最后获取职位列表数据
          }
          wx.removeStorageSync('isChange')
        }

        this.getAllTagFn()
      }
    },
    onReady() {
      let that = this
      wx.createSelectorQuery().select('.gc_index_head').boundingClientRect((rect) => {
        that.setData({
          indexHeadHeight: Math.floor(rect.height)
        })
      }).exec();
    },
    // 求职期望和首页岗位列表顺序发出请求
    async getParamsFn() {
      this.setData({ showLoading: true, pageNum: 1 })
      await this.getLocationAsync() // 先获取定位经纬度
      await this.getApiJobExpectationList() // 获取求职期望
      await this.getListByHome(false) // 最后获取职位列表数据
      await this.getWhetherActivePopUpFn() // 获取活动弹窗
      await this.getWhetherActivePopUpJQFn() // 获取金秋活动弹窗
    },
    // 获取当前经纬度
    async getLocationAsync() {
      try {
        const location = await this.getLocation();
        // 在这里可以继续处理获取到的定位信息
        this.setData({
          latitude: location.latitude,
          longitude: location.longitude
        })
        // if (this.data.token) {
        await this.getAddress()
        // } else {
        //     let params = {
        //         lon: this.data.longitude,
        //         lat: this.data.latitude
        //     }
        //     const result = await apiGetAddress(params)
        //     if (result.code !== 200) return showToast(result.msg)
        //     wx.setStorageSync('addressCityId', result.data.cityId)
        //     wx.setStorageSync('cityId', result.data.districtId)
        //     wx.setStorageSync('postArea', { name: result.data.streetName, id: result.data.streetId })
        // }
      } catch (err) {
        // 处理定位失败的情况
        this.setData({
          locationAddress: '不限',
        });
        wx.removeStorageSync('postAddress');
        // wx.removeStorageSync('postAddressId');
      }
    },
    getLocation() {
      return new Promise((resolve, reject) => {
        wx.getLocation({
          type: 'gcj02',
          geocode: true,
          success(res) {
            resolve({
              latitude: res.latitude,
              longitude: res.longitude
            });
          },
          fail(err) {
            reject(err);
          }
        });
      });
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
    showEvent() {
      //字典数据空时获取字典
      // this.getDictionary()
      let tags = wx.getStorageSync('selectTags')
      if (tags) {
        let pick = tags.map((item, index) => {
          return {
            name: item.name,
            code: item.id,
            isActive: true
          }
        })
        this.data.industryList.splice(1, pick.length, ...pick)
        this.data.industryList[0].isActive = false
        this.setData({
          industryList: this.data.industryList
        })
        wx.removeStorageSync('selectTags')
      }
      let step = wx.getStorageSync('userInfo').step
      if (step == 1 || step == 16) {
        return
      }
      //监听消息未读数
      let that = this
      // 监听消息页面未读数
      getApp().watch('unReadMessageNum', function () {
        that.setData({
          count: getApp().globalData.unReadMessageNum
        })
      })
      if (this.data.token) {
        that.getUnread()
      }
    },
    getUserInfoM() {
      getUserInfo().then((result) => {
        if (result.code == 200) {
          wx.setStorageSync('userInfo', result.data)
          this.setData({
            userInfo: result.data
          })
          let step = result.data.step
          // 1求职者   (0跳到首页，1跳到岗位录入页面,16未完善简历)
          if (step == 1 || step == 16) {
            let url = urlBack(step)
            wx.reLaunch({
              url: url
            })
          }
        } else {
          showToast(result.msg)
        }
      })
    },
    async loadEvent() {
      //判断是否添加求职期望或者在线简历
      this.getUserInfoM()
      let popupHeight = wx.getSystemInfoSync().windowHeight - 80
      var that = this
      that.setData({
        popupHeight: popupHeight - app.globalData.statusBarHeight + app.globalData.navBarHeight - 80,
      })
      that.setData({
        pxAndRpx: 750 / wx.getSystemInfoSync().screenWidth
      })
    },
    // 获取首页数据信息
    async getListByHomeNoLogin(isBeachBottom) {
      await this.getDictionary()
      setTimeout(() => {
        let params = {
          dignity: 1,
          edition: 2,
          module: 10,
          latitude: this.data.latitude,
          longitude: this.data.longitude,
          pageSize: 10,
          pageNum: this.data.pageNum
        }
        searchPostHome(params).then(result => {
          //getListByHomeNoLogin(params).then(result => { 
          if (result.code !== 200) {
            wx.showToast({
              title: result.msg,
              icon: 'none'
            })
            this.setData({ showLoading: false })
            this.setData({ dataList: [] })
            return
          }
          if (isBeachBottom) {
            let arr = this.setListData(result.data.list)
            this.setData({ showLoading: false })
            this.setData({
              dataList: [...this.data.dataList, ...arr],
            })
          } else {
            let newArr = result.data.list || []
            let arr = []
            arr = this.setListData(newArr)
            this.setData({ showLoading: false })
            this.setData({
              dataList: arr,
            })
          }
          this.setData({
            isRefreshing: false, // 关闭下拉刷新
            isFinish: this.data.dataList.length >= result.data.total //全部加载完毕
          })
        })
      }, 500)
    },
    // 分享到好友
    onShareAppMessage: function () {
      return {
        title: '知城优聘',
        path: '/pages/index/index',
        imageUrl: this.data.logo,
        success(res) {
          console.log('成功', res)
        }
      }
    },
    // 分享到朋友圈
    onShareTimeline() {
      return {
        title: '知城优聘',
        query: '/pages/index/index',
      }
    },
    gourl() {
      wx.navigateTo({
        url: '/packageIm/pages/interview/interview',
      })
    },
    //监听scroll滚动事件
    onRefresh() {
      setTimeout(() => {
        if (this.data.token) {
          this.setData({
            pageNum: 1
          })
          this.getListByHome(false)
        } else {
          this.getListByHomeNoLogin(false)
        }
      }, 1000)
    },
    onLoadMore: function () {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      if (this.data.token) {
        this.getListByHome(true)
      } else {
        this.getListByHomeNoLogin(true)
      }
    },

    onPulling: function (e) {

    },
    //提示会员过期
    getVipAlert() {
      getVipExpireAlert().then(res => {
        if (res.code == 200) {
          this.setData({
            memberProp: res.data
          })
        }
      })
    },
    //会员提示关闭或续费
    closeProp(e) {
      getVipExpireAlertBtn({ day: this.data.memberProp.day, type: this.data.memberProp.type })
      if (e.detail == 1) {
        wx.navigateTo({
          url: '/subpackPage/member/equities/index',
        })
      } else if (e.detail == 2) {
        this.setData({
          memberProp: null
        })
      }
    },
    // 关闭收藏弹窗
    closePupop() {
      this.setData({ isGuide: false })
    },

    // 获取红点（首页/我的）
    async getAllTagFn() {
      const res = await getAllTag('first')
    },
    // 是否弹出活动弹窗
    async getWhetherActivePopUpFn() {
      let params = {
        lon: this.data.longitude,
        lat: this.data.latitude
      }
      const res = await getWhetherActivePopUp(params)
      if (res.code !== 200) return
      let activityIds = []
      if (res.data !== null) {
        if (!wx.getStorageSync('activityIds')) {
          activityIds.push(res.data.id)
          wx.setStorageSync('activityIds', activityIds)
        } else if (wx.getStorageSync('activityIds').includes(res.data.id)) return

        if (!wx.getStorageSync('activityIds').includes(res.data.id) && res.data !== null) {
          activityIds = wx.getStorageSync('activityIds')
          activityIds.push(res.data.id)
          wx.setStorageSync('activityIds', activityIds)
        }
        const urlLower = res.data.url.toLowerCase();
        if (urlLower.endsWith('.svga')) {
          this.setData({
            showType: 2
          })
        } else if (urlLower.endsWith('.png') || urlLower.endsWith('.jpg') || urlLower.endsWith('.jpeg')) {
          this.setData({
            showType: 1
          })
        } else if (urlLower.endsWith('.gif')) {
          this.setData({
            showType: 3
          })
        }
        this.setData({
          activityPopUpShow: true,
          activityUrl: res.data.url,
          activityId: res.data.id,
        })
        try {
          const parser = new Parser();
          const player = new Player;
          await player.setCanvas('#demoCanvas')
          const videoItem = await parser.load(res.data.url)
          await player.setVideoItem(videoItem);
          player.loops = 1
          player.clearsAfterStop = false
          player.startAnimation();
        } catch (error) {
        }
      }
    },
    // 关闭活动弹窗
    closeActivityProp() {
      this.setData({
        activityPopUpShow: false,
        activityPopUpShow_JQ: false,
      })
    },
    // 查看活动详情
    activityDetail() {
      this.setData({
        activityPopUpShow: false
      })
      let activityId = this.data.activityId
      wx.navigateTo({
        url: `/packageIm/pages/system/detail?id=${activityId}&type=${1}`,
      })
    },
    // 是否弹出金秋活动弹窗
    async getWhetherActivePopUpJQFn() {
      const result = await getWhetherActivePopUpJQ()
      // console.log(result, '是否弹出金秋活动弹窗')
      if (result.code != 200) return
      wx.setStorageSync('activityEquity', result.data)
      // 看本地是否存储过
      if (wx.getStorageSync('isActivityPopUpShow_JQ')) return
      if (result.data.hasActivity && !result.data.received) {
        this.setData({
          activityPopUpShow_JQ: true,
          activityEquityList: result.data.details,
          saveMoney: result.data.saveMoney
        })
        try {
          const parser = new Parser();
          const player = new Player;
          await player.setCanvas('#demoCanvas_JQ')
          const videoItem = await parser.load('https://gcjt-youpin-beijing.oss-cn-beijing.aliyuncs.com/resource/wechat/baseimages/jinqiu/test.svga')
          await player.setVideoItem(videoItem);
          // player.loops = 1
          // player.clearsAfterStop = false
          player.startAnimation();
        } catch (error) {
        }
        wx.setStorageSync('isActivityPopUpShow_JQ', 1)
      }
    },

    // 领取权益
    async getDrawInterestsFn() {
      let activityEquity = wx.getStorageSync('activityEquity')
      let params = {
        activityId: activityEquity.activityId
      }
      const result = await getDrawInterests(params)
      console.log(result, '领取权益')
      if (result.code != 200) return
      this.setData({
        activityPopUpShow_JQ: false
      })
      showToast('领取成功')
    },

    gotoActivityDetail() {
      wx.navigateTo({
        url: `/subpackPage/user/goldActivity/index`,
      })
      this.setData({
        activityPopUpShow_JQ: false
      })
    }
  }
})