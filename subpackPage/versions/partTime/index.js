const app = getApp();
const { Parser, Player } = require("../../../libs/svgaplayer.weapp")
import { getUnreadCount, searchPostHome } from '../../../http/api'
import { apiGetAddress, getMaparound } from '../../../http/index'
import { getVipExpireAlert, getVipExpireAlertBtn } from '../../../http/user'
import { getRecommendPropApi } from '../../../http/versions'
import { showToast } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: app.globalData.unReadMessageNum,
    globalBottom: app.globalData.globalBottom,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    locationAddress: '不限', // 显示的地址
    baseImageUrl: app.globalData.baseImgUrl,
    token: null,
    latitude: '',
    longitude: '',
    dataList: [], // 列表数组(职位)
    propData: undefined, // 推荐道具对象
    pageNum: 1, // 职位接口页码
    pageSize: 15, // 职位接口条数
    pageRecommendNum: 1, // 推荐接口页码
    pageRecommendSize: 15, // 推荐接口条数
    loginShow: false, // 微信快速登录弹窗
    showLoading: false, // loading效果
    isShow: false, // 筛选弹窗
    sxNum: 0, // 筛选数量
    isRefreshing: false,//是否下拉刷新状态
    isFinish: false,//是否加载完全部数据
    isUpload: false, // 推荐数据加载完毕
    currentTab: {
      tab_name: '全部',
      tab_val: ''
    },
    post_index: 0,
    screen: {}, // 筛选条件
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    memberProp: null,
    red: false, // 红包岗
    new: false, // 最新
    areaIds: [], // 区域id
    scrollThreshold: 0, // 外层scroll滚动阀值（为搜索框高度和金刚区高度）
    partTime_ScrollY: true, // 外层scroll是否可以滚动
    waterfall_ScrollY: false, // 内层scroll是否可以滚动
    module_dom: 100,
    total: 0, // 总条数
    totalPages: 0, // 总页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    const _capsuleData = { ...this.data.capsuleData }
    let token = wx.getStorageSync('token') // 获取token
    let popupHeight = wx.getSystemInfoSync().windowHeight - 60 // 弹窗高度
    let dictionary = wx.getStorageSync('dictionary')
    dictionary[6].unshift({ name: '不限' })
    // 导航栏高度 = 状态栏高度 + 44
    _capsuleData.navBarHeight = systemInfo.statusBarHeight + 44;
    _capsuleData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    _capsuleData.menuTop = menuButtonInfo.top;
    _capsuleData.menuHeight = menuButtonInfo.height;
    _capsuleData.menuWidth = menuButtonInfo.width

    that.setData({
      capsuleData: _capsuleData,
      token: token,
      popupHeight: popupHeight,
      sufferList: this.mapData(dictionary[33]),
      textData: this.mapData(dictionary[3]),
      scaleList: this.mapData(dictionary[5]),
      financingList: this.mapData(dictionary[4]),
      educationList: this.mapData(dictionary[6]),
      jsList: this.mapData(dictionary[46]),
      typeList: this.mapData(dictionary[39]),
      clearing: this.mapData(dictionary[48]), // 结算方式
      showLoading: true
    })

    if (!token) {
      this.getParamsNoLoginFn()
    } else {
      //设置eventbus自定义事件
      wx.$event.on('jbCity', this, this.jbCity)
      this.getParamsFn()
      this.getVipAlert()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    const query = this.createSelectorQuery();
    let _scrollThreshold = 0;
    let elementsChecked = 0; // 计数器，用于追踪已获取高度的元素数量

    const checkCompletion = () => {
      elementsChecked++;
      // 如果两个元素的高度都已经获取，则输出总高度
      if (elementsChecked === 2) {
        console.log('总高度:', _scrollThreshold);
        this.setData({
          scrollThreshold: _scrollThreshold
        })
      }
    };

    query.select('.newNav_wrap').boundingClientRect((rect1) => {
      if (rect1) {
        console.log('元素1高度:', rect1.height);
        _scrollThreshold += rect1.height;
      }
      checkCompletion(); // 增加计数器并检查是否完成
    });

    query.select('.featured-entries').boundingClientRect((rect2) => {
      if (rect2) {
        console.log('元素2高度:', rect2.height);
        _scrollThreshold += rect2.height;
      }
      checkCompletion(); // 增加计数器并检查是否完成
    });

    query.exec();

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
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
  // 未登陆时调用
  async getParamsNoLoginFn() {
    // 先获取经纬度
    await this.getLocationAsync()
    await this.getListByHomeNoLogin(false)
  },
  // 登陆时调用
  async getParamsFn() {
    await this.getLocationAsync() // 先获取定位经纬度
    // 获取推荐道具
    await this.getRecommendPropApiFn()
    this.getListByHome(false)
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
      await this.apiGetAddressFn()
      if (!this.data.token) {
        wx.setStorageSync('nologinLatitude', location.latitude)
        wx.setStorageSync('nologinLongitude', location.longitude)
      }
    } catch (err) {
      // 处理定位失败的情况
      this.setData({
        locationAddress: '不限',
      });
      wx.removeStorageSync('postAddress');
    }
  },
  // 经纬度赋值
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
  // 根据当前经纬度获取当前定位信息
  async apiGetAddressFn() {
    let params = {
      lon: this.data.longitude,
      lat: this.data.latitude
    }
    const result = await apiGetAddress(params)
    if (result.code != 200) return showToast(result.msg)
    const res = await getMaparound({ location: `${this.data.longitude},${this.data.latitude}`, radius: 500 })
    console.log(res, '11111')
    if (res.code != 200) return showToast(res.msg)
    let addressDetail_part = wx.getStorageSync('addressDetail_part')
    if (addressDetail_part && addressDetail_part.length > 0) {
      // 修改搜索框展示的名称
      this.setData({
        locationAddress: addressDetail_part[0].jobCityName || addressDetail_part[0].name,
        areaIds: Array.isArray(addressDetail_part[0].jobCityId) ? addressDetail_part[0].jobCityId : [Number(addressDetail_part[0].jobCityId)],
      })
    } else {
      wx.setStorageSync('addressDetail_part', [{ ...res.data[0], jobCityId: result.data.streetId }])
      // 修改搜索框展示的名称
      this.setData({
        locationAddress: res.data[0].name,
        areaIds: [result.data.streetId]
      })
    }
  },
  // 获取推荐道具
  async getRecommendPropApiFn() {
    const result = await getRecommendPropApi()
    if (result.code !== 200) return
    if (Object.keys(result.data).length > 0) {
      this.setData({
        propData: { ...result.data, renderType: 'prop' }
      })
    } else {
      this.setData({
        propData: undefined
      })
    }
  },
  // 获取未读数
  async getUnread() {
    let _usrId = wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').info.userId
    const result = await getUnreadCount({ userId: _usrId })
    if (result.code !== 200) return showToast(result.msg)
    this.setData({
      count: result.data
    })
    getApp().globalData.unReadMessageNum = result.data;
  },
  // 选择城市
  gotoCity() {
    let that = this
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
          console.log(that.data.locationAddress, 'locationAddress')
          // return
          wx.navigateTo({
            url: `/subpackPage/index/cityIndexEdition/index?currentAddId=${0}&addressNameNologin=${that.data.locationAddress}&storageType=addressDetail_part`,
            events: {
              changeCity: function (currentAddId) {
                console.log(currentAddId, 'currentAddId')
                let addressDetail_part = wx.getStorageSync('addressDetail_part')
                that.setData({
                  showLoading: true,
                  pageNum: 1,
                  dataList: [],
                  locationAddress: addressDetail_part[currentAddId].jobCityName || addressDetail_part[currentAddId].name,
                  areaIds: Array.isArray(addressDetail_part[currentAddId].jobCityId) ? addressDetail_part[currentAddId].jobCityId : [Number(addressDetail_part[currentAddId].jobCityId)],
                })
                that.getListByHome(false)
              }
            }
          })
        }
      }
    })
  },
  // 让多选地址页面来调用
  jbCity(addIndex) {
    let addressDetail_part = wx.getStorageSync('addressDetail_part')
    if (addressDetail_part) {
      this.setData({
        showLoading: true,
        pageNum: 1,
        locationAddress: addressDetail_part[addIndex].jobCityName || addressDetail_part[addIndex].name,
        areaIds: Array.isArray(addressDetail_part[addIndex].jobCityId) ? addressDetail_part[addIndex].jobCityId : [Number(addressDetail_part[addIndex].jobCityId)]
      })
      this.getListByHome(false) // 最后获取职位列表数据
    }
  },
  // 搜索
  gotoSearch: function (event) {
    wx.navigateTo({
      url: `/subpackPage/index/search/index?storageType=history_partTime&type=1&areaIds=${JSON.stringify(this.data.areaIds)}`,
    })
    wx.removeStorageSync('screenArr')
    this.setData({ sxNum: 0 })
  },
  // 全部/红包/最新
  searchTab(event) {
    if (!this.data.token) return this.setData({ loginShow: true })
    this.setData({
      showLoading: true,
      red: false,
      new: false,
      pageNum: 1,
    })
    const tab = event.currentTarget.dataset.tab; // 获取tab名称
    this.setData({
      currentTab: {
        tab_name: tab,
        tab_val: ""
      },
      dataList: [],
    });
    if (tab == '全部') return this.getListByHome(false)
    this.changeTabFn(tab)
  },
  // 处理tab函数
  changeTabFn(tab) {
    if (tab == '红包') {
      this.setData({ red: true })
    } else if (tab == '最新') {
      this.setData({ new: true })
    }
    this.getListByHome(false)
  },
  //提示会员过期
  async getVipAlert() {
    const result = await getVipExpireAlert()
    if (result.code !== 200) return showToast(result.msg)
    this.setData({
      memberProp: result.data
    })
  },
  //会员提示关闭或续费
  async closeProp(e) {
    const result = await getVipExpireAlertBtn({ day: this.data.memberProp.day, type: this.data.memberProp.type })
    if (result.code !== 200) return showToast(result.msg)
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
  // 获取首页列表(全部岗位)
  async getListByHome(isBeachBottom) {
    let _moudle = 100
    if (this.data.red) {
      _moudle = 108
    } else if (this.data.new) {
      _moudle = 101
    }
    // module值给页面中使用
    this.setData({ module_dom: _moudle })
    let params = {
      edition: 1,
      module: _moudle,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      areaIds: this.data.areaIds,// 区域id数组
      latitude: this.data.latitude, // 纬度
      longitude: this.data.longitude, // 经度
      ...this.data.screen
    }
    setTimeout(async () => {
      let result = null
      result = await searchPostHome(params)
      if (result.code !== 200) {
        showToast(result.msg)
        this.setData({ dataList: [] })
        return
      }
      if (isBeachBottom) {
        this.setData({
          dataList: [...this.data.dataList, ...this.setListData(result.data.list)],
        })
      } else {
        let newArr = result.data.list || []
        if (this.data.propData && newArr.length > 0) {
          this.setData({ dataList: [this.data.propData, ...this.setListData(newArr)] })
        } else {
          this.setData({ dataList: this.setListData(newArr) })
        }
        // 上拉刷新后进行充值
        const waterfallInstance = this.selectComponent("#waterfall");
        console.log(waterfallInstance, 'waterfallInstance')
        waterfallInstance.reflow();
      }
      this.setData({
        isRefreshing: false,//关闭下拉刷新
        // isFinish: this.data.dataList.length >= result.data.total, //全部加载完毕
        isFinish: this.data.pageNum >= result.data.pages,// 全部加载完毕
        showLoading: false,
        total: result.data.total,
        totalPages: result.data.pages
      })
      if (this.data.isFinish && _moudle == 100) {
        // 推荐
        this.getClassicsPostRecommend(false)
      }
    }, 0);
  },
  // 获取首页推荐接口
  getClassicsPostRecommend(isBeachBottom) {
    let params = {
      edition: 1,
      module: 107,
      pageNum: this.data.pageRecommendNum,
      pageSize: this.data.pageRecommendSize,
      areaIds: this.data.areaIds,// 区域id数组
      latitude: this.data.latitude, // 纬度
      longitude: this.data.longitude, // 经度
      jobExpectation: this.data.jobExpectation, //职位id
      ...this.data.screen
    }
    setTimeout(async () => {
      let result = null
      result = await searchPostHome(params)
      if (result.code !== 200) return showToast(result.msg)
      // 创建一个 Set 来存储 dataList 数组中所有元素的 postId
      // console.log('aIds0=', this.data.dataList)
      let aIds = new Set(this.data.dataList.map(item => item.postId));
      // console.log('aIds=', aIds)
      // console.log('aIds1=', result.data.list.filter(item => !aIds.has(item.id)))
      result.data.list = result.data.list.filter(item => !aIds.has(item.id))
      if (result.data.list.length == 0 && (this.data.pageRecommendNum < result.data.pages)) {
        console.log(this.data.pageRecommendNum, 'this.data.pageRecommendNum')
        if (this.data.pageRecommendNum == 1) {
          // showToast('暂未找到相关职位，为您推荐以下职位')
          this.setData({ showToastDom: true })
          setTimeout(() => {
            this.setData({ showToastDom: false })
          }, 1500)
        }
        this.setData({
          pageRecommendNum: this.data.pageRecommendNum + 1
        })
        this.getClassicsPostRecommend(true)
        return
      }
      if (isBeachBottom) {
        let arr = this.setListData(result.data.list)
        this.setData({ dataList: [...this.data.dataList, ...arr] })
      } else {
        let newArr = result.data.list || []
        let arr = this.setListData(newArr)
        if (arr.length > 0 && this.data.pageRecommendNum == 1) {
          // showToast('暂未找到相关职位，为您推荐以下职位')
          this.setData({ showToastDom: true })
          setTimeout(() => {
            this.setData({ showToastDom: false })
          }, 1500)
        }
        this.setData({ dataList: [...this.data.dataList, ...arr] })
      }
      // if (this.data.dataList.length >= (result.data.total + this.data.total)) {
      //   this.setData({
      //     isUpload: true, //全部加载完毕
      //   })
      // }
      if ((this.data.pageNum + this.data.pageRecommendNum) >= (result.data.pages + this.data.totalPages)) {
        this.setData({
          isUpload: true, //全部加载完毕
        })
      }
    }, 0);
  },
  // 无token时获取首页数据信息
  async getListByHomeNoLogin(isBeachBottom) {
    let params = {
      dignity: 1,
      module: 10,
      edition: 1,
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      pageSize: this.data.pageSize,
      pageNum: this.data.pageNum,
      areaIds: this.data.areaIds,// 区域id数组
    }
    //换接口(getListByHomeNoLogin)
    setTimeout(async () => {
      const result = await searchPostHome(params)
      if (result.code !== 200) {
        this.setData({ showLoading: false })
        this.setData({ dataList: [] })
        showToast(result.msg)
        return
      }
      if (isBeachBottom) {
        this.setData({ showLoading: false })
        this.setData({
          dataList: [...this.data.dataList, ...this.setListData(result.data.list)],
        })
      } else {
        let newArr = result.data.list || []
        this.setData({ showLoading: false })
        this.setData({
          dataList: this.setListData(newArr)
        })
        // 上拉刷新后进行充值
        const waterfallInstance = this.selectComponent("#waterfall");
        console.log(waterfallInstance, 'waterfallInstance')
        waterfallInstance.reflow();
      }
      this.setData({
        isRefreshing: false, // 关闭下拉刷新
        isFinish: this.data.dataList.length >= result.data.total, //全部加载完毕
        showLoading: false,
        total: result.data.total
      })
      console.log(this.data.dataList, 'this.data.dataList')
    }, 0)
  },
  //列表数据结构整理
  setListData(newArr) {
    let activityTagsCopy = true
    return newArr.map(item => {
      // 视频展示
      // let _visitFiles = []
      // if (item.visitFiles && item.visitFiles.length > 0) {
      //   _visitFiles = item.visitFiles.map(i => {
      //     let type = null
      //     let url = null
      //     type = this.isVideoLink(i) ? 2 : 1
      //     if (type == 2) {
      //       url = i + '?x-oss-process=video/snapshot,t_1000,m_fast'
      //     } else {
      //       url = i
      //     }
      //     return {
      //       type,
      //       url
      //     }
      //   })
      // }

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
        postAddress: item.postAddress,
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
        distance: item.distance,
        clearing: item.settlementUnit && this.data.clearing[item.settlementUnit - 1] ? this.data.clearing[item.settlementUnit - 1].name : '元/时', // 兼职结算方式
        looked: item.looked,
        activation: item.activation || '',
        online: item.online,
        urgent: item.urgent,
        type: 'job', // 用于区分是推荐列表还是职位列表
        // visitFiles: _visitFiles,
        compete: item.compete, // 是否竞招
        bigRedPacket: item.bigRedPacket,
        activityTags: activityTagsCopy,
        logo: item.logo,
        financeStage: item.financeStage,
        jobTitle: item.jobTitle,
        ptype: item.type,
        activitySubsidy: item.activityTags.length > 0 ? 1 : 0,
        isfirstChat: item.firstChat,
        changePositionId: item.changePositionId || null,
        chatSessionId: item.chatSessionId,
        yourHx: item.userName
      }
    })
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
  // 职位详情
  jump(event) {
    // 当前点击的这一项的id和bossid
    let { bossuserid, id, distance } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackPage/index/job_detail/index?postId=${id}&bossuserid=${bossuserid}`,
    })
  },
  // 打开筛选弹窗
  openFilterPopup() {
    if (!this.data.token) return this.setData({ loginShow: true })
    this.setData({ isShow: true })
  },
  // 关闭筛选/登录弹窗
  onClose() {
    this.setData({ isShow: false, loginShow: false })
  },
  // 筛选确定事件
  screenEvent(event) {
    console.log(event, 'event')
    this.setData({
      dataList: [],
      screen: event.detail,
      isShow: false,
      showLoading: true
    })
    this.getListByHome(false)
  },
  // 筛选数量
  screenNum(event) {
    this.setData({
      sxNum: event.detail
    })
  },
  // 关闭当前推荐道具结构
  closePropDom() {
    let _dataList = this.data.dataList.filter(it => it.renderType != 'prop')
    console.log(_dataList, '_dataList')
    this.setData({
      dataList: _dataList
    })
    // 进行重置
    const waterfallInstance = this.selectComponent("#waterfall");
    console.log(waterfallInstance, 'waterfallInstance')
    waterfallInstance.reflow();
  },
  // 根据不同的类型跳转到不同的道具详情页面
  gotoPropDetail(event) {
    let { item } = event.currentTarget.dataset
    let type = ''
    if (item.propType == 'TOP_RESUME') { // 简历置顶卡
      type = 5
    } else if (item.propType == 'PHONE_JOB_SEEKER') { // 电话卡
      type = 9
    } else if (item.propType == 'AI_JOB_SEEKER') { // AI卡
      type = 7
    } else if (item.propType == 'REFRESH') { // 刷新卡
      type = 1
    }
    wx.navigateTo({
      url: `/subpackPage/user/stageBuy/index?type=${type}`,
    })
  },
  // 金刚区跳转不同的页面
  gotoTab(event) {
    let { path, type, module } = event.currentTarget.dataset
    let cityname = this.data.locationAddress.split('/')[0]
    wx.navigateTo({
      url: `/subpackPage/versions/${path}?type=${type}&city=${cityname}&areaIds=${this.data.areaIds[0]}&module=${module}&pageType=partTime`,
    })
  },
  // 金刚区域跳转今日速配
  gotoMatch() {
    wx.navigateTo({
      url: '/pages/match/index',
    })
  },
  // 金刚区域跳转求职群
  handleToEntryPage() {
    wx.navigateTo({
      url: '/subpackPage/index/qiyeWx/index',
    })
  },
  //监听scroll滚动事件
  onRefresh() {
    if (this.data.token) {
      this.getRecommendPropApiFn()
    }
    setTimeout(() => {
      if (this.data.token) {
        this.setData({
          pageNum: 1,
          pageRecommendNum: 1
        })
        this.getListByHome(false)
      } else {
        this.getListByHomeNoLogin(false)
      }
    }, 500)
  },
  onLoadMore: function () {
    if (this.data.token) {
      if (this.data.isFinish) {
        if (this.data.isUpload) return
        this.setData({
          pageRecommendNum: this.data.pageRecommendNum + 1,
        })
        this.getClassicsPostRecommend(true)
      } else {
        this.setData({
          pageNum: this.data.pageNum + 1,
        })
        this.getListByHome(true)
      }
    } else {
      if (this.data.isFinish) {
        if (this.data.isUpload) return
        this.setData({
          pageRecommendNum: this.data.pageRecommendNum + 1,
        })
        this.getClassicsPostRecommend(true)
      } else {
        this.setData({
          pageNum: this.data.pageNum + 1,
        })
        this.getListByHomeNoLogin(true)
      }
    }
  },

  // 外层scroll开始滚动
  containerscroll(event) {
    let { scrollTop, scrollHeight } = event.detail
    if (scrollTop === 0) {
      console.log('外层scroll已滚动到顶部');
    }

    // 注意：这里使用一个小范围的阈值（例如1），因为有时由于精度问题，直接比较可能不会完全相等
    const threshold = 1;
    if (Math.abs(scrollTop - this.data.scrollThreshold) <= threshold) {
      console.log('到达指定位置')
      if (this.data.waterfall_ScrollY == true) return
      this.setData({
        waterfall_ScrollY: true,
      })
    } else {
      if (this.data.waterfall_ScrollY == false) return
      this.setData({
        waterfall_ScrollY: false,
      })
    }
  },
  // 外层scroll滚动到底事件
  containerscrolltolower(event) {
    console.log(event, '外层scroll到底部了')
    // 当外层scroll滚动到底事件触发，则证明结构已经调整正确
    // 则将内层的scroll滚动打开，并将外层的scroll滚动禁止
    this.setData({
      waterfall_ScrollY: true,
    })
  },
  // 内层scroll滚动事件
  contentscroll(event) {
    // let { scrollTop } = event.detail.detail
    // if (scrollTop === 0) {
    //   console.log('内层scroll已滚动到顶部');
    //   if (this.data.partTime_ScrollY == true) return
    //   this.setData({
    //     partTime_ScrollY: true,
    //   })
    // } else {
    //   if (this.data.partTime_ScrollY == false) return
    //   this.setData({
    //     partTime_ScrollY: false,
    //   })
    // }
  }
})