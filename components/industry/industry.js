// subpackPage/user/industry/index.js
import { dictionaryIndustry } from '../../http/api'
var app = getApp()
Component({
    data: {
        industry: [], // 行业数据
        leftIndex: 0,
        valueList: ['safeList', 'salaryList', 'holidayList', 'lifeList'],
        tabIndex: "scroll-0",//右边瞄点项
        nowIndex: 0, //颜色项
        IndustryValue: '', // 搜索字段,
        timefn: null,
        statusBarHeight: app.globalData.statusBarHeight,
        navBarHeight: app.globalData.navBarHeight,
        globalBottom: app.globalData.globalBottom,
        baseImageUrl: app.globalData.baseImgUrl,
        activeKey: 0,
        scrollTop: 0
    },
    lifetimes: {
      ready(){
          let industry = wx.getStorageSync('industry')
          if (!industry) {
              this.getIndustryList()
          } else {
              this.setData({
                  industry
              })
          }
        }
    },
    methods: {
        onClose(){
          this.triggerEvent('onClose')
        },
        // 获取行业信息
        async getIndustryList() {
      const { code, msg, data } = await dictionaryIndustry()
      if (code !== 200) {
          wx.showToast({
              title: msg,
              icon: "none"
          })
          return
      }
      let industry = data.map((item, index) => {
          return {
              ...item,
              tabTitle: this.data.valueList[index],
              select: false
          }
      })
      this.setData({
          industry
      })
      console.log(industry)
      wx.setStorageSync('industry', industry)
        },
        // 切换行业
        cutIndustry(event) {
            let { index } = event.currentTarget.dataset
            this.flag = true // 修复点击分类过快时，会因为滚动条的的滑动，调用scroll触发瞄点
            // 联动右边
            this.setData({ nowIndex: index })
            this.setData({ tabIndex: `scroll-${index}` })
        },
        // 此函数代码请勿删除
        onScroll(e) {
            console.log(e,'8888')
            if (this.flag) {
                this.flag = false
                return
            }
            this.setData({scrollTop: e.detail.scrollTop})
            // 获取每个goodItem到顶部的距离
            // 减去顶部距离其他东西的距离
            // 如果距离小于或等于0则更新index
            // 设置最后更新index
            var index = this.data.nowIndex
            // scroll-view 距离顶部的高度
            var scrollMenuTop = 0
            let query = wx.createSelectorQuery()
            query.selectAll('#scrollMenu').boundingClientRect()
            query.selectAll('.safeList').boundingClientRect()
            query.exec(res => {
                console.log(res);
                scrollMenuTop = res[0][0].top
                res[1].forEach((item, index2) => {
                    // 每个项目距离顶部的高度-scroll-view 距离顶部的高度=每个项目距离scroll-view顶部的高度
                    if (item.top - scrollMenuTop <= 0) {
                        // index = index2
                        // index = Number(item.id.split('-')[1])
                        return
                    }
                });
                
                // 联动左边项
                // this.setData({ nowIndex: index})
                // console.log(this.data.nowIndex,'8888')
            })
        },
        clearFun(){
          this.triggerEvent('onSelected',{industryId:'',name:'筛选'})
        },
        // 热招行业详情
        gotoIndusrtyDetail(event) {
            let { industryid,name } = event.currentTarget.dataset
            // wx.navigateTo({
            //     url: `/subpackPage/user/hotIndustry/index?industryId=${industryid}&name=${name}`,
            // })
            this.triggerEvent('onSelected',{industryId:industryid,name:name})
        },

        // 搜索功能
        input(event) {
            this.setData({
                timefn: this.debounce(() => {
                    this.searchIndustryItem(event.detail)
                }, 500)
            })
            this.data.timefn()
        },

        // 抖动 搜索对应行业
        searchIndustryItem(event) {
            console.log(event, '搜索行业')
            let industryList = this.data.industry.map(e => {
                let select = false
                e.subList.map((item) => {
                    if (event == '') {
                        item.select = true
                        select = true
                        return
                    }
                    if (item.name.indexOf(event) != -1) {
                        item.select = true
                        select = true
                    } else {
                        item.select = false
                    }
                    return item
                })
                e.select = select
                return e
            })
            console.log(industryList)
            this.setData({
                industry: industryList
            })
            let leftIndex = this.data.industry.findIndex(e => e.select)
            console.log(leftIndex,'8888')
            this.setData({ nowIndex: leftIndex })
            this.setData({ tabIndex: `scroll-${leftIndex}` })
        },

        // 清除搜索框内容
        clear() {
            this.setData({
                IndustryValue:'',
                timefn: this.debounce(() => {
                    // 点击清除icon之后证明用户搜索框为空,则直接返回第一分类
                    this.setData({ nowIndex: 0 })
                    this.setData({ tabIndex: `scroll-${0}` })
                },500)
            })
            this.data.timefn()
        },
        debounce(func, delay) {
          let timer = null;
          return function (...args) {
              clearTimeout(timer);
              timer = setTimeout(() => {
                  func.apply(this, args);
              }, delay);
          };
      }
    }
})