// components/tab_ classics.js
var app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    numProp: {
      type: [Number, null],
      value: null,
      observer(newVal) {
        this.setData({
          num: Number(newVal)
        })
      }
    },
    count: {
      type: [Number, null],
      value: 0,
      observer(newVal) {
        this.setData({
          count: Number(newVal)
        })
      }
    }
  },
  lifetimes: {
    attached(){
      
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    globalBottom: app.globalData.globalBottom,
    navigationList: [{
      "sortnum": 1,
      "title": "全职",
      // "icon": app.globalData.baseImgUrl + '/tab/index-nor-1.png',
      // "acIcon": app.globalData.baseImgUrl + '/tab/index-hov-1.png',
      //"acIcon": app.globalData.baseImgUrl+'/tab/tab1.gif',
      // festival-year_tab
      "icon": app.globalData.baseImgUrl + '/ocean_tab/index-nor.png',
      "acIcon": app.globalData.baseImgUrl + '/ocean_tab/index.png',
    }, {
      "sortnum": 2,
      "title": "兼职",
      // "icon": app.globalData.baseImgUrl + '/tab/index-nor-2.png',
      // "acIcon": app.globalData.baseImgUrl + '/tab/index-hov-2.png',
      //"acIcon": app.globalData.baseImgUrl+'/tab/tab2.gif',
      "icon": app.globalData.baseImgUrl + '/ocean_tab/partTime-nor.png',
      "acIcon": app.globalData.baseImgUrl + '/ocean_tab/partTime.png',
    },
    {
      "sortnum": 3,
      "title": "热门岗位",
      // "icon": app.globalData.baseImgUrl + '/tab/index-nor-4.png',
      // "acIcon": app.globalData.baseImgUrl + '/tab/index-hov-4.png',
      "icon": app.globalData.baseImgUrl + '/ocean_tab/hot-nor.png',
      "acIcon": app.globalData.baseImgUrl + '/ocean_tab/hot.png',
    },
    {
      "sortnum": 4,
      "title": "消息",
      // "icon": app.globalData.baseImgUrl + '/tab/index-nor-31.png',
      // "acIcon": app.globalData.baseImgUrl + '/tab/index-hov-31.png',
      //"acIcon": app.globalData.baseImgUrl+'/tab/tab5.gif',
      "icon": app.globalData.baseImgUrl + '/ocean_tab/chat-nor.png',
      "acIcon": app.globalData.baseImgUrl + '/ocean_tab/chat.png',
    },

    {
      "sortnum": 5,
      "title": "我的",
      // "icon": app.globalData.baseImgUrl + '/tab/index-nor-5.png',
      // "acIcon": app.globalData.baseImgUrl + '/tab/index-hov-5.png',
      //"acIcon": app.globalData.baseImgUrl+'/tab/tab4.gif',
      "icon": app.globalData.baseImgUrl + '/ocean_tab/my-nor.png',
      "acIcon": app.globalData.baseImgUrl + '/ocean_tab/my.png',
      "className": 'my-icon'
    }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabTapFun(e) {
      wx.removeStorageSync('screenArr')
      const { sortnum } = e.currentTarget.dataset;
      const urls = {
        1: '/subpackPage/versions/index/index', // 全职
        2: '/subpackPage/versions/partTime/index', // 兼职
        3: '/subpackPage/versions/hotPost/index', // 热门岗位
        4: '/packageIm/pages/main/index?pageType=tabBar', // 消息
        5: '/pages/user/index', // 我的
      }
      this.setData({
        num: sortnum
      })
      if (wx.getStorageSync('currentPageIdx') != sortnum) {
        wx.setStorageSync('currentPageIdx', sortnum)
        wx.reLaunch({
          url: urls[sortnum]
        })
      }
    },
  }
})