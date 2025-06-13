// subpackPage/user/recharge/index.js
import { apiProductList, apiPropGetBalance } from '../../../http/index'
import { WxcreateOrder } from '../../../http/api'
import NumberAnimate from '../../../utils/NumberAnimate'
import {showToast} from '../../../utils/util'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [], // 商品列表
    activeIndex: 0, // 高亮
    activeIndexCopy: 0,
    bottomDistance: 60,
    baseImageUrl: app.globalData.baseImgUrl,
    balance: 0, // 当前用户知豆余额
    inputValue: '', // 用户输入的充值数量
    inputPriceText:'请输入自定义充值金额,最低可充1元',
    msgList:['快速充值','方便高效','立享优惠']
  },
  // 立即充值
  recharge() {
    console.log(this.data.inputValue, '0000')
    if (this.data.inputValue) {
      wx.redirectTo({
        url: `/subpackPage/user/pay/index?propId=${''}&price=${this.data.inputValue}`,
      })
    } else {
      let { id, nowPrice, title } = this.data.productList[this.data.activeIndex]
      wx.redirectTo({
        url: `/subpackPage/user/pay/index?propId=${id}&price=${nowPrice}&title=${title}`,
      })
    }
  },
  inputFocus(){
    this.setData({
      inputPriceText:'请输入充值金额'
    })
  },
  inputBlur(){
    this.setData({
      inputPriceText:'自定义充值金额，最低可充1元'
    })
  },
  inputPrice(e) {
    let value = e.detail.value.replace(/^[0]+[0-9]*$/gi,'')
    this.setData({
      inputValue: value,
    })
    if (this.data.inputValue) {
      this.setData({ activeIndex: null })
    } else {
      this.setData({ activeIndex: this.data.activeIndexCopy })
    }
  },
  //协议
  gotoPage() {
    wx.navigateTo({
      url: `/subpackPage/index/webFile/index?type=5`,
    })
  },
  gotoUrl() {
    wx.navigateTo({
      url: `/subpackPage/user/customer/index`,
    })
  },
  // 获取商品列表
  async getProductList() {
    const { code, msg, data } = await apiProductList()
    console.log(data, '商品列表')
    if (code !== 200) return showToast(msg)
    this.setData({
      productList: data
    })
  },

  // 展示高亮
  changeActiveIndex(event) {
    let { index } = event.currentTarget.dataset
    this.setData({
      activeIndex: index,
      activeIndexCopy: index,
      inputValue: ''
    })
  },

  // 获取知豆余额
  async getPropGetBalance() {
    const { code, msg, data } = await apiPropGetBalance()
    if (code !== 200) return showToast(msg)
    // wechatCount().then(res=>{
    //     if(res.code==200){
    //         this.setData({
    //             info:res.data
    //         })
    //     }
    // })
    this.setData({
      balance: data
    })
    this.animate()
  },

  // 购买明细
  buyDetail() {
    // wx.navigateTo({
    //   url: `/subpackPage/user/recordStage/index?type=2`,
    // })
    wx.navigateTo({
      url: `/subpackPage/user/recordStage1/index`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow(options) {
    this.getPropGetBalance()
    this.getProductList()
  },

  // 数字动画
  animate() {
    let n1 = new NumberAnimate({
      from: Number(this.data.balance),
      speed: 3000,
      refreshTime: 30,
      decimals: 0,
      onUpdate: () => {
        this.setData({
          balance: n1.tempValue
        });
      },
      onComplete: () => { }
    });
  },
})