import { getInitPerfectJobExpectation, savePerfectJobExpectation, getUserContactMeWay } from '../../../http/versions'
import { showToast } from '../../../utils/util'
import { getUserInfo } from '../../../http/user'
var app = getApp()
import {
  ossUpload
} from '../../../miniprogram-6/utils/oss.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    postListName: '', // 求职期望
    baseImageUrl: app.globalData.baseImgUrl,
    globalBottom: app.globalData.globalBottom,
    // 数据都是根据当前机型进行计算，这样的方式兼容大部分机器
    globalData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
    },
    imageUrl: app.globalData.baseImgUrl,
    show: false,
    showAvatar: false,
    radio: '', // 选择的平台头像
    birsthday: '', // 选择出生年月
    workingYears: [], // 工作年限
    showXz: false,
    list: [{ value: '面议', label: '面议', children: [''] }],
    selectedValues: [0, 0], // 默认选中的值
    middle: false,
    wagesIndex: 0,
    wagesIndex2: 0,
    multiArray: [
      [],
    ],
    sexArr: [{ code: 0, name: '男' }, { code: 1, name: '女' }],
    selectIndex: null,
    isShowContact: false
  },
  // 期望薪资弹窗
  selectedMoney() {
    this.setData({ showXz: true })
  },
  openSet() {
    this.setData({ isShowSex: true })
  },
  // 添加求职期望
  addPost() {
    let that = this
    wx.navigateTo({
      url: `/subpackPage/versions/classicsPostType/classicsPostType?postList=${JSON.stringify(this.data.postList)}`,
      events: {
        changePostList: function (data) {
          // that.newUserInfo()
          that.setData({
            postListName: data.map(item => item.postName).join("/"),
            postList: data,
            ['userInfo.exs']: data
          })
        }
      }
    })
  },

  //弹出层显示(头像)
  avatarTap() {
    this.setData({ show: true })
  },
  //上传图片(从手机相册选择)
  uploadImage() {
    this.setData({ show: false })
    let userId = this.data.userInfo.userId
    var that = this
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: async (res) => {
        console.log(res)
        // console.log(userId, '9999')
        const result = await ossUpload(res.tempFiles[0].tempFilePath, 'image', userId, 1)
        let imgStr = `userInfo.avatar`
        that.setData({
          [imgStr]: result.full
        })
      }
    })
  },
  //上传图片(拍照)
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
        let imgStr = `userInfo.avatar`
        that.setData({
          [imgStr]: result.full
        })
        console.log(result, '照片')
      }
    })
  },
  //平台头像（选择平台头像）
  goToAvatar() {
    let that = this
    wx.navigateTo({
      url: `/subpackPage/user/avatar/avatar?type=${1}`,
      events: {
        updataUserInfoAvatar: (url) => {
          let imgStr = `userInfo.avatar`
          that.setData({
            [imgStr]: url,
          })
        }
      }
    })
    this.setData({ show: false })
  },
  // 怎么联系你
  changeContact() {
    this.setData({ isShowContact: true })
  },
  //性别
  bindSexChange(e) {
    // console.log(e, '000:::::::::::::::')
    this.setData({
      // isShowSex: false,
      ['userInfo.sex']: Number(e.currentTarget.dataset.value)
    })
  },
  bindSexSave() {
    this.setData({
      isShowSex: false
    })
  },
  // 获取联系我的方式
  async getContactMeWay() {
    const res = await getUserContactMeWay()
    console.log(res, '00000')
    if (res.code != 200) return showToast(res.msg)
    this.setData({ selectIndex: res.data })
  },
  // 出生日期
  bindBirsdayChange: function (e) {
    console.log(e, '999')
    let _birthday = `userInfo.birthday`
    if (new Date().getFullYear() - e.detail.value.substr(0, 4) < 16) {
      showToast('年龄必须大于16岁')
      return
    }
    if (new Date().getFullYear() - e.detail.value.substr(0, 4) > 100) {
      showToast('年龄必须小于100岁')
      return
    }
    this.setData({
      [_birthday]: e.detail.value
    })
  },

  // 学历
  bindMultiPickerChange(e) {
    let index = e.detail.value[0]
    this.setData({
      ['userInfo.maxBackground']: index + 1
    })
  },
  confirmValue(event) {
    if (event.detail.value.length == 15) {
      showToast('名称格式超出限制')
    }
    this.setData({
      ['userInfo.nickName']: event.detail.value
    })
  },
  // 工作经历
  goOtherPage(e) {
    let type = e.currentTarget.dataset.type
    let val = e.currentTarget.dataset.val || ''
    wx.navigateTo({
      url: `/subpackPage/user/${type}/${type}?val=` + val
    })
  },
  // 编辑
  setContent(content) {
    this.setData({
      ['userInfo.workedJob']: content
    })
  },

  // 选择工作年限
  bindPickerChange(event) {
    let workYear = Number(event.detail.value)
    this.setData({
      ['userInfo.workDay']: workYear
    })
  },
  // 去逛逛
  async gotoChat() {
    const res = await this.saveData()
    if (res) {
      wx.reLaunch({
        url: '/subpackPage/versions/index/index',
      })
    }
  },
  async saveData() {
    let flag = false
    const params = { ...this.data.userInfo }
    console.log(params, '9999999')
    if (params.lowestMoney == '面议') {
      params.lowestMoney = 0
    }
    console.log(params, '0000')
    if (!params.avatar) return showToast('请选择头像')
    if (!params.nickName) return showToast('请输入名称')
    if (params.sex == null || params.sex < 0) return showToast('请选择性别')
    if (!params.birthday) return showToast('请选择出生日期')
    if (params.workDay == null || params.workDay < 0) return showToast('请选择工作年限')
    if (!params.maxBackground) return showToast('请选择学历')
    // 接口
    const res = await savePerfectJobExpectation(params)
    console.log(res, '9999')
    if (res.code == 200) {
      flag = true
    }
    return flag
  },
  // 完善更多
  async gotoUserInfo() {
    // this.saveData()
    // wx.navigateTo({
    //   url: `/subpackPage/user/resume/resume`,
    // })

    const res = await this.saveData()
    if (res) {
      wx.navigateTo({
        url: `/subpackPage/user/resume/resume`,
      })
    }
  },

  //弹出层隐藏
  onClose() {
    this.setData({ show: false, showAvatar: false, radio: '', showXz: false, isShowContact: false })
  },
  onjobClose() {
    this.setData({ isShowContact: false })
    this.getContactMeWay()
  },

  // 选择月薪
  changeData(e) {
    console.log(e, '选择')
    const selectedValues = e.detail.value;
    this.setData({
      middle: true,
      selectedValues: selectedValues
    });
    if (e.detail.value[0] == 0) {
      this.setData({
        middle: false,
      });
    }
    // wx.setStorageSync('selectedValues', selectedValues);
    const yindex = e.detail.value[0] || 0,
      mindex = e.detail.value[2] || 0;
    console.log(yindex, mindex, '999')
    this.setData({
      wagesIndex: yindex,
      wagesIndex2: mindex,
      // list1: _list1,
      selArr: e.detail.value,
    })
  },
  // 选择月薪确定
  confirm() {
    let _lowestMoney = `userInfo.lowestMoney`
    let _maximumMoney = `userInfo.maximumMoney`
    let _expectedMoneyStatus = `userInfo.expectedMoneyStatus`
    let _low = '面议'
    let _max = '面议'
    let _status = 1
    _max = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].value || 0
    _low = this.data.list[this.data.wagesIndex].value
    _status = this.data.list[this.data.wagesIndex].value == '面议' ? 0 : 1
    this.setData({
      showXz: false,
      [_lowestMoney]: _low,
      [_maximumMoney]: _max,
      [_expectedMoneyStatus]: _status
    })
  },
  // 获取用户信息
  newUserInfo() {
    getInitPerfectJobExpectation().then(result => {
      console.log(result, '用户信息111')
      if (result.code == 200) {
        this.setData({
          postListName: result.data.exs.map(item => item.name).join("/"),
          postList: result.data.exs.map(item => {
            return { ...item, postName: item.name }
          }),
          userInfo: result.data,
        })
        if (result.data.exs.length > 0) {
          let _lowestMoney = `userInfo.lowestMoney`
          let _maximumMoney = `userInfo.maximumMoney`
          let _expectedMoneyStatus = `userInfo.expectedMoneyStatus`
          this.setData({
            [_lowestMoney]: result.data.exs[0].lowestMoney,
            [_maximumMoney]: result.data.exs[0].maximumMoney,
            [_expectedMoneyStatus]: result.data.exs[0].expectedMoneyStatus
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const _userInfo = wx.getStorageSync('userInfo').info
    const _globalData = { ...this.data.globalData }
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    _globalData.navBarHeight = systemInfo.statusBarHeight + 44;
    _globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
    _globalData.menuTop = menuButtonInfo.top;
    _globalData.menuHeight = menuButtonInfo.height;
    this.getSalary()
    let years = ['暂无工作经验'];
    for (let i = 1; i <= 20; i++) {
      let unit = '年'
      years.push(i.toString() + unit);
    }
    this.newUserInfo()
    this.getContactMeWay()
    this.setData({
      globalData: _globalData,
      workingYears: years,
      userInfo: _userInfo,
      ['multiArray[0]']: wx.getStorageSync('dictionary')[6].map(item => {
        return item.name
      })
    })
  },
  getInfo() {
    wx.removeStorageSync('userInfo')
    getUserInfo().then(result => {
      // console.log(result, '用户信息')
      if (result.code == 200) {
        this.setData({
          ['userInfo.nickName']: result.data.info.nickName
        })
        wx.setStorageSync('userInfo', result.data)
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getInfo()
  },
  getSalary() {
    let _list = this.data.list
    const less30 = new Array(29).fill(1).map((e, i) => {
      const num = i + 1;
      const value = i + 1;
      const label = num >= 10 ? `${Math.floor(num / 10)}.${num % 10}万` : `${num}千`;
      return {
        value,
        label,
        children: [],
      };
    });
    const less100 = new Array(14).fill(1).map((e, i) => {
      const num = i * 5 + 30;
      const value = i * 5 + 30;
      const label = num >= 10 ? `${Math.floor(num / 10)}.${num % 10}万` : `${num}千`;
      return {
        value,
        label,
        children: [],
      };
    });

    const less160 = new Array(7).fill(1).map((e, i) => {
      const num = i * 10 + 100;
      const value = i * 10 + 100;
      const label = num >= 10 ? `${Math.floor(num / 10)}.${num % 10}万` : `${num}千`;
      return {
        value,
        label,
        children: [],
      };
    });
    const listA = [..._list, ...less30, ...less100, ...less160];

    listA.map(e => {
      if (e.value < 10) {
        for (let j = e.value; j < e.value + 5; j++) {
          e.children.push({
            value: j + 1,
            // label: `${j + 1}K`,
            label: j + 1 >= 10 ? `${Math.floor((j + 1) / 10)}.${(j + 1) % 10}万` : `${(j + 1)}千`
          })
        }
      } else {
        for (let j = e.value; j < e.value * 2; j++) {
          if (e.value < 40 && (j + 1) % 2 == 0) {
            const value = e.value % 2 == 0 ? j + 1 : j + 2;
            e.children.push({
              value,
              // label: `${value}K`,
              label: value >= 10 ? `${Math.floor(value / 10)}.${value % 10}万` : `${value}千`
            })
          } else if (e.value >= 40 && e.value < 80 && (j + 1) % 5 == 0) {
            e.children.push({
              value: j + 1,
              // label: `${j + 1}K`,
              label: j + 1 >= 10 ? `${Math.floor((j + 1) / 10)}.${(j + 1) % 10}万` : `${(j + 1)}千`
            })
          } else if (e.value >= 80 && e.value <= 160 && (j + 1) % 10 == 0) {
            e.children.push({
              value: j + 1,
              // label: `${j + 1}K`,
              label: j + 1 >= 10 ? `${Math.floor((j + 1) / 10)}.${(j + 1) % 10}万` : `${(j + 1)}千`
            })
          }
        }
      }
    })
    this.setData({
      list: listA,
    })
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
})