var app = getApp()
import { getPersonalAdvantage, getEquityAIOrPhone, getEquityList, getBuyEquity } from '../../../http/versions'
import { setSave,getCheckAiOrPhone } from '../../../http/user'
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
    AITEXT: '',
    globalBottom: app.globalData.globalBottom,
    baseImageUrl: app.globalData.baseImgUrl,
    checked: false,
    AIEquity: null, // AI权益
    equityListAI: null, // AI商品价格
    show: false,
    AILoading: true, // 控制loading效果
  },

  back() {
    wx.navigateBack()
  },
  // 支付并优化
  async payOptimize() {
    // wx.showLoading({
    //   title: '别走开正在生成',
    // })
    // 开启loading效果
    this.setData({AILoading: false})
    let params = {
      requirement: this.data.AITEXT
    }
    const res = await getPersonalAdvantage(params)

    if (res.code !== 200) {
      // 关闭loading
      showToast(res.msg)
      this.setData({AILoading: true})
      // wx.hideLoading()
      return
    }
    let optimizedText = res.data && res.data.replace(/[ \t\r\n]+/g, ''); // 正则处理换行符并将结果赋值给新的变量
    this.setData({
      AITEXT: optimizedText.substring(0, 300),
      AILoading: true
    })
    // wx.hideLoading()
    // 获取AI权益剩余次数
    this.getEquityAI(0)
  },
  // 保存
  save() {
    let param = {
      personalStrength: this.data.AITEXT,
      userId: wx.getStorageSync('userInfo').info.userId
    }
    setSave(param).then(res => {
      if (res.code != 200) return showToast(res.msg)
      setTimeout(() => {
        wx.navigateBack({ delta: 2 })
      }, 500);
    })
  },
  //  textarea框input方法
  changeText(event) {
    this.setData({
      AITEXT: event.detail.value
    })
  },

  onChange() {
    this.setData({ checked: !this.data.checked })
  },
  // 《AI知城服务协议》
  AIxieyi() {

  },
  // 获取ai权益剩余次数
  async getEquityAI(type) {
    const res = await getEquityAIOrPhone(type)
    console.log(res, '00000')
    if (res.code !== 200) return
    this.setData({ AIEquity: res.data })
    // if (res.data.status == 0) {
    //   // this.equityList(type)
    // } else if(res.data.status == 1){
    //   //没有次数但是有道具，去激活
    // } else{
    //   // 去购买
    // }
  },
  // 获取权益商品列表
  async equityList(type) {
    const res = await getEquityList(type)
    console.log(res, '99999')
    if (res.code !== 200) return
    this.setData({ equityListAI: res.data })
  },
  // 支付
  async payMoney() {
    wx.navigateTo({
      url: `/subpackPage/user/stageBuy/index?type=${7}`,
    })
    // wx.showLoading({
    //   title: '支付中',
    // })

    // setTimeout(async () => {
    //   let _id = this.data.equityListAI.id
    //   const res = await getBuyEquity(_id)
    //   console.log(res, '充值')
    //   if (res.code != 200) {
    //     this.setData({ show: true })
    //     wx.hideLoading()
    //     return
    //   }
    //   wx.hideLoading()
    //   showToast('支付成功')
    //   setTimeout(()=>{
    //     this.getEquityAI(0)
    //   },500)
    // }, 500)
  },
  // 去充值
  gotoRecharge() {
    wx.navigateTo({
      url: `/subpackPage/user/recharge/index`,
    })
    this.setData({ show: false })
  },
  // 关闭
  cancel() {
    this.setData({ show: false })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
      AITEXT: options.val
    })
    // 获取AI权益剩余次数
    //this.getEquityAI(0)
  },
  onShow(){
    // 获取AI权益剩余次数
    this.getEquityAI(0)
  },
  payOptimize1(){
    let param={
      type:'AI_JOB_SEEKER',
      belongId:this.data.AIEquity.data.id,
      requirement:this.data.AITEXT
    }
    // 开启loading效果
    this.setData({AILoading: false})
    getCheckAiOrPhone(param).then(res=>{
      if(res.code!=200) showToast(res.msg)
      let optimizedText = res.data.replace(/[ \t\r\n]+/g, ''); // 正则处理换行符并将结果赋值给新的变量
      this.setData({
        AITEXT: optimizedText.substring(0, 300),
        AILoading: true
      })
      wx.hideLoading()
      // 获取AI权益剩余次数
      this.getEquityAI(0)
    })
  }
})