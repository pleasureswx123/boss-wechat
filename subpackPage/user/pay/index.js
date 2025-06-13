import { WxcreateOrder } from "../../../http/api"
import { getBeforePayDetails, setVipDirectBuy } from "../../../http/user"
import { showToast } from '../../../utils/util'
import { helpActivityHandler } from '../../../utils/helpActivity'
var app = getApp()
Page({
  data: {
    flag: true,
    baseImageUrl: app.globalData.baseImgUrl,
    price: 0, // 商品价格
    propId: null, // 商品id
    title: "", // 商品名称
    isConsent: '',
    useDou: true
  },
  useChange() {
    this.setData({
      useDou: !this.data.useDou
    })
  },
  onChange() {
    this.setData({
      flag: !this.data.flag
    })
  },
  // 会员支付(暂时区分)
  confirmMemberPay() {
    if (this.data.isConsent && this.data.flag) {
      // 调起支付大于0微信支付,否则知豆支付
      let param = {
        productId: this.data.propId,
        tradeType: 'JSAPI',
        payType: 1,  // 支付方式
        handleType: 4,
        num: 1
      }
      if (this.data.payDetails.payPrice > 0) {
        param.realPrice = this.data.payDetails.payPrice
        wx.login({
          success: (res) => {
            param.code = res.code
            if(helpActivityHandler.shareCode) {
              param.shareCode = helpActivityHandler.shareCode
            }
            WxcreateOrder(param).then((res) => {
              if (res.code == 200) {
                if (res.data.code !== 0) return
                wx.requestPayment({
                  timeStamp: res.data.data.data.timeStamp,
                  nonceStr: res.data.data.data.nonceStr,
                  package: res.data.data.data.packageValue,
                  signType: res.data.data.data.signType,
                  paySign: res.data.data.data.paySign,
                  success(res) {
                    wx.redirectTo({
                      url: '/subpackPage/user/pay/detail?type=1',
                    })
                  },
                  fail(res) {
                    showToast('购买失败')
                  }
                })
              }
            })
          }
        })
      } else {
        param.douPrice = this.data.payDetails.deductionDou
        setVipDirectBuy(param).then(res => {
          if (res.code == 200) {
            wx.redirectTo({
              url: '/subpackPage/user/pay/detail?type=1',
            })
          }
        })
      }
    }
  },
  // 确认支付
  confirmPay() {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    wx.login({
      success: (res) => {
        let code = res.code
        let param = {
          code,
          productId: this.data.propId,
          tradeType: 'JSAPI',
          payType: 1,  // 支付方式
          propType: 1,
          handleType: 1,
          num: 1,
          realPrice: this.dataprice,
        }
        if (this.data.propId) {
          param.realPrice = this.dataprice
        } else {
          param.realPrice = this.data.price
        }
        if(helpActivityHandler.shareCode) {
          param.shareCode = helpActivityHandler.shareCode
        }
        WxcreateOrder(param).then((res) => {
          if (res.code == 200) {
            if (res.data.code !== 0) return
            wx.hideLoading()
            wx.requestPayment({
              timeStamp: res.data.data.data.timeStamp,
              nonceStr: res.data.data.data.nonceStr,
              package: res.data.data.data.packageValue,
              signType: res.data.data.data.signType,
              paySign: res.data.data.data.paySign,
              success(res) {
                wx.redirectTo({
                  url: '/subpackPage/user/pay/detail?type=0',
                })
              },
              fail(res) {
                wx.hideLoading()
                showToast('充值失败')
              }
            })
          }
        })
      }
    })
  },
  // 是否同意支付协议
  changeFn(event) {
    this.setData({
      isConsent: event.detail,
    });
  },
  getVipDetail(vipId) {
    getBeforePayDetails({ vipId: vipId }).then(res => {
      if (res.code == 200) {
        this.setData({
          payDetails: res.data,
          price: res.data.originalPrice
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, '传递的参数')
    this.setData({
      price: options.originalPrice || options.price,
      propId: options.propId,
      title: options.title,
      type: options.type
    })
    if (options.type == 'memberBuy') {
      this.getVipDetail(options.propId)
    }
  },
  //协议
  gotoPage() {
    wx.navigateTo({
      url: `/subpackPage/index/webFile/index?type=5`,
    })
  },
})
