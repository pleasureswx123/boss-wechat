import { getBigIindustryList, getLocalBigList } from '../../../http/versions'
import { showToast } from '../../../utils/util'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    // 数据都是根据当前机型进行计算，这样的方式兼容大部分机器
    globalData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    },
    distance: 0,
    tabsList: [], // tabs列表
    enterpriseList: [], // 企业列表
    pageSize: 10, // 每页条数
    pageNum: 1, // 当前页面
    selectId: 0 // 高亮
  },
  async changeTab(event) {
    console.log(event, '0000')
    let index = event.currentTarget.dataset.index
    let selectId = event.currentTarget.id
    this.setData({selectId})
    await this.localBigList('change',index)
  },
  // 返回
  gotoBack() {
    wx.navigateBack()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const _globalData = { ...this.data.globalData }
    const that = this;
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    _globalData.navBarHeight = systemInfo.statusBarHeight + 44;
    _globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    _globalData.menuTop = menuButtonInfo.top;
    _globalData.menuHeight = menuButtonInfo.height;


    this.setData({
      globalData: _globalData
    })

    this.bigIindustryList()
  },

  // 获取本地行业tab
  async bigIindustryList() {
    const res = await getBigIindustryList({})
    console.log(res, '22222')
    if (res.code !== 200) return showToast(res.msg)
    let newTabsList = res.data.map(item => {
      return { ...item, select: false }
    })
    this.setData({
      tabsList: newTabsList,
      selectId: newTabsList[0].id,
    })
    this.localBigList()
  },
  async localBigList(type,index) {
    let cityId = wx.getStorageSync('cityId')
    let params = {
      pageSize: this.data.pageSize,
      pageNum: this.data.pageNum,
      type: this.data.selectId,
      areaId: cityId
    }
    const result = await getLocalBigList(params)
    console.log(result, '企业')
    if (result.code !== 200) return showToast(result.msg)
    this.setData({enterpriseList: result.data.records})
    console.log(this.data.enterpriseList,'111111')
    if(type == 'change'){
      this.setData({ distance: -(index * 100) })
    }
  },
  // 点击去公司详情页
  gotoCompanyDetail(event){
    let corporationId = event.currentTarget.dataset.corporationid
    wx.navigateTo({
      url: `/subpackPage/index/corporation_detail/index?corporationId=${corporationId}`,
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