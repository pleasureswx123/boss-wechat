// subpackPage/versions/component/component.js
import { apiIndustry, apiGetHotEnterprise, getBannerList } from '../../../http/index'
import { searchPostHome } from '../../../http/api'
import { showToast } from '../../../utils/util';
const app = getApp();
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    baseImageUrl: app.globalData.baseImgUrl,
    defaultImage: '?x-oss-process=image/resize,w_100/quality,q_90',
    globalBottom: app.globalData.globalBottom,
    navBerBack: {}, // 背景图片
    locationAddress: '不限',
    arrowIcon: 'arrow-down',
    arrowIcon1: 'arrow-down',
    isOpenAddress: false,
    isSeletePost: false,
    isShow: false,
    type: null, // 展示类型
    companyList: [], // 公司数组
    scaleList: [], // 公司规模
    financingList: [], // 融资
    educationList: [], // 学历
    jsList: [],//结算方式,
    textData: [], // 期望薪资
    sufferList: [], // 经验
    typeList: [], // 招聘类型
    clearing: [], // 兼职薪资
    industryList: [{ name: '不限', isActive: true, code: null }], // 行业
    popupHeight: 0, // 弹框高度
    pageNum: 1, // 页码
    pageSize: 10, // 每页条数
    isRefreshing: false,//是否下拉刷新状态
    isFinish: false,//是否加载完全部数据
    dataList: [], // 列表数组
    postName: '全部职位', // 职位名称
    simpleId: '', // 职位id
    screen: {}, // 筛选条件
    isShowIndustry: false,
    gsName: '筛选',
    showLoading: false, // loading效果
    nearBy: false, // 是否展示距离
    areaIds: [], // 区域ids
    postId: '', // 职位id
    total: 0, // 总条数
    totalPages: 0, // 总页数
    module: 0, // module值
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    pageType: 'all', // 区分全职/兼职/热门岗位筛选结构展示
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, '外部传递的参数')
    let token = wx.getStorageSync('token') // 获取token
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
      token: token
    })
    // 字典
    let dictionary = wx.getStorageSync('dictionary')
    let popupHeight = wx.getSystemInfoSync().windowHeight
    dictionary[6].unshift({ name: '不限' })
    this.setData({
      financingList: this.mapData(dictionary[4]),
      scaleList: this.mapData(dictionary[5]),
      popupHeight: popupHeight,
      areaIds: [Number(options.areaIds)],
      sufferList: this.mapData(dictionary[33]),
      textData: this.mapData(dictionary[3]),
      educationList: this.mapData(dictionary[6]),
      jsList: this.mapData(dictionary[46]),
      typeList: this.mapData(dictionary[39]),
      clearing: this.mapData(dictionary[48]), // 结算方式
    })
    if (options.city && options.city !== 'null' && options.city !== 'undefined') {
      this.setData({ locationAddress: options.city })
    }
    if (options.module && options.module !== 'null' && options.module !== 'undefined') {
      this.setData({ module: Number(options.module) })
    }
    if (options.pageType && options.pageType !== 'null' && options.pageType !== 'undefined') {
      this.setData({ pageType: options.pageType })
    }
    if (options.type && options.type !== 'null' && options.type !== 'undefined') {
      this.setData({
        type: Number(options.type),
      })
      // 获取banner数据
      this.bannerList()
      // 开启骨架屏
      this.setData({ showLoading: true })
      // 急聘专区
      if (options.type == 0) {
        this.getListByHome(false)
      } else if (options.type == 1) { // 附近岗位
        this.setData({ nearBy: true })
        if (!this.data.token) {
          this.setData({
            latitude: wx.getStorageSync('nologinLatitude'),
            longitude: wx.getStorageSync('nologinLongitude')
          })
        } else {
          // 这里需要动
          let addressDetail = wx.getStorageSync('addressDetail')[options.currentAddId]
          console.log(addressDetail, options.currentAddId, '::::::::::::::')
          // if (options.currentAddId == 0) {
          //     this.setData({
          //         latitude: addressDetail.location.split(',')[1],
          //         longitude: addressDetail.location.split(',')[0]
          //     })
          // } else {
          this.setData({
            latitude: addressDetail.lat,
            longitude: addressDetail.lon,
          })
          // }
        }
        this.getListByHome(false)
      } else if (options.type == 2) { // 企业榜单
        this.getHotEnterprise(false)
      } else if (options.type == 3 || options.type == 4 || options.type == 5 || options.type == 6) { // 应届校园 助残帮扶 宝妈专区 日结专区
        this.getListByHome(false)
      }
    }
  },
  /**
  * 生命周期函数--监听页面显示
  */
  onShow() {
    this.getIndustry()
  },
  // 返回上一页
  navigateBack() {
    wx.navigateBack()
  },
  // 获取行业信息
  async getIndustry() {
    const { code, data, msg } = await apiIndustry()
    if (code !== 200) return showToast(msg)
    let arr = data.map(item => {
      return {
        ...item,
        isActive: false
      }
    })
    let industryList = [...this.data.industryList, ...arr.slice(6, 11)]
    this.setData({
      industryList
    })
  },
  // 获取首页列表(全部岗位)
  async getListByHome(isBeachBottom) {
    let params = {
      edition: 1,
      module: this.data.module,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      latitude: this.data.latitude, // 纬度
      longitude: this.data.longitude, // 经度
      areaIds: this.data.areaIds, // 区域id
      // simpleId: this.data.simpleId, // 职位选择返回的id
      postId: this.data.postId, // 职位选择返回的id (目前是急聘使用)
      ...this.data.screen // 筛选条件
    }
    setTimeout(async () => {
      const result = await searchPostHome(params)
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
        this.setData({
          dataList: this.setListData(newArr),
        })
      }
      this.setData({
        isRefreshing: false,//关闭下拉刷新
        isFinish: this.data.dataList.length >= result.data.total, //全部加载完毕(根据总条数)
        // isFinish: this.data.pageNum >= result.data.pages,// 全部加载完毕(根据总页数)
        showLoading: false,
        total: result.data.total,
        totalPages: result.data.pages
      })
    }, 500);
  },
  //列表数据结构整理
  setListData(newArr) {
    return newArr.map(item => {
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
        urgent: item.urgent
      }
    })
  },
  // 职位筛选返回
  selectedPost(event) {
    let {code,name} = event.detail
    this.setData({
      pageNum: 1,
      postId: code,
      isSeletePost: false,
      arrowIcon1: 'arrow-down',
      postName: name,
      showLoading: true
    })
    this.getListByHome(false)
  },
  // 热门企业
  async getHotEnterprise(isBeachBottom) {
    let params = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      industryId: this.data.industryId || ''
    }
    const { code, msg, data } = await apiGetHotEnterprise(params)
    console.log(data, '热门企业')
    if (code !== 200) return showToast(msg)
    if (isBeachBottom) {
      setTimeout(() => {
        this.setData({ showLoading: false })
      }, 1000)
      this.setData({
        companyList: [...this.data.companyList, ...data.records],
      })
    } else {
      setTimeout(() => {
        this.setData({ showLoading: false })
      }, 1000)
      this.setData({
        companyList: data.records,
      })
    }
    this.setData({
      isRefreshing: false,//关闭下拉刷新
      // isFinish: this.data.companyList.length >= data.total //全部加载完毕
    })
    // this.setData({
    //     companyList: data.records
    // })
  },
  // 获取banner列表
  async bannerList() {
    let type = Number(this.data.type) + 1
    let params = {
      showOn: type
    }
    const result = await getBannerList(params)
    console.log(result, 'banner')
    if (result.code !== 200) return showToast(result.msg)
    this.setData({
      navBerBack: result.data
    })
  },
  // 打开筛选行业弹窗
  openIndustry() {
    this.setData({
      isShowIndustry: true
    })
  },
  searchIndustry(params) {
    let _params = params.detail
    this.setData({
      gsName: _params.name,
      industryId: _params.industryId,
      pageNum: 1,
      isShowIndustry: false
    })
    this.getHotEnterprise(false)
  },
  // 更改地址和职位的箭头位置
  changeStatus(event) {
    let variate = event.currentTarget.dataset.type
    let icon = event.currentTarget.dataset.icon
    let flag = this.data[event.currentTarget.dataset.type]
    this.setData({
      [variate]: !flag,
      [icon]: !flag ? 'arrow-up' : 'arrow-down'
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
  // 关闭
  onClose() {
    this.setData({
      isSeletePost: false,
      arrowIcon1: 'arrow-down',
      isShow: false,
      isOpenAddress: false,
      arrowIcon: 'arrow-down',
      isShowIndustry: false
    })
  },
  // 地址确定
  comfirmCity(event) {
    if (this.data.type == 2) {
      this.setData({
        latitude: event.detail.latitude,
        longitude: event.detail.longitude
      })
    }
    this.setData({ areaId: event.detail.id, locationAddress: event.detail.name })
    this.onClose()
    this.getListByHome(false)
  },
  // 筛选弹窗
  openScreen() {
    this.setData({
      isShow: true
    })
  },
  // 筛选确定事件
  screenEvent(event) {
    this.setData({
      screen: event.detail,
      isShow: false,
      showLoading: true
    })
    this.getListByHome(false)
  },
  // 筛选数量统计
  screenNum(event) {
    this.setData({
      sxNum: event.detail
    })
  },
  //监听scroll滚动事件
  onRefresh() {
    let _type = this.data.type
    this.setData({
      pageNum: 1
    })
    if (_type == 2) { // 企业榜单
      this.getHotEnterprise(false)
    } else if (_type == 3 || _type == 4 || _type == 0 || _type == 5 || _type == 6) { // 应届校园 助残帮扶 急聘 宝妈专区 日结专区
      this.getListByHome(false)
    }
  },
  onLoadMore: function () {
    let _type = this.data.type
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    if (_type == 2) { // 企业榜单
      this.getHotEnterprise(true)
    } else if (_type == 3 || _type == 4 || _type == 0 || _type == 5 || _type == 6) { // 应届校园 助残帮扶 急聘 宝妈专区 日结专区
      this.getListByHome(true)
    }
  },
})