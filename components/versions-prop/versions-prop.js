// components/versions-prop/versions-prop.js
var app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(newVal,oldVal){
        if(newVal){
          setTimeout(() => {
            this.animateItemsSequentially();
            this.animateItemsSequentially_right();
          }, 300);
        }
      }
    },
    showCurrent: {
      type: Boolean,
      value: false
    },
    mustChoice: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    checked: 0,
    baseImageUrl: app.globalData.baseImgUrl,
    globalBottom: app.globalData.globalBottom,
    versions: 1,
    changeVersionsValue: 1, // 切换使用
    autoplay: false,
    current: 0, // 当前展示的图片
    capsuleData: {
      navBarHeight: 0, // 导航栏高度
      menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
      menuTop: 0, // 胶囊距顶部间距
      menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
      menuWidth: 0, // 胶囊宽度
    },
    screenHeight: 0,
    animationData: [], // 用于存储每个 item 的动画数据
    animationData_right: [], // 用于存储每个 item 的动画数据
  },
  lifetimes: {
    attached() {
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
        screenHeight: systemInfo.screenHeight
      })
      let versions = wx.getStorageSync('versions')
      if (versions) {
        this.setData({
          versions: versions,
          changeVersionsValue: versions
        })
      }
    },
    ready(){
      console.log(123456)
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //监听轮播图的下标
    monitorCurrent: function (e) {
      let current = e.detail.current;
      this.setData({
        current: current
      })
    },
    changeOutName(event) {
      let { index } = event.currentTarget.dataset
      // this.setData({
      //   current: 0
      // })
      if (index == 1) {
        this.setData({
          show: false
        })
        //if (!this.data.showCurrent) {
        wx.reLaunch({
          url: '/subpackPage/versions/index/index',
        })
        //}
      } else {
        wx.reLaunch({
          url: `/pages/index/index`,
        })
      }
      this.setData({
        versions: index == 1 ? 2 : 1,
      })
      wx.setStorageSync('versions', index == 1 ? 2 : 1) // 存储当前选择的版本(1为至臻版 / 2为经典版)
    },
    // 预览图片
    previewImg(event) {
      var currentUrl = event.currentTarget.dataset.id; // 获取当前点击的图片链接
      var currentType = event.currentTarget.dataset.type;
      if (this.data.versions == currentType) {
        var urls = [currentUrl]; // 需要预览的图片链接列表
        wx.previewImage({
          current: currentUrl, // 当前显示图片的链接
          urls: urls // 需要预览的图片链接列表
        });
      } else {
        if (this.data.versions == 1) {
          this.setData({
            versions: 2
          })
        } else {
          this.setData({
            versions: 1
          })
        }
      }
    },
    onClose() {
      if (this.data.mustChoice) return
      if (!this.data.checked && !wx.getStorageSync('versions')) {
        wx.showToast({
          title: '请先选择版本',
          icon: 'none'
        })
        return
      }
      this.setData({
        show: false,
        current: 0
      })
    },
    // 切换版本
    changeVersions(event) {
      let { index } = event.currentTarget.dataset
      this.setData({
        changeVersionsValue: index
      })
    },
    // 确定使用
    // confirmVersions() {
    //   this.setData({
    //     show: false,
    //     versions: this.data.changeVersionsValue == 1 ? 2 : 1,
    //   })
    //   if (this.data.changeVersionsValue == 1) {
    //     wx.reLaunch({
    //       url: '/subpackPage/versions/index/index',
    //     })
    //   } else {
    //     wx.reLaunch({
    //       url: `/pages/index/index`,
    //     })
    //   }
    //   wx.setStorageSync('versions', this.data.changeVersionsValue == 1 ? 2 : 1) // 存储当前选择的版本(1为至臻版 / 2为经典版)
    //   // 切换版本时清除本地金秋活动弹窗
    //   // 防止进入其他版本不弹窗
    //   wx.removeStorageSync('isActivityPopUpShow_JQ')
    // },

    confirmVersions(event) {
      let { versions } = event.currentTarget.dataset
      this.setData({
        show: false,
        versions: versions
      })
      if (versions == 2) {
        wx.reLaunch({
          url: '/subpackPage/versions/index/index',
        })
      } else {
        wx.reLaunch({
          url: `/pages/index/index`,
        })
      }
      wx.setStorageSync('versions', versions) // 存储当前选择的版本(1为至臻版 / 2为经典版)
      // 切换版本时清除本地金秋活动弹窗
      // 防止进入其他版本不弹窗
      wx.removeStorageSync('isActivityPopUpShow_JQ')
    },
    // 至臻版
    animateItemsSequentially() {
      const itemsCount = 4; // 假设有 3 个 item
      let currentIndex = 0;
      const animateNextItem = () => {
        if (currentIndex >= itemsCount) return; // 所有动画完成后退出

        const animation = wx.createAnimation({
          duration: 500, // 动画时长
          timingFunction: 'ease',
        });
        animation.opacity(1).translateX(0).step();

        this.setData({
          [`animationData[${currentIndex}]`]: animation.export()
        });

        currentIndex++;
        setTimeout(animateNextItem, 300); // 当前动画结束后触发下一个动画
      };

      animateNextItem(); // 开始第一个动画
    },
    // 经典版
    animateItemsSequentially_right() {
      const itemsCount = 3; // 假设有 3 个 item
      let currentIndex = 0;
      const animateNextItem = () => {
        if (currentIndex >= itemsCount) return; // 所有动画完成后退出

        const animation = wx.createAnimation({
          duration: 500, // 动画时长
          timingFunction: 'ease',
        });
        animation.opacity(1).translateX(0).step();

        this.setData({
          [`animationData_right[${currentIndex}]`]: animation.export()
        });

        currentIndex++;
        setTimeout(animateNextItem, 300); // 当前动画结束后触发下一个动画
      };

      animateNextItem(); // 开始第一个动画
    }
  }
})