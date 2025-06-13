// components/cityPopup/cityPopup.js
import { getAreaData } from '../../http/index'
import { quchong } from '../../utils/util'
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    city: {
      type: Object,
      observer(newData) {
        // console.log(newData,'传递的数据全111:::::::')
      }
    },
    cityType: {
      type: String,
      value: 'select'
    },
    currentAddId: {
      type: Number || String,
      value: 0
    },
    step: {
      type: Number || String,
      value: -1
    },
    storageType: {
      type: String,
      value: 'addressDetail'
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
      console.log(this.data.cityType, '单选/多选')
      console.log(this.data.currentAddId, '更新那个数据')
      console.log(this.data.city, '传递过来的地址数据111::::::')
      let _city = this.data.city
      this.setData({
        cityList: [{ name: _city.cityName, id: _city.cityId }],
        selectedList: [{ name: _city.cityName, id: _city.cityId }],
        activeCityId: _city.cityId,
        optionsItem: _city,
      })
      this.getAreaList(_city.cityId, 'district')
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    cityList: [],
    districtList: [],
    streetList: [],
    selectedList: [], // 选择的地址
    multipleDistrictToView: '', // 市区县滚动id
    multipleStreetToView: '', // 接到滚动元素id
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
        console.log(res, '区数据')
        if (this.data.cityType == 'multiple') {
          this.disposeMultiple(res.data, 'district')
        } else {
          this.dispose(res.data, 'district')
        }
      } else {
        console.log(res, '镇街道数据')
        if (this.data.cityType == 'multiple') {
          let _multipleList = this.data.districtList.find(i => i.id == id).multipleList
          console.log(_multipleList, '上一次选择的地址列表')
          this.disposeMultiple(res.data, 'street', _multipleList)
        } else {
          this.dispose(res.data, 'street')
        }
      }
    },
    // 处理数据(单选情况下)
    dispose(list, level) {
      if (level == 'district') { // 区县
        let arr = []
        let _selectedList = this.data.selectedList
        list.map(item => {
          arr.push(...item.subList)
        })
        let city = this.data.cityList.find(i => i.id == this.data.activeCityId)
        arr.unshift({ name: `全${city.name}`, id: 0 })
        this.setData({ districtList: arr, activeDistrictId: arr[0].id, selectedList: _selectedList })
        if (this.data.optionsItem.districtId) {
          this.setData({ activeDistrictId: this.data.optionsItem.districtId })
          this.getAreaList(this.data.activeDistrictId, 'street')
          _selectedList.push(arr.find(i => i.id == this.data.activeDistrictId))
        } else {
          _selectedList.push(arr[0])
          this.setData({ selectedList: _selectedList })
          this.getAreaList(this.data.districtList[0].id, 'street')
        }
        // 这里暂时不清除districtId，但是后续可能有问题
        // 目前这种形式默认选中的情况下，清除districtId是为了让市级锚点不出错
        // 但是现在市级不会有多个
        this.setData({ multipleDistrictToView: `multipleDistrict${this.data.activeDistrictId}`})
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
          // _selectedList.push(arr[0])
          //  selectedList: _selectedList
          this.setData({ streetList: arr, activeStreetId: arr[0].id })
          if (this.data.optionsItem.streetId) {
            this.setData({ activeStreetId: this.data.optionsItem.streetId })
            _selectedList.push(arr.find(i => i.id == this.data.optionsItem.streetId))
            this.setData({ selectedList: _selectedList })
            console.log(_selectedList, 'zhen')
          } else {
            _selectedList.push(arr[0])
            this.setData({ selectedList: _selectedList })
          }
          // 设置锚点
          // 这里清除streetId和上同样的问题
          // 因为外部数据如果有街道的id，就需要追加进去并设置高亮
          // 但是因为streetId没有清除，所以每次切换县区高亮显示都不正确
          // 对应的街道锚点元素也不正确
          let _optionsItem = this.data.optionsItem
          _optionsItem.streetId = null // 清除第一次就默认追加的地址，防止后面出现锚点元素显示不正确
          this.setData({
            multipleStreetToView: `multipleStreet${this.data.activeStreetId}`,
            optionsItem: _optionsItem
          })
        }
      }
    },
    // 选择
    async selectItem(event) {
      let { currentlevel, item, nextlevel } = event.currentTarget.dataset
      if (currentlevel == 'district') {
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
    // 确定选择(单选)
    comfirmScreening() {
      let addressDetail = null
      let index = this.data.selectedList.length - 1
      let lastItem = this.data.selectedList[index]
      console.log(this.data.selectedList, '0000')
      if (!lastItem.name.includes('全')) {
        addressDetail = {
          allName: this.data.selectedList.map(item => item.name).join("/"),
          adcode: this.data.selectedList[index].adCode || this.data.selectedList[index - 1].id,
          name: this.data.selectedList[index].name,
          id: this.data.selectedList[index].id
        }
      } else {
        index -= 1
        addressDetail = {
          allName: this.data.selectedList.map(item => item.name).join("/"),
          adcode: this.data.selectedList[index].adCode || this.data.selectedList[index].id,
          name: this.data.selectedList[index].name,
          id: this.data.selectedList[index].id
        }
      }
      // 最后选择
      // console.log(addressDetail,'选择的')
      if (this.data.step == 1) {
        wx.navigateTo({
          url: `/subpackPage/versions/sclectPost/sclectPost?addressDetail=${JSON.stringify(addressDetail)}`
        })
      } else {
        // 组件通知外部
        this.triggerEvent('changeAddr', addressDetail)
      }
    },

    // 处理数据(多选情况下)
    disposeMultiple(list, level, multipleList) {
      if (level == 'district') { // 区县
        let arr = []
        list.map(item => {
          let subList = item.subList.map(i => {
            return { ...i, multipleNum: 0, multipleList: [] }
          })
          arr.push(...subList)
        })
        let city = this.data.cityList.find(i => i.id == this.data.activeCityId)
        arr.unshift({ name: `全${city.name}`, id: 0 })
        this.setData({ districtList: arr, activeDistrictId: arr[0].id })
        if (this.data.optionsItem.districtId) {
          this.setData({ activeDistrictId: this.data.optionsItem.districtId })
          this.getAreaList(this.data.activeDistrictId, 'street')
        } else {
          this.getAreaList(this.data.districtList[0].id, 'street')
        }
        this.setData({ multipleDistrictToView: `multipleDistrict${this.data.activeDistrictId}`})
      } else if (level == 'street') {
        let arr = []
        if (list.length == 0) {
          let city = this.data.cityList.find(i => i.id == this.data.activeCityId)
          if (city.name.startsWith('全')) {
            city.name = city.name.substring(1);
          }
          arr.unshift({ name: `全${city.name}`, id: 0, streetSelect: true })
          this.setData({ streetList: arr })
        } else {
          list.map(item => {
            let subList = item.subList.map(i => {
              i.streetSelect = false
              if (multipleList.length > 0) {
                multipleList.map(item => {
                  if (item.id == i.id) {
                    i.streetSelect = true
                  }
                })
              }
              if (this.data.optionsItem.streetId && i.id == this.data.optionsItem.streetId) {
                i.streetSelect = true
                let _districtList = this.data.districtList

                // 查找出对应高亮的父级
                let FatherLevelItem = _districtList.find(i => i.id == this.data.activeDistrictId)
                // 追加
                FatherLevelItem.multipleList.push(i)
                // 显示数量
                FatherLevelItem.multipleNum = FatherLevelItem.multipleNum + 1
                // 更新
                this.setData({districtList: _districtList})
              }
              return { ...i }
            })
            arr.push(...subList)
          })
          let district = this.data.districtList.find(i => i.id == this.data.activeDistrictId)
          arr.unshift({ name: `全${district.name}`, id: 0, streetSelect: multipleList.length > 0 ? false : true })
          // 看单选函数注释（一样的问题）
          let _optionsItem = this.data.optionsItem
          this.setData({ streetList: arr, multipleStreetToView: `multipleStreet${_optionsItem.streetId}` })
          _optionsItem.streetId = null // 清除第一次就默认追加的地址，防止后面出现父级元素显示数量不正确
          this.setData({ optionsItem: _optionsItem })
        }
      }
    },

    // 选择(多选)
    async MultipleItem(event) {
      let { currentlevel, item, nextlevel, index } = event.currentTarget.dataset
      // 当前选择的是市区县
      if (currentlevel == 'district') {
        this.setData({
          activeDistrictId: item.id,
        })
        await this.getAreaList(item.id, nextlevel)
        // 当前选择的是街道
      } else if (currentlevel == 'street') {
        let _streetList = this.data.streetList
        let _districtList = this.data.districtList
        let districtItem = _districtList.find(i => i.id == this.data.activeDistrictId)
        if (item.id == 0) {
          _streetList.map(i => i.streetSelect = false)
          _streetList[0].streetSelect = true
          districtItem.multipleNum = 0
          districtItem.multipleList = []
        } else {
          _streetList[0].streetSelect = false
          _streetList[index].streetSelect = !_streetList[index].streetSelect
          districtItem.multipleNum = _streetList.filter(i => i.streetSelect).length
          districtItem.multipleList = _streetList.filter(i => i.streetSelect)
        }
        this.setData({
          streetList: _streetList,
          districtList: _districtList
        })
      }
    },
    // 确定选择(多选)
    multipleComfirmScreening() {
      // let addressDetail = wx.getStorageSync('addressDetail')
      let addressDetail = wx.getStorageSync(this.data.storageType)
      let _multipleList = []
      this.data.districtList.map(item => {
        if (item.multipleList && item.multipleList.length > 0) {
          _multipleList.push(...item.multipleList)
        }
      })
      let activeDistrictItem = this.data.districtList.find(i => i.id == this.data.activeDistrictId)
      // 两种情况（1: 区县数据中的多选属性没有数据/则证明选择的是区县或者是选择的是xx市）单个的
      // 选择市的情况存在于区县选择的是 ‘全xxx市’
      if (_multipleList.length == 0) {
        // 如果此时从区县数据查找的高亮选项包含 ‘全’ 则证明选择的是市级
        // 否则就是区县下某一项数据
        if (activeDistrictItem.name.includes('全')) {
          let _cityList = this.data.cityList[0]
          addressDetail[this.data.currentAddId].jobCityName = _cityList.name
          addressDetail[this.data.currentAddId].jobCityId = _cityList.id
        } else {
          // 设置本地存储的名称和区域id
          // addressDetail[this.data.currentAddId].lat = activeDistrictItem.lat
          // addressDetail[this.data.currentAddId].lon = activeDistrictItem.lon
          // addressDetail[this.data.currentAddId].adCode = activeDistrictItem.adCode
          addressDetail[this.data.currentAddId].jobCityName = activeDistrictItem.name
          addressDetail[this.data.currentAddId].jobCityId = activeDistrictItem.id
        }
        // 如果选择的数据长度不为0, 则证明当前为多选
      } else {
        addressDetail[this.data.currentAddId].jobCityName = _multipleList.map(item => item.name).join('/')
        addressDetail[this.data.currentAddId].jobCityId = _multipleList.map(item => item.id)
      }

      console.log(addressDetail, '8888888:::::::::::::::::')
      // 更新本地存储
      // wx.setStorageSync('addressDetail', addressDetail)
      wx.setStorageSync(this.data.storageType, addressDetail)
      // 通知经典版首页进行重新请求接口数据
      wx.$event.emit('jbCity', this.data.currentAddId)
      // wx.navigateBack({ delta: 2 })
      // 组件通知外部
      this.triggerEvent('backRenovate')
    },
  }
})