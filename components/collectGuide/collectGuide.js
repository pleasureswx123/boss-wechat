// components/collectGuide/collectGuide.js
var app = getApp()
Component({

    /**
     * 组件的属性列表
     */
    properties: {
      collectGuideY: {
        type: Number,
        value: 0
      },
      isShow: {
        type: Boolean,
        value: true
      }
    },

    /**
     * 组件的初始数据
     */
    data: {
      baseImageUrl: app.globalData.baseImgUrl
    },

    /**
     * 组件的方法列表
     */
    methods: {
      // 通知外部组件关闭收藏弹窗
      colseCollectGuideBox(){
        wx.setStorageSync('collectGuide', 1)
        this.triggerEvent('closeCollectGuide')
      }
    }
})