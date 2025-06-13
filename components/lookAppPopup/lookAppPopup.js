// components/lookAppPopup/lookAppPopup.js
var app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    capsuleData: {
      type: Object,
      value: () => { }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    active: 1,
    current: 0, // 当前展示的图片
    list: [{ type: 1, name: '求职端' }, { type: 2, name: '招聘端' }],  // 切换
    imgUrls: [{ type: 1, name: '/myCard/qz1.png' }, { type: 1, name: '/myCard/qz2.png' }, { type: 1, name: '/myCard/qz3.png' }, { type: 1, name: '/myCard/qz4.png' }, { type: 1, name: '/myCard/qz5.png' }],
    imgUrls2: [{ type: 2, name: '/myCard/zp1.png' }, { type: 2, name: '/myCard/zp2.png' }, { type: 2, name: '/myCard/zp3.png' }, { type: 2, name: '/myCard/zp4.png' }, { type: 2, name: '/myCard/zp5.png' }, { type: 2, name: '/myCard/zp6-1.png' }]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back() {
      this.triggerEvent('close')
    },
    //监听轮播图的下标
    monitorCurrent: function (e) {
      let current = e.detail.current;
      this.setData({
        current: current
      })
    },
    changeTab(e) {
      this.setData({
        active: e.currentTarget.dataset.type,
        current: 0
      })
    },
  }
})