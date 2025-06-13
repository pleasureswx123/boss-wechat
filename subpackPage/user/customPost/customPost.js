var app = getApp()
import { apiDictionary } from '../../../http/index'
import {showToast} from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.globalData.baseImgUrl, //图片路径
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    globalBottom: app.globalData.globalBottom,
    selectedCode: [],
    searchType: null, // 首页搜索职位 （至臻版不使用/经典版全职不使用）只有经典版兼职使用
    storageType: 'history', // 本地存储类型 history 为全职/至臻版使用 ｜ history_partTime 兼职 ｜ history_hot 热门岗位
    areaIds: [], // 区域ids
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,'options')
    if (options.searchType && options.searchType !== 'null' && options.searchType !== 'undefined') {
      this.setData({
        searchType: Number(options.searchType) // 首页搜索职位 （至臻版不使用/经典版全职不使用）只有经典版兼职使用
      })
    }
    if(options.storageType && options.storageType !== 'null' && options.storageType !== 'undefined'){
      this.setData({
        storageType: options.storageType
      })
    }
    if(JSON.parse(options.areaIds).length > 0 && options.areaIds !== 'null' && options.areaIds !== 'undefined'){
      this.setData({
        areaIds: JSON.parse(options.areaIds)
      })
      console.log(JSON.parse(options.areaIds),'JSON.parse(options.areaIds)')
    }
    this.getDictionary()
  },
  // 字典数据赋值
  async getDictionary() {
    let ids = ''
    ids = '102'
    const result = await apiDictionary(ids)
    if (result.code == 200) {
      this.setData({
        list: result.data[102]
      })
    }
  },
  back() {
    wx.navigateBack()
  },
  goBind(e) {
    let val = e.currentTarget.dataset.code
    let _selectAll = this.data.selectedCode
    if (_selectAll.includes(val)) {
      _selectAll = _selectAll.filter(item => item !== val)
    } else {
      _selectAll.push(val)
    }
    let _list = this.data.list
    _list.map(item => {
      if (_selectAll.indexOf(item.code) >= 0) {
        item.selected = true
      } else {
        item.selected = false
      }
    })
    this.setData({
      selectedCode: _selectAll,
      list: _list
    })
  },
  goSearch() {
    if(this.data.selectedCode.length == 0) return showToast('请选择您希望关注的信息')
    if (this.data.selectedCode.length > 0) {
      // this.data.selectedCode.map(item => {
      //   if (item == 1) {
      //     _screenObj.moneySort = true // 薪资
      //   } else if (item == 2) {
      //     _screenObj.nearBy = true // 通勤距离
      //   } else if (item == 3) {
      //     _screenObj.scaleBy = true // 通勤距离
      //   } else if (item == 4) {
      //     _screenObj.financeStageBy = true // 通勤距离
      //   } else if (item == 5) {
      //     _screenObj.welfareBy = true // 通勤距离
      //   }
      // interests
      // })
      wx.redirectTo({
        url: `/subpackPage/index/searchResult/index?screenObj=${JSON.stringify(this.data.selectedCode)}&searchType=${this.data.searchType}&storageType=${this.data.storageType}&areaIds=${JSON.stringify(this.data.areaIds)}`,
      })
    }
  }
})