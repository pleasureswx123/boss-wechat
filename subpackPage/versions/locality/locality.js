import { getVisitList, getLocalCarousel } from '../../../http/versions'
import { showToast } from '../../../utils/util'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    distance: 0, // 动画距离（100为一个单位，初始为0）
    current: 0, // 轮播图下标
    currentTab: 0, //预设当前项的值
    tabsList: [
      {
        text: '名企探访',
        select: true
      }
    ],
    pageNum: 1,
    pageSize: 10,
    visitList: [], // 数组
    carouselImgList: [], // 本地企业轮播图
    areaId: 0, // 区域id
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    sufferList: [], // 经验
    scaleList: [],// 公司规模
    financingList: [], // 融资
    typeList: [], // 招聘类型
    clearing: [], // 兼职薪资
  },
  changeTab(event) {
    console.log(event, '0000')
    let index = event.currentTarget.dataset.index
    let newTabsList = []
    newTabsList = this.data.tabsList.map((item, i) => {
      item.select = false
      if (i == index) {
        item.select = true
      }
      return { ...item }
    })
    this.setData({ distance: -(index * 100), tabsList: newTabsList })
  },
  // 监听轮播图的下标
  monitorCurrent(e) {
    let current = e.detail.current;
    this.setData({
      current: current
    })
  },
  // 去企业馆
  gotoAdvertisement() {
    wx.navigateTo({
      url: '/subpackPage/versions/localityEnterprise/localityEnterprise',
    })
  },
  // 播放视频
  playVideo(event) {
    let { playurl, type } = event.currentTarget.dataset
    console.log(playurl, type)
    if (type == 2) {
      wx.navigateTo({
        url: `/subpackPage/playVideo/index/index?url=${playurl}`,
      })
    } else if (type == 1) {
      wx.previewImage({
        urls: [playurl],
      })
    }
  },
  // 跳转到对应公司详情页
  gotoCompanyDetail(event) {
    let { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackPage/index/corporation_detail/index?corporationId=${id}`,
    })
  },
  //列表数据结构整理
  setListData(newArr) {
    return newArr.map(item => {
      let _visitFiles = []
      if (item.visitFiles && item.visitFiles.length > 0) {
        _visitFiles = item.visitFiles.map(i => {
          let type = null
          let url = null
          type = this.isVideoLink(i) ? 2 : 1
          if (type == 2) {
            url = i + '?x-oss-process=video/snapshot,t_1000,m_fast'
          } else {
            url = i
          }
          return {
            type,
            url
          }
        })
      }

      return {
        post: item.title,
        num: this.data.typeList[item.type]?.name,
        year: this.data.sufferList[item.experience]?.name || '',
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
        distance: item.distance,
        clearing: item.settlementUnit && this.data.clearing[item.settlementUnit - 1] ? this.data.clearing[item.settlementUnit - 1].name : '元/时', // 兼职结算方式
        looked: item.looked,
        activation: item.activation || '',
        online: item.online,
        urgent: item.urgent,
        type: 'job', // 用于区分是推荐列表还是职位列表
        visitFiles: _visitFiles
      }
    })
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
  // 获取实探企业
  async visitList() {
    let params = {
      pageSize: this.data.pageSize,
      pageNum: this.data.pageNum,
      areaId: this.data.areaId
    }
    const res = await getVisitList(params)

    if (res.code !== 200) return
    this.setData({
      visitList: res.data.records.map(item => {
        item.type = this.isVideoLink(item.videoUrl) ? 2 : 1
        if (item.type == 2) {
          item.url = item.videoUrl + '?x-oss-process=video/snapshot,t_1000,m_fast'
        } else {
          item.url = item.videoUrl
        }
        return item
      })
    })
    console.log(this.data.visitList, '获取实探企业')
  },
  // 获取本地企业轮播图
  async getLocalCarouselList() {
    const params = {
      areaId: this.data.areaId
    }
    const res = await getLocalCarousel(params)
    console.log(res, '0000')
    if (res.code !== 200) return showToast(res.msg)
    if (res.data.postList.length > 0) {
      res.data.postList = this.setListData(res.data.postList)
    }
    if (res.data.carousel.length > 0) {
      res.data.carousel = res.data.carousel.map(item => {
        let coms = item.coms.map(i => {
          return {
            ...i,
            abbreviation: i.abbreviation.substring(0, 6)
          }
        })
        return {
          coms: coms,
          title: item.title
        }
      })
    }
    let _arr = []
    res.data.carousel && res.data.carousel.map(item => {
      if (item.coms.length > 0) {
        _arr.push(item)
      }
    })
    res.data.carousel = _arr
    this.setData({ carouselImgList: res.data })
  },

  isVideoLink(path) {
    const videoExtensions = ['mp4', 'mov', 'm4v', 'mkv', 'webm', 'avi', '3gp', 'm2ts', 'flv', 'f4v'];
    const extension = path.split('.').pop().toLowerCase(); // 获取路径中的文件扩展名并转为小写
    // 判断扩展名是否存在于视频格式数组中
    return videoExtensions.includes(extension.toLowerCase());
  },

  back() {
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,'123456789')
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
      capsuleData: _capsuleData,
    })
    this.setData({
      areaId: Number(options.areaIds)
    })
    this.visitList()
    this.getLocalCarouselList()
    let dictionary = wx.getStorageSync('dictionary')
    this.setData({
      sufferList: this.mapData(dictionary[33]),
      scaleList: this.mapData(dictionary[5]),
      financingList: this.mapData(dictionary[4]),
      typeList: this.mapData(dictionary[39]),
      clearing: this.mapData(dictionary[48]), // 结算方式
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})