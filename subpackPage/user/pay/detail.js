var app = getApp()
Page({
    data: {
        baseImageUrl: app.globalData.baseImgUrl,
    },

    onLoad(options) {
        if(options.type == 1){
           wx.setNavigationBarTitle({
             title: '订购成功',
           })
        }
        if(options.discriminate){
          this.setData({
            discriminate: options.discriminate
          })
        }
        this.setData({
            type: options.type
        })
    },
    goBack(){
        wx.navigateBack()
    },
    // 查看权益
    lookEquities(){
        wx.redirectTo({
          url: `/subpackPage/member/memberBuy/index`,
        })
    },
    gotoPropList(){
      wx.redirectTo({
        url: '/subpackPage/user/myProp/myProp',
      })
    }
})