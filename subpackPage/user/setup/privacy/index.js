// subpackPage/user/setup/privacy/index.js
// import {getUserContactMeWay,setUserContactMeWay} from '../../../../http/versions'
import {showToast} from '../../../../utils/util'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.globalData.baseImgUrl,
    // 联系方式列表
    contactWay: [
      {
        text: '电话',
        selectIndex: 1,
      },
      {
        text: '在线',
        selectIndex: 2
      },
      {
        text: '电话+在线',
        selectIndex: 3
      }
    ]
  },
  //电话助手授权
  goAccredit(){
    wx.navigateTo({
      url: '/subpackPage/user/setPhone/setPhone',
    })
  },
  //屏蔽公司
  goToShield() {
    wx.navigateTo({
      url: '../shield/index',
    })
  },
  goToBoss() {
    wx.navigateTo({
      url: '../boss/index',
    })
  },
  // 联系方式选中
  async itemSelect(event) {
    let { selectindex } = event.currentTarget.dataset
    const res = await setUserContactMeWay({status: selectindex})
    console.log(res)
    if(res.code !== 200) return showToast(res.msg)
    showToast('修改成功')
    this.setData({ selectIndex: selectindex })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //this.getContactMeWay()
  },

  // 获取联系我的方式
  async getContactMeWay(){
    const res = await getUserContactMeWay()
    console.log(res,'00000')
    if(res.code != 200) return showToast(res.msg)
    this.setData({selectIndex: res.data})
  },
  // 设置联系我的方式
  async setContactMeWay(){
    const res = await setUserContactMeWay()
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