import { resumeSocre } from '../../../http/user'
import
NumberAnimate
  from '../../../utils/NumberAnimate'
var app = getApp()
Page({
  data: {
    list: [
      {
        type: 'fjjl',
        name: '附件简历',
        content: '上传附件简历可以在面试中，以文档的形式发送给招聘官',
        url: '/subpackPage/user/resumeAnnex/resumeAnnex'
      }, {
        type: 'gzjl',
        name: '工作经历',
        content: '好的工作经历可以获取招聘官更多的青睐。',
        url: '/subpackPage/user/addWorkExper/addWorkExper?type=add'
      }, {
        type: 'wxh',
        name: '微信',
        content: '微信号只有在你与招聘官交换的时候才会告知对方。',
        url: '/subpackPage/user/setWxNumber/setWxNumber'
      },
      // {
      //     type: 'yj',
      //     name: '邮箱',
      //     content: '填写邮箱可在 BOSS 查看在线信息后发送电子邮件。',
      //     url: '/subpackPage/user/setEmail/setEmail'
      // }, 
      {
        type: 'grys',
        name: '个人优势',
        content: '填写好的个人优势，可以让招聘官快速了解您的优点。',
        url: '/subpackPage/user/advantage/advantage'
      }, {
        type: 'qzzt',
        name: '求职状态',
        content: '求职状态可以直观的让招聘官快速了解您的就职情况',
        url: '/subpackPage/user/resume/resume'
      }, {
        type: 'xmjl',
        name: '项目经历',
        content: '项目经验的丰富可以增加招聘官对您的了解增加对您的肯定',
        url: '/subpackPage/user/addProjectExper/addProjectExper?type=add'
      }, {
        type: 'jyjl',
        name: '教育经历',
        content: '教育经历可以更直观的让招聘官了解，您受到的教育情况',
        url: '/subpackPage/user/education/education'
      }, {
        type: 'cjgzsj',
        name: '参加工作时间',
        content: '参加工作时间可以更直观的让招聘官了解，您受到的教育情况',
        url: '/subpackPage/user/personalInfo/personalInfo'
      }],
    score: 0,
    scoreWidth: 100,
    currentScore: 0,
    imageUrl: app.globalData.baseImgUrl, //图片路径
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    show: true,
    flowerAnimation: null,
    bubbleAnimation: {},
    bubbleAnimationA: {}
  },
  // 撒花动画
  startAnimation: function () {
    const animation = wx.createAnimation({
      duration: 3000,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 100% 0'
    });
    animation.translateY(-100).step();
    animation.translateY(0).step({ duration: 2000 });
    this.setData({
      bubbleAnimation: animation.export()
    });
    setTimeout(() => {
      this.startAnimation();
    }, 5000);
  },
  // 泡泡动画
  startAnimationA: function () {
    const animation = wx.createAnimation({
      duration: 4000,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 100% 0'
    });
    animation.translateY(-100).step();
    animation.translateY(0).step({ duration: 2000 });
    this.setData({
      bubbleAnimationA: animation.export()
    });
    setTimeout(() => {
      this.startAnimationA();
    }, 6000);
  },
  // 去投简历
  cast() {
    let versions = wx.getStorageSync('versions')
    // 如果已经选择好版本了
    if (versions) {
      if (versions == 1) {
        wx.reLaunch({
          url: `/pages/index/index`
        })
      } else {
        wx.reLaunch({
          url: `/subpackPage/versions/index/index`
        })
      }
    } else {
      wx.setStorageSync('currentPageIdx', 1)
      // 如果没有选择版本
      wx.reLaunch({
        url: `/pages/index/index`
      })
    }
  },
  onLoad() {
    this.startAnimation();
    this.startAnimationA()
  },

  onShow(options) {
    this.resumeSocre()

  },
  // 数字动画
  animate() {
    let n1 = new NumberAnimate({
      from: Number(this.data.resData.score),
      speed: 3000,
      refreshTime: 30,
      decimals: 1,
      onUpdate: () => {
        this.setData({
          score: n1.tempValue
        });
      },
      onComplete: () => { }
    });
  },
  resumeSocre() {
    resumeSocre().then(res => {
      console.log()
      if (res.code == 200) {
        let resData = res.data
        let _data = this.data.list
        _data.map(result => {
          result.count = resData[result.type]
        })
        let _scoreLine = 100
        if (res.data.score >= 60) {
          _scoreLine = 280
        }
        if (res.data.score >= 80 && res.data.score <= 99) {
          _scoreLine = 470
        }
        if (res.data.score == 100) {
          _scoreLine = 750
        }
        this.setData({
          list: _data,
          resData: res.data,
          currentScore: res.data.score,
          scoreWidth: _scoreLine
        })
        this.animate()
      }
    })
  },
  goPage(e) {
    console.log(e,'111111')
    let _url = e.currentTarget.dataset.url
    let _name = e.currentTarget.dataset.name
    let _userInfo = null
    if (_name == '微信') {
      _userInfo =  wx.getStorageSync('userInfo').info
    }
    wx.navigateTo({
      url: _url + '?val=' + JSON.stringify(_userInfo),
    })
  },
  goOtherPage() {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  goBack() {
    wx.navigateBack()
  }
})