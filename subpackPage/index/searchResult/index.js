// subpackPage/index/searchResult/index.js
var app = getApp()
import { getSratchPostList, apiSearchByPost } from '../../../http/index'
import { historyListWhether, showToast } from '../../../utils/util'
import { searchPostHome } from '../../../http/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    searchResultValue: '', // 搜索职位或公司,
    type: 1,
    model: '',
    areaIds: [], // 区域ids
    keyId: '',
    dataList: [], // 数据
    index: "0", // 默认高亮职位
    show: false, // 筛选
    popupHeight: 0, // 弹框高度
    textData: [], // 期望薪资
    industryList: [{ name: '不限', isActive: true, code: null }], // 行业
    sufferList: [], // 经验
    scaleList: [], // 公司规模
    financingList: [], // 融资
    educationList: [], // 学历
    natureList: [], // 企业性质
    typeList: [], // 招聘类型
    jsList: [],//结算方式,
    clearing: [], // 结算单位
    searchListAsync: [], // 模糊匹配搜索结果列表,
    companyList: [], // 公司列表
    timefn: null,
    locationAddress: '',
    showLoading: false,
    jobType: null,
    indexInfo: {},
    sxNum: 0,
    screen: {}, // 筛选条件
    isRefreshing: false,//是否下拉刷新状态
    isFinish: false,//是否加载完全部数据
    pageNum: 1,
    searchTopHeight: 0, // 搜索区域元素的高度 
    search: true,
    sortObj: null, // 定制职位的排序对象
    searchType: null, // 首页搜索职位 （至臻版不使用/经典版全职不使用）只有经典版兼职使用
    storageType: 'history', // history 为全职/至臻版使用 ｜ history_partTime 兼职 ｜ history_hot 热门岗位
    pageType: 'all', // 区分全职/兼职/热门岗位筛选结构展示
  },
  // 职位和公司切换
  searchTab(event) {
    let index = event.currentTarget.dataset.index
    this.setData({
      index: Number(index),
    })
  },
  // 筛选城市
  gotoCity() {
    let currentAddress = JSON.stringify(wx.getStorageSync('current_Position'))
    wx.navigateTo({
      url: `/subpackPage/index/city/index?addressInfo=${currentAddress}`,
    })
  },
  // 筛选
  screOpen() {
    this.setData({ show: true })
  },
  // 关闭弹窗
  onClose() {
    this.setData({ show: false })
  },
  debounce(func, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
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
  // 清除当前输入框内容
  clearKeyWord() {
    this.setData({
      searchResultValue: '',
      searchListAsync: []
    })
  },
  // input框聚焦事件
  focus(event) {
    this.setData({
      timefn: this.debounce(() => {
        this.searchResultLikst(event)
      }, 300)
    })
    this.data.timefn()
  },
  // 搜索框input事件
  input(event) {
    this.setData({
      timefn: this.debounce(() => {
        this.searchResultLikst(event)
      }, 300)
    })
    this.data.timefn()
  },
  // confirm事件
  confirm(event) {
    if (event.detail.trim() == '') return showToast('搜索词不能为空')
    let history = wx.getStorageSync(this.data.storageType)
    let value = event.detail // 用户输入的内容
    // 把这个值用于请求
    this.setData({
      model: '',
      keyId: null,
      searchResultValue: value,
      searchListAsync: [], // 用户点击某一个职位或者公司之后清空搜索列表
      dataList: [], // 清空原本搜索结果列表
      showLoading: true, // 开启骨架屏
      pageNum: 1
    })
    if (!this.data.searchType) {
      this.getSearchByPost()
    }
    this.getListBySearch(false)
    let pushItem = {
      name: value,
      type: '',
      id: null
    }
    historyListWhether(history, pushItem, this.data.storageType)
  },
  // 点击模糊搜索列表
  async hotSearch(event) {
    let { name, id, type } = event.currentTarget.dataset.item
    let history = wx.getStorageSync(this.data.storageType)
    this.setData({
      model: type,
      index: type == 2 ? '1' : '0',
      keyId: id,
      searchResultValue: name,
      searchListAsync: [], // 用户点击某一个职位或者公司之后清空搜索列表
      dataList: [], // 清空原本搜索结果列表
      showLoading: true, // 开启骨架屏
      pageNum: 1
    })
    if (!this.data.searchType) {
      this.getSearchByPost()
    }
    this.getListBySearch(false)
    console.log('搜索结果页再次搜索')
    let pushItem = {
      name: name,
      id: id,
      type: type
    }
    historyListWhether(history, pushItem, this.data.hotSearch)
  },
  // 聚焦事件和input事件使用(模糊匹配结收拾结果)
  searchResultLikst(event) {
    if (event.detail.trim()) {
      let versions = wx.getStorageSync('versions')
      let params = {
        key: event.detail,
        edition: versions == 1 ? 2 : 1
      }
      getSratchPostList(params).then(res => {
        if (res.rows.length <= 10) {
          const regex = new RegExp(event.detail, "gi");
          const highlightedResult = res.rows.map((item, index) => {
            return {
              ...item,
              highlightedResult: item.name.replace(regex, (match) => `<span style="color: red;">${match}</span>`)
            }
          });
          let searchListAsync = highlightedResult
          this.setData({
            searchListAsync
          })
        } else {
          const regex = new RegExp(event.detail, "gi");
          const top10List = res.rows.slice(0, 10)
          const highlightedResult = top10List.map((item, index) => {
            return {
              ...item,
              highlightedResult: item.name.replace(regex, (match) => `<span style="color: red;">${match}</span>`)
            }
          });
          // let searchListAsync = res.data.list.slice(0, 10)
          let searchListAsync = highlightedResult
          this.setData({
            searchListAsync
          })
        }
      })
    } else {
      this.setData({
        searchListAsync: []
      })
    }
  },
  // 获取搜索职位的
  async getListBySearch(isBeachBottom) {
    // 106 是兼职-搜索 9是全职（至臻版搜索）
    let _module = 9
    if(this.data.storageType == 'history_partTime'){
      _module = 106
    } else if(this.data.storageType == 'history_hot'){
      _module = 205
    }
    let params = {
      dignity: 1,
      edition: wx.getStorageSync('versions') == 2 ? 1 : 2,
      module: _module, 
      pageNum: this.data.pageNum,
      pageSize: 10,
      // 搜索的是职位还是公司
      searchModel: this.data.model ? this.data.model : '',
      areaIds: this.data.areaIds,
      // model有值,key就是公司id或者职位id
      key: this.data.model ? this.data.keyId : this.data.searchResultValue,
      search: this.data.search,
      ...this.data.screen,
    }
    if (this.data.sortObj && this.data.sortObj.length > 0) {
      params.interests = this.data.sortObj
    }
    setTimeout(async () => {
      const res = await searchPostHome(params)
      console.log(res.data, '职位数据或者是当前公司下的职位数据')
      if (res.code !== 200) {
        showToast(res.msg)
        this.setData({ dataList: [] })
        return
      }
      if (isBeachBottom) {
        this.setData({
          dataList: [...this.data.dataList, ...this.setListData(res.data.list)],
        })
      } else {
        let newArr = res.data.list || []
        this.setData({
          dataList: this.setListData(newArr)
        })
      }
      this.setData({
        // isRefreshingText: true,
        isRefreshing: false,//关闭下拉刷新
        isFinish: this.data.dataList.length >= res.data.total, //全部加载完毕
        showLoading: false,
      })
    }, 1000)
  },
  // 搜索企业
  async getSearchByPost() {
    let params = {
      // model有值,key就是公司id或者职位id
      key: this.data.model ? this.data.keyId : this.data.searchResultValue,
      // 0是不点击纯粹搜索搜索框文本 (1是点击职位/2是点击公司)
      type: this.data.model ? this.data.model : 0,
      search: true,
      module: 9,
      edition: 1
    }
    const result = await apiSearchByPost(params)
    console.log(result, '企业列表')
    if (result.code !== 200) return showToast(result.msg)
    this.setData({
      companyList: result.rows
    })
  },
  // 筛选确定事件
  screenEvent(event) {
    console.log(event.detail, '搜索筛选')
    this.setData({
      screen: event.detail,
      show: false,
      dataList: [], // 清空原本搜索结果列表
      showLoading: true, // 开启骨架屏
      pageNum: 1
    })
    this.getListBySearch(false)
  },
  screenNum(event) {
    this.setData({
      sxNum: event.detail
    })
  },
  //列表数据结构整理
  setListData(newArr) {
    return newArr.map(item => {
      if (item.type == 1) {
        this.setData({
          jobType: 1
        })
      }
      if (item.type == 0) {
        this.setData({
          jobType: 0
        })
      }
      return {
        post: item.title,
        num: this.data.typeList[item.type]?.name,
        year: this.data.sufferList[item.experience]?.name,
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
        distance: item.distance?.substring(0, 4),
        clearing: this.data.clearing[item.settlementUnit - 1] ? this.data.clearing[item.settlementUnit - 1].name : '元/时', // 兼职结算方式
        online: item.online, // 在线状态
        activation: item.activation
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, '22222')
    // 字典
    let dictionary = wx.getStorageSync('dictionary')
    let popupHeight = wx.getSystemInfoSync().windowHeight - 10
    let _version = wx.getStorageSync('versions')
    this.setData({
      searchResultValue: options.keyValue,
      popupHeight: popupHeight,
      model: options.type,
      keyId: options.id,
      index: options.type == 2 ? '1' : '0',
      sufferList: this.mapData(dictionary[33]),
      textData: this.mapData(dictionary[3]),
      scaleList: this.mapData(dictionary[5]),
      financingList: this.mapData(dictionary[4]),
      educationList: this.mapData(dictionary[6]),
      natureList: this.mapData(dictionary[38]),
      typeList: this.mapData(dictionary[39]),
      jsList: this.mapData(dictionary[46]),
      clearing: this.mapData(dictionary[48]),
      versions: _version
    })
    if (options.screenObj && options.screenObj !== 'null' && options.screenObj !== 'undefined') {
      let sortObj = JSON.parse(options.screenObj)
      this.setData({
        sortObj,
        search: false
      })
    }
    if (options.searchType && options.searchType !== 'null' && options.searchType !== 'undefined') {
      // 首页搜索职位 （至臻版不使用/经典版全职不使用）只有经典版兼职使用
      this.setData({ searchType: options.searchType })
    }
    if (options.storageType && options.storageType !== 'null' && options.storageType !== 'undefined') {
      this.setData({ storageType: options.storageType })
      if (this.data.storageType == 'history_hot') {
        this.setData({pageType: 'hot'})
      } else if (this.data.storageType == 'history_partTime') {
        this.setData({pageType: 'partTime'})
      }
    }
    if(JSON.parse(options.areaIds).length > 0 && options.areaIds !== 'null' && options.areaIds !== 'undefined'){
      this.setData({
        areaIds: JSON.parse(options.areaIds)
      })
    }
    this.setData({ showLoading: true })
    // 获取公司列表
    if (!this.data.searchType) {
      this.getSearchByPost()
    }
    this.getListBySearch(false)
    // this.getIndustry()
    wx.createSelectorQuery().select('.searchTop').boundingClientRect((rect) => {
      this.setData({
        searchTopHeight: Math.floor(rect.height)
      })
    }).exec();
  },

  // 分享到好友
  onShareAppMessage: function () {
    return {
      title: '知城优聘职位推荐',
      path: `/subpackPage/index/searchResult/index?keyValue=${this.data.searchResultValue}&type=${''}&id=${null}`,
      imageUrl: this.data.logo,
      success(res) {
        console.log('成功', res)
      }
    }
  },
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '知城优聘职位推荐',
      query: `/subpackPage/index/searchResult/index?keyValue=${this.data.searchResultValue}&type=${''}&id=${null}`,
    }
  },

  //监听scroll滚动事件
  onRefresh() {
    this.setData({ pageNum: 1 })
    this.getListBySearch(false)
  },
  onLoadMore: function () {
    this.setData({ pageNum: this.data.pageNum + 1 })
    this.getListBySearch(true)
  },

  // ES6简写
  hasAnyValue(obj) {
    return Object.values(obj).some(value => value !== null && value !== undefined && value !== '');
  },
})