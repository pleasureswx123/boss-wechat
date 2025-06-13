// subpackPage/index/photo_detail/index.js
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: { 
        defaultImage: '?x-oss-process=image/resize,w_80/quality,q_80',
        globalBottom: app.globalData.globalBottom,
        baseImageUrl: app.globalData.baseImgUrl,
        width: '', //每一个图片的宽度
        index: 0, // 展示高亮
        images: [], // 照片列表
        videos: [], // 视频列表
        isPlay: false,
        playSrc: ''
    },
    // 切换公司视频和照片
    cutImgOrvideo(event){
        let index = event.currentTarget.dataset.index
        this.setData({index})
    },

    // 播放当前点击的视频
    playVideo(event) {
        let url = event.currentTarget.dataset.url.split('?')[0]
        console.log(url)
        // this.setData({
        //     isPlay: true,
        //     playSrc: url
        // })
        // this.autoFullScreen()
        wx.navigateTo({
          url: `/subpackPage/playVideo/index/index?url=${url}`,
        })
    },
    // 视频自动全屏的方法
    autoFullScreen() {
        const videoUrl = this.data.playSrc
        let videoContext = wx.createVideoContext('myVideo', this);// 	创建 video 上下文 VideoContext 对象。
        console.log(videoContext)
        videoContext.requestFullScreen({	// 设置全屏时视频的方向，不指定则根据宽高比自动判断。
            direction: 90						// 屏幕逆时针90度
        });
        videoContext.play()
        videoContext.src = videoUrl
    },

    // 视频结束后自动退出全屏
    endAction: function () {
        let videoContext = wx.createVideoContext('myVideo', this);
        videoContext.exitFullScreen(); //退出全屏
        this.setData({
            isPlay: false,
            playSrc: ''
        })
    },
    // 查看图片
    previewImage(event){
        let {url} = event.currentTarget.dataset
        let images = this.data.images.map(item=>{
            return item.url
        })
        wx.previewImage({
            urls: images,
            current: url,
            showmenu: true
        })
    },

    onClick(){
      this.selectComponent('#tabs').resize();
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let width = 100 / 3 + "%"
        let album = wx.getStorageSync('album')
        let images = []
        let videos = []
        album.map(item=>{
            if(item.type == 1){
                images.push(item)
            } else {
                videos.push(item)
            }
        })
        this.setData({
            width,
            images,
            videos
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