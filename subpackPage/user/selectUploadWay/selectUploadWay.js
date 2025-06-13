// subpackPage/user/selectUploadWay/selectUploadWay.js
import { httpUrl, resumeFileList, apiResumeSave, apiResumeRemove } from '../../../http/api'
import { showToast } from '../../../utils/util'
import {
  ossUpload
} from '../../../miniprogram-6/utils/oss.js'
const app = getApp();
import {getAllTag,cancelRedis} from '../../../http/versions'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    wayList: [
      { imageUrl: '/my/wayWxUpload.png', title: '微信上传', tips: '微信文件传输助手' },
      { imageUrl: '/my/wayResume.png', title: '微信上传', tips: '微信文件传输助手' }
    ],
    newNoticeTagObj: {
      attachmentResumeTransfer: 0
    }
  },
  uploadBefore(event) {
    const { file } = event.detail
    console.log(file, '上传')
    wx.showLoading({
      title: '上传中',
    })
    var fileSize = file.size / (1024 * 1024);
    if (fileSize > 20) {
      showToast('附件简历请不要超过20MB')
      return
    }
    let fileName = file.name.split('.')
    let ending = fileName[fileName.length - 1]
    let userId = wx.getStorageSync('userInfo').info.userId
    //  || ending == 'doc' || ending == 'docx'
    if (file.type == "file" && (ending == 'pdf' || ending == 'PDF')) {
      ossUpload(file.url, 'file', userId).then(res => {
        const form = {
          fileName: file.name,
          type: 0,
          url: res.shot,
          size: file.size
        }
        this.getResumeSave(form)
      })
    } else {
      wx.showToast({
        title: '请选择pdf文件',
        icon: 'none',
        duration: 3000
      })
      wx.hideLoading()
    }
  },

  async getResumeSave(form) {
    const { code, data, msg } = await apiResumeSave(form)
    if(code !== 200)return showToast(msg)
    showToast('添加成功')
    wx.hideLoading()
    wx.navigateBack()
  },
  // 跳转到简历模版列表页面
  gotoTemplateList(e){
    let myWallet = e.currentTarget.dataset.mywallet
    let _isValue = this.data.newNoticeTagObj[myWallet]
    this.setData({ myWallet })
    let that = this
    wx.navigateTo({
      url: `/subpackPage/user/createResume/createResume`,
      success: (res) => {
        if (_isValue) {
          that.cancelTag()
        }
      }
    })
  },
  // 获取更新红点
  async newNoticeTag() {
    const res = await getAllTag(this.data.wayType)
    console.log(res,'红点附件简历')
    if (res.code !== 200) return
    this.setData({
      newNoticeTagObj: {
        attachmentResumeTransfer: 0
      }
    })
    let _newNoticeTagObj = this.data.newNoticeTagObj
    for (let key in _newNoticeTagObj) {
      if (res.data[key]) {
        _newNoticeTagObj[key] = res.data[key]
      }
    }
    this.setData({
      newNoticeTagObj: _newNoticeTagObj
    })
  },

  // 取消tag红点
  async cancelTag() {
    const res = await cancelRedis(this.data.myWallet)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.wayType && options.wayType !== 'null' && options.wayType !== 'undefined') {
      this.setData({
        wayType: options.wayType
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.newNoticeTag()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('uploadList');
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