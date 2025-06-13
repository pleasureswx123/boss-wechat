import { showToast } from '../../../../utils/util'
import { getList, greeting, setGreeting, deleteCostomGreet } from '../../../../http/user'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    checked: false,
    greeting: 1,
    contentText: '',
    userId: null,
    imageUrl: app.globalData.baseImgUrl,
    active: 0,
    isBackGoto: false,
    popShow: false,
    selecetdId: '', // 选中的id(删除和编辑按钮使用)
    isEditId: '', // 是否是编辑后的id
  },

  //开关状态
  chenge() {
    this.setData({ checked: !this.data.checked })
    if (!this.data.checked) {
      this.keepHandelTap()
    }
  },

  //设置打招呼语
  keepHandelTap() {
    let param = {
      userId: this.data.userId,
      greetingsId: this.data.greeting,
      useGreetings: this.data.checked ? 1 : 0
    }
    const code = setGreeting(param).then(res => {
      if (res.code == 200) {
        showToast('设置成功')
        setTimeout(() => {
          wx.navigateBack()
        }, 500)
      }
    })
  },

  //平台语切换
  switchGreen(e) {
    let greetId = e.detail || e
    var param = this.data.list.find(item => {
      return item.id == greetId
    })
    this.setData({
      greeting: Number(greetId),
      contentText: param.content,
    })
  },
  // 修改状态
  change(event) {
    let { index } = event.currentTarget.dataset
    this.setData({
      active: index
    })
    this.getListGreet()
  },
  // 自定义添加打招呼语
  gotoCustomkeepHandel(param) {
    let that = this
    let type = this.data.active
    let { content, id } = param
    wx.navigateTo({
      url: `/subpackPage/user/setup/costom/index?content=${content}&id=${id}&type=${type}`,
      events: {
        changeActive: function (data) {
          console.log(data)
          that.setData({
            active: data.type,
            isBackGoto: true,
            isEditId: data.id
          })
          that.getListGreet()
        }
      }
    })
  },

  // 获取推荐语列表
  getListGreet() {
    let params = {
      type: this.data.active
    }
    //获取打招呼列表
    getList(params).then((res) => {
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      this.setData({ list: res.data })
      var param = this.data.list.find(item => {
        return item.id == this.data.greeting
      })
      console.log(param, 'ssssss')
      if (param) {
        this.setData({ contentText: param.content })
      }
      if (this.data.isBackGoto) {
        let id = this.data.isEditId ? this.data.isEditId : res.data[0].id
        console.log(id, '9999')
        this.switchGreen(id)
        this.setData({
          isBackGoto: false
        })
      }
    })
  },
  // 删除打招呼语
  deleteFn(event) {
    let { id } = event.currentTarget.dataset
    this.setData({
      popShow: true,
      selecetdId: id
    })
  },
  // 编辑打招呼语
  editFn(event) {
    let { id } = event.currentTarget.dataset
    var param = this.data.list.find(item => {
      return item.id == id
    })
    this.gotoCustomkeepHandel(param)
  },
  // 确定删除
  async identifyHandle() {
    const res = await deleteCostomGreet(this.data.selecetdId)
    console.log(res, '000')
    if (res.code !== 200) return showToast('删除失败,请重试')
    this.getListGreet()
    this.setData({
      popShow: false
    })
  },

  // 弹窗取消
  cloneShow() {
    this.setData({
      popShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({ userId: wx.getStorageSync('userInfo').info.userId })

    //查看当前打招呼语信息
    greeting(this.data.userId).then(res => {
      console.log(res, '999')
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      this.setData({ greeting: res.data.greetingsId, active: res.data.greetingsType })
      this.setData({ checked: res.data.useGreetings == 1 ? true : false })
      this.getListGreet()
    })
  }
})