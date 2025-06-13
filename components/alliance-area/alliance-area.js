// components/alliance-area/alliance-area.js
var app = getApp()
const allianceImg = 'https://imgcdn.guochuanyoupin.com/resource/back'
const baseImage = 'https://gcjt-car.oss-cn-beijing.aliyuncs.com/resource/wechat'
Component({

  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    token: null,
    baseImage: baseImage,
    operateList: [
      {
        operateTitle: '知城传媒',
        operateTxt: [
          '精准定位 锁定目标受众',
          '电梯广告 引客流 提人气'
        ],
        operateImg: '/images/user/logo_chuanmei.png',
        appId:'wx2dda126d742b02cf',
        backImg: allianceImg + '/alliance_area-media.png'
      },
      {
        operateTitle: '知城享贷',
        operateTxt: [
          '息费透明',
          '高效 透明 专业级别服务'
        ],
        operateImg: '/images/user/zhudai-icon1.png',
        appId: 'wx2ae9ea6075ba643d',
        backImg: allianceImg + '/alliance_area-zhudai.png'
      },
      // {
      //   operateTitle: '知城优聘',
      //   operateTxt: [
      //     '本地找工作 上知城优聘',
      //     '专为本地量身打造平台'
      //   ],
      //   operateImg: '/images/user/youpin-icon1.png',
      //   appId:'wx97de09df94ae4715',
      //   backImg: allianceImg + '/alliance_area-youpin.png'
      // },
      {
        operateTitle: '知城拼车',
        operateTxt: [
          '让温暖 从家门口开始',
          '邻里合乘 绿色新方式'
        ],
        operateImg: '/images/user/car_logo_big.png',
        appId:'wxf99af0456bf96edb',
        backImg: allianceImg + '/alliance_area-car.png'
      },
      {
        operateTitle: '知城联盟',
        operateTxt: [
          '丰厚佣金',
          '开始推广，享受收益'
        ],
        operateImg: '/images/user/lianmeng-icon1.png',
        appId:'wx8b10372ea0c659d0',
        backImg: allianceImg + '/alliance_area-lianmeng.png'
      }
    ],
    swiperConfig: {
      indicatorDots: false,
      vertical: false,
      autoplay: true,
      interval: 2000,
      duration: 500,
      circular: true,
      vertical: true
    }
  },

  lifetimes: {
    attached() {
      let that = this
      if (wx.getStorageSync('token')) {
        that.setData({
          token: wx.getStorageSync('token')
        })
      }
      getApp().watch('token', function () {
        console.log('监听到了token-user')
        that.setData({
          token: getApp().globalData.token
        })
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 跳转页面-按钮区域
  gotoPage(event) {
    console.log('event', event)
    let { url,appid } = event.currentTarget.dataset
    console.log(url, appid)

    if(url){
      wx.navigateTo({
        url
      })
    }else{
      wx.navigateToMiniProgram({
        appId: appid,
        path: '/pages/index/index',
        extraData: {
          foo: 'bar'
        },
        // envVersion: 'release',
        envVersion: 'trial',
        success(res) {
          // 打开成功
          console.log("跳转小程序成功!", res);
        }
      });
    }
    // if (this.data.token) {
      
    // } else {
    //   if (typeof this.getTabBar === 'function' &&
    //     this.getTabBar()) {
    //     this.getTabBar().setData({
    //       loginShow: true
    //     })
    //   }
    // }
  },
  }
})