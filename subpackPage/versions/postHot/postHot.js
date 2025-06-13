// subpackPage/versions/postHot/postHot.js
import { getBriefnessPostList, getBriefnessAgileList } from '../../../http/index'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    baseImageUrl: app.globalData.baseImgUrl,
    defaultImage: '?x-oss-process=image/resize,w_100/quality,q_90',
    globalBottom: app.globalData.globalBottom,
    colorList: ['linear-gradient(270deg, #FFFDFD 0%, #FFDFDD 100%)', 'linear-gradient(270deg, #FEFDFF 0%, #EFD5FF 100%)', 'linear-gradient(270deg, #FFFDFD 0%, #FFE5C4 100%)', 'linear-gradient(270deg, #FDFDFF 0%, #D9EAFF 100%)', 'linear-gradient(270deg, #FFFDFD 0%, #E6FFC7 100%)', 'linear-gradient(270deg, #FEFDFF 0%, #E1FDFF 100%)'],
    type: '',
    navberText: '', // 标题文字
    // tab数组
    tabsList: [], // 热门岗位
    industryList: [], // 严选兼职列表
    active: 0, // 高亮
    imageUrl: app.globalData.baseImgUrl,
    areaId: '', // 区域id
  },
  back() {
    wx.navigateBack()
  },
  // 查询当前点击岗位的数据列表
  searchCurrentPost(event) {
    let currentPost = JSON.stringify(event.currentTarget.dataset.item)
    if (this.data.backType == 1) {
      const eventChannel = this.getOpenerEventChannel()
      eventChannel.emit('setCurrentHotPost', event.currentTarget.dataset.item);
      wx.navigateBack()
    } else {
      wx.navigateTo({
        url: `/subpackPage/versions/postAll/postAll?currentPost=${currentPost}&city=${this.data.cityname}&areaId=${this.data.areaId}&type=${this.data.otype}`,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, '7777')
    this.setData({
      type: options.type,
      navberText: options.type == 'hot' ? '热门岗位' : '严选兼职',
      cityname: options.city,
      areaId: Number(options.areaId),
      otype: options.type == 'hot' ? 8 : 3,
      backType: options.backType
    })
    if (options.type == 'hot') {
      this.briefnessPostList()
    } else {
      this.briefnessAgileList()
    }
  },

  // 获取热门岗位数据
  async briefnessPostList() {
    const res = await getBriefnessPostList()
    console.log(res, '热门岗位')
    if (res.code !== 200) return
    this.setData({
      tabsList: res.data
    })
  },
  // 获取严选兼职数据
  async briefnessAgileList() {
    const res = await getBriefnessAgileList()
    console.log(res, '严选兼职')
    if (res.code !== 200) return
    this.setData({
      industryList: res.data,
      tabsList: res.data[0].list,
    })
  },
  // 修改严选兼职tab高亮
  changeAgileActive(event) {
    let { index } = event.currentTarget.dataset
    this.setData({
      active: index,
      tabsList: this.data.industryList[index].list,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

})