import {
  getPostListByLookedAndPropUsed,
  getPostListByConcatAndPropUsed,
  saveaProp,
  privacyProtectionBoss,
  setPrivacyProtectionBoss,
  propUsing,
  getConcatPropChart,
  getLookPropChart,
  getUsedByDayRecords,
  getLookPropCensus,
  getTopConcatProp,
  getReLookPropCensus,
  getRefreshConcatProp,
  getDayDataRecords,
  getPhoneDataRecords
} from '../../../http/user'
import { showToast } from '../../../utils/util'

const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    popShow: false,
    topActive: 0,
    baseImageUrl: app.globalData.baseImgUrl,
    dataList: [], // 数据
    userId: null,
    propId: null, //道具Id
    topTabs: [],
    botTabs: [{
      name: '查看我',
      selected: true
    }, {
      name: '与我联系',
      selected: false
    }],
    currentNum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.setData({
      capsuleData: _capsuleData,
      userId: wx.getStorageSync('userInfo').info.userId,
      propId: options.id,
      propType: options.propType,
      used: options.used,
      status: options.status
    })
    if (options.propType == 9 || options.propType==7) {
      this.setData({
        topTabs: [{ name: '使用记录', selected: true }],
        botTabs: [{ name: '沟通过', selected: true }]
      })
    } else if (options.propType == 5) {
      this.setData({
        //topTabs: [{ name: '查看我', selected: true }, { name: '与我联系', selected: false }, { name: '置顶曝光度', selected: false }]
        topTabs: [{ name: '查看我', selected: true }, { name: '与我联系', selected: false }]
      })
    } else {
      this.setData({
        //topTabs: [{ name: '查看我', selected: true }, { name: '与我联系', selected: false }, { name: '简历曝光度', selected: false }]
        topTabs: [{ name: '查看我', selected: true }, { name: '与我联系', selected: false }]
      })
    }
    this.getDictionary()
    // this.getPostListByLookedAndPropUsed()
    if(options.propType==9 || options.propType==7){
      this.getPhoneProp()
    }else if(options.propType==5){
      this.getLookPropCensus()
    }else if(options.propType==1){
      this.getReLookPropCensus()
    }
  },

  back() {
    wx.navigateBack()
  },
  // tab切换
  onChange(event) {
    this.setData({
      active: event.detail.name
    })
  },

  //道具使用.立即刷新btn
  refresh() {
    //查看boss权限
    privacyProtectionBoss(this.data.userId).then(res => {
      console.log(res, 'boss权限')
      if (res.data.hideResumeFromBoss == 1) return this.setData({ popShow: true })
      let type = 'REFRESH'
      if (this.data.propType == 5) {
        type = 'TOP_RESUME'
      }
      let params = {
        belongId: this.data.propId,
        type: type
      }
      //立即使用
      saveaProp(params).then(res => {
        if (res.code == 200) {
          if (res.data.code !== 0) return showToast(res.data.msg)
          this.setData({ used: 1, status: 'using' })
        }
      })
    })
  },

  //顶部nav切换
  changeTopTabs(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.topTabs
    for (let i = 0; i < list.length; i++) {
      list[i].selected = false
    }
    list[index].selected = true
    this.setData({
      topTabs: list,
      topActive: index
    })
    wx.showLoading()
    if(this.data.propType==5 && index===1){
      this.getTopConcatProp()
    }else if(this.data.propType==1 && index===1){
      this.getRefreshConcatProp()
    }else if(this.data.propType==1 && index===0){
      this.getReLookPropCensus()
    }else if(this.data.propType==5 && index===0){
      this.getLookPropCensus()
    }
  },

  //使用道具后 查看 过我的列表
  async getPostListByLookedAndPropUsed() {
    let params = {
      id: this.data.propId,
      pageNum: 1,
      pageSize: 10
    }
    const res = await getPostListByLookedAndPropUsed(params)
    console.log(res, '8888')
    if (res.code != 200) return showToast(res.msg)
    this.resetData(res.data.records)
  },
  //使用道具后 沟通 过我的列表
  async getPostListByConcatAndPropUsed() {
    let params = {
      id: this.data.propId,
      pageNum: 1,
      pageSize: 10
    }
    const res = await getPostListByConcatAndPropUsed(params)
    if (res.code != 200) return showToast(res.msg)
    this.resetData(res.data.records)
  },

  //底部查看过我，沟通过的nav切换
  changeBotTabs(e) {
    let index = e.currentTarget.dataset.index
    let list = this.data.botTabs
    for (let i = 0; i < list.length; i++) {
      list[i].selected = false
    }
    list[index].selected = true
    this.setData({
      botTabs: list,
    })
    if (index == 0) {
      this.getPostListByLookedAndPropUsed()
    } else {
      this.getPostListByConcatAndPropUsed()
    }
  },

  //取消对boss隐藏简历
  async cloneShow() {
    let params = {
      userId: this.data.userId,
      hideResumeFromBoss: 0
    }
    const res = await setPrivacyProtectionBoss(params)
    if (res.code != 200) return showToast(res.msg)
    showToast('取消成功')
    this.setData({ hideResumeFromBoss: 0, popShow: false })
  },
  // 隐藏弹窗
  cloneShowA() {
    this.setData({ popShow: false })
  },
  //是否是今天
  isToday(str){
    const today = new Date();
    let dateStr = new Date(str); 
    return dateStr.getDate() === today.getDate() &&
    dateStr.getMonth() === today.getMonth() &&
    dateStr.getFullYear() === today.getFullYear();
  },
  //查看aI帮写/虚拟电话使用记录
  async getPhoneProp(){
    const res = await getUsedByDayRecords(this.data.propId)
    if(res.code!=200) showToast(res.msg)
    res.data.list.map(item=>{
      if(this.isToday(item.useDate)){
        item.today=true
      }
    })
    this.setData({
      aiPhoneList:res.data.list,
      totalNum:res.data.residue
    })
    if(res.data.list.length>0){
      this.getPhoneDataRecords(res.data.list[0].ids)
    }
  },
  //查看aI帮写/虚拟电话使用详情列表
  async getPhoneDataRecords(idsNum){
    const res = await getPhoneDataRecords({ids:idsNum})
    if(res.code!=200) showToast(res.msg)
    if(res.data.length>0){
      this.resetData(res.data)
    }else{
      this.setData({
        dataList:res.data
      })
    }
  },

  //置顶卡-查看过我的统计
  async getLookPropCensus(){
    const res = await getLookPropCensus(this.data.propId)
    wx.hideLoading()
    if(res.code!=200) showToast(res.msg)
    this.setData({
      lookList:res.data
    })
  },
  //置顶卡-沟通过我的统计
  async getTopConcatProp(){
    const res = await getTopConcatProp(this.data.propId)
    wx.hideLoading()
    if(res.code!=200) showToast(res.msg)
    this.setData({
      concatList:res.data
    })
  },
  //刷新简历-查看过我的统计
  async getReLookPropCensus(){
    const res = await getReLookPropCensus(this.data.propId)
    wx.hideLoading()
    if(res.code!=200) showToast(res.msg)
    this.setData({
      lookList:res.data
    })
  },
  //刷新简历-沟通过我的统计
  async getRefreshConcatProp(){
    const res = await getRefreshConcatProp(this.data.propId)
    wx.hideLoading()
    if(res.code!=200) showToast(res.msg)
    this.setData({
      concatList:res.data
    })
  },
  goLookPost(){
    let _versions=wx.getStorageSync('versions')
    if(_versions==1){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }else{
      wx.reLaunch({
        url: '/subpackPage/versions/index/index',
      })
    }
  },
   // 字典数据
   getDictionary() {
    if (wx.getStorageSync('dictionary')) {
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
  resetData(resData){
    let _dataList = []
        resData && resData.map(item => {
            _dataList.push({
                post: item.title,
                num: this.data.typeList[item.type].name,
                year: this.data.sufferList[item.experience].name,
                companyName: item.corporationName,
                city: item.city,
                province: item.province,
                tag: item.tag && item.tag.split(','),
                username: item.belonger,
                isH: item.redPacket,
                moneyType: item.moneyType,
                maximumMoney: item.maximumMoney,
                lowestMoney: item.lowestMoney,
                monthMoney: item.monthMoney,
                postId: item.positionId,
                bossUserId: item.belonger,
                outName: item.outName,
                avatar: item.avatar,
                outPost: item.outPost,
                stage: this.data.financingList[item.financeStage] && this.data.financingList[item.financeStage].name,
                corporationId: item.corporationId,
                //需要改字段，字段为scale
                scale: this.data.scaleList[item.scale].name
            })
        })
        this.setData({
            showLoading: false,
            dataList: _dataList
        })
  },
  goLookResume(){
    wx.navigateTo({
      url: '/subpackPage/versions/indexAI/indexAI',
    })
  }
})