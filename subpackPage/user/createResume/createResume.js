// subpackPage/user/createResume/createResume.js
const app = getApp();
import { getResumeList, createGenerate } from '../../../http/resume.js'
import { apiJobExpectationList, apiDictionary } from '../../../http/index'
import { showToast } from '../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    baseImageUrl: app.globalData.baseImgUrl,
    globalBottom: app.globalData.globalBottom,
    TemplatePopup: false,
    isOpenScreen: false,
    postShow: false,
    templateList: [], // 简历模版列表
    postList: [], // 求职期望列表
    currentTemplate: null, // 当前模版详情数据
    tagActive: 0,
    resumeTemplateId: '', // 选择的模版id
    tagList: [
      { text: '全部', id: 0 },
      { text: '上新时间', id: 1 },
      { text: '销量', id: 2 }
    ],
    priceList: [], // 免费还是看vip
    templateScreenList: [], // 模版筛选数据
    pageNum: 1,
    sceenNum: 0, // 筛选数量
    copySceenNum: 0, // 筛选
    timeSort: false, // 按照时间筛选
    saleSort: false, // 按照销量筛选
    // 筛选弹窗的筛选条件
    screen: {
      price: 0,
      style: 0
    },
    isRefreshing: false,//是否下拉刷新状态
    isFinish: false,//是否加载完全部数据
  },
  // 切换
  changeActive(event) {
    let { index } = event.currentTarget.dataset
    this.setData({
      timeSort: false, // 按照时间筛选
      saleSort: false // 按照销量筛选
    })
    if (index == 1 || index == 2) {
      this.setData({ timeSort: index == 1 ? true : false })
      this.setData({ saleSort: index == 2 ? true : false })
    }
    this.setData({
      tagActive: index
    })
    console.log(this.data.timeSort, this.data.saleSort)
    this.resumeList(false)
  },
  // 打开筛选弹窗
  openScreen() {
    this.setData({ isOpenScreen: true })
  },
  back() {
    wx.navigateBack()
  },
  cloneShow() {
    this.setData({ TemplatePopup: false })
    this.setData({ postShow: false })
    this.setData({ isOpenScreen: false })
  },
  // 模版详情并打开弹窗
  templateDetail(event) {
    let item = event.currentTarget.dataset.item
    console.log(item, '11112222')
    let id = event.currentTarget.id
    this.setData({ TemplatePopup: true, currentTemplate: item, resumeTemplateId: id })
  },
  // 选择求职期望准备生成简历模版
  selectPost() {
    let isVip = wx.getStorageSync('userInfo').info.vip
    let _currentTemplate = this.data.currentTemplate
    // 如果使用的是vip模版并且自身没有vip （跳转到vip页面）
    if (_currentTemplate.vip == 2 && isVip == 0) {
      wx.navigateTo({
        url: `/subpackPage/member/equities/index`,
      })
    } else {
      this.setData({
        TemplatePopup: false,
        postShow: true
      })
    }
  },
  // 生成简历模版
  async createResumeTemplate(event) {
    wx.showLoading({
      title: '生成附件简历',
    })
    let that = this
    let jobExpectationId = event.currentTarget.id
    let resumeTemplateId = this.data.resumeTemplateId
    const res = await createGenerate(jobExpectationId, resumeTemplateId)
    if (res.code !== 200) return showToast(res.msg)
    wx.navigateTo({
      url: `/subpackPage/user/preview/index?fileUrl=${res.data.url}&fileName=${res.data.fileName}&size=${res.data.size}&templateId=${resumeTemplateId}`,
      success: (res) => {
        wx.hideLoading()
        that.setData({
          postShow: false
        })
      }
    })
  },

  // 获取简历模版列表
  async resumeList(isBeachBottom) {
    let params = {
      pageNum: this.data.pageNum,
      pageSize: 10,
      timeSort: this.data.timeSort, // 按照时间筛选
      saleSort: this.data.saleSort, // 按照销量筛选
      ...this.data.screen
    }
    setTimeout(async () => {
      const res = await getResumeList(params)
      console.log(res, '8888')
      if (res.code !== 200) return showToast(res.msg)
      if(isBeachBottom){
        let arr = res.rows
        this.setData({
          templateList: [...this.data.templateList,...arr]
        })
      } else {
        this.setData({
          templateList: res.rows
        })
      }

      this.setData({
        isRefreshing: false,//关闭下拉刷新
        isFinish: this.data.templateList.length >= res.total //全部加载完毕
      })
    })
    
  },
  // 获取求职期望
  async getApiJobExpectationList() {
    let { code, data, msg } = await apiJobExpectationList()
    if (code != 200) return showToast(msg);
    this.setData({
      postList: data
    })
  },

  // 字典数据
  async getDictionary() {
    let ids = '99,100'
    const result = await apiDictionary(ids)
    console.log(result)
    if (result.code !== 200) return showToast(result.msg)
    this.setData({
      priceList: this.mapData(result.data[99]),
      templateScreenList: this.mapData(result.data[100])
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

  // 单选事件
  radio(event, name, code) {
    // 切换高亮展示
    var { code, distinctionname } = event.currentTarget.dataset
    let _num = this.data.sceenNum
    const updatedList = this.data[distinctionname].map((item, index) => {
      if (item.code === code) {
        if (item.code > 0 && !item.isActive) {
          _num++
        }
        item.isActive = true;
      } else {
        if (item.code > 0 && item.isActive) {
          _num--
        }
        item.isActive = false;
      }
      return item;
    });
    this.setData({
      [distinctionname]: updatedList,
      sceenNum: _num
    });
    // this.addScreen(this.setSel(updatedList), distinctionname)
  },
  // 筛选弹窗的确定事件
  sceenConfirm() {
    let _num = this.data.sceenNum
    let _price = this.data.priceList.find((item, index) => item.isActive).code
    let _template = this.data.templateScreenList.find((item, index) => item.isActive).code
    this.setData({
      ['screen.price']: _price,
      ['screen.style']: _template
    })
    this.resumeList(false)
    this.setData({ isOpenScreen: false, copySceenNum: _num })
  },

  // 重置事件
  reset() {
    // 重置筛选数据
    let _priceList = this.data.priceList.map(item => {
      item.isActive = false
      if (item.code == 0) {
        item.isActive = true
      }
      return item
    })
    let _templateScreenList = this.data.templateScreenList.map(item => {
      item.isActive = false
      if (item.code == 0) {
        item.isActive = true
      }
      return item
    })
    // 重置筛选对象数据
    let screen = { price: 0, style: 0 }
    this.setData({
      screen,
      sceenNum: 0,
      priceList: _priceList,
      templateScreenList: _templateScreenList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const dictionary = wx.getStorageSync('dictionary')
    if (dictionary[99] && dictionary[100]) {
      this.setData({
        priceList: this.mapData(dictionary[99]),
        templateScreenList: this.mapData(dictionary[100])
      })
    } else {
      this.getDictionary()
    }
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

    this.resumeList(false)
    this.getApiJobExpectationList()
  },

  //监听scroll滚动事件
  onRefresh() {
    console.log('上拉')
    this.setData({
      pageNum: 1
    })
    this.resumeList(false)
  },
  onLoadMore: function () {
    console.log('下拉')
    this.setData({
      pageNum: this.data.pageNum + 1
    })
    this.resumeList(true)
  },

  onPulling: function (e) {

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