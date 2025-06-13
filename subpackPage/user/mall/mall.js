import { wechatCount } from "../../../http/api"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    baseImageUrl: app.globalData.baseImgUrl,
    list1: [{ title: '知豆', describe: '剩余知豆 0 颗', rightText: '去充值', image: '/daoju/dj_dou.png' }],
    list: [{ title: '简历置顶', describe: '职位一键置顶，急聘专区展示', rightText: '去购买', image: '/daoju/dj_7.png', index: 2 }, { title: '简历刷新', describe: '简历优先展示，持续曝光翻倍', rightText: '去购买', image: '/daoju/dj_8.png', index: 1 }, { title: '虚拟电话', describe: '保护个人隐私，沟通有保障', rightText: '去购买', image: '/daoju/dj_newdh.png', index: 3 }, { title: 'AI帮写', describe: '自动完善信息，为求职加速', rightText: '去购买', image: '/daoju/aiIcon.png', index: 4 }],
    type: ['recharge', 'stageBuy', 'stageBuy', 'stageBuy', 'stageBuy'],
    info: {
      used: 1
    },
    activeCard: '',
    minActiveCard: '',
    count: 0,
    count1: 0
  },
  mallJump() {
    wx.navigateBack()
  },
  gotoUrl() {
    wx.navigateTo({
      url: `/subpackPage/user/customer/index`,
    })
  },
  // 我的道具
  gotoMyProp() {
    wx.navigateTo({
      url: `/subpackPage/user/myProp/myProp`,
    })
  },

  // 购买记录
  recordStage() {
    wx.navigateTo({
      url: `/subpackPage/user/recordStage/index?type=1`,
    })
  },

  // 去充值或者购买道具
  rechargeOrstageBuy(event) {
    let type = 1
    let { index } = event.currentTarget.dataset
    console.log(index, '00000')
    if (index == 2) {
      type = 5
    } else if (index == 3) {
      type = 9
    } else if (index == 4) {
      type = 7
    }
    wx.navigateTo({
      url: `/subpackPage/user/${this.data.type[index]}/index?balance=${this.data.balance}&type=${type}`,
    })
  },

  onShow() {
    this.getCount()
  },

  getCount() {
    wechatCount().then(res => {
      if (res.code == 200) {
        let _num = 0
        let _num1 = 0
        res.data.all.map(item => {
          _num = _num + item.count
        })
        res.data.used.map(item => {
          _num1 = _num1 + item.count
        })
        this.setData({
          info: res.data,
          count: _num,
          count1: _num1
        })
      }
    })
  },
  goBtn() {
    wx.navigateTo({
      url: '/subpackPage/user/stageBuy/index',
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