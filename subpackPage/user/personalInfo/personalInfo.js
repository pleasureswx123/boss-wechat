import { getUserInfo } from '../../../http/user'
import { apiUserJobDetails } from '../../../http/api'
import { showToast } from '../../../utils/util'
import {
  ossUpload
} from '../../../miniprogram-6/utils/oss.js'
var app = getApp()
Page({
  data: {
    isSex: 0,
    workTime: '',
    birsthday: '1990-06-01',
    email: '',
    imageUrl: app.globalData.baseImgUrl,
    show: false,
    showAvatar: false,
    radio: '', // 选择的平台头像
    isSelectWork: 1, //是否有工作经验
    qzArray: [],
    jobWantedType: null,
    sexArr: [{ code: 0, name: '男' }, { code: 1, name: '女' }],
    isShowSex: false,
    womanChecked: false, // 女
    boyChecked: false, // 男
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    baseImageUrl: app.globalData.baseImgUrl,
    isShowAvatar: false, //头像提示
    selectIdentityShow: false, // 选择身份弹窗
    IdentityType: 0, // 展示什么身份(学生（应届）看职场人 / 职场人看学生)
    experienceYear: 0, // 几年工作经验
    terraceAvatarList: [
      'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/avatar/qztx1.png',
      'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/avatar/qztx2.png',
      'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/avatar/qztx3.png',
      'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/avatar/qztx4.png',
      'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/avatar/qztx5.png',
      'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/avatar/qztx6.png',
      'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/avatar/qztx7.png',
      'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/avatar/qztx8.png'
    ], // 是否是平台头像
  },
  //性别
  bindSexChange(e) {
    // console.log(e, '000:::::::::::::::')
    this.setData({
      ['userInfo.info.sex']: Number(e.currentTarget.dataset.value)
    })
  },
  onCloseSex() {
    this.setData({
      isShowSex: false
    })
  },

  openSet() {
    this.setData({ isShowSex: true })
  },
  //求职类型
  bindPickerChange(e) {
    this.setData({
      ['userInfo.info.jobWantedType']: e.detail.value
    })
    this.getSave({ jobWantedType: e.detail.value })
  },
  bindSexSave() {
    this.setData({
      isShowSex: false
    })
    this.getSave({ sex: this.data.userInfo.info.sex })
  },
  //上传图片
  uploadImage1() {
    this.setData({ show: false })
    let userId = wx.getStorageSync('userInfo').info.userId
    var that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: async (res) => {
        console.log(res)

        const result = await ossUpload(res.tempFiles[0].tempFilePath, 'image', userId, 1)
        let imgStr = `userInfo.info.avatar`
        that.setData({
          [imgStr]: result.full
        })
        this.getSave({ avatar: result.full })
      }
    })
  },
  //上传图片
  uploadImage() {
    this.setData({ show: false })
    this.setData({ isShowAvatar: false })
    let userId = wx.getStorageSync('userInfo').info.userId
    var that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: async (res) => {
        console.log(res)
        console.log(userId, '9999')
        const result = await ossUpload(res.tempFiles[0].tempFilePath, 'image', userId, 1)
        let imgStr = `userInfo.info.avatar`
        that.setData({
          [imgStr]: result.full
        })
        this.getSave({ avatar: result.full })
      }
    })
  },
  //弹出层显示
  avatarTap() {
    // 判断当前用户信息中的头像是否是平台头像 （是就展示弹窗/否则就不展示）
    let flag = this.data.terraceAvatarList.some(item => item == this.data.userInfo.info.avatar)
    console.log(flag, '是否是平台头像')
    if (flag) {
      this.setData({isShowAvatar: true})
    } else {
       this.setData({ show: true })
    }
    // this.setData({showAvatar: true})
  },
  openuploadShow(){
    this.setData({ show: true,isShowAvatar: false})
  },

  // 选择手机照片
  phoneAvatar() {
    this.setData({ show: true })
    this.setData({ showAvatar: false })
  },

  //单选事件
  onChange(e) {
    let { imageurl } = e.currentTarget.dataset
    this.setData({ radio: imageurl })
  },

  // 确定头像
  pitchAvatar() {
    if (!this.data.radio) {
      showToast('请先上传头像')
      return
    }
    apiUserJobDetails({ avatar: this.data.radio }).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '修改成功',
        })
        this.getUserInfo()
        this.setData({ showAvatar: false })
      }
    });
  },
  //弹出层隐藏
  onClose() {
    this.setData({ show: false, isShowAvatar: false })
    this.setData({ showAvatar: false, radio: '' })
  },
  //平台头像
  goToAvatar() {
    wx.navigateTo({
      url: '../avatar/avatar'
    })
    this.setData({
      show: false
    })
  },
  // 获取用户信息
  getUserInfo() {
    wx.removeStorageSync('userInfo')
    getUserInfo().then(result => {
      console.log(result, '用户信息')
      if (result.code == 200) {
        this.setData({
          userInfo: result.data,
          step: result.data.step
        })

        if (!this.data.userInfo.info.nickName) {
          this.setData({
            ['userInfo.nickName']: ''
          })
        }
        // 如果工作时间有值就是职场人
        if (result.data.info.startWorkDate) {
          let year = this.calculateYearsOfWorkExperience(result.data.info.startWorkDate)
          this.setData({
            IdentityType: 1,
            experienceYear: year
          })
        } else {
          // 否则就是学生
          this.setData({
            IdentityType: 2
          })
        }
        wx.setStorageSync('userInfo', result.data)
      }
    })
  },
  clearEmail() {
    this.setData({
      email: ''
    })
  },
  confirmInput(e) {
    this.setData({
      email: e.detail
    })
  },
  bindBirsdayChange: function (e) {
    let _birthday = `userInfo.info.birthday`
    if (new Date().getFullYear() - e.detail.value.substr(0, 4) < 18) {
      showToast('年龄必须大于18岁')
      return
    }
    if (new Date().getFullYear() - e.detail.value.substr(0, 4) > 100) {
      showToast('年龄必须小于100岁')
      return
    }
    this.setData({
      [_birthday]: e.detail.value
    })
    this.getSave({ birthday: e.detail.value })
  },
  bindTimeChange: function (e) {
    if (new Date(e.detail.value).getTime() > new Date().getTime()) {
      showToast('工作时间填写错误')
      return
    }
    console.log(e)
    let year = this.calculateYearsOfWorkExperience(e.detail.value)
    this.setData({
      isSelectWork: 2,
      ['userInfo.info.startWorkDate']: e.detail.value,
      experienceYear: year
    })
    this.getSave({ startWorkDate: e.detail.value })
  },
  getSave(param, isUpdata) {
    apiUserJobDetails(param).then(res => {
      if (res.code == 200) {
        showToast('修改成功')
        if (isUpdata) {
          this.getUserInfo()
          this.closeIdentity()
        }
      }
    });
  },
  goOtherPage(e) {
    console.log(e, '0000')
    let type = e.currentTarget.dataset.type
    let val = JSON.stringify(e.currentTarget.dataset.val) || ''
    if (type == 'setName') {
      val = e.currentTarget.dataset.val || ''
    }
    let url = `/subpackPage/user/${type}/${type}?val=` + val
    wx.navigateTo({
      url,
    })
  },
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
      AITEXT: options.val
    })
    if (options.step) {
      this.setData({
        step: options.step
      })
      wx.hideHomeButton()
    }
    if (wx.getStorageSync('dictionary')) {
      let _qzArray = wx.getStorageSync('dictionary')[39]
      this.setData({
        qzArray: _qzArray
      })
    }
  },
  onShow(options) {
    this.getUserInfo()
  },
  // goResume(){
  //     wx.reLaunch({
  //       url: '/subpackPage/user/resume/resume?step=16'
  //     })
  // },
  goWork(e) {
    let type = e.currentTarget.dataset.type
    let url = '/subpackPage/user/resume/resume?step=16'
    if (type == 2) {
      let versions = wx.getStorageSync('versions')
      // 如果已经选择好版本了
      if (versions) {
        if (versions == 1) {
          url = `/pages/index/index`
        } else {
          url = `/subpackPage/versions/index/index`
        }
      } else {
        wx.setStorageSync('currentPageIdx', 1)
        // 如果没有选择版本
        url = '/pages/index/index'
      }
    }
    if (!this.data.userInfo.info.avatar) {
      // showToast('请先上传头像')
      this.setData({ showAvatar: true })
      return
    }
    if (!this.data.userInfo.info.nickName) {
      showToast('请先填写姓名')
      return
    }
    if (!this.data.userInfo.info.sex && this.data.userInfo.info.sex !== 0) {
      showToast('请先选择性别')
      return
    }
    if (!this.data.userInfo.info.jobWantedType && this.data.userInfo.info.jobWantedType !== 0) {
      showToast('请先选择求职类型')
      return
    }
    if (!this.data.userInfo.info.startWorkDate && this.data.isSelectWork == 2) {
      showToast('请先选择参加工作时间')
      return
    }
    if (!this.data.userInfo.info.birthday) {
      showToast('请先选择出生年月')
      return
    }
    wx.reLaunch({
      url: url
    })
  },
  changeWork() {
    this.setData({
      isSelectWork: 1,
      ['userInfo.info.startWorkDate']: null
    })
    this.getSave({ startWorkDate: '' }, true)
  },

  back() {
    wx.navigateBack()
  },
  closeShow() {
    this.setData({ show: false })
  },
  openIdentity() {
    this.setData({ selectIdentityShow: true })
  },
  closeIdentity() {
    this.setData({ selectIdentityShow: false })
  },
  // 切换身份
  showPickerDate(e) {
    this.getSave({ startWorkDate: e.detail.value }, true)
  },
  // 处理有几年工作时间
  calculateYearsOfWorkExperience(startDateStr) {
    // 将给定的日期字符串转换为Date对象
    const startDate = new Date(startDateStr + '-01'); // 添加'-01'来代表每个月的第一天，假设我们从月初开始计算
    const currentDate = new Date();
    // 计算两个日期之间的年份差
    const differenceInMS = currentDate - startDate;
    const years = Math.floor(differenceInMS / (1000 * 60 * 60 * 24 * 365.25)); // 考虑到不是每年都是365天（闰年）
    return years;
  }
})