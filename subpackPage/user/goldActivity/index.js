var app = getApp()
import {
  showToast
} from '../../../utils/util'
import { getWhetherActivePopUpJQ, getDrawInterests } from '../../../http/versions'

const {Parser,Player} = require('../../../libs/svgaplayer.weapp')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl, //图片路径
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    isReceive: false,
    activityEquityList: [], // 权益列表
    showFull: false,
    activitystartTime: '',
    activityendTime: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.getWhetherActivePopUpJQFn()
    try {
      const parser = new Parser;
      const player = new Player;
      await player.setCanvas('#demoCanvas')
      // const videoItem = await parser.load("https://cdn.jsdelivr.net/gh/svga/SVGA-Samples@master/angel.svga");
      const videoItem = await parser.load('https://gcjt-youpin-beijing.oss-cn-beijing.aliyuncs.com/resource/wechat/baseimages/jinqiu/test.svga')
      await player.setVideoItem(videoItem);
      player.startAnimation();
    } catch (error) {
      console.log(error);
    }
  },
  goBack() {
    wx.navigateBack()
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  // 领取权益
  async getDrawInterestsFn() {
    let activityEquity = wx.getStorageSync('activityEquity')
    let params = {
      activityId: activityEquity.activityId
    }
    const result = await getDrawInterests(params)
    console.log(result, '领取权益')
    if (result.code != 200) return
    showToast('领取成功')
    this.getWhetherActivePopUpJQFn()
  },
  // 是否弹出金秋活动弹窗
  async getWhetherActivePopUpJQFn() {
    const result = await getWhetherActivePopUpJQ()
    console.log(result,'llllllllll')
    if (result.code != 200) return
    this.setData({
      activityEquityList: result.data.details,
      isReceive: result.data.received,
      activitystartTime: result.data.startDate, // 活动开始时间
      activityendTime: result.data.endDate, // 活动结束时间
    })
  },
})