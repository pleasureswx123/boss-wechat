// components/screenCondition/screenCondition.js
var app = getApp()
import { apiListByHome, apiIndustry, apiDictionary } from '../../http/index'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: Number || String,
      value: 0
    },
    //求职类型
    jobType: {
      type: Number || String,
      value: 0
    },
    pageType: {
      type: String,
      value: 'all'
    },
    show: {
      type: Boolean,
      value: {},
      observer: function (newVal) {
        if (newVal) {
          // this.setScreenArr()
        }
      }
    },
    isSave: {
      type: Boolean,
      value: false,
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 筛选条件对象
    textData: [], // 期望薪资
    industryList: [{ name: '不限', isActive: true, code: null }], // 行业
    sufferList: [], // 经验
    scaleList: [], // 公司规模
    financingList: [], // 融资
    educationList: [], // 学历
    natureList: [], // 企业性质
    typeList: [], // 招聘类型
    jsList: [],//结算方式,
    clearing: [], // 兼职薪资
    // 筛选条件
    screen: {
      textData: null, // 期望薪资
      industryList: [], // 行业/领域
      sufferList: null, // 经验
      scaleList: null, // 公司规模
      financingList: null, // 融资
      educationList: null, // 学历
      natureList: null, // 企业性质
      jsList: null //结算方式
    },
    baseImageUrl: app.globalData.baseImgUrl,
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    top: app.globalData.navBarHeight + app.globalData.statusBarHeight,
    form: {}, // 筛选接口需要的字段
    windowHeight: '',
    windowWidth: '',
    baseInfo: {},
    number: 0
  },
  lifetimes: {
    async attached() {
      let that = this
      that.getIndustry()
      // 获取屏幕高度
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            windowWidth: res.windowWidth
          })
        }
      })
      await this.getDictionary() // 获取字典数据
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //初始化选中状态
    setScreenArr() {
      console.log(this.data.isSave, '9999999')
      if (this.data.isSave) return this.reset()
      if (wx.getStorageSync('screenArr')) {
        this.setData({
          screen: wx.getStorageSync('screenArr')
        })
        const keys = Object.keys(wx.getStorageSync('screenArr'));
        keys.map(item => {
          if (wx.getStorageSync('screenArr')[item] && wx.getStorageSync('screenArr')[item].code)
            this.radio(1, item, wx.getStorageSync('screenArr')[item].code)
        })
      } else {
        this.reset()
      }
    },
    setSel(newVal) {
      const screenTrue = newVal.find((e, i) => {
        return e.isActive == true
      })
      return screenTrue
    },
    // 查看更多(选择行业)
    seeIndustry(event) {
      let that = this
      let { type } = event.currentTarget.dataset
      let ids = Object.values(this.data.screen.industryList).map(value => value.code);
      wx.navigateTo({
        url: `/subpackPage/user/desireIndustry/desireIndustry?type=${type}&id=${ids}`,
        events: {
          selectTags: function (data) {
            setTimeout(() => {
              that.setData({
                industryList: [...[{ name: '不限', isActive: false, code: null }], ...data.selectTags, ...that.data.tmpIndustryList.splice(1, 5 - data.selectTags.length)],
                [`screen.industryList`]: data.selectTags
              })
            }, 100)
          }
        }
      })
    },
    // 单选事件
    radio(event, name, code) {
      // 切换高亮展示
      if (event != 1) {
        var { code, distinctionname, item } = event.currentTarget.dataset
      } else {
        var distinctionname = name
        var code = code
      }
      let _num = this.data.number
      const updatedList = this.data[distinctionname].map((item, index) => {
        if (item.code === code) {
          if (item.code > 0 && !item.isActive) {
            _num++
          }
          item.isActive = true;
        } else {
          if (item.code > 0 && item.isActive) {
            _num--
          }
          item.isActive = false;
        }
        return item;
      });
      this.setData({
        [distinctionname]: updatedList,
        number: _num
      });
      this.addScreen(this.setSel(updatedList), distinctionname)
    },
    // 多选事件
    multiple(event) {
      // 接收参数
      let { code, distinctionname, item } = event.currentTarget.dataset
      // 如果点击的是不限
      // 清空已选择的,清楚高亮并恢复原状
      if (item.code == null) {
        const noRestrict = this.data[distinctionname].map((item, index) => {
          item.isActive = false
          return item;
        });
        noRestrict[0].isActive = true
        this.setData({
          [distinctionname]: noRestrict
        });
        this.addScreen([], distinctionname)
        return
      } else {
        // 如果点击的不是不限
        const screenTrue = this.data[distinctionname].filter((e, i) => {
          return e.isActive == true
        })
        // 使用排他效果实现点击的按钮高亮
        const updatedList = this.data[distinctionname].map((item, index) => {
          if (item.code == code) {
            if (item.isActive) {
              item.isActive = false;
            } else {
              if (screenTrue.length > 2) {
                wx.showToast({
                  title: '行业只能选择3个',
                  icon: "none"
                })
              } else {
                item.isActive = true;
              }
            }
            // 并将行业数据的不限高亮清除
            let obj = this.data[distinctionname].find((e, i) => {
              return e.code == null
            })
            obj.isActive = false
          }
          return item;
        });
        // 看选中的行业是否超过3个,超过三个则提示,并不可在选
        // 否则更新数据并追加
        this.setData({
          [distinctionname]: updatedList
        });
        const screenTrue1 = this.data[distinctionname].filter((e, i) => {
          return e.isActive == true
        })
        this.addScreen(screenTrue1, distinctionname)
      }
    },
    // 追加选中的筛选条件
    addScreen(obj, distinctionname) {
      if (distinctionname == 'industryList') {
        let updatedDataA = {}
        updatedDataA[`screen.${distinctionname}`] = obj
        this.setData(updatedDataA)
        return
      } else {
        const updatedData = {};
        updatedData[`screen.${distinctionname}`] = obj
        this.setData(updatedData)
      }
    },
    // 重置事件
    reset() {
      // 重置筛选数据
      for (let key in this.data.screen) {
        let updatedScreen = this.data[key].map(e => {
          e.isActive = false
          let obj = this.data[key].find((e, i) => {
            return i == 0
          })
          obj.isActive = true
          return e
        })
        this.setData({
          [key]: updatedScreen,
          number: 0
        });
      }
      // // 重置筛选对象数据
      let screen = {
        textData: null, // 期望薪资
        industryList: [], // 行业/领域
        sufferList: null, // 经验
        scaleList: null, // 公司规模
        financingList: null, // 融资
        educationList: null, // 学历
        natureList: null, // 企业性质
        jsList: null //结算方式  
      }
      this.setData({
        screen,
        number: 0
      })
    },
    // 筛选确定事件
    async comfirmScreening() {
      // wx.setStorageSync('screenArr', this.data.screen)
      let money, lowestMoney, maximumMoney
      console.log(this.data.screen)
      if (this.data.screen.textData?.name == '不限' || !this.data.screen.textData) {
        lowestMoney = null
        maximumMoney = null
      } else if (Math.floor(Number(this.data.screen.textData?.realStart)) && !Math.floor(Number(this.data.screen.textData?.realEnd))) {
        lowestMoney = 50
        maximumMoney = null
      } else {
        lowestMoney = Math.floor(Number(this.data.screen.textData?.realStart))
        maximumMoney = Math.floor(Number(this.data.screen.textData?.realEnd))
      }
      let industryData = []
      this.data.screen.industryList.forEach(item => {
        industryData.push(item.code)
      })
      let form = {
        lowestMoney,
        maximumMoney,
        background: this.data.screen.educationList ? this.data.screen.educationList.code : null, // 学历
        financeStage: this.data.screen.financingList ? this.data.screen.financingList.code : null, //融资情况
        industryList: industryData[0] == '不限' ? [] : industryData, // 行业
        scale: this.data.screen.scaleList ? this.data.screen.scaleList.code : null, // 公司规模
        startWorkDate: this.data.screen.sufferList ? this.data.screen.sufferList.code : null, // 经验
        settlementMethod: this.data.screen.jsList ? this.data.screen.jsList.code : null, // 结算方式
        enterpriseNature: this.data.screen.natureList ? this.data.screen.natureList.code : null // 企业性质
      }
      // console.log(form,'0000')
      this.triggerEvent('screenEvent', form)
      this.triggerEvent('screenNum', this.data.number + industryData.length)
    },
    // 关闭弹窗
    close() {
      this.triggerEvent('onClose')
    },
    // 获取行业信息
    async getIndustry() {
      const { code, data, msg } = await apiIndustry()
      if (code !== 200) {
        wx.showToast({
          title: msg,
          icon: "none"
        })
        return
      }
      let arr = data.map(item => {
        return {
          ...item,
          isActive: false
        }
      })
      let industryList = [...this.data.industryList, ...arr.slice(6, 11)]
      this.setData({
        tmpIndustryList: arr,
        industryList
      })
    },
    // 字典数据
    getDictionary() {
      let resultData = {}
      if (wx.getStorageSync('dictionary')) {
        resultData = wx.getStorageSync('dictionary')
        this.setDataGs(resultData)
      } else {
        let ids = ''
        ids = '1,2,3,4,5,6,34,38,39,33,40,46,48,60,80'//38企业性质
        apiDictionary(ids).then(result => {
          wx.setStorageSync('dictionary', result.data)
          resultData = result.data
          this.setDataGs(resultData)
        })
      }
    },
    setDataGs(resultData) {
      resultData[6].unshift({ name: '不限' })
      resultData[46].unshift({ name: '不限' })
      this.setData({
        sufferList: this.mapData(resultData[33]),
        textData: this.mapData(resultData[3]),
        scaleList: this.mapData(resultData[5]),
        financingList: this.mapData(resultData[4]),
        educationList: this.mapData(resultData[6]),
        natureList: this.mapData(resultData[38]),
        typeList: this.mapData(resultData[39]),
        jsList: this.mapData(resultData[46]),
        clearing: this.mapData(resultData[48]), // 结算方式
      })
    },
    // 处理筛选数据的函数
    mapData(data) {
      let add = data.map(item => {
        let isActive = false
        if (item.name == '不限') {
          isActive = true
        } else {
          isActive = false
        }
        return {
          ...item,
          isActive: isActive
        }
      })
      return add
    },
  },
})
