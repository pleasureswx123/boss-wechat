import { dictionaryPosts, searchPostList } from '../../../http/api'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    industrySech: "",
    leftList: [],
    rightList: [],
    active: 0,
    timefn: null,
    postList: [],
    imageUrl: app.globalData.baseImgUrl,
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
  },
  changeItem(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      active: index,
      rightList: this.data.leftList[index].subList
    })
  },
  searchChange(event) {
    this.searchPost(event.detail.value)
    this.setData({
      industrySech: event.detail.value
    })
  },
  // 补充(ghy)
  // 根据符合要求的数组去查找数据中第一层数据 返回值是接口数据中第一层数据
  findFirstLevelData: function (data, targetName) {
    const targetData = this.findDataByName(data, targetName);
    if (targetData.length > 0) {
      return this.findLeftListData(targetData, data)
    }
    return null;
  },
  // 查找出第一层数据
  findLeftListData(targetData, data) {
    let firstLevelData = [];
    targetData.map(i => {
      data.map(e => {
        if (e.name == i.name) {
          firstLevelData.push(e)
        } else {
          e.subList.map(ie => {
            if (ie.name == i.name) {
              firstLevelData.push(e)
            } else {
              ie.subList.map(m => {
                if (m.name == i.name) {
                  firstLevelData.push(e)
                }
              })
            }
          })
        }
      })
    })
    let a = [];
    data.map(item => {
      item.select = false
      firstLevelData.map(it => {
        if (it.code == item.code) {
          item.select = true
        }
      })
      a.push(item)
    })
    return a;
  },
  // 查找出数据中符合要求的内容 返回值是一个数组
  findDataByName: function (data, targetName) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (item.name.includes(targetName)) {
        result.push({ ...item, select: true });
      } else if (item.searchName?.includes(targetName)) {
        result.push({ ...item, select: true });
      }
      if (item.subList && item.subList.length > 0) {
        const childResult = this.findDataByName(item.subList, targetName);
        result.push(...childResult);
      }
    }
    return result;
  },
  // 处理数据 (处理数据中第三层数据英文字符串 小写)
  transition(name) {
    var pattern = new RegExp("[A-Za-z]+");
    if (pattern.test(name)) {
      name = name.toLowerCase()
      return name
    } else {
      return name
    }
  },

  getDictionaryPosts() {
    dictionaryPosts().then(res => {
      if (res.code == 200) {
        // 循环调用处理数据方法,为其第三层数据新增一个处理好英文字符的数据
        // 暂时只增加英文全部小写的字段 (searchName)
        let leftList = res.data.map(item => {
          let subList = item.subList.map(i => {
            let subList = i.subList.map(e => {
              let searchName = this.transition(e.name)
              return {
                ...e,
                searchName: searchName
              }
            })
            return {
              id: i.id,
              code: i.code,
              name: i.name,
              remark: i.remark,
              subList: subList
            }
          })
          return {
            id: item.id,
            code: item.code,
            name: item.name,
            remark: item.remark,
            subList: subList,
            // select: true,
            // pitch: false
          }
        })
        this.setData({
          leftList: leftList,
          rightList: res.data[0].subList
        })
      }
    })
  },
  selectedItem1(e) {
    let item = e.currentTarget.dataset.item
    wx.reLaunch({
      url: `/subpackPage/user/editJobExpStep2/editJobExp?postItem=${JSON.stringify(item)}`,
    })
  },
  selectedItem(e) {
    let item = e.currentTarget.dataset.item
    let itemobj = {
      level3Name: item.name,
      level3: item.code
    }
    wx.reLaunch({
      url: `/subpackPage/user/editJobExpStep2/editJobExp?postItem=${JSON.stringify(itemobj)}`,
    })
  },
  onLoad(options) {
    this.getDictionaryPosts()
    // // 获取系统信息
    // const systemInfo = wx.getSystemInfoSync();
    // // 导航栏高度 = 状态栏高度 + 44
    // let _navBarHeight = systemInfo.statusBarHeight + 44;
    // this.setData({
    //   navBarHeight: _navBarHeight
    // })
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
  },
  searchPost(key) {
    let params = {
      pageSize: 999,
      pageNum: 1,
      keyWord: key
    }
    searchPostList(params).then(res => {
      if (res.code == 200) {
        this.setData({
          postList: res.data.list
        })
      }
    })
  },
  goBack() {
    wx.navigateBack()
  }
})