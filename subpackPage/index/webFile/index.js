// subpackPage/index/webFile/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
      baseUrl:''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      let _url=''
      let _title=''
      switch( options.type ) {
              case '1':
                _url=' https://guochuanyoupin.com/static/fwxy.html';
                _title='用户服务协议'
                break;
              case '2':
                _url='https://guochuanyoupin.com/static/ysxy.html';
                _title='用户隐私协议'
                break;
              case '3':
                _url=' https://guochuanyoupin.com/static/yyzz.html';
                _title='营业执照'
                break;
              case '4':
                _url=' https://guochuanyoupin.com/static/rlzy.html';
                _title='人力资源许可证'
                break;
              case '5':
                _url='https://guochuanyoupin.com/static/zzfw.html';
                _title='增值服务'
                break;
              default:
                _url='';
                _title='';
        }
        this.setData({
          baseUrl:_url
        })
        wx.setNavigationBarTitle({
          title: _title
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})