// subpackPage/index/city1/index.js
import { getAreaData, searchAreaList, searchInputtips, apiGetAddress } from '../../../http/index'
import { showToast } from '../../../utils/util'
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    baseImageUrl: app.globalData.baseImgUrl,
    globalBottom: app.globalData.globalBottom,
    cityShow: true, // 默认打开弹窗
    addressInfo: {}, // 点击进来的位置信息
    id: 'scroll-street',
    nowindex: '',// 左边颜色项
    // 左边标题
    leftTitle: [
      { name: '省', type: 'province', id: '', num: 0 },
      { name: '市', type: 'city', id: '', num: 1 },
      { name: '县/区', type: 'district', id: '', num: 2 },
      { name: '镇/乡/街道', type: 'street', id: '', num: 3 },
    ],
    districtList: [], // 县/区
    streetList: [], // 镇/乡/街道
    cityList: [], // 市
    provinceList: [], // 省
    selectedList: [], // 选择的区域
    isNumOne: true, // 是否是第一次
    type: '', // 区分求职期望和首页位置选择 (1为求职期望选择地址)
    searchValue: '', // 搜索
    maxlength: 14,
    timefn: null, // 定时器
    searchListAsync: [], // 搜索结果数组
    clearable: true,
    middleContentHeight: 0
  },
  measureMiddleContent: function () {
    const query = wx.createSelectorQuery().in(this);
    query.select('#middleContent').boundingClientRect(rect => {
      if (rect) {
        this.setData({
          middleContentHeight: rect.height,
        });
      }
    }).exec();
  },
  // 左边切换
  cutCity(event) {
    let { type, id, index } = event.currentTarget.dataset
    if (index == 0) {
      this.getAreaList(0, this.data.leftTitle[index].type)
    } else {
      console.log(this.data.leftTitle, '99999')
      if (!this.data.leftTitle[index - 1].id) return showToast(`请先选择${this.data.leftTitle[index - 1].name}`)
      this.getAreaList(this.data.leftTitle[index - 1].id, this.data.leftTitle[index].type)
    }
  },
  // 获取默认
  async getAreaList(id, level) {
    let params = {
      id: id,
      level: level
    }
    const res = await getAreaData(params)
    if (res.code !== 200) return
    // 设置县区的数据
    if (level == 'district') {
      let districtList = this.dispose(res.data, 'district', this.data.leftTitle[2].id)
      this.setData({
        districtList: districtList,
        nowindex: level,
        id: `scroll-${level}`
      })
    } else if (level == 'street') { // 镇/乡/街道
      let streetList = this.dispose(res.data, 'street', this.data.leftTitle[3].id)
      this.setData({
        streetList: streetList,
        nowindex: level,
        id: `scroll-${level}`
      })
    } else if (level == 'city') { // 市
      let cityList = this.dispose(res.data, 'city', this.data.leftTitle[1].id)
      this.setData({
        cityList: cityList,
        nowindex: level,
        id: `scroll-${level}`
      })
    } else if (level == 'province') { // 省
      let provinceList = this.dispose(res.data, 'province', this.data.leftTitle[0].id)
      this.setData({
        provinceList: provinceList,
        nowindex: level,
        id: `scroll-${level}`
      })
    }
  },
  // 返回上一页
  back() {
    wx.navigateBack()
  },
  // 选择省市区街道
  SELECTED(event) {
    let { item, list, nexttype, currenttype, index } = event.currentTarget.dataset
    let _list = this.disposeRight(list, item)
    let _upDataList = currenttype + 'List'
    let _nextList = nexttype + 'List'
    let _leftTitle = []
    _leftTitle = this.data.leftTitle.map(i => {
      if (currenttype == i.type) {
        i.id = item.id
      }
      if (i.num > index) {
        i.id = ''
      }
      return {
        ...i
      }
    })
    this.setData({
      [_upDataList]: _list,
      [_nextList]: [],  // 清除下一层级的数组数据, 防止出现问题
      leftTitle: _leftTitle
    })
    this.addSelectedList(item, currenttype, this.data.isNumOne)
    if (nexttype == 0) return
    this.getAreaList(item.id, nexttype)
  },
  // 处理数据(左边选择省市区街道)
  dispose(typeList, type, id) {
    if (type == 'city' || type == 'district' || type == 'province' || type == 'street') {
      let radio = false
      let disposeList = typeList.map(item => {
        let subList = item.subList.map(i => {
          if (i.id == id) {
            radio = true
          } else {
            radio = false
          }
          return {
            ...i,
            radio: radio,
            type: type
          }
        })
        return {
          py: item.py,
          subList: subList
        }
      })
      return disposeList
    }
  },
  // 处理数据(右边选择单个)
  disposeRight(arrList, item) {
    let list = null
    let subList = null
    let radio = false
    list = arrList.map((e, index) => {
      subList = e.subList.map(i => {
        if (i.id == item.id) {
          radio = true
        } else {
          radio = false
        }
        return {
          ...i,
          radio: radio
        }
      })
      return {
        py: e.py,
        subList: subList
      }
    })
    return list
  },
  // 追加地址
  addSelectedList(item, type, isFlag) {
    if (type == 'street' && isFlag) { // 选择的是镇/乡/街道
      this.data.selectedList = [] // 清空之后再次更新
      let province = { name: this.data.addressInfo.provinceName, id: this.data.addressInfo.provinceId, type: 'province' }
      let city = { name: this.data.addressInfo.cityName, id: this.data.addressInfo.cityId, type: 'city' }
      let district = { name: this.data.addressInfo.districtName, id: this.data.addressInfo.districtId, type: 'district' }
      let street = { name: item.name, id: item.id, type: item.type }
      this.data.selectedList.push(province)
      this.data.selectedList.push(city)
      this.data.selectedList.push(district)
      this.data.selectedList.push(street)
    } else {
      // 如果点击的是除街道之外的位置,则不是第一次点击/再次点击街道时,需要将第一次的状态修改
      this.setData({ isNumOne: false })
      // 点击的不是镇/乡/街道
      // 查找对应的索引
      let selectedIndex = this.data.selectedList.findIndex(e => e.type == item.type)
      console.log(selectedIndex, '是打击挨打')
      if (this.data.selectedList.findIndex(e => e.type == item.type) >= 0) {
        // 将最新选择的数据追加到已选数组中
        this.data.selectedList.splice(selectedIndex)
        this.data.selectedList[selectedIndex] = item
      } else {
        this.data.selectedList.push(item)
      }
    }
    this.setData({
      selectedList: this.data.selectedList
    })
  },
  // 删除已选择的地址
  delete(event) {
    let { id, type, index } = event.currentTarget.dataset
    this.data.selectedList.splice(index)
    let _leftTitle = []
    _leftTitle = this.data.leftTitle.map(i => {
      if (i.num >= index) {
        i.id = ''
      }
      return {
        ...i
      }
    })
    this.setData({
      nowindex: type,
      selectedList: this.data.selectedList,
      leftTitle: _leftTitle
    })
    if (index == 0) {
      this.getAreaList(0, this.data.leftTitle[index].type)
    } else {
      this.getAreaList(this.data.leftTitle[index - 1].id, this.data.leftTitle[index].type)
    }
  },
  // 底部按钮-(清除)
  reset(event) {
    let { type } = event.currentTarget.dataset
    let _leftTitle = []
    _leftTitle = this.data.leftTitle.map(i => {
      if (i.num > 0) { i.id = '' }
      return { ...i }
    })
    let selectedList = this.data.selectedList.filter(item => item.type == 'province')
    this.setData({
      selectedList: selectedList,
      nowindex: type,
      leftTitle: _leftTitle
    })
    this.getAreaList(0, type)
  },
  // 底部按钮-(确定)
  comfirmScreening() {
    if (this.data.selectedList.length == 0) {
      showToast('请至少选择一个市级区域')
      return
    }
    if (this.data.type == 1) {
      const eventChannel = this.getOpenerEventChannel()
      if (this.data.selectedList[this.data.selectedList.length - 1].type == 'province') return showToast('小优提醒您,至少选择到市哦')
      let selectedClty = this.data.selectedList[this.data.selectedList.length - 1]
      eventChannel.emit('changeCity', selectedClty);
      wx.navigateBack();
    } else {
      if (this.data.selectedList[this.data.selectedList.length - 1].type == 'province') return showToast('小优提醒您,至少选择到市哦')
      // wx.removeStorageSync('current_Position')
      wx.removeStorageSync('isnotOne')
      // 存储地址
      let current_Position = {
        provinceId: this.data.selectedList[0].id, // 省
        provinceName: this.data.selectedList[0].name,
        cityId: this.data.selectedList[1] ? this.data.selectedList[1].id : '', // 市
        cityName: this.data.selectedList[1] ? this.data.selectedList[1].name : '',
        districtId: this.data.selectedList[2] ? this.data.selectedList[2].id : '', // 镇
        districtName: this.data.selectedList[2] ? this.data.selectedList[2].name : '',
        streetId: this.data.selectedList[3] ? this.data.selectedList[3].id : '', // 街道
        streetName: this.data.selectedList[3] ? this.data.selectedList[3].name : ''
      }
      wx.setStorageSync('current_Position', current_Position)
      wx.setStorageSync('areaId', this.data.selectedList[this.data.selectedList.length - 1].id)
      wx.navigateBack();
    }
  },
  // 模糊搜索列表点击事件
  hotSearch(event) {
    let { item } = event.currentTarget.dataset
    console.log(item, '点击的项')
    let params = {
      lon: item.location.split(',')[0],
      lat: item.location.split(',')[1]
    }
    apiGetAddress(params).then(res => {
      console.log(res, '数据')
      this.initOrSearchAddress(res.data, 'search')
    })
  },
  // 点击清除按钮
  clearKeyWord(event) {
    this.setData({
      searchValue: '',
      searchListAsync: []
    })
  },
  // 搜索事件
  input(event) {
    if (event !== '') {
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
        pageNum: 1,
        pageSize: 10,
        // name: event.detail.value
        key: event.detail.value,
        keywords: event.detail.value,
        adcode: this.data.adcode,
        location: this.data.location
      }
      searchInputtips(params).then(res => {
        console.log(res, '模糊匹配')
        let newList = this.fliterLocationFn(res.data)
        const regex = new RegExp(event.detail.value, "gi");
        const highlightedResult = newList.map((item, index) => {
          return {
            ...item,
            highlightedResult: item.name.replace(regex, (match) => `<span style="color: red;">${match}</span>`)
          }
        });
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

  debounce(func, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  },

  // 过滤出没有经纬度的搜索内容
  fliterLocationFn(array) {
    return array.filter(item => {
      // 检查 location 是否存在并且不是空数组或非空字符串
      return (item.location && (typeof item.location == 'string' || item.location.length > 0));
    });
  },

  // 抽离公共方法
  initOrSearchAddress(addressData, type) {
    if (addressData.districtId) {
      this.getAreaList(addressData.districtId, 'street')
    } else if (addressData.cityId) {
      this.getAreaList(addressData.cityId, 'district')
    } else if (addressData.provinceId) {
      this.getAreaList(addressData.provinceId, 'city')
    } else if (addressData.streetId) {
      this.getAreaList(addressData.streetId, 'street')
    }

    let idList = [
      { id: addressData.provinceId, type: 'province' }, // 省
      { id: addressData.cityId, type: 'city' }, // 市
      { id: addressData.districtId, type: 'district' }, // 县
      { id: addressData.streetId, type: 'street' }, // 街道
    ]
    let _leftTitle = null
    let _selectedList = []
    idList.map((item, index) => {
      _leftTitle = this.data.leftTitle.map(i => {
        if (i.type == item.type) {
          i.id = item.id
        }
        return {
          ...i
        }
      })
    })
    // 初始就追加已选择的内容
    let province = { name: addressData.provinceName, id: addressData.provinceId, type: 'province' }
    let city = { name: addressData.cityName, id: addressData.cityId, type: 'city' }
    let district = { name: addressData.districtName, id: addressData.districtId, type: 'district' }
    let street = { name: addressData.streetName, id: addressData.streetId, type: 'street' }
    if (province.id && province.name) {
      _selectedList.push(province)
    }
    if (city.id && city.name) {
      _selectedList.push(city)
    }
    if (district.id && district.name) {
      _selectedList.push(district)
    }
    if (street.id && street.name) {
      _selectedList.push(street)
    }
    if (type == 'search') {
      this.setData({
        searchListAsync: [],
        searchValue: ''
      })
    }
    this.setData({
      leftTitle: _leftTitle,
      selectedList: _selectedList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.addressInfo = JSON.parse(options.addressInfo)
    this.setData({ adcode: this.data.addressInfo.cityId, location: options.location })
    // console.log(this.data.addressInfo, '000')
    if (Object.keys(this.data.addressInfo).length !== 0) {
      this.initOrSearchAddress(this.data.addressInfo, 'init')
    } else {
      this.getAreaList(0, 'province')
    }
    if (options.type == 1) {
      this.setData({
        type: options.type
      })
    }
  },

  onReady() {
    this.measureMiddleContent()
  }
})