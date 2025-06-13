const app = getApp();
const { Parser, Player } = require("../../../libs/svgaplayer.weapp")
import { getUnreadCount, searchPostHome } from '../../../http/api'
import { apiGetAddress, getMaparound } from '../../../http/index'
import { getVipExpireAlert, getVipExpireAlertBtn } from '../../../http/user'
import { getRecommendPropApi, checkIsJobJobExpectation, getJobExpectations, getWhetherActivePopUp, getWhetherActivePopUpJQ, getDrawInterests } from '../../../http/versions'
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
    postList: [], // 推荐岗位
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
    jobTabStatus: {}, // 用于保存职位选择的列表tab状态
    currentJob: '', // 当前职位
    currentAddId: 0,
    post_index: 0,
    screen: {}, // 筛选条件
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    guide: {
      guideIdxShow: false,
      guideStep1: true,
      guideStep2: false,
      guideStep3: false,
      top1: 0,
      top2: 0,
      top3: 0
    },
    memberProp: null, // 会员即将过期
    red: false, // 红包岗
    nearBy: false, // 附近岗
    probe: false, // 实探岗位
    areaIds: [], // 区域id
    scrollThreshold: 0, // 外层scroll滚动阀值（为搜索框高度和金刚区高度）
    partTime_ScrollY: true, // 外层scroll是否可以滚动
    waterfall_ScrollY: false, // 内层scroll是否可以滚动
    collectGuide: false, // 收藏
    circulateShow: false, // 询问弹窗
    activityId: '', // 活动弹窗
    activityPopUpShow: false, // 活动弹窗
    activityPopUpShow_JQ: false,
    activityEquityList: [], // 权益列表
    saveMoney: '0', // 节省金额
    total: 0, // 总条数
    totalPages: 0, // 总页数
    animationData: {}, // 动画数据
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
    wx.setStorageSync('currentPageIdx', 1)
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
    console.log(!wx.getStorageSync('guideIdxShow'), 'wx.getStorageSync')
    if (!wx.getStorageSync('guideIdxShow') && this.data.token) {
      this.setData({
        ['guide.guideIdxShow']: true
      })
      this.getPaddingTopFn()
    }

    //收藏小程序引导页
    if (!wx.getStorageSync('collectGuide') && wx.getStorageSync('guideIdxShow') && this.data.token) {
      this.setData({
        collectGuide: true
      })
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
  /**
   * 分享给好友
   */
  onShareAppMessage() {
    return {
      title: '知城优聘',
      path: '/pages/index/index',
      imageUrl: this.data.logo,
      success(res) {
        console.log('成功', res)
      }
    }
  },
  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '知城优聘',
      query: '/pages/index/index',
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
    // await this.getRecommendPropApiFn()
    // 登陆时检测是否有求职期望
    await this.checkJobJobExpectation()
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
    wx.setStorageSync('addressCityId', result.data.cityId)
    wx.setStorageSync('cityId', result.data.districtId)
    wx.setStorageSync('postArea', { name: result.data.streetName, id: result.data.streetId })
    const res = await getMaparound({ location: `${this.data.longitude},${this.data.latitude}`, radius: 500 })
    if (res.code != 200) return showToast(res.msg)
    // wx.setStorageSync('location', { ...res.data[0], jobCityId: result.data.streetId })
    wx.setStorageSync('longitude', { longitude: this.data.longitude, latitude: this.data.latitude })
    let postAddress = wx.getStorageSync('postAddress')
    if (!postAddress) {
      wx.setStorageSync('postAddress', result.data.cityName)
    } else {
      // 判断当前接口请求数据地址是否一致(比较市)
      if (postAddress !== result.data.cityName) {
        this.setData({ isAddressModel: true })  // 如果不一致,则弹出检测定位弹出(询问用户是否更改)
        // 如果更改,则处理余下逻辑
      }
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
  // 检测是否有求职期望
  async checkJobJobExpectation() {
    const res = await checkIsJobJobExpectation()
    if (res.data == 0) {
      wx.reLaunch({
        url: '/subpackPage/index/cityIndexEdition/index?step=1',
      })
    } else {
      await this.getApiJobExpectationList()
      this.getListByHome(false)
    }
  },
  // 添加求职期望
  addPost() {
    let that = this
    if (!this.data.token) return this.setData({ loginShow: true })
    wx.navigateTo({
      url: `/subpackPage/versions/allJobManage/allJobManage`,
      // 只重新请求一下求职期望并更新当前的pagenum和对应的数组
      events: {
        changePostList: async (data) => {
          that.setData({
            showLoading: true,
            red: false,
            nearBy: false,
            probe: false,
            pageNum: 1,
            dataList: [],
            post_index: 0,
            postList: [],
            jobTabStatus: {},// 清空状态
            currentTab: {
              tab_name: '全部',
              tab_val: ''
            },
          })
          await that.getApiJobExpectationList()
          await that.getListByHome(false)
        }
      }
    })
  },
  // 获取求职期望
  async getApiJobExpectationList() {
    let { code, data, msg } = await getJobExpectations()
    if (code != 200) return showToast(msg);
    let _postList = this.data.postList
    _postList.push(...data)
    wx.setStorageSync('addressDetail', _postList)
    let addressDetail = wx.getStorageSync('addressDetail')
    this.setData({
      postList: addressDetail,
      postId: data[0].postId,
      locationAddress: _postList[0].jobCityName,
      areaIds: [_postList[0].jobCityId],
      jobExpectation: _postList[0].id,
      jobType: data[0].jobType,
      post_index: 0,
      longitude: _postList[0].lon,
      latitude: _postList[0].lat
    })
    this.setData({ currentJob: this.data.postList[0].postName }) // 获取当前职位
    wx.setStorageSync('postId', data[0].postId)

    //是否有参加打车活动
    await this.getWhetherActivePopUpFn()
    await this.getWhetherActivePopUpJQFn()
  },
  // 获取元素高度
  getPaddingTopFn() {
    let that = this
    // 添加职位
    wx.createSelectorQuery().selectAll('.addPost').boundingClientRect(function (rects) {
      that.setData({
        ['guide.top1']: rects[0].top
      })
    }).exec();
    // 岗位
    wx.createSelectorQuery().selectAll('.tabNav_left').boundingClientRect(function (rects) {
      that.setData({
        ['guide.top2']: rects[0].top
      })
    }).exec();

    // 今日速配
    wx.createSelectorQuery().selectAll('.featured-entries').boundingClientRect(function (rects) {
      that.setData({
        ['guide.top3']: rects[0].top
      })
      console.log(rects[0].top, 'rects[0].top')
    }).exec();
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
          wx.navigateTo({
            url: `/subpackPage/index/cityIndexEdition/index?currentAddId=${that.data.currentAddId}&addressNameNologin=${that.data.locationAddress}&storageType=addressDetail`,
            events: {
              changeCity: function (currentAddId) {
                console.log(currentAddId, 'currentAddId')
                let addressDetail = wx.getStorageSync('addressDetail')
                that.setData({
                  showLoading: true,
                  pageNum: 1,
                  dataList: [],
                  locationAddress: addressDetail[currentAddId].jobCityName || addressDetail[currentAddId].name,
                  areaIds: Array.isArray(addressDetail[currentAddId].jobCityId) ? addressDetail[currentAddId].jobCityId : [Number(addressDetail[currentAddId].jobCityId)],
                })
                that.getListByHome(false)
              }
            }
          })
        }
      }
    })
  },
  // 职位切换展示
  post_TabNav(event) {
    wx.removeStorageSync('screenArr')
    this.setData({
      showLoading: true,
      red: false,
      nearBy: false,
      probe: false,
      pageNum: 1,
      pageRecommendNum: 1,
      sxNum: 0,
      areaIds: [],
      screenY: false,
      scrollY1: true
    })
    // console.log(this.data.currentTab, 'currentTabcurrentTab')
    let addressDetail = wx.getStorageSync('addressDetail') // 取出
    let index = event.currentTarget.id
    let { item, job } = event.currentTarget.dataset
    const currentTab = this.data.jobTabStatus[job] || {
      tab_name: '全部',
      tab_val: ''
    };
    // console.log(currentTab, 'currentTabcurrentTab11111')
    if (currentTab.tab_name == '全部' || currentTab.tab_name == '红包' || currentTab.tab_name == '实探') {
      if (currentTab.tab_name == '红包') {
        this.setData({ red: true })
      } else if (currentTab.tab_name == '附近') {
        this.setData({
          nearBy: true
        })
      } else if (currentTab.tab_name == '实探') {
        this.setData({ probe: true })
      }
    }

    // console.log(this.data.probe, 'probe')
    let name = addressDetail[index].name
    this.setData({
      currentAddId: index,
      currentJob: job,
      currentTab: currentTab,
      dataList: [],
      post_index: index,
      hot: item.id ? false : true,
      pageNum: 1,
      sxNum: 0,
      screen: {}, // 清空筛选条件
      areaIds: [item.jobCityId],
      locationAddress: item.jobCityName ? item.jobCityName : name,
      jobExpectation: item.id,
      jobType: item.jobType,
    })
    this.getListByHome(false)
    this.getWhetherActivePopUpFn() // 获取活动弹窗
  },
  // 让多选地址页面来调用
  jbCity(addIndex) {
    let addressDetail = wx.getStorageSync('addressDetail')
    if (addressDetail) {
      this.setData({
        showLoading: true,
        pageNum: 1,
        postList: addressDetail,
        locationAddress: addressDetail[addIndex].jobCityName || addressDetail[addIndex].name,
        areaIds: Array.isArray(addressDetail[addIndex].jobCityId) ? addressDetail[addIndex].jobCityId : [Number(addressDetail[addIndex].jobCityId)]
      })
      this.getListByHome(false) // 最后获取职位列表数据
    }
  },
  // 搜索
  gotoSearch: function (event) {
    wx.navigateTo({
      url: `/subpackPage/index/search/index?areaIds=${JSON.stringify(this.data.areaIds)}`,
    })
    wx.removeStorageSync('screenArr')
    this.setData({ sxNum: 0 })
  },
  // 推荐/红包/附近/实探 （函数需要更改逻辑）
  searchTab(event) {
    if (!this.data.token) return this.setData({ loginShow: true })
    this.setData({
      showLoading: true,
      red: false,
      nearBy: false,
      probe: false,
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
      },
      jobTabStatus: {
        ...this.data.jobTabStatus,
        [currentJob]: {
          tab_name: tab,
          tab_val: tab_val()
        }
      },
      dataList: [],
    });
    if (tab == '全部') return this.getListByHome(false)
    this.changeTabFn(tab)
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
    } else if (tab == '实探') {
      this.setData({ probe: true })
      this.getListByHome(false)
    }
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
    let _moudle = 13
    if (this.data.red) {
      _moudle = 14
    } else if (this.data.nearBy) {
      _moudle = 15
    } else if (this.data.probe) {
      _moudle = 16
    }
    let params = {
      edition: 1,
      module: _moudle,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      areaIds: this.data.areaIds,// 区域id数组
      latitude: this.data.latitude, // 纬度
      longitude: this.data.longitude, // 经度
      jobExpectation: this.data.jobExpectation, //职位id
      distanceSort: this.data.currentTab.tab_val || '',
      ...this.data.screen
    }
    setTimeout(async () => {
      let result = null
      result = await searchPostHome(params)
      if (result.code !== 200) {
        showToast(result.msg)
        this.setData({ showLoading: false, dataList: [] })
        return
      }
      if (isBeachBottom) {
        this.setData({
          dataList: [...this.data.dataList, ...this.setListData(result.data.list)],
        })
      } else {
        let newArr = result.data.list || []
        // 推荐道具是否有值
        if (this.data.propData && newArr.length > 0) {
          this.setData({ dataList: [this.data.propData, ...this.setListData(newArr)] })
        } else {
          this.setData({ dataList: this.setListData(newArr) })
        }
        // 上拉刷新后进行充值
        // const waterfallInstance = this.selectComponent("#waterfall");
        // console.log(waterfallInstance, 'waterfallInstance')
        // waterfallInstance.reflow();
      }
      this.setData({
        isRefreshing: false,//关闭下拉刷新
        // isFinish: this.data.dataList.length >= result.data.total, //全部加载完毕
        isFinish: this.data.pageNum >= result.data.pages,// 全部加载完毕
        showLoading: false,
        total: result.data.total,
        totalPages: result.data.pages
      })
      if (this.data.isFinish) {
        // 推荐
        this.getClassicsPostRecommend(isBeachBottom)
      }
    }, 0);
  },
  // 获取首页推荐接口
  getClassicsPostRecommend(isBeachBottom) {
    let _moudle = 17
    if (this.data.red) {
      _moudle = 18
    } else if (this.data.nearBy) {
      _moudle = 19
    } else if (this.data.probe) {
      _moudle = 20
    }
    let params = {
      edition: 1,
      module: _moudle,
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
      console.log(result.data.list, 'result.data.list')
      if (result.data.list.length == 0 && (this.data.pageRecommendNum < result.data.pages)) {
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
        // // 检查数组中是否存在type为'separator'的元素
        // if (arr.length > 0 && !this.data.dataList.some(item => item.type === 'separator')) {
        //   // 如果不存在，则追加
        //   arr.unshift({ type: 'separator' });
        // }
        this.setData({ dataList: [...this.data.dataList, ...arr] })

      } else {
        let newArr = result.data.list || []
        let arr = this.setListData(newArr)
        // 检查数组中是否存在type为'separator'的元素
        // if (arr.length > 0 && !this.data.dataList.some(item => item.type === 'separator')) {
        //   // 如果不存在，则追加
        //   arr.unshift({ type: 'separator' });
        // }
        if (arr.length > 0 && this.data.pageRecommendNum == 1) {
          // showToast('暂未找到相关职位，为您推荐以下职位')
          this.setData({ showToastDom: true })
          setTimeout(() => {
            this.setData({ showToastDom: false })
          }, 1500)
          // this.showToastDomFn()
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
      pageNum: this.data.pageNum
    }
    setTimeout(async () => {
      const result = await searchPostHome(params)
      if (result.code !== 200) {
        this.setData({ dataList: [], showLoading: false })
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
        this.setData({
          showLoading: false,
          dataList: this.setListData(newArr)
        })
        // 上拉刷新后进行充值
        // const waterfallInstance = this.selectComponent("#waterfall");
        // console.log(waterfallInstance, 'waterfallInstance')
        // waterfallInstance.reflow();
      }
      this.setData({
        isRefreshing: false, // 关闭下拉刷新
        isFinish: this.data.dataList.length >= result.data.total, //全部加载完毕
        showLoading: false,
        total: result.data.total
      })
      if (this.data.isFinish) {
        // 推荐
        this.getClassicsPostRecommend(isBeachBottom)
      }
      console.log(this.data.dataList, 'this.data.dataList')
    }, 0)
  },
  //列表数据结构整理
  setListData(newArr) {
    let activityTagsCopy = true
    return newArr.map(item => {
      // 视频展示
      let _visitFiles = []
      if (item.visitFiles && item.visitFiles.length > 0) {
        _visitFiles = item.visitFiles.map(i => {
          let type = null
          let url = null
          type = this.isVideoLink(i) ? 2 : 1
          if (type == 2) {
            url = i + '?x-oss-process=video/snapshot,t_1000,m_fast'
          } else {
            url = i
          }
          return {
            type,
            url
          }
        })
      }

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
        visitFiles: _visitFiles,
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
  // 检测是什么类型
  isVideoLink(path) {
    const videoExtensions = ['mp4', 'mov', 'm4v', 'mkv', 'webm', 'avi', '3gp', 'm2ts', 'flv', 'f4v'];
    const extension = path.split('.').pop().toLowerCase(); // 获取路径中的文件扩展名并转为小写
    // 判断扩展名是否存在于视频格式数组中
    return videoExtensions.includes(extension.toLowerCase());
  },
  // 职位详情
  jump(event) {
    // 当前点击的这一项的id和bossid
    let { bossuserid, id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackPage/index/job_detail/index?postId=${id}&bossuserid=${bossuserid}`,
    })
  },
  // 无token时弹窗登录
  showLogin() {
    if (!this.data.token) return this.setData({ loginShow: true })
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
  // 关闭询问弹窗
  onCloseCirculate() {
    this.setData({ circulateShow: false })
  },
  // 关闭收藏弹窗
  closeCollectGuide() {
    this.setData({
      collectGuide: false
    })
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
    if (!this.data.token) return this.setData({ loginShow: true })
    let { path, type, module } = event.currentTarget.dataset
    let cityname = this.data.locationAddress.split('/')[0]
    if (type == 1) {
      wx.navigateTo({
        url: `/subpackPage/versions/${path}?type=${type}&city=${cityname}&areaId=${this.data.areaIds[0]}&currentAddId=${this.data.currentAddId}`,
      })
    } else {
      // 急聘 / 学生 / 助残帮扶
      wx.navigateTo({
        url: `/subpackPage/versions/${path}?type=${type}&city=${cityname}&areaIds=${this.data.areaIds[0]}&module=${module}`,
      })
    }
  },
  // 金刚区域跳转今日速配
  gotoMatch() {
    wx.navigateTo({
      url: '/pages/match/index',
    })
  },
  // 引导页跳转
  goStep(e) {
    let step = e.currentTarget.dataset.step
    if (step == 1) {
      this.setData({
        ['guide.guideIdxShow']: false
      })
      wx.setStorageSync('guideIdxShow', 1)
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
        console.log(error);
      }
    }
  },
  // 关闭活动弹窗
  closeActivityProp() {
    this.setData({
      activityPopUpShow: false,
      activityPopUpShow_JQ: false
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
        player.startAnimation();
      } catch (error) {
        console.log(error);
      }
      // 存储金秋活动是否弹过
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
    if (result.code != 200) return
    this.setData({
      activityPopUpShow_JQ: false
    })
    showToast('领取成功')
  },
  // 查看活动规则
  gotoActivityDetail() {
    wx.navigateTo({
      url: `/subpackPage/user/goldActivity/index`,
    })
    this.setData({
      activityPopUpShow_JQ: false
    })
  },
  // 立即沟通按钮
  nowCommunicate(itemObj) {
    // 查看是否登录
    if (!this.data.token) {
      this.setData({ loginShow: true })
      return
    }
    let _itemObj = itemObj.detail
    console.log(_itemObj, '发起聊天，立即沟通')
    let userInfo = wx.getStorageSync('userInfo').info
    var nameList = {
      myHx: userInfo.hxUname,
      your: _itemObj.yourHx, //环信id -
      targetName: _itemObj.outName, //招聘者对外昵称-
      targetJob: _itemObj.outPost, //招聘者岗位-
      targetCompany: _itemObj.companyName, //招聘者公司-
      targetAvatar: _itemObj.avatar, //招聘者头像-
      fromUserId: userInfo.userId, //自己用户id
      targetUserIds: _itemObj.bossUserId, //招聘者用户id-
      firstChat: _itemObj.isfirstChat, //是否第一次发起聊天------
      changePositionId: _itemObj.changePositionId, //不是第一次聊天的话弹出是否更换职位------
      jobId: _itemObj.postId, //岗位id
      dignity: 1,
      resumeId: userInfo.resumeId, //简历Id
      greeting: userInfo.greetings, //初次打招呼语
      chatId: _itemObj.chatSessionId, //会话id（如果有的话带上）--------
      jobCompanyFinancing: _itemObj.financeStage, //岗位公司融资情况
      jobRedEnvelope: _itemObj.isH, //岗位红包(是否有红包)
      jobSalary: _itemObj.lowestMoney ? (_itemObj.lowestMoney + '~' + _itemObj.maximumMoney + 'K') : '不限', //岗位薪资
      jobTag: _itemObj.tag && _itemObj.tag.join(',') || null, //岗位标签
      jobTitle: _itemObj.post, //岗位标题
      jobTitleTag: _itemObj.ptype, //岗位标题标签(位类型;默认0 社招;1校园应届招聘; 2兼职招聘)
      activitySubsidy: _itemObj.activitySubsidy //是否汽车活动补贴岗位-------
    };
    wx.navigateTo({
      url: "/packageIm/pages/chatroom/chatroom?userInfo=" + JSON.stringify(nameList),
    });
  },
  //监听scroll滚动事件
  onRefresh() {
    if (this.data.token) {
      // this.getRecommendPropApiFn()
    }
    setTimeout(() => {
      this.setData({
        pageNum: 1,
        pageRecommendNum: 1
      })
      if (this.data.token) {
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

  showToastDomFn() {
    const animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateY('-10rpx').opacity(1).step();
    this.setData({
      animationData: animation.export(),
    });
    // 第二步：1 秒后隐藏
    setTimeout(() => {
      // 创建隐藏动画
      const hideAnimation = wx.createAnimation({
        duration: 800, // 动画持续时间
        timingFunction: 'ease', // 动画缓动函数
      });

      // 向下滑出
      hideAnimation.translateY('100rpx').opacity(0).step();

      // 设置动画数据
      this.setData({
        animationData: hideAnimation.export(),
      });
    }, 1500); // 1 秒后执行
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