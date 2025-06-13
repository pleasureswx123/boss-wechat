import { apiProductList, apiPropOrderSave, apiYdBalance } from "../../../http/api"
import { showToast } from "../../../utils/util"
var app = getApp()
Page({
  data: {
    isShowAll: false,
    list: [],
    info: {},
    balance: 0,
    active: null,
    inputValue: '',
    baseImageUrl: app.globalData.baseImgUrl,
    inputPriceText:'自定义充值金额，最低可充1元'
  },
  onLoad(options) {
    console.log(options, '传递的参数')
    if (options.info) {
      console.log(JSON.parse(options.info), '测试')
      this.setData({
        info: JSON.parse(options.info),
        balance: options.balance
      })
    }
    this.getProductList()
  },
  onShow() {
    console.log('触发')
    this.getBalance()
  },
  onChange() {
    this.setData({
      isShowAll: !this.data.isShowAll
    })
  },
  // 获取知豆余额
  async getBalance() {
    apiYdBalance().then(res => {
      this.setData({
        balance: res.data
      })
    })
  },
  async getProductList() {
    const { code, data, msg } = await apiProductList();
    if (code == 200) {
      this.setData({
        list: data
      })
    } else {
      showToast(msg)
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
  async comfirmPay() {
    let info = this.data.info
    let param = {
      productId: info.id,
      num: 1,
      handleType: 2,
    }
    console.log(param, '参数')
    const res = await apiPropOrderSave(param)
    console.log(res, '参数1')
    if (res.code != 200) return showToast(res.msg)
    wx.redirectTo({
      url: `/subpackPage/user/pay/detail?type=0&discriminate=${'prop'}`,
    })
  },
  selItem(e) {
    let idx = e.currentTarget.dataset.index
    this.setData({
      active: idx,
      activeCopy: idx,
      inputValue: ''
    })
  },
  goPay() {
    if (this.data.inputValue) {
      wx.redirectTo({
        url: `/subpackPage/user/pay/index?propId=${''}&price=${this.data.inputValue}`,
      })
    } else {
      if (!this.data.active && this.data.active != 0) { showToast('请选择充值金额'); return }
      let _id = this.data.list[this.data.active].id
      let _price = this.data.list[this.data.active].nowPrice
      let _title = this.data.list[this.data.active].title

      console.log(_price, _title, _id)
      wx.navigateTo({
        url: `/subpackPage/user/pay/index?propId=${_id}&price=${_price}&title=${_title}`
      })
    }

  },

  inputPrice(e) {
    let value = e.detail.value.replace(/^[0]+[0-9]*$/gi,'')
    this.setData({
      inputValue: value,
    })
    if (this.data.inputValue) {
      this.setData({ active: null })
    } else {
      this.setData({ active: this.data.activeCopy })
    }
  },
})