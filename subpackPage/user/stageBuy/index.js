var app = getApp()
import { apiYdOrderDetail, apiYdBalance, wechatCount } from "../../../http/api"
import { apiDictionary } from "../../../http/index"
import { showToast } from "../../../utils/util"
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    baseImageUrl: app.globalData.baseImgUrl,
    active: null,
    info: {},
    balance: 0, //余额
    activeCard: '',
    minActiveCard: '',
    count: [],
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
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

    const _type80=wx.getStorageSync('dictionary')[80]
    if(!_type80){
      this.getDictionary()
    }
    this.setData({
      capsuleData: _capsuleData,
      typeArr:_type80
    })
    console.log(options, '传递的参数')
    if (options.type != 'undefined') {
      this.setData({
        type: options.type
      })
    } else {
      this.setData({
        type: 0
      })
    }
    this.getDetail(options.type)
    this.getYdBalance()
    this.getCount(options.type)
  },
  // 字典数据
  async getDictionary() {
    const { code, data, msg } = await apiDictionary(80)
    if(code==200)
    this.setData({
      typeArr:data[80]
    })
  },
  getCount(type) {
    wechatCount().then(res => {
      if (res.code == 200) {
        let _count = res.data.all.filter(item => item.propType == type)[0]
        if (_count) {
          this.setData({
            count: _count.count
          })
        }
      }
    })
  },
  onShow() {
    console.log('触发')
    this.getYdBalance()
  },
  async getDetail(type) {
    wx.showLoading({
      title: '加载中',
    })
    let propType = ''
    if (type == 5) {
      propType = 'TOP_RESUME'
    } else if(type == 9){
      propType = 'PHONE_JOB_SEEKER'
    }else if(type == 7){
      propType = 'AI_JOB_SEEKER'
    }else{
      propType = 'REFRESH'
    }
    const { code, data, msg } = await apiYdOrderDetail({ propType: propType })
    wx.hideLoading()
    if (code !== 200) return showToast(msg);
    console.log(data, '6666')
    if(this.data.type==9 || this.data.type==7){
        data.map(item=>{
        item.relation.map(itemName=>{
          itemName.card.usedExpireUnitName = this.data.typeArr[itemName.card.usedExpireUnit-1].name
        })
      })
    }
    this.setData({
      info: data
    })
  },
  goBack() {
    wx.navigateBack()
  },
  selTab(e) {
    let idx = e.currentTarget.dataset.index
    this.setData({
      active: idx
    })
  },
  goPage() {
    //   let info=JSON.stringify(this.data.info.GoodsListByType ? this.data.info.GoodsListByType[this.data.active] : [])
    let info = JSON.stringify(this.data.info[this.data.active])
    if (info) {
      wx.redirectTo({
        url: `/subpackPage/user/stageBuy/detail?balance=${this.data.balance}&info=` + info
      })
    } else {
      showToast('请选择套餐')
    }
  },
  // 当前登陆人余额
  getYdBalance() {
    apiYdBalance().then(res => {
      if (res.code == 200)
        this.setData({
          balance: res.data
        })
    })
  },
  goUse() {
    wx.navigateTo({
      url: '/subpackPage/user/myProp/myProp',
    })
  },

  // 切换卡片
  switchCard: function (e) {
    const cardId = e.currentTarget.id;
    this.setData({
      activeCard: cardId,
      minActiveCard: cardId
    });
  }
})