// subpackPage/index/appUpload/index.js
const app = getApp();
import {
  resumeFileList,
  apiResumeSave,
  apiUpLoadFileFn,
} from "../../../http/api";
import { showToast } from "../../../utils/util";
import { getUserInfo } from "../../../http/login";
import { ossUpload } from "../../../miniprogram-6/utils/oss.js";
Page({
  // 返回首页
  gotoHome() {
    let versions = wx.getStorageSync("versions");
    if (versions) {
      if (versions == 1) {
        wx.reLaunch({
          url: "/pages/index/index",
        });
      } else {
        wx.reLaunch({
          url: "/subpackPage/versions/index/index",
        });
      }
    } else {
      wx.reLaunch({
        url: "/pages/index/index",
      });
    }
  },
  uploadBefore(event) {
    if (!this.data.isAccordance) {
      if (this.data.status == 2) {
        wx.showModal({
          title: "当前知城优聘账号不一致",
          cancelText: "关闭",
          confirmText: "知道了",
          content:
            "您的知城优聘账号不一致，您可以登录知城优聘App进行切换，再尝试上传简历",
          success: function (res) {
            if (res.confirm) {
              //这里是点击了确定以后
              console.log("用户点击确定");
            } else if (res.cancel) {
              //这里是点击了取消以后
              console.log("用户点击取消");
            }
          },
        });
      } else if (this.data.status == 3) {
      }
    } else {
      console.log(event, "ssss");
      if (this.data.list.length >= 3) {
        showToast("最多保存3份简历附件");
        return;
      }
      const { file } = event.detail;
      var fileSize = file.size / (1024 * 1024);
      if (fileSize > 20) {
        showToast("附件简历请不要超过20MB");
        return;
      }
      let fileName = file.name.split(".");
      let ending = fileName[fileName.length - 1];
      let userId = wx.getStorageSync("userInfo").info.userId;
      // || ending == 'docx'
      if (file.type == "file" && ending == "pdf") {
        ossUpload(file.url, "file", userId).then((res) => {
          const form = {
            fileName: file.name,
            type: 0,
            url: res.full,
            size: file.size,
          };
          this.getResumeSave(form);
        });
      } else {
        wx.showToast({
          title: "请选择pdf文件",
          icon: "none",
          duration: 3000,
        });
      }
    }
  },
  async getResumeSave(form) {
    const { code, data, msg } = await apiResumeSave(form);
    if (code == 200) {
      showToast("保存成功");
      setTimeout(() => {
        wx.reLaunch({
          url: `/subpackPage/user/resumeAnnex/resumeAnnex?flag=${1}`,
        });
      }, 2000);
    } else {
      showToast(msg);
    }
  },
  // 获取简历列表
  getList() {
    resumeFileList({ type: 0 }).then((res) => {
      if (res.code == 200) {
        this.setData({
          list: res.data,
        });
      }
    });
  },
  //监听轮播图的下标
  monitorCurrent: function (e) {
    let current = e.detail.current;
    this.setData({
      current: current,
    });
  },
  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    baseImageUrl: app.globalData.baseImgUrl,
    list: [],
    current: 0, // 当前展示的图片
    backgroundArr: [0, 1, 2, 3],
    autoplay: false,
    baseUrl: "https://imgcdn.guochuanyoupin.com/",
    isAccordance: false, // 账号是否一致
    status: 0, // 状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options, "传递的参数");
    let wxToken = wx.getStorageSync("token");
    let appToken = options.appToken;
    let appUserId = options.appUserId;
    // wx.setStorageSync('app', options)
    // wx.login({
    //   success: (res) => {
    //     let code = res.code;
    //     let me = this;
    //     let params = {
    //       code: code, // wx登录的code
    //       appToken: appToken || '3734d131-013b-4998-ba3d-05f6ac2b06c4',
    //       wxToken: wxToken ? wxToken : "",
    //     };
    //     console.log(params, "接口参数");
    //     apiUpLoadFileFn(params).then((res) => {
    //       console.log(res, "111111111111111");
    //       me.unloginFun(res);
    //     });
    //   },
    // });
  },

  unloginFun(result) {
    this.setData({
      status: result.data.status,
    });
    if (result.code !== 200) return;
    if (result.data.status == 3) {
      // 空号
      wx.showModal({
        title: "当前知城优聘账号未注册",
        cancelText: "关闭",
        content:
          "您的知城优聘账号未注册，您可以登录知城优聘App进行注册，再尝试上传简历",
        success: function (res) {
          if (res.confirm) {
            //这里是点击了确定以后
            console.log("用户点击确定");
          } else if (res.cancel) {
            //这里是点击了取消以后
            console.log("用户点击取消");
          }
        },
      });
    } else if (result.data.status == 2) {
      // 账号不一致
      wx.showModal({
        title: "当前知城优聘账号不一致",
        cancelText: "关闭",
        content:
          "您的知城优聘账号不一致，您可以登录知城优聘App进行切换，再尝试上传简历",
        success: function (res) {
          if (res.confirm) {
            //这里是点击了确定以后
            console.log("用户点击确定");
          } else if (res.cancel) {
            //这里是点击了取消以后
            console.log("用户点击取消");
          }
        },
      });
      this.setData({ isAccordance: false });
    } else {
      let wxToken = wx.getStorageSync("token");
      if (wxToken) {
        if (result.data.needLogin == 1) {
          wx.setStorageSync("token", result.data.token);
          getUserInfo().then((userInfo) => {
            console.log(userInfo, "获取用户信息");
            if (userInfo.code == 200) {
              wx.hideLoading();
              wx.setStorageSync("userInfo", userInfo.data);
              // let { appToken, appUserId } = wx.getStorageSync('app')
              // wx.redirectTo({
              //     url: `/subpackPage/index/appUpload/index?appUserId=${appUserId}&appToken=${appToken}`,
              // })
              // 请求当前登录账号的简历列表
              this.getList();
              this.setData({ isAccordance: true });
            } else {
              showToast(userInfo.msg);
              this.setData({ isAccordance: false });
            }
          });
        } else {
          // 请求当前登录账号的简历列表
          this.getList();
          this.setData({ isAccordance: true });
        }
      } else {
        if (result.data.needLogin == 1) {
          wx.setStorageSync("token", result.data.token);
          getUserInfo().then((userInfo) => {
            console.log(userInfo, "获取用户信息");
            if (userInfo.code == 200) {
              wx.hideLoading();
              wx.setStorageSync("userInfo", userInfo.data);
              // 请求当前登录账号的简历列表
              this.getList();
              this.setData({ isAccordance: true });
            } else {
              showToast(userInfo.msg);
              this.setData({ isAccordance: false });
            }
          });
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //开启轮播图
    this.setData({
      autoplay: true,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    //开启轮播图
    this.setData({
      autoplay: false,
    });
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    //开启轮播图
    this.setData({
      autoplay: false,
    });
  },
});
