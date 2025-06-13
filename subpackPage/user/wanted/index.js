// subpackPage/user/wanted/index.js

import { jobRedEnvelopeInfo, appealSave, redView, getJobRedEnvelopeInfo, withdrawal,showActivity } from '../../../http/user'
import
NumberAnimate
  from '../../../utils/NumberAnimate'
var app = getApp()
const { Parser, Player } = require("../../../libs/svgaplayer.weapp")
const parser = new Parser();
const player = new Player;
import {
  ossUpload
} from '../../../miniprogram-6/utils/oss.js'
import { showToast } from '../../../utils/util'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    navList: [
      {
        value: 1,
        title: '求职红包',
      },
      {
        value: 2,
        title: '路费补贴',
      }
    ],
    screenList: [
      {
        value: 0,
        title: '全部',
      },
      {
        value: 1,
        title: '待签到',
      },
      {
        value: 2,
        title: '待确认',
      },
      {
        value: 3,
        title: '已完成',
      }
    ],
    isActive: 1,
    isActive1: 0,
    total: null,
    dataList: [], // 签到红包数据列表
    imageUrl: app.globalData.baseImgUrl,
    show: false,
    showLoading: false,
    wnShow: false,
    audioSrc: app.globalData.baseImgUrl + '/jinbi.mp3',
    showJinbi: false,
    despText: '',
    ImageArr: [],
    isShenSu: true,
    isWithDraw: true,
    redInfo: {},
    sxShow: false,
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
  },
  switchSxHandle(e) {
    let index = e.currentTarget.dataset.index
    this.setData({ isActive1: index })
  },
  cancelEvent() {
    this.setData({ isActive1: 0 })
  },
  sureEvent() {
    this.setData({
      showLoading: true,
      sxShow: false
    })
    this.jobRedEnvelopeInfo(this.data.isActive1)
  },
  screenEvent() {
    this.setData({ sxShow: true })
  },
  onClose1() {
    this.setData({ sxShow: false })
  },
  goWithdraw() {
    if (this.data.redInfo.balance <= 0) {
      showToast('暂无可提现金额')
      return
    }
    // this.setData({
    //   isWithDraw: true
    // })
    this.setData({
      isWithDraw: false
    })
    this.loadSvga()
  },
  //去申诉
  goSs(e) {
    console.log(e.detail)
    let item = JSON.parse(e.detail)
    this.setData({
      interviewInfo: item,
      isShenSu: true
    })
  },
  closeBox() {
    // this.setData({
    //   isWithDraw: false
    // })
    this.setData({
      isWithDraw: true
    })
    this.clearAnimationFn()
  },
  //导航切换
  switchNavHandle(e) {
    this.setData({
      showLoading: true
    })
    let index = e.currentTarget.dataset.index
    this.setData({ isActive: index })
    if(index == 1){
      this.setData({
        screenList: [
          {
            value: 0,
            title: '全部',
          },
          {
            value: 1,
            title: '待签到',
          },
          {
            value: 2,
            title: '待确认',
          },
          {
            value: 3,
            title: '已完成',
          }
        ],
      })
    } else {
      this.setData({
        screenList: [
          {
            value: 0,
            title: '全部',
          },
          {
            value: 1,
            title: '待签到',
          },
          {
            value: 2,
            title: '待审核',
          },
          {
            value: 3,
            title: '已完成',
          }
        ]
      })
    }
    this.jobRedEnvelopeInfo(index)
  },
  // 数字动画
  animate() {
    let n1 = new NumberAnimate({
      from: Number(this.data.total),
      speed: 3000,
      refreshTime: 30,
      decimals: 0,
      onUpdate: () => {
        this.setData({
          total: n1.tempValue
        });
      },
      onComplete: () => { }
    });
  },
  //文本框输入数量内容
  textareaInput(e) {
    this.setData({
      despText: e.detail.value
    })
  },
  //获取红包信息
  getredView() {
    redView().then(res => {
      if (res.code == 200) {
        this.setData({
          redInfo: res.data
        })
      }
    })
  },
  //查看求职红包信息
  jobRedEnvelopeInfo(type) {
    let param = {
      pageNum: 1,
      pageSize: 20,
      mode: this.data.isActive,
      redEnvelopeStatus: this.data.isActive1,
      userId: wx.getStorageSync('userInfo').info.userId
    }
    getJobRedEnvelopeInfo(param).then(res => {
      this.setData({
        showLoading: false
      })
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      this.setData({ total: res.data.totalWithdrawalAmount })
      let list = JSON.parse(JSON.stringify(res.data.records))
      list.forEach((item, index) => {
        list[index].tag = item.tag.split(',')
      })
      this.setData({ dataList: list })
      this.animate()
      if (res.data.totalWithdrawalAmount) {
        this.audioPlay()
        this.setData({
          showJinbi: true
        })
        setTimeout(() => {
          this.setData({
            showJinbi: false
          })
          this.innerAudioContext.stop();
        }, 4000)
      }
    })
  },
  //关闭遮罩层
  cloneOver() {
    this.setData({ show: false })
  },
  onClickHide() {
    this.setData({
      wnShow: false
    })
  },
  openDesc() {
    this.setData({
      wnShow: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
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
    })
    this.jobRedEnvelopeInfo(0)
    this.getredView()
    this.showActivityFn()
  },
  audioPlay() {
    //创建内部 audio 上下文 InnerAudioContext 对象。
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.src = this.data.audioSrc //设置音频地址
    this.innerAudioContext.loop = false // 是否循环播放
    this.innerAudioContext.play(); //播放音频
  },
  //上传图片
  uploadImage() {
    var that = this
    let userId = wx.getStorageSync('userInfo').info.userId
    let _length = 3 - this.data.ImageArr.length
    wx.chooseMedia({
      count: _length,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFiles = res.tempFiles
        var imageList = that.data.ImageArr
        for (let i = 0; i < tempFiles.length; i++) {
          console.log(tempFiles[i])
          const result = await ossUpload(tempFiles[i].tempFilePath, 'image', userId)
          imageList.push(result.full)
        }
        that.setData({
          ImageArr: imageList
        })
      }
    })
  },
  //删除上传的图片
  removeImage(e) {
    var index = e.currentTarget.dataset.index
    console.log(index)
    let imgArr = this.data.ImageArr
    var imageList = imgArr.splice(0, 1)
    console.log(imageList)
    this.setData({
      ImageArr: imgArr
    })
  },
  onClose() {
    this.setData({
      isShenSu: false,
      interviewInfo: {}
    })
  },
  appealSave() {
    let params = {
      imgUrls: this.data.ImageArr.join(','),
      interviewRecordId: this.data.interviewInfo.interviewRecordId,
      reasonContent: this.data.despText,
      typeId: 1
    }
    appealSave(params).then(res => {
      if (res.code == 200) {
        showToast('申诉成功')
        setTimeout(() => {
          this.onClose()
        }, 500)
      }
    })
  },
  goMoney() {
    if (this.data.redInfo.todayWithdraw > 0) return
    let _balance = this.data.redInfo.balance
    if (_balance > 100) {
      _balance = 100
    }
    withdrawal({ money: _balance }).then(res => {
      if (res.code == 200) {
        this.getredView()
        showToast(res.msg)
      }
    })
  },

  moneyDetail() {
    wx, wx.navigateTo({
      url: '/subpackPage/user/wantedDetail/wantedDetail',
    })
  },

  async loadSvga() {
    try {

      await player.setCanvas('#demoCanvas')
      // const videoItem = await parser.load("https://cdn.jsdelivr.net/gh/svga/SVGA-Samples@master/angel.svga");
      const videoItem = await parser.load("https://gcjt-youpin-beijing.oss-cn-beijing.aliyuncs.com/resource/wechat/baseimages/my/qiuzhihongbao2.svga")
      await player.setContentMode('Fill')
      await player.setVideoItem(videoItem);
      player.startAnimation();
    } catch (error) {
      console.log(error);
    }
  },
  async clearAnimationFn() {
    await player.stopAnimation(true)
  },
  async showActivityFn(){
    const res = await showActivity()
    console.log(res,'222222222')
    if (res.data.showActivity == 1) {
      this.setData({
        navList: [
          {
            value: 1,
            title: '求职红包',
          }
        ],
      })
    } else {
      this.setData({
        navList: [
          {
            value: 1,
            title: '求职红包',
          },
          {
            value: 2,
            title: '路费补贴',
          }
        ],
      })
    }
  }
})