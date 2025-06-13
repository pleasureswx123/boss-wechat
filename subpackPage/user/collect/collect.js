import { getCollectedPostByUserId,getCollectedCorporationList } from '../../../http/api'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        datalist:[],
        active:0,
        defaultImage: '?x-oss-process=image/resize,w_80/quality,q_50'
    },
    positionCollect(e){
        console.log('职位',e);
        getCollectedPostByUserId().then(res=>{
            if(res.code==200){
                res.data.list.map(item=>{
                    item.post= item.title,
                    item.num= this.data.typeList[item.type]?.name,
                    item.year= this.data.sufferList[item.experience]?.name,
                    item.companyName= item.corporationName,
                    item.city= item.city,
                    item.province= item.province,
                    item.tag= item.tag.split(','),
                    item.username=  item.belonger,
                    item.isH=  item.redPacket,
                    item.moneyType=  item.moneyType,
                    item.maximumMoney=  item.maximumMoney,
                    item.lowestMoney=  item.lowestMoney,
                    item.monthMoney=  item.monthMoney,
                    item.postId=  item.id,
                    item.bossUserId= item.belonger,
                    item.outName= item.outName,
                    item.avatar= item.avatar,
                    item.outPost= item.outPost,
                    item.stage= this.data.financingList[item.financeStage]?.name,
                    item.corporationId= item.corporationId,
                    //需要改字段，字段为scale
                    item.scale= this.data.scaleList[item.scale]?.name
            })
            this.setData({
                datalist:res.data.list
            })
            }
        })
    },
    // 字典数据
    getDictionary() {
        if(wx.getStorageSync('dictionary')){
            let resultData = wx.getStorageSync('dictionary')
            this.setData({
                sufferList: this.mapData(resultData[33]),
                scaleList: this.mapData(resultData[5]),
                financingList: this.mapData(resultData[4]),
                typeList: this.mapData(resultData[39])
            })
        }
    },

    // 处理筛选数据的函数
    mapData(data) {
        let add = data.map(item => {
            let isActive = false
            if (item.name == '不限') {
                isActive = true
            } else {
                isActive = false
            }
            return {
                ...item,
                isActive: isActive
            }
        })
        return add
    },
    companyCollect(e){
        console.log('公司',e);
        getCollectedCorporationList().then(res=>{
            if(res.code==200){
                res.data.list.map(item=>{
                    item.stage= this.data.financingList[item.financeStage]?.name,
                    //需要改字段，字段为scale
                    item.scale= this.data.scaleList[item.scale]?.name
            })
            this.setData({
                datalist:res.data.list
            })
            }
        })
    },
    changeTabs(event) {
        this.setData({
            active:event.detail.index
        })
      },
   // 获取设备屏幕高度
   systemType () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  tabChange (event) {
    this.setData({
        active: event.detail.current
    })
    if(event.detail.current==0){
        this.positionCollect()
    }else{
        this.companyCollect()
    }
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.systemType()
        this.getDictionary()
        this.positionCollect()
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