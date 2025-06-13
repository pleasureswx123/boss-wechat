// subpackPage/index/corporation_detail/index.js
const app = getApp();
import { apiDetailCompany, apigetCorporationPost, apiNavwelfare, postTypeList } from "../../../http/index"
// 按下的纵坐标
let startY = 0
// 移动的纵坐标
let moveY = 0
// 移动的距离
let distanceY = 0
Page({
  /** 
   * 页面的初始数据
   */
  data: {
    convertTransform: `translateY(0rpx)`, // 设置移动距离
    convertTransition: '', // 设置缓动效果
    height: 0,
    height1: 252,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    baseImageUrl: app.globalData.baseImgUrl,
    show: false,
    isPlay: false, // 控制视频播放
    playSrc: '', // 播放链接
    current: 0,  // 当前所在滑块的 index
    corporationId: null,
    companyDetail: {},
    sufferList: [], // 经验
    scaleList: [], // 公司规模
    financingList: [], // 融资
    typeList: [], // 招聘类型
    album: [], // 视频列表
    defaultImage: '?x-oss-process=image/resize,w_100/quality,q_90',
    currentBoss: [],
    introductionMaxHeight: 3,
    examineAll: true, // 控制公司介绍查看更多展示
    recruitTagList: [], // 招聘岗位tag列表
    currentTag: 0, // 默认高亮全部按钮
    popupHeight: 0,
    treatHeight: 0, // 福利弹窗高度
    dataList: [], // 岗位数据
    pageNum: 1, // 公司在招岗位当前页
    pageSize: 9999,// 每页多少条
    topOpacity: 0,
    scrollTopShow: true, // 顶部颜色默认隐藏
    searchPost: '', // 搜索公司下的职位
    isSearchInput: false,
    disPlay: '-webkit-box',
    otherWelfareSort: [],
    postTotal: '',
    isUpOrDown: false,
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
  },
  // 返回上一页
  corporationJump() {
    wx.navigateBack()
  },
  // 查看当前公司全部视频和照片
  lookAll() {
    wx.navigateTo({
      url: `/subpackPage/index/photo_detail/index`,
    })
  },
  // 高管介绍
  seniorIntroduce(event) {
    let currentBoss = event.currentTarget.dataset.boss
    let index = event.currentTarget.dataset.index
    console.log(currentBoss, '高管列表')
    this.setData({
      show: true,
      currentBoss,
      current: index
    })
  },
  // 关闭弹窗
  onClose() {
    this.setData({
      show: false
    })
  },
  // current改变触发事件
  bindchange() {

  },
  // 当前公司详情
  async getDetailCompany() {
    const { code, data, msg } = await apiDetailCompany({ corporationId: this.data.corporationId })
    // console.log(data, '公司详情')
    let album = data.album
    // 处理视频
    album?.map(item => {
      if (item.type == 2) {
        item.url = item.url + '?x-oss-process=video/snapshot,t_1000,m_fast'
      }
    })
    album?.sort((a, b) => {
      if (a.type === 2 && b.type !== 2) {
        return -1; // a排在b前面
      } else if (a.type !== 2 && b.type === 2) {
        return 1; // b排在a前面
      } else {
        return 0; // 保持原有顺序
      }
    })
    console.log(album, '升序')
    data.visitVideos = data.visitVideos.map(item=>{
      let type = this.isVideoLink(item) ? 2 : 1
      let url = ''
      if (type == 2) {
        url = item + '?x-oss-process=video/snapshot,t_1000,m_fast'
      } else {
        url = item
      }
      return {
        url,
        type
      }
    })
    console.log(data, '公司详情1')
    this.setData({
      companyDetail: data,
    })

    wx.setStorageSync('album', data.album)
  },
  // 播放当前点击的视频
  playVideo(event) {
    let url = event.currentTarget.dataset.url.split('?')[0]
    console.log(url, '11111')
    // this.setData({
    //     isPlay: true,
    //     playSrc: url
    // })
    wx.navigateTo({
      url: `/subpackPage/playVideo/index/index?url=${url}`,
    })
    // this.autoFullScreen()
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
  // 公司介绍查看全部
  examineAll() {
    this.setData({
      introductionMaxHeight: 'normal',
      examineAll: false,
      disPlay: 'inline-block'
    })
  },
  // 切换当前岗位tag标签
  changCurrentTag(event) {
    let index = event.currentTarget.dataset.index
    this.setData({
      currentTag: index
    })
    this.GetCorporationPost(this.data.recruitTagList[index].id)
  },
  // 手指触摸开始
  start(event) {
    this.setData({
      convertTransition: ''
    })
    // 获取按下的坐标点
    startY = event.touches[0].clientY
    console.log(event.touches[0].clientY)
  },
  // 手指移动
  move(event) {
    console.log(event.touches, '0000')
    // 后去移动中的坐标点
    moveY = event.touches[0].clientY
    // 计算移动距离
    distanceY = moveY - startY
    if (distanceY > 40) { // 下拉
      console.log(distanceY, '下拉')
      distanceY = 0
      this.setData({
        convertTransition: 'transform linear 0.8s',
        convertTransform: `translateY(${distanceY}px)`,
        isUpOrDown: false,
      })
      return
    }
    if (distanceY < 0) { // 上拉
      console.log(distanceY, '上拉')
      let popupHeight = wx.getSystemInfoSync().windowHeight - 90
      distanceY = -popupHeight + app.globalData.statusBarHeight + app.globalData.navBarHeight + 40

      this.setData({ isUpOrDown: true })
    }

    // 设置移动的效果
    this.setData({
      convertTransition: 'transform linear 0.6s',
      convertTransform: `translateY(${distanceY}px)`
    })
    console.log(distanceY, '99999')
  },
  // 手指离开
  handlerEnd() {
    // this.setData({
    //   convertTransform: `translateY(0rpx)`,
    //   convertTransition: 'transform 1s linear'
    // })
  },
  // 切换的同时让弹窗弹起
  movement() {
    let popupHeight = wx.getSystemInfoSync().windowHeight - 90
    distanceY = -popupHeight + app.globalData.statusBarHeight + app.globalData.navBarHeight + 40
    this.setData({
      convertTransition: 'transform linear 0.6s',
      convertTransform: `translateY(${distanceY}px)`,
      isSearchInput: true
    })
  },
  // 切换当前公司在招职位数据列表
  cutPostData() {
    this.setData({
      dataList: this.data.cdataList,
      isSearchInput: false
    })
  },
  //招聘职位类型
  async getPostTypeList() {
    const { code, data, msg } = await postTypeList(this.data.corporationId)
    data.unshift({ id: null, name: '全部' })
    this.setData({
      recruitTagList: data
    })
  },
  // 公司在招列表
  async GetCorporationPost(id) {
    let params = {
      corporationId: this.data.corporationId,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize,
      status: 1
    }
    if (id) {
      params.category = id
    }
    const { code, data, msg } = await apigetCorporationPost(params)
    console.log(data, '在招列表')
    if (code !== 200) {
      wx.showToast({
        title: msg,
        icon: 'none'
      })
    }
    if (!params.category) {
      this.setData({
        postTotal: data.total
      })
    }
    let newArr = data.records.map(item => {
      return {
        post: item.title,
        num: this.data.typeList[item.type]?.name,
        year: this.data.sufferList[item.experience]?.name,
        companyName: item.corporationName,
        city: item.city,
        province: item.province,
        tag: item.tag.split(','),
        username: item.belonger,
        isH: item.redPacket,
        moneyType: item.moneyType,
        maximumMoney: item.maximumMoney,
        lowestMoney: item.lowestMoney,
        monthMoney: item.monthMoney,
        postId: item.id,
        bossUserId: item.belonger,
        outName: item.outName,
        avatar: item.avatar,
        outPost: item.outPost,
        stage: this.data.financingList[item.financeStage]?.name,
        corporationId: item.corporationId,
        //需要改字段，字段为scale
        scale: this.data.scaleList[item.scale]?.name,
        online: item.online,
        activation: item.activation,
        activityTags: item.activityTags.indexOf(1) > -1 ? true : false
      }
    })
    console.log(newArr, '99999')
    this.setData({
      cdataList: newArr,
      dataList: newArr
    })
  },
  // 查看公司福利弹窗
  tereatmentEnever() {
    this.setData({ treatShow: true })
  },
  // 获取公司福利信息
  async getNavwelfare() {
    const { code, data, msg } = await apiNavwelfare()
    if (code !== 200) {
      wx.showToast({
        title: msg,
        icon: "none"
      })
      return
    }
    let listotherWelfare = []
    this.data.companyDetail.otherWelfare && this.data.companyDetail.otherWelfare.split(',').map(item => {
      let list = data.filter(i => i.id == item)
      listotherWelfare.push(...list)
    })
    console.log(listotherWelfare, '福利列表')
    this.setData({
      otherWelfare: listotherWelfare,
      otherWelfareSort: listotherWelfare.slice(0, 5)
    })
  },
  // 关闭福利弹窗
  onClosetreatShow() {
    this.setData({ treatShow: false })
  },
  // 去导航页面
  gotoMap() {
    let params = {
      postAddress: this.data.companyDetail.address[0].mapDetails,
      latitude: this.data.companyDetail.address[0].lat,
      longitude: this.data.companyDetail.address[0].lon,
      corporationName: this.data.companyDetail.abbreviation,
    }
    wx.navigateTo({
      url: `/subpackPage/index/map/index?param=` + JSON.stringify(params),
    })
  },

  // 在公司详情页预览图片
  preview(event) {
    let { url, type } = event.currentTarget.dataset
    if (url.split('.')[url.split('.').length - 1].split('?')[0] == 'mp4' || type == 2) {
      this.playVideo({ currentTarget: { dataset: { url: url } } })
      return
    }
    let images = []
    this.data.companyDetail.album.map(item => {
      if (item.type == 1) {
        images.push(item.url)
      }
    })
    console.log(url)
    wx.previewImage({
      urls: images,
      current: url
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
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
    console.log(options, '传递到参数')
    let dictionary = wx.getStorageSync('dictionary')
    let popupHeight = wx.getSystemInfoSync().windowHeight - 90
    let height1 = this.data.height1 // 头部动态设置
    let bottomHeight = (height1 + app.globalData.statusBarHeight + 10 * 2) / 2  // 初始值固定在哪
    this.setData({
      capsuleData: _capsuleData,
      corporationId: options.corporationId,
      sufferList: dictionary[33],
      scaleList: dictionary[5],
      financingList: dictionary[4],
      typeList: dictionary[39],
      height: -popupHeight + app.globalData.statusBarHeight + app.globalData.navBarHeight + 30,
      popupHeight: -popupHeight + app.globalData.statusBarHeight + app.globalData.navBarHeight + bottomHeight,
      treatHeight: popupHeight - app.globalData.statusBarHeight,
      // convertTransform: `translateY(${-popupHeight + app.globalData.statusBarHeight + app.globalData.navBarHeight + 40}px)`,
      // convertTransition: 'transform linear 0.5s',
      convertTransition: 'transform linear 0.8s',
      convertTransform: `translateY(0px)`
    })

    await this.getDetailCompany()
    await this.GetCorporationPost()
    await this.getNavwelfare()
    await this.getPostTypeList()
  },

  // 监听滚动事件
  // onPageScroll(e) { //nvue暂不支持滚动监听，可用bindingx代替
  //     let scrollTop = e.scrollTop;
  //     this.data.topOpacity = scrollTop / 300 > 0.9 ? 1 : scrollTop / 300
  //     if (e.scrollTop != 0) {
  //         this.data.scrollTopShow = false;
  //     } else {
  //         this.data.scrollTopShow = true;
  //     }
  // },
  onPageScroll(e) {
    var opacity = 0
    console.log(e)
    if (e.scrollTop <= 160) {
      opacity = e.scrollTop / 160
    } else {
      opacity = 1
    }
    var str = "rgba(0,0,0," + opacity + ")"
    this.setData({
      background: str
    })
  },
  debounce(func, delay) {
    let timer = null;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  },
  // 搜索功能
  input(event) {
    this.setData({
      timefn: this.debounce(() => {
        this.searchPostItem(event.detail)
      }, 500)
    })
    this.data.timefn()
  },
  // 清除搜索框内容 
  clear() {
    this.setData({
      IndustryValue: '',
      timefn: this.debounce(() => {
        //清除搜索框
        this.setData({
          dataList: this.data.cdataList
        })
      }, 500)
    })
    this.data.timefn()
  },
  searchPostItem(keyword) {
    const list = this.data.dataList.filter(item => {
      return item.post.match(keyword)
    })
    this.setData({
      dataList: list
    })
  },
  // 播放实探视频
  explorationPlay(event) {
    let { playurl, type } = event.currentTarget.dataset
    if (type == 2) {
      wx.navigateTo({
        url: `/subpackPage/playVideo/index/index?url=${playurl}`,
      })
    } else if(type == 1){
      // let _visitVideos = []
      let _visitVideos = this.data.companyDetail.visitVideos.map(item=>{
        return item.url
      })
      console.log(_visitVideos)
      wx.previewImage({
        urls: _visitVideos,
        current: playurl
      })
    }
  },

  isVideoLink(path) {
    const videoExtensions = ['mp4', 'mov', 'm4v', 'mkv', 'webm', 'avi', '3gp', 'm2ts', 'flv', 'f4v'];
    const extension = path.split('.').pop().toLowerCase(); // 获取路径中的文件扩展名并转为小写
    // 判断扩展名是否存在于视频格式数组中
    return videoExtensions.includes(extension.toLowerCase());
  },
})