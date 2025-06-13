// subpackPage/index/post_detail/index.js
const app = getApp();
import { apigetActiveListByUserId } from "../../../http/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    belonger: null,
    postList: [], // 在招列表
    sufferList: [], // 经验
    tagList: [], // 标签列表
    corporationId: '',
    corporationName: '',
    outName: '',
    postName: "",
    outPost: '',
    imageUrl: app.globalData.baseImgUrl,
    defaultImage: '?x-oss-process=image/resize,w_100/quality,q_50', // 图片压缩
    img: '',
    versions: 1, // 版本
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
  },
  corporationJump() {
    wx.navigateBack()
  },
  // 获取在招岗位
  async getPostCorporationList() {
    let _corporationId = this.data.belonger
    let params = {
      userId: _corporationId,
      pageNum: 1,
      // pageSize: 10,
      // status: 1
    }
    const { data, msg, code } = await apigetActiveListByUserId(params)
    if (code !== 200) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    }
    // 处理数据
    let newObj = data?.map(item => {
      return {
        ...item,
        tagList: item.tag.split(','),
        activityTags: item.activityTags.indexOf(1) > -1 ? true : false
      }
    })
    this.setData({
      postList: newObj,
    })
  },
  // 查看更多岗位
  lookAll(event) {
    wx.navigateTo({
      url: `/subpackPage/index/corporation_detail/index?corporationId=${this.data.corporationId}`,
    })
  },
  // 预览招聘者头像
  previewAvatar() {
    var imgUrl = this.data.img
    wx.previewImage({
      urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
      current: '', // 当前显示图片的http链接，默认是第一个
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,'传递过来的数据1111')
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
    let dictionary = wx.getStorageSync('dictionary')
    this.setData({
      capsuleData: _capsuleData,
      belonger: options.belonger,
      corporationId: options.corporationId,
      outName: options.outName,
      postName: options.postName,
      outPost: options.outPost,
      corporationName: options.corporationName,
      sufferList: dictionary[33],
      clearing: dictionary[48],
      personal: options.personal
    })
    if (options.avatar && options.avatar !== 'null' && options.avatar !== 'undefined') {
      this.setData({ img: options.avatar })
    }
    this.getPostCorporationList()
  },

  goDetail(event) {
    // 当前点击的这一项的id和bossid
    let { bossuserid, id } = event.currentTarget.dataset
    console.log(id, bossuserid)
    wx.navigateTo({
      url: `/subpackPage/index/job_detail/index?postId=${id}&bossuserid=${bossuserid}`,
    })
  },
  onShow() {
    let versions = wx.getStorageSync('versions')
    this.setData({
      versions: versions
    })
  }
})