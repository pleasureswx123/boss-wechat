// subpackPage/user/wantedDetail/wantedDetail.js
var app = getApp()
let currentYear = new Date().getFullYear(); // 获取当前年份
let currentMonth = new Date().getMonth() + 1;
import { getWithdrawalList } from '../../../http/api'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    wantedDetailList: [], // 红包提现列表
    monthShow: false, // 筛选年份
    list: [], // 
    wagesIndex: 0,
    wagesIndex2: 0,
    year: currentYear,
    month: currentMonth,
    showTextType: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      // initYear: currentYear,
      initMonth: currentMonth
    })
    this.onloadFn()
    this.getWithdrawalListFn()
  },


  // 获取红包提现记录
  async getWithdrawalListFn() {
    let params = {
      pageNum: 1,
      pageSize: 999,
      year: this.data.year,
      month: this.data.month
    }
    const res = await getWithdrawalList(params)
    if (res.code !== 200) return
    this.setData({
      wantedDetailList: res.data.records.map(item=>{
        return {
          ...item,
          timeWithoutYear: item.createTime.substring(item.createTime.indexOf('-') + 1)
        }
      })
    })
  },


  openMonthPopup() {
    this.setData({ monthShow: true })
  },

  // 取消(关闭弹窗)
  closeMonthPopup() {
    this.setData({
      monthShow: false, // 关闭弹窗
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  // 页面一加载触发事件
  onloadFn() {
    let months = [];
    let yearMonths = [];
    for (let i = currentMonth; i >= 1; i--) {
      let days = this.getDaysInMonth(currentYear, i)
      months.push({
        label: i.toString() + '月',
        children: days
      })
    }
    // 整年月份
    for (let i = 12; i >= 1; i--) {
      yearMonths.push({
        label: i.toString() + '月',
        value: i,
        children: []
      })
    }
    let list = []
    let index = 0
    for (let i = currentYear; i >= 1990; i--) {
      let unit = '年'

      if (i == currentYear) {
        list.push({
          label: i.toString() + unit,
          children: months,
          index: index++
        })
      } else {
        for (let k = 1; k <= 12; k++) {
          // console.log(yearMonths[k - 1], 111)
          let days = this.getDaysInMonth1(i, yearMonths[k - 1].value)
          yearMonths[k - 1].children = days
        }
        list.push({
          label: i.toString() + unit,
          children: yearMonths,
          index: ++index
        })
      }
    }
    this.setData({
      list: list
    })
  },

  getDaysInMonth(year, month) {
    // 获取当前日期对象
    const today = new Date();
    // 创建一个新的日期对象，设置为传递的年份和月份的第一天
    const startDate = new Date(year, month - 1, 1);
    // 计算与当前日期的差异（以毫秒为单位）
    const diffMs = Math.min(today.getTime(), new Date(year, month, 0).getTime()) - startDate.getTime();
    // 将毫秒转换为天数并返回
    let days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
    let arrDays = []
    // 整年月份
    for (let i = days; i >= 1; i--) {
      arrDays.push({
        label: i.toString() + '日'
      })
    }
    return arrDays;
  },

  // 获取指定年份和月份的总天数
  getDaysInMonth1(year, month) {
    const date = new Date(year, month - 1, 1);
    const daysInMonth = new Date(year, month, 0).getDate();
    let arrDays = []
    // 整年月份
    for (let i = daysInMonth; i >= 1; i--) {
      arrDays.push({
        label: i.toString() + '日'
      })
    }
    return arrDays;
  },

  // 选择时间方法
  changeData(event) {
    let { value } = event.detail
    console.log(value, '77777')
    let _wagesIndex = this.data.wagesIndex
    let _wagesIndex2 = this.data.wagesIndex2
    this.setData({
      wagesIndex: value[0],
      wagesIndex2: value[1],
    })
    if (_wagesIndex !== value[0]) {
      this.setData({
        selectedValues: [this.data.wagesIndex, 0],
        wagesIndex2: 0
      })
    }
    if (_wagesIndex2 !== value[1]) {
      this.setData({
        selectedValues: [this.data.wagesIndex, this.data.wagesIndex2, 0],
        wagesIndex3: 0
      })
    }
  },

  // 确定筛选时间
  confirm() {
    let year = null
    let month = null
    year = this.data.list[this.data.wagesIndex].label.replace('年', '')
    month = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].label.replace('月', '')
    this.setData({
      year: year,
      month: month
    })
    this.getWithdrawalListFn()
    // 请求接口,关闭弹窗
    this.setData({ monthShow: false,showTextType: 1 })
  },
})