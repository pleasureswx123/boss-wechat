const app = getApp();
import { getAreaData, seekerCollectAddress, getMaparound, getMapinputtips, apiGetAddress, searchAreaList } from '../../../http/index'
import { getOpenArea } from '../../../http/versions'
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
    provinceList: [], // 全部省份数据
    seekerCollectAddressList: [], // 历史地址列表
    currentAddress: '', // 当前选择的地址
    latitude: '', // 纬度
    longitude: '', // 经度
    searchListAsync: [], // 搜索结果数据
    maxlength: 14,
    timefn: null,
    getRandomEvent: null,
    currentAddId: '', // 更新本地存储的哪一个地址
    rollIndex: 1,
    swiperHidden: false,
    focus: false,
    autoplay: true,
    isShowBtn: false,
    dialogShow: false, // dialog弹窗
    provinceOpenList: [],
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    cityShow: false,
    cityType: '', // 模式（单选/多选）
    cityItem: '',
    storageType: 'addressDetail', // 从修改或使用那个本地存储
  },
  // 选择一个已经添加的地址
  onChange(event) {
    let { index, item } = event.currentTarget.dataset
    let _seekerCollectAddressList = this.data.seekerCollectAddressList
    _seekerCollectAddressList[index].checked = true
    // let addressDetail = wx.getStorageSync('addressDetail')
    let addressDetail = wx.getStorageSync(this.data.storageType)
    addressDetail[this.data.currentAddId].jobCityId = item.areaId
    addressDetail[this.data.currentAddId].lat = item.lat
    addressDetail[this.data.currentAddId].lon = item.lon
    addressDetail[this.data.currentAddId].adCode = item.adcode || item.adCode
    addressDetail[this.data.currentAddId].jobCityName = item.title
    // wx.setStorageSync('addressDetail', addressDetail)
    wx.setStorageSync(this.data.storageType, addressDetail)
    this.setData({
      seekerCollectAddressList: _seekerCollectAddressList,
    });
    const eventChannel = this.getOpenerEventChannel();
    // 触发事件并传递数据
    eventChannel.emit('changeCity', this.data.currentAddId);
    this.back()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, '传递的参数')
    console.log(this.data.swiperHidden)
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
    if (options.step) {
      this.setData({
        step: options.step
      })
    }
    //至臻版求职期望
    if (options.addressInfo) {
      this.setData({
        addressInfo: options.addressInfo
      })
    }
    if (options.location) {
      this.setData({
        location: options.location
      })
    }
    if (options.storageType && options.storageType != 'undefined') {
      this.setData({ storageType: options.storageType })
    }

    if (options.addressNameNologin != '' && options.addressNameNologin != 'undefined') {
      wx.$event.on('SeekerCollectAddressList', this, this.getSeekerCollectAddressList)
      this.getSeekerCollectAddressList()
      // let addressDetail = wx.getStorageSync('addressDetail')[options.currentAddId]
      let addressDetail = wx.getStorageSync(this.data.storageType)[options.currentAddId]
      console.log(addressDetail, '取出来的地址')
      if (addressDetail) {
        this.setData({
          currentAddress: addressDetail.jobCityName || addressDetail.name,
          currentAddId: options.currentAddId // 更新本地存储的哪一个地址
        })
      } else {
        this.setData({
          currentAddress: options.addressNameNologin,
        })
      }
    }
    //区域工作机会
    this.getOpenArea()
  },
  onUnload() {
    clearInterval(this.data.getRandomEvent)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  // 获取历史地址列表
  async getSeekerCollectAddressList() {
    let params = {}
    const res = await seekerCollectAddress(params, 0)
    console.log(res, '历史地址')
    if (res.code != 200) return
    this.setData({
      seekerCollectAddressList: res.data.map(item => {
        return { ...item, checked: false }
      })
    })
  },
  // 地址列表(去)
  gotoAddressList() {
    if (this.data.seekerCollectAddressList.length == 0) {
      console.log('没有地址')
      let that = this
      wx.navigateTo({
        url: `/subpackPage/index/addressDetail/index?id=${''}`,
        events: {
          someEvent: function (data) {
            that.getSeekerCollectAddressList()
          }
        },
      })
    } else {
      wx.navigateTo({
        url: '/subpackPage/index/addressList/index',
      })
    }
  },
  goMoreAddr() {
    console.log(1111)
    let that = this
    wx.navigateTo({
      url: `/subpackPage/index/city/index?addressInfo=${this.data.addressInfo}&type=${1}&location=${this.data.location}`,
      events: {
        changeCity: function (data) {
          const eventChannel = that.getOpenerEventChannel()
          eventChannel.emit('changeCity', data);
          wx.navigateBack()
        }
      }
    })
  },
  // 去地址
  gotoCity(event) {
    let { item } = event.currentTarget.dataset
    this.setData({ cityItem: item })
    if (this.data.step == 2) {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('changeCity', { name: item.streetName || item.districtName, id: item.streetId || item.districtId });
      wx.navigateBack();
    } else if (this.data.step == 1) {
      // wx.navigateTo({
      //   url: `/subpackPage/index/newjdCity/index?city=${JSON.stringify(item)}&step=1`,
      // })
      this.setData({
        cityType: 'select',
        cityShow: true,
      })
    } else {
      // wx.navigateTo({
      //   url: `/subpackPage/index/newCity/index?province=${JSON.stringify(item)}&currentAddId=${this.data.currentAddId}`,
      // })
      // wx.navigateTo({
      //   url: `/subpackPage/index/newjdCity/index?city=${JSON.stringify(item)}&currentAddId=${this.data.currentAddId}&type=${'multiple'}`,
      // })
      this.setData({
        cityType: 'multiple',
        cityShow: true,
      })
    }
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
    // let addressDetail = wx.getStorageSync('addressDetail')
    let addressDetail = wx.getStorageSync(this.data.storageType)
    addressDetail[this.data.currentAddId].lat = res.data[0].location.split(',')[1]
    addressDetail[this.data.currentAddId].lon = res.data[0].location.split(',')[0]
    addressDetail[this.data.currentAddId].adCode = res.data[0].adcode || res.data[0].adCode
    addressDetail[this.data.currentAddId].jobCityName = res.data[0].name
    addressDetail[this.data.currentAddId].jobCityId = result.data.streetId
    console.log(addressDetail, '8888:::::::::::::::::::::::')
    wx.setStorageSync(this.data.storageType, addressDetail)
    const eventChannel = this.getOpenerEventChannel();
    // 触发事件并传递数据
    eventChannel.emit('changeCity', this.data.currentAddId);
    this.back()
  },
  // 返回
  back() {
    wx.navigateBack({ delta: 1 })
  },
  //获取开放地区接口
  async getOpenArea() {
    const res = await getOpenArea()
    if (res.code != 200) return
    // console.log(_provinceOpenList,'777777')
    this.setData({
      provinceOpenList: res.data
    })
  },
  // 新版
  editAddress() {
    // this.setData({
    //   isShowBtn: !this.data.isShowBtn
    // })
    wx.navigateTo({
      url: '/subpackPage/index/addressList/index',
    })
  },

  // 打开dialog弹窗
  openDeleteDialog(event) {
    let currentId = event.currentTarget.dataset.id
    this.setData({ dialogShow: true, currentId })
  },
  onClose(event) {
    console.log(event);
    this.setData({ dialogShow: false })
  },
  async confirm(event) {
    console.log(event);
    let params = {
      id: this.data.currentId
    }
    const res = await seekerCollectAddress(params, 4)
    console.log(res, '9999')
    if (res.code !== 200) return
    wx.showToast({
      title: '删除成功',
      icon: 'none',
    })
    this.setData({
      dialogShow: false
    })
    this.getSeekerCollectAddressList()
  },

  // 关闭地址弹窗
  onClosecityShow() {
    this.setData({
      cityShow: false,
      cityItem: '', // 关闭弹窗后需要清空上次选择的地址/防止弹窗选择地址出现问题
    })
  },
  // 返回
  backRenovate() {
    this.onClosecityShow()
    wx.navigateBack()
  }
})