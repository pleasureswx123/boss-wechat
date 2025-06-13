// subpackPage/index/search/index.js
import { getSratchPostList, getHotPost } from '../../../http/index'
import { historyListWhether,showToast } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timefn: null, // 定时器
    searchValue: '',
    show: false, // 定义初始化变量
    textData: [], // 热门搜索列表
    historyList: [], // 历史推荐列表
    historyList_partTime: [], // 历史推荐列表-兼职
    historyList_hot: [], // 历史推荐列表-热门
    searchListAsync: [], // 检索用户搜索的内容
    maxlength: 20,
    searchType: null, // 首页搜索职位 （至臻版不使用/经典版全职不使用）只有经典版兼职使用
    storageType: 'history', // 本地存储类型 history 为全职/至臻版使用 ｜ history_partTime 兼职 ｜ history_hot 热门岗位
    areaIds: [], // 搜索结果页使用
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
  // 搜索框input事件
  input(event) {
    this.setData({
      timefn: this.debounce(() => {
        this.searchResultLikst(event)
      }, 500)
    })
    this.data.timefn()
  },
  // 聚焦事件和input事件使用(模糊匹配结收拾结果)
  searchResultLikst(event) {
    if (event.detail.trim()) {
      let versions = wx.getStorageSync('versions')
      let params = {
        key: event.detail,
        edition: versions == 1 ? 2 : 1
      }
      if(this.data.searchType){
        params.type = this.data.searchType
      }
      getSratchPostList(params).then(res => {
        if(res.code !== 200) return showToast(res.msg)
        console.log(res, '模糊匹配')
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
  // 获取岗位热门推荐
  async getHotPostList() {
    const result = await getHotPost()
    console.log(result, '热门推荐')
    if(result.code !== 200) return showToast(res.msg)
    this.setData({
      textData: result.data.list
    })
  },
  // 点击热门推荐
  hotRecommend(event) {
    let { item } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackPage/index/searchResult/index?keyValue=${item.name}&type=${1}&id=${item.id}&searchType=${this.data.searchType}&storageType=${this.data.storageType}&areaIds=${JSON.stringify(this.data.areaIds)}`,
    })
    if(this.data.storageType == 'history'){
      historyListWhether(this.data.historyList, item,this.data.storageType)
    } else if(this.data.storageType == 'history_hot'){
      historyListWhether(this.data.historyList_hot, item,this.data.storageType)
    } else if(this.data.storageType == 'history_partTime'){
      historyListWhether(this.data.historyList_partTime, item,this.data.storageType)
    }
    this.setData({
      searchValue: item.name
    })
  },
  // 点击历史搜索
  historyItem(event) {
    let { item,type } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackPage/index/searchResult/index?keyValue=${item.name}&type=${item.type}&id=${item.id}&searchType=${this.data.searchType}&storageType=${type}&areaIds=${JSON.stringify(this.data.areaIds)}`,
    })
    if(type == 'history'){
      historyListWhether(this.data.historyList, item,type)
    } else if(type == 'history_hot'){
      historyListWhether(this.data.historyList_hot, item,type)
    } else if(type == 'history_partTime'){
      historyListWhether(this.data.historyList_partTime, item,type)
    }
    this.setData({
      searchValue: item.name
    })
  },
  // 点击模糊搜索列表
  searchitem(event) {
    let { name, id, type } = event.detail
    wx.navigateTo({
      url: `/subpackPage/index/searchResult/index?keyValue=${name}&type=${type}&id=${id}&searchType=${this.data.searchType}&storageType=${this.data.storageType}&areaIds=${JSON.stringify(this.data.areaIds)}`,
    })
    let pushItem = {
      name: name,
      id: id,
      type: type
    }
    if(this.data.storageType == 'history'){
      historyListWhether(this.data.historyList, pushItem,this.data.storageType)
    } else if(this.data.storageType == 'history_hot'){
      historyListWhether(this.data.historyList_hot, pushItem,this.data.storageType)
    } else if(this.data.storageType == 'history_partTime'){
      historyListWhether(this.data.historyList_partTime, pushItem,this.data.storageType)
    }
    this.setData({
      searchValue: name
    })
  },
  // 搜索按下回车事件
  confirm(event) {
    if (event.detail.trim() == '') return showToast('搜索词不能为空')
    let value = event.detail // 用户输入的内容
    wx.navigateTo({
      url: `/subpackPage/index/searchResult/index?keyValue=${value}&type=${''}&id=${null}&searchType=${this.data.searchType}&storageType=${this.data.storageType}&areaIds=${JSON.stringify(this.data.areaIds)}`,
    })
    let pushItem = {
      name: value,
      type: '',
      id: null
    }
    if(this.data.storageType == 'history'){
      historyListWhether(this.data.historyList, pushItem,this.data.storageType)
    } else if(this.data.storageType == 'history_hot'){
      historyListWhether(this.data.historyList_hot, pushItem,this.data.storageType)
    } else if(this.data.storageType == 'history_partTime'){
      historyListWhether(this.data.historyList_partTime, pushItem,this.data.storageType)
    }
    this.setData({
      searchValue: value
    })
  },
  // 历史记录去重方法
  unique(tempArr) {
    let result = []
    let obj = {}
    for (let i = 0; i < tempArr.length; i++) {
      if (!obj[tempArr[i].name]) {
        result.push({
          ...tempArr[i]
        })
        obj[tempArr[i].name] = true;
      };
    };
    return result;
  },
  // 清空历史记录
  delefeEvent() {
    this.setData({
      show: true
    })
  },
  // 关闭清空历史弹窗
  onClose(){
    this.setData({
      show: false
    })
  },
  // 历史记录确定删除事件
  deleteConfirm() {
    wx.removeStorageSync(this.data.storageType)
    if(this.data.storageType == 'history'){
      this.setData({historyList: []})
    } else if(this.data.storageType == 'history_hot'){
      this.setData({historyList_hot: []})
    } else if(this.data.storageType == 'history_partTime'){
      this.setData({historyList_partTime: []})
    }
  },
  // 点击清除按钮
  clear() {
    this.setData({
      searchListAsync: []
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,'optionsoptions')
    if (options.type && options.type !== 'null' && options.type !== 'undefined') {
      this.setData({
        searchType: Number(options.type) // 首页搜索职位 （至臻版不使用/经典版全职不使用）只有经典版兼职使用
      })
    }
    if(options.storageType && options.storageType !== 'null' && options.storageType !== 'undefined'){
      this.setData({
        storageType: options.storageType
      })
    }
    if(options.areaIds && JSON.parse(options.areaIds).length > 0 && options.areaIds !== 'null' && options.areaIds !== 'undefined'){
      this.setData({
        areaIds: JSON.parse(options.areaIds)
      })
      console.log(JSON.parse(options.areaIds),'JSON.parse(options.areaIds)')
    }
    this.getHotPostList()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // let res = wx.getStorageSync('history') ? wx.getStorageSync('history') : []
    let res = wx.getStorageSync(this.data.storageType) ? wx.getStorageSync(this.data.storageType) : []
    this.setData({
      searchListAsync: [],
      searchValue: '',
    })
    if(this.data.storageType == 'history'){
      this.setData({historyList: this.unique(res)})
    } else if(this.data.storageType == 'history_hot'){
      this.setData({historyList_hot: this.unique(res)})
    } else if(this.data.storageType == 'history_partTime'){
      this.setData({historyList_partTime: this.unique(res)})
    }
    wx.removeStorageSync('screenArr')
  },
  //定制职位推荐
  goCustom() {
    wx.navigateTo({
      url: `/subpackPage/user/customPost/customPost?searchType=${this.data.searchType}&storageType=${this.data.storageType}&areaIds=${JSON.stringify(this.data.areaIds)}`
    })
  }
})