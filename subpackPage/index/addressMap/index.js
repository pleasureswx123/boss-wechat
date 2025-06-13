import { getMaparound, getMapinputtips } from '../../../http/index.js'
const app = getApp();
const INIT_MARKER = {
  callout: {
    content: '',
    padding: 10,
    borderRadius: 2,
    display: 'ALWAYS'
  },
  // latitude: 40.040415,
  latitude: 39.98246,
  // longitude: 116.273511,
  longitude: 117.07822,
  iconPath: 'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/newImg/markerImg.png',
  width: '24px',
  height: '24px',
  rotate: 0,
  alpha: 1,
  id: 1
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    latitude: '', // 维度
    longitude: '', // 经度
    maparoundList: [], // 附近的10个地址
    activeDistance: '', // 高亮名称
    eventChannel: null,
    searchValue: '', // 搜索内容
    maxlength: 14,
    searchListAsync: [], // 搜索地址数据
    clearable: true, // 是否展示清除图标
    baseImageUrl: app.globalData.baseImgUrl,
    markers: [{
      ...INIT_MARKER
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      eventChannel: this.getOpenerEventChannel()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    wx.getLocation({
      type: 'gcj02',
      geocode: true,
      success(res) {
        console.log(res, '定位位置111')
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
  // 获取经纬度下周边500m的店
  async maparound(isChange) {
    let params = {
      location: `${this.data.longitude},${this.data.latitude}`,
      radius: 500
    }
    if (isChange) {
      this.setData({
        maparoundList: []
      })
    }
    const res = await getMaparound(params)
    console.log(res, '999')
    if (res.code !== 200) return
    if(this.data.checkedItem && this.data.checkedItem){
      res.data[0].name = this.data.checkedItem.name
      res.data[0].location = this.data.checkedItem.location
      res.data[0].address = this.data.checkedItem.address
    }
    this.setData({
      ['markers[0].callout.content']: res.data[0].name,
      ['markers[0].latitude']: this.data.latitude,
      ['markers[0].longitude']: this.data.longitude
    })
    let arr = res.data.map(item => {
      return {
        ...item,
        select: false
      }
    })
    arr[0].select = true
    this.setData({
      maparoundList: arr,
      activeDistance: arr[0].distance,
    })
  },
  // 地图拖动事件
  bindregionchange(event) {
    // console.log(event, 11111)
    if (event.type == 'end' && event.causedBy == 'drag') {
      let { latitude, longitude } = event.detail.centerLocation
      let mapContent = wx.createMapContext('myMap', this)
      console.log(mapContent, '地图组件')
      mapContent.translateMarker({
        markerId: 1,
        destination: {
          latitude,
          longitude
        },
        autoRotate: false,
        duration: 250
      })
      this.setData({
        latitude,
        longitude
      })
      this.maparound(true)
    }
  },
  // 地址选择事件
  changeSelect(event) {
    let mapContent = wx.createMapContext('myMap', this)
    let that = this
    let { item } = event.currentTarget.dataset
    let updataList = this.data.maparoundList.map(i => {
      i.select = false
      if (i.distance == item.distance) {
        i.select = true
      }
      return {
        ...i
      }
    })
    mapContent.translateMarker({
      markerId: 1,
      destination: {
        latitude: item.location.split(',')[1],
        longitude: item.location.split(',')[0]
      },
      autoRotate: false,
      duration: 250,
      animationEnd: () => {
        that.setData({
          ['markers[0].callout.content']: item.name,
          ['markers[0].latitude']: item.location.split(',')[1],
          ['markers[0].longitude']: item.location.split(',')[0]
        })
      }
    })
    this.setData({
      maparoundList: updataList,
      activeDistance: item.distance,
      latitude: item.location.split(',')[1],
      longitude: item.location.split(',')[0],
    })

  },
  // 确定返回
  backCofirm() {
    let selectItem = this.data.maparoundList.find(item => item.distance == this.data.activeDistance)
    this.data.eventChannel.emit('someEvent', selectItem);
    wx.navigateBack()
  },

  // 搜索地址
  input(event) {
    if (event.detail.value !== '') {
      this.setData({
        timefn: this.debounce(() => {
          this.searchResultSiteList(event)
        }, 0)
      })
      this.data.timefn()
    }
  },

  // 调用接口
  searchResultSiteList(event) {
    if (event.detail.value.trim()) {
      let params = {
        // pageNum: 1,
        // pageSize: 50,
        keywords: event.detail.value,
        adcode: this.data.adcode,
        location: this.data.location,
        // name: event.detail.value
      }
      getMapinputtips(params).then(res => {
        console.log(res, '模糊匹配')
        const regex = new RegExp(event.detail.value, "gi");
        const highlightedResult = res.data.map((item, index) => {
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
  hotSearch(event) {
    let { item } = event.currentTarget.dataset
    console.log(item,'点击的项')
    this.setData({
      latitude: item.location.split(',')[1], // 维度
      longitude: item.location.split(',')[0], // 经度
      searchListAsync: [],
      searchValue: '',
      checkedItem: item
    })
    this.maparound(true)
  },
})