// components/perfectestCityPopup/perfectestCityPopup.js
import { getAreaData, seekerCollectAddress } from '../../http/index'
const app = getApp();
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    currentAddId: {
      type: Number || String,
      value: 0
    },
    province: {
      type: Object
    }
  },
  lifetimes: {
    attached() {
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
      console.log(this.data.currentAddId,'111111')
      console.log(this.data.province,'传递的参数')
      let _province = this.data.province
      if(_province){
        this.setData({ provinceName: _province.name })
        this.getAreaList(_province.id, 'city')
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    globalBottom: app.globalData.globalBottom,
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    provinceList: [], // 全部省份数据
    cityList: [], // 市数据
    districtList: [], // 区县数据
    streetList: [], // 街道数据
    activeCityId: 0, // 市高亮
    activeDistrictId: 0, // 区县高亮
    activeStreetId: 0, // 街道高亮
    selectedList: [], // 选择
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取默认(全部省份地址)
    async getAreaList(id, level) {
      let params = {
        id: id,
        level: level
      }
      const res = await getAreaData(params)
      if (res.code !== 200) return
      if (level == 'district') {
        // console.log(res, '区数据')
        this.dispose(res.data, 'district')
      } else if (level == 'city') {
        // console.log(res, '市数据')
        this.dispose(res.data, 'city')
      } else {
        // console.log(res, '镇街道数据')
        this.dispose(res.data, 'street')
      }
    },
    // 处理数据
    dispose(list, level) {
      if (level == 'city') {
        let arr = []
        let _selectedList = this.data.selectedList
        list.map(item => {
          arr.push(...item.subList)
        })
        _selectedList.push(arr[0])
        this.setData({ cityList: arr, activeCityId: arr[0].id, selectedList: _selectedList })
        this.getAreaList(this.data.cityList[0].id, 'district')
      }
      if (level == 'district') { // 区县
        let arr = []
        let _selectedList = this.data.selectedList
        list.map(item => {
          arr.push(...item.subList)
        })
        let city = this.data.cityList.find(i => i.id == this.data.activeCityId)
        arr.unshift({ name: `全${city.name}`, id: 0 })
        _selectedList.push(arr[0])
        this.setData({ districtList: arr, activeDistrictId: arr[0].id, selectedList: _selectedList })
        this.getAreaList(this.data.districtList[0].id, 'street')
      } else if (level == 'street') {
        let arr = []
        let _selectedList = this.data.selectedList
        if (list.length == 0) {
          let city = this.data.cityList.find(i => i.id == this.data.activeCityId)
          if (city.name.startsWith('全')) {
            city.name = city.name.substring(1);
          }
          arr.push({ name: `全${city.name}`, id: 0 })
          this.setData({ streetList: arr, activeStreetId: arr[0].id })
        } else {
          list.map(item => {
            arr.push(...item.subList)
          })
          let district = this.data.districtList.find(i => i.id == this.data.activeDistrictId)
          arr.unshift({ name: `全${district.name}`, id: 0 })
          _selectedList.push(arr[0])
          this.setData({ streetList: arr, activeStreetId: arr[0].id, selectedList: _selectedList })
        }
      }
    },

    // 选择
    async selectItem(event) {
      let { currentlevel, item, nextlevel } = event.currentTarget.dataset
      if (currentlevel == 'city') {
        this.setData({
          selectedList: []
        })
        let _selectedList = this.data.selectedList
        _selectedList.push(item)
        this.setData({
          activeCityId: item.id,
          activeDistrictId: 0,
          activeStreetId: 0,
          streetList: [],
          selectedList: _selectedList
        })
        await this.getAreaList(item.id, nextlevel)
      } else if (currentlevel == 'district') {
        let _selectedList = this.data.selectedList
        _selectedList[1] = item
        if (_selectedList.length > 2) {
          _selectedList.pop()
        }
        this.setData({
          activeDistrictId: item.id,
          activeStreetId: 0,
          selectedList: _selectedList
        })
        await this.getAreaList(item.id, nextlevel)
      } else {
        let _selectedList = this.data.selectedList
        _selectedList[2] = item
        this.setData({
          activeStreetId: item.id,
          selectedList: _selectedList
        })
      }
    },

    // 确定选择
    comfirmScreening() {
      let addressDetail = wx.getStorageSync('addressDetail')
      let index = this.data.selectedList.length - 1
      let lastItem = this.data.selectedList[index]
      console.log(this.data.selectedList[index - 1], '9999::::::::::::::::::::')
      if (!lastItem.name.includes('全')) {
        addressDetail[this.data.currentAddId].jobCityId = this.data.selectedList[index].id
        if (this.data.currentAddId == 0) {
          addressDetail[this.data.currentAddId].adcode = this.data.selectedList[index].adCode
          addressDetail[this.data.currentAddId].name = this.data.selectedList[index].name
          addressDetail[this.data.currentAddId].location = `${this.data.selectedList[index].lng},${this.data.selectedList[index].lat}`
        } else {
          addressDetail[this.data.currentAddId].lat = this.data.selectedList[index].lat
          addressDetail[this.data.currentAddId].lon = this.data.selectedList[index].lng
          addressDetail[this.data.currentAddId].adCode = this.data.selectedList[index].adCode
          addressDetail[this.data.currentAddId].jobCityName = this.data.selectedList[index].name
        }
      } else {
        index -= 1
        addressDetail[this.data.currentAddId].jobCityId = this.data.selectedList[index].id
        if (this.data.currentAddId == 0) {
          addressDetail[this.data.currentAddId].adcode = this.data.selectedList[index].adCode
          addressDetail[this.data.currentAddId].name = this.data.selectedList[index].name
          addressDetail[this.data.currentAddId].location = `${this.data.selectedList[index].lng},${this.data.selectedList[index].lat}`
        } else {
          addressDetail[this.data.currentAddId].lat = this.data.selectedList[index].lat
          addressDetail[this.data.currentAddId].lon = this.data.selectedList[index].lng
          addressDetail[this.data.currentAddId].adCode = this.data.selectedList[index].adCode
          addressDetail[this.data.currentAddId].jobCityName = this.data.selectedList[index].name
        }
      }
      console.log(addressDetail, '8888888:::::::::::::::::')
      // // 更新本地存储
      wx.setStorageSync('addressDetail', addressDetail)
      wx.setStorageSync('isChange', this.data.currentAddId)
      // // 返回两次,后期如果服用这个页面需要多一层判断
      // wx.navigateBack({ delta: 2 })
      this.triggerEvent('backRenovate')
    }
  }
})