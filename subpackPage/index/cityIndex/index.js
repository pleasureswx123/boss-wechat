// subpackPage/index/cityIndex/index.js
const app = getApp();
import { getAreaData, seekerCollectAddress, getMaparound, getMapinputtips, apiGetAddress, searchAreaList, searchInputtips } from '../../../http/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    baseImageUrl: app.globalData.baseImgUrl,
    globalBottom: app.globalData.globalBottom,
    defaultImage: '?x-oss-process=image/resize,w_100/quality,q_90',
    capsuleWidth: '', // 胶囊宽度
    capsuleTop: '', // 胶囊距离顶部距离
    provinceList: [], // 全部省份数据
    seekerCollectAddressList: [], // 历史地址列表
    currentAddress: '', // 当前选择的地址
    latitude: '', // 纬度
    longitude: '', // 经度
    searchListAsync: [], // 搜索结果数据
    maxlength: 14,
    searchValue: '', // 搜索结果
    clearable: true, // 是否展示清空图标
    timefn: null,
    location: '', // 经纬度对象(用于搜索框)
    adcode: '', // 区域adcode(用于搜索框)
    placeholderVal: '', // 输入框占位
    getRandomEvent: null,
    currentAddId: '', // 更新本地存储的哪一个地址
    rollList: [
      { text: '请输入所在省份', translateY: 0 },
      { text: '请输入所在市区', translateY: 0 },
      { text: '请输入所在县城', translateY: 0 },
    ],
    rollIndex: 1,
    swiperHidden: false, // 是否展示轮播
    focus: false,
    autoplay: true,
    cityShow: false,
    province: '', // 选择的省
  },
  // 数组中随机取值
  getRandomElement(arr) {
    var randomIndex = Math.floor(Math.random() * arr.length);
    return arr[randomIndex];
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, '传递的参数')
    console.log(this.data.swiperHidden)
    let that = this
    wx.getSystemInfo({
      success: e => {
        that.setData({
          capsuleWidth: wx.getMenuButtonBoundingClientRect().width,
          capsuleTop: wx.getMenuButtonBoundingClientRect().top
        })
        console.log(wx.getMenuButtonBoundingClientRect().width, wx.getMenuButtonBoundingClientRect().top)
      }
    })
    let addressDetail = wx.getStorageSync('addressDetail')[options.currentAddId]
    let token = wx.getStorageSync('token')
    
    if (addressDetail) {
      this.setData({
        currentAddress: addressDetail.name || addressDetail.jobCityName,
        adcode: addressDetail.adcode || addressDetail.adCode,
        currentAddId: options.currentAddId // 更新本地存储的哪一个地址
      })
      if (addressDetail.location) {
        this.setData({ location: addressDetail.location })
      } else {
        this.setData({ location: `${addressDetail.lon},${addressDetail.lat}` })
      }
    }

    if (token) {
      wx.$event.on('SeekerCollectAddressList', this, this.getSeekerCollectAddressList)
      this.getSeekerCollectAddressList()
    }
  },
  onUnload() {
    // clearInterval(this.data.getRandomEvent)
  },
  inputFoucs() {
    this.setData({
      swiperHidden: true,
      focus: true,
      placeholderVal: '搜索省市街道',
      autoplay: false
    })
  },
  blur() {
    this.setData({
      swiperHidden: false,
      focus: false,
      placeholderVal: '',
      autoplay: true
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getAreaList(0, 'province')
    
  },

  // 获取默认(全部省份地址)
  async getAreaList(id, level) {
    let params = {
      id: id,
      level: level
    }
    const res = await getAreaData(params)
    if (res.code !== 200) return
    let arr = []
    res.data.map(item => {
      arr.push(...item.subList)
    })
    this.setData({
      provinceList: arr
    })
  },
  // 获取历史地址列表
  async getSeekerCollectAddressList() {
    let params = {}
    const res = await seekerCollectAddress(params, 0)
    // console.log(res,'历史地址')
    if (res.code != 200) return
    this.setData({
      seekerCollectAddressList: res.data
    })
  },
  // 地址列表(去)
  gotoAddressList() {
    wx.navigateTo({
      url: '/subpackPage/index/addressList/index',
    })
  },
  // 去地址
  gotoCity(event) {
    let { item } = event.currentTarget.dataset
    // wx.navigateTo({
    //   url: `/subpackPage/index/newCity/index?province=${JSON.stringify(item)}&currentAddId=${this.data.currentAddId}`,
    // })
    this.setData({province:item})
    this.setData({cityShow: true})
  },
  // 刷新定位
  refreshAddress() {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      geocode: true,
      success(res) {
        console.log(res, '定位位置')
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        that.maparound()
      },
      fail(err) {
        console.log(err, '错误')
      }
    })
  },
  // 获取地址周边详细地址(第一个)
  async maparound() {
    let params = {
      lon: this.data.longitude,
      lat: this.data.latitude
    }
    const result = await apiGetAddress(params)
    console.log(result, '当前位置')
    if (result.code !== 200) return
    const res = await getMaparound({ location: `${this.data.longitude},${this.data.latitude}`, radius: 500 })
    console.log(res, this.data.currentAddId, '获取当前定位周围的店')
    if (res.code !== 200) return
    let addressDetail = wx.getStorageSync('addressDetail')
    addressDetail[this.data.currentAddId].lat = res.data[0].location.split(',')[1]
    addressDetail[this.data.currentAddId].lon = res.data[0].location.split(',')[0]
    addressDetail[this.data.currentAddId].adCode = res.data[0].adcode || res.data[0].adCode
    addressDetail[this.data.currentAddId].jobCityName = res.data[0].name
    addressDetail[this.data.currentAddId].jobCityId = result.data.streetId
    console.log(addressDetail, '8888:::::::::::::::::::::::')
    wx.setStorageSync('addressDetail', addressDetail)
    wx.setStorageSync('isChange', this.data.currentAddId)
    const eventChannel = this.getOpenerEventChannel();
    // 触发事件并传递数据
    eventChannel.emit('changeTab');
    this.back()
  },

  // 选择地址
  selectAddress(event) {
    let { item } = event.currentTarget.dataset
    item.name = item.title
    let addressDetail = wx.getStorageSync('addressDetail')
    addressDetail[this.data.currentAddId].jobCityId = item.areaId
    if (this.data.currentAddId == 0) {
      addressDetail[this.data.currentAddId].location = `${item.lon},${item.lat}`
      addressDetail[this.data.currentAddId].adcode = item.adcode || item.adCode
      addressDetail[this.data.currentAddId].name = item.name
    } else {
      addressDetail[this.data.currentAddId].lat = item.lat
      addressDetail[this.data.currentAddId].lon = item.lon
      addressDetail[this.data.currentAddId].adCode = item.adcode || item.adCode
      addressDetail[this.data.currentAddId].jobCityName = item.name
    }
    console.log(addressDetail, '9999')
    wx.setStorageSync('addressDetail', addressDetail)
    wx.setStorageSync('isChange', this.data.currentAddId)
    const eventChannel = this.getOpenerEventChannel();
    // 触发事件并传递数据
    eventChannel.emit('changeTab');
    this.back()
  },
  // 搜索地址
  input(event) {
    if (event.detail.value !== '') {
      this.setData({
        timefn: this.debounce(() => {
          this.searchResultSiteList(event)
        }, 500)
      })
      this.data.timefn()
    }
  },

  // 调用接口
  searchResultSiteList(event) {
    if (event.detail.value.trim()) {
      let params = {
        adcode: this.data.adcode,
        location: this.data.location,
        page: 1,
        pageSize: 10,
        key: event.detail.value,
        keywords: event.detail.value
      }
      searchInputtips(params).then(res => {
        // console.log(res, '模糊匹配')
        let newList = this.fliterLocationFn(res.data)
        const regex = new RegExp(event.detail.value, "gi");
        const highlightedResult = newList.map((item, index) => {
          return {
            ...item,
            highlightedResult: item.name.replace(regex, (match) => `<span style="color: red;">${match}</span>`)
          }
        });
        console.log(highlightedResult);
        let searchListAsync = highlightedResult
        this.setData({
          searchListAsync
        })
      })
    } else {
      this.setData({
        searchListAsync: []
      })
    }
  },

  // 过滤出没有经纬度的搜索内容
  fliterLocationFn(array) {
    return array.filter(item => {
      // 检查 location 是否存在并且不是空数组或非空字符串
      return (item.location && (typeof item.location == 'string' || item.location.length > 0));
    });
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

  // 点击清除按钮
  clearKeyWord(event) {
    this.setData({
      searchValue: '',
      searchListAsync: []
    })
  },
  // 模糊搜索列表点击事件
  async hotSearch(event) {
    let { item } = event.currentTarget.dataset
    console.log(item, '点击的项')
    let params = {
      lon: item.location.split(',')[0],
      lat: item.location.split(',')[1]
    }
    const result = await apiGetAddress(params)
    console.log(result, '当前位置')
    let keyList = ['provinceId', 'cityId', 'districtId', 'streetId']
    let keyName = ['provinceName', 'cityName', 'districtName', 'streetName']
    let areaId = null
    let _name = null
    keyList.map(i => {
      if (result.data[i]) {
        areaId = result.data[i]
      }
    })
    keyName.map(i => {
      if (result.data[i]) {
        _name = result.data[i]
      }
    })
    console.log(_name, areaId, '数据1111')
    let addressDetail = wx.getStorageSync('addressDetail')
    addressDetail[this.data.currentAddId].jobCityId = areaId // 缺少区域id
    if (this.data.currentAddId == 0) {
      // addressDetail[this.data.currentAddId].location = item.location
      // addressDetail[this.data.currentAddId].adcode = item.adcode || item.adCode
      // addressDetail[this.data.currentAddId].name = _name
      addressDetail[this.data.currentAddId].name = item.name
    } else {
      // addressDetail[this.data.currentAddId].lat = item.location.split(',')[1]
      // addressDetail[this.data.currentAddId].lon = item.location.split(',')[0]
      // addressDetail[this.data.currentAddId].adCode = item.adcode || item.adCode
      // addressDetail[this.data.currentAddId].jobCityName = _name
      addressDetail[this.data.currentAddId].jobCityName = item.name
    }
    wx.setStorageSync('addressDetail', addressDetail)
    const eventChannel = this.getOpenerEventChannel();
    // 触发事件并传递数据
    eventChannel.emit('changeTab');
    this.setData({
      searchValue: '',
      searchListAsync: [],
      swiperHidden: false,
      placeholderVal: '',
      focus: false,
      autoplay: true
    })
    this.back()
  },
  // 返回
  back() {
    wx.navigateBack({ delta: 1 })
  },

  onClosecityShow(){
    this.setData({
      cityShow: false,
      province: ''
    })
  },
  // 返回并触发刷新
  backRenovate(){
    this.onClosecityShow()
    wx.navigateBack()
  }
})