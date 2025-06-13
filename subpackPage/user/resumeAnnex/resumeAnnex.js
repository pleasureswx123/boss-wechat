import { httpUrl, resumeFileList, apiResumeSave, apiResumeRemove } from '../../../http/api'
import { showToast } from '../../../utils/util'
import {
  ossUpload
} from '../../../miniprogram-6/utils/oss.js'
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    overlay: false,
    baseUrl: httpUrl(),
    imageUrl: app.globalData.baseImgUrl,
    show: false,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    globalBottom: app.globalData.globalBottom,
    flag: false,
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
  },

  // 预览简历
  previewResume(event) {
    wx.showLoading({
      title: '加载中',
    })
    let { filename, url } = event.currentTarget.dataset
    //打开pdf文件
    // 暂时请勿删除注释代码
    // wx.navigateTo({
    //     url: `/subpackPage/user/preview/index?fileUrl=${url}&fileName=${filename}`,
    // })
    // return
    // 文件后缀名
    let suffix = url.split('.')[url.split('.').length - 1]
    //下载简历
    wx.downloadFile({
      url: url,
      success: function (res) {
        var filePath = res.tempFilePath
        //预览简历
        wx.openDocument({
          filePath: filePath,
          fileType: suffix,
          success: function (res) {
            console.log("打开文档成功")
            console.log(res);
          },
          fail: function (res) {
            console.log("fail");
            console.log(res)
          },
          complete: function (res) {
            console.log("complete");
            console.log(res)
            wx.hideLoading()
          }
        })
      },
      fail: function (res) {
        console.log('fail')
      },
      complete: function (res) {
        console.log('complete')
      }
    })
  },
  cSize(val) {
    if (val)
      if (val < 1024) {
        return val + "B"
      } else if (val < 1024 * 1024) {
        return (val / 1024).toFixed(0) + "KB"
      } else if (val < 1024 * 1024 * 1024) {
        return (val / 1024 / 1024).toFixed(0) + "MB"
      } else {
        return "0B"
      }
  },
  uploadBefore(event) {
    if (this.data.list.length >= 3) {
      showToast('最多支持上传3个简历附件')
      return
    }
    const { file } = event.detail
    console.log(file, '上传')
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
    }
  },
  goResetName() {
    this.setData({
      overlay: false
    })
    const { fileName, extension } = this.separateFileNameAndExtension(this.data.name);
    // let newnName = this.data.name.replace(/\.\w+$/, ''); // 去掉所有类型的文件扩展名
    wx.navigateTo({
      url: `/subpackPage/user/resetName/resetName?id=${this.data.id}&name=${fileName}&extension=${extension}`
    })
  },
  closeOverlay() {
    this.setData({
      overlay: false
    })
  },
  moreOperate(e) {
    let item = e.currentTarget.dataset.item
    this.setData({
      id: item.id,
      name: item.fileName,
      overlay: true
    })
  },
  getList() {
    let that = this
    resumeFileList({ type: 0 }).then(res => {
      if (res.code == 200) {
        res.data.map(item => {
          item.size = that.cSize(item.size)
          item.fileTy = item.fileName.slice(-4)
        })
        this.setData({
          list: res.data
        })
      }
    })
  },
  async getResumeRemove() {
    const { code, msg } = await apiResumeRemove({ id: this.data.id })
    if (code == 200) {
      showToast('删除成功')
      this.setData({
        overlay: false
      })
      this.getList()
    } else {
      showToast(msg)
    }
  },
  async getResumeSave(form) {
    const { code, data, msg } = await apiResumeSave(form)
    if (code == 200) {
      showToast('添加成功')
      this.getList()
    } else {
      showToast(msg)
    }
  },
  // 捕获错误事件
  launchAppError(e) {
    console.log(e.detail.errMsg)
    this.setData({
      show: false
    })
  },
  // 打开app成功
  handleLaunchApp(e) {
    this.setData({
      show: false
    })
  },
  gotoAppUpload() {
    console.log(111)
    wx.navigateTo({
      url: '/subpackPage/index/appUpload/index',
    })
    //   wx.navigateTo({
    //     url: '/subpackPage/user/resetName/resetName?id=' + this.data.id + '&name=' + this.data.name,
    // })
  },
  onShow(options) {
    this.getList()
  },
  onLoad(options) {
    if (options.wayType && options.wayType !== 'null' && options.wayType !== 'undefined') {
      this.setData({
        wayType: options.wayType
      })
    }
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
      capsuleData: _capsuleData
    })
    console.log(options, '返回?')
    if (options.flag == 1) {
      this.setData({
        show: true,
        flag: true
      })
    }

  },
  // 返回首页
  gotoHome() {
    let versions = wx.getStorageSync('versions')
    if (versions) {
      if (versions == 1) {
        wx.reLaunch({
          url: '/pages/index/index',
        })
      } else {
        wx.reLaunch({
          url: '/subpackPage/versions/index/index',
        })
      }
    } else {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  },
  back() {
    wx.navigateBack()
  },

  selectUploadWay() {
    if (this.data.list.length >= 3) return showToast('最多支持上传3个简历附件')
    let that = this
    wx.navigateTo({
      url: `/subpackPage/user/selectUploadWay/selectUploadWay?wayType=${this.data.wayType}`,
      events: {
        uploadList: function (data) {
          that.getList()
        }
      }
    })
  },

  separateFileNameAndExtension(fullFileName) {
    // 从后往前查找第一个.的位置
    const dotIndex = fullFileName.lastIndexOf('.');
    
    // 如果找到了.则认为其前面的是文件名，后面的是扩展名
    if (dotIndex !== -1) {
      const fileName = fullFileName.substring(0, dotIndex);
      const extension = fullFileName.substring(dotIndex + 1);
      return { fileName, extension };
    } else {
      // 没有找到.，则整个字符串都是文件名，没有扩展名
      return { fileName: fullFileName, extension: '' };
    }
  }
  
})