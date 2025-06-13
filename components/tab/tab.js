var app = getApp()
Component({
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
    attached() {

    }
  },
  data: {
    globalBottom: app.globalData.globalBottom,
    navigationList: [{
      "sortnum": 1,
      "title": "首页",
      "icon": app.globalData.baseImgUrl + '/tab/index-nor-1.png',
      "acIcon": app.globalData.baseImgUrl + '/tab/index-hov-1.png',
      //"acIcon": app.globalData.baseImgUrl+'/tab/tab1.gif',
      // 以下为2025年新春版本icon
      // "icon": app.globalData.baseImgUrl + '/festival-year_tab/index-nor.png',
      // "acIcon": app.globalData.baseImgUrl + '/festival-year_tab/index.gif',
    }, {
      "sortnum": 2,
      "title": "今日速配",
      "icon": app.globalData.baseImgUrl + '/tab/index-nor-2.png',
      "acIcon": app.globalData.baseImgUrl + '/tab/index-hov-2.png',
      //"acIcon": app.globalData.baseImgUrl+'/tab/tab2.gif',
      // 以下为2025年新春版本icon
      // "icon": app.globalData.baseImgUrl + '/festival-year_tab/mate-nor.png',
      // "acIcon": app.globalData.baseImgUrl + '/festival-year_tab/mate.gif',
    }, {
      "sortnum": 3,
      "title": "消息",
      "icon": app.globalData.baseImgUrl + '/tab/index-nor-31.png',
      "acIcon": app.globalData.baseImgUrl + '/tab/index-hov-31.png',
      //"acIcon": app.globalData.baseImgUrl+'/tab/tab5.gif',
      // 以下为2025年新春版本icon
      // "icon": app.globalData.baseImgUrl + '/festival-year_tab/chat-nor.png',
      // "acIcon": app.globalData.baseImgUrl + '/festival-year_tab/chat.gif',
    },
    // {
    // "sortnum": 4,
    // "title": "行业图谱",
    // "icon": app.globalData.baseImgUrl+'/tab/index-nor-4.png',
    // "acIcon": app.globalData.baseImgUrl+'/tab/index-hov-4.png',
    // },  
    {
      "sortnum": 4,
      "title": "我的",
      "icon": app.globalData.baseImgUrl + '/tab/index-nor-5.png',
      "acIcon": app.globalData.baseImgUrl + '/tab/index-hov-5.png',
      //"acIcon": app.globalData.baseImgUrl+'/tab/tab4.gif',
      // 以下为2025年新春版本icon
      // "icon": app.globalData.baseImgUrl + '/festival-year_tab/my-nor.png',
      // "acIcon": app.globalData.baseImgUrl + '/festival-year_tab/my.gif',
      // "className": 'my-icon'
    }
    ]
  },

  methods: {
    tabTapFun(e) {
      wx.removeStorageSync('screenArr')
      const { sortnum } = e.currentTarget.dataset;
      const urls = {
        1: '/pages/index/index',
        2: '/pages/match/index',
        3: '/packageIm/pages/main/index?pageType=tabBar',
        // 4: '/subpackPage/user/industry/index',
        4: '/pages/user/index',
      }
      // 本地存储的版本
      let versions = wx.getStorageSync('versions')
      // 修改路径(1至臻版 2精简版)
      if (versions == 2) {
        urls[1] = '/subpackPage/versions/index/index'
      } else {
        urls[1] = '/pages/index/index'
      }
      this.setData({
        num: sortnum
      })
      if (wx.getStorageSync('currentPageIdx') != sortnum) {
        wx.setStorageSync('currentPageIdx', sortnum)
        wx.reLaunch({
          url: urls[sortnum]
        })
        // wx.redirectTo({
        //   url: urls[sortnum]
        // })
      }
    }
  }
})
