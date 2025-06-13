// subpackPage/user/recordStage1/index.js
import { getAccountWalletInfo, getDouRecordList } from '../../../http/recordApi.js'
import NumberAnimate from '../../../utils/NumberAnimate'
import {showToast} from '../../../utils/util'
var app = getApp()
let currentYear = new Date().getFullYear(); // 获取当前年份
let currentMonth = new Date().getMonth() + 1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
    // '全部', '已充值', '已消费'
    tagsList: [
      { name: '全部', type: 0 },
      { name: '已充值', type: 4 },
      { name: '已消费', type: 1 }
    ],
    tagActive: 0,
    monthShow: false,
    wagesIndex: 0,
    wagesIndex2: 0,
    wagesIndex3: 0,
    selectedValues: [0, 0, 0],
    yearMonthValues: [0, 0, 0], // 按照月份选择时间的pickerValue
    startDateValues: [0, 0, 0], // 开始时间选择的pickerValue
    EndDateValues: [0, 0, 0], // 结束时间选择的pickerValue
    monthPopupTitleActive: 0,
    customTimeActive: 0, // 切换自定义时间
    selectStartDate: '', // 选择的开始日期
    selectEndDate: '', // 选择的结束时期
    copySelectStartDate: '', // 选择的开始日期
    copySelectEndDate: '', // 选择的结束时期
    tagType: 0, // 列表type
    walletInfo: {}, // 钱包详情
    initYear: '', // 初始化年
    initMonth: '', // 初始化月份
    dateStart: '', // 筛选区间使用
    dateEnd: '', // 筛选区间使用
    recordList: [], // 展示列表
    showTextType: 0, // 头部以什么形式展示选择的筛选数据
  },
  // 账单详情
  gotoDetail(event) {
    console.log(event, '9999')
    let { detailid } = event.currentTarget.dataset
    wx.navigateTo({
      url: `/subpackPage/user/recordStageDetail/index?id=${detailid}`,
    })
  },
  // 弹窗修改当前展示结构
  changeTag(event) {
    let { index } = event.currentTarget.dataset
    let _currentTag = this.data.tagsList[index]
    this.setData({ tagActive: index, tagType: _currentTag.type })
    this.douRecordList()
  },
  openMonthPopup() {
    if(this.data.monthPopupTitleActive == 1){
      this.setData({
        // selectedValues
        customTimeActive: 0
      })
    }
    this.setData({ monthShow: true })
  },
  // 选择时间方法
  changeData(event) {
    let { value } = event.detail
    console.log(value, '77777')
    let _wagesIndex = this.data.wagesIndex
    let _wagesIndex2 = this.data.wagesIndex2
    let _wagesIndex3 = this.data.wagesIndex3
    this.setData({
      wagesIndex: value[0],
      wagesIndex2: value[1],
      wagesIndex3: value[2] || 0
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
    // 按照月份筛选
    if (this.data.monthPopupTitleActive == 0) {
      if (_wagesIndex !== value[0]) {
        this.setData({
          yearMonthValues: [value[0], 0],
          wagesIndex2: 0
        })
      }
      if (_wagesIndex2 !== value[1]) {
        this.setData({
          yearMonthValues: [value[0], value[1], 0],
          wagesIndex3: 0
        })
      }
      if (_wagesIndex3 !== value[2]) {
        this.setData({
          yearMonthValues: [...value],
        })
      }
    } else if (this.data.monthPopupTitleActive == 1) { // 自定义
      // 自定义开始时间
      if (this.data.customTimeActive == 0) {
        let year = this.data.list[this.data.wagesIndex].label.replace('年', '')
        let month = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].label.replace('月', '')
        let day = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].children[this.data.wagesIndex3].label.replace('日', '')
        if (_wagesIndex !== value[0]) {
          this.setData({
            startDateValues: [this.data.wagesIndex, 0, 0],
            wagesIndex2: 0
          })
        }
        if (_wagesIndex2 !== value[1]) {
          this.setData({
            startDateValues: [this.data.wagesIndex, this.data.wagesIndex2, 0],
            wagesIndex3: 0
          })
        }
        if (_wagesIndex3 !== value[2]) {
          this.setData({
            // startDateValues: [...value],
            startDateValues: [this.data.wagesIndex, this.data.wagesIndex2, this.data.wagesIndex3]
          })
        }
        this.setData({ selectStartDate: year + '/' + month + '/' + day })
      } else if (this.data.customTimeActive == 1) { // 自定义结束时间
        let year = this.data.list[this.data.wagesIndex].label.replace('年', '')
        let month = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].label.replace('月', '')
        let day = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].children[this.data.wagesIndex3].label.replace('日', '')
        if (_wagesIndex !== value[0]) {
          this.setData({
            EndDateValues: [this.data.wagesIndex, 0, 0],
            wagesIndex2: 0
          })
        }
        if (_wagesIndex2 !== value[1]) {
          this.setData({
            EndDateValues: [this.data.wagesIndex, this.data.wagesIndex2, 0],
            wagesIndex3: 0
          })
        }
        if (_wagesIndex3 !== value[2]) {
          this.setData({
            // EndDateValues: [...value],
            EndDateValues: [this.data.wagesIndex, this.data.wagesIndex2, this.data.wagesIndex3]
          })
        }
        this.setData({ selectEndDate: year + '/' + month + '/' + day })
      }
    }

  },
  // 确定筛选时间
  confirm() {
    let year = null
    let month = null
    let day = null
    // 按照月份筛选
    if (this.data.monthPopupTitleActive == 0) {
      year = this.data.list[this.data.wagesIndex].label.replace('年', '')
      month = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].label.replace('月', '')
      console.log(year, month, '0000')
      this.setData({
        initYear: year,
        initMonth: month
      })
      // 请求接口,关闭弹窗
      this.douRecordList()
      this.setData({ monthShow: false,showTextType: 1 })
    } else if (this.data.monthPopupTitleActive == 1) { // 按照年月日筛选
      let _selectStartDate = this.data.selectStartDate
      let _selectEndDate = this.data.selectEndDate
      let _startDateValues = this.data.startDateValues
      let _EndDateValues = this.data.EndDateValues
      if (!_selectEndDate) {
        this.setData({ customTimeActive: 1 })
      } else {
        year = this.data.list[this.data.wagesIndex].label
        month = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].label
        day = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].children[this.data.wagesIndex3].label
        // console.log(_selectStartDate, _selectEndDate)
        // 需要加判断
        let time = this.compareAndReturnTimeRange(_selectStartDate,_selectEndDate)
        console.log(time,'11111')
        console.log(_startDateValues,_EndDateValues)
        if(Object.prototype.toString.call(time) == '[object String]'){
          this.setData({
            showTextType: 3,
            dateStart: time, // 筛选区间使用
            dateEnd: time, // 筛选区间使用
            copySelectStartDate: time
          })
        } else if(Object.prototype.toString.call(time) == '[object Object]'){
          this.setData({
            dateStart: time.startTime, // 筛选区间使用
            dateEnd: time.endTime, // 筛选区间使用
            selectStartDate: time.startTime,
            selectEndDate: time.endTime,
            copySelectStartDate: time.startTime,
            copySelectEndDate: time.endTime,
            showTextType: 2
          })
        }
        this.setData({
          initYear: '',
          initMonth: ''
        })
        this.douRecordList()
        this.setData({ monthShow: false})
      }
    }
  },
  // 取消(关闭弹窗)
  closeMonthPopup() {
    this.setData({
      monthShow: false, // 关闭弹窗
      // yearMonthValues: [0, 0, 0], // 初始化月份时间
      // selectedValues: [0, 0, 0], //重新初始化开始时间
      // startDateValues: [0, 0, 0], // 重新初始化开始时间
      // EndDateValues: [0, 0, 0],// 重新初始化开始时间
      // wagesIndex: 0,
      // wagesIndex2: 0,
      // wagesIndex3: 0,
      // monthPopupTitleActive: 0,
      // selectStartDate: '',
      // selectEndDate: ''
    })
  },
  // 开始时间和结束时间切换
  changeCustomTime(event) {
    let { index } = event.currentTarget.dataset
    // console.log(this.data.startDateValues, '开始', this.data.EndDateValues, '结束')
    this.setData({ customTimeActive: index })
    if (this.data.customTimeActive == 0) {
      let _startDateValues = this.data.startDateValues
      this.setData({
        wagesIndex: _startDateValues[0],
        wagesIndex2: _startDateValues[1],
        wagesIndex3: _startDateValues[2] || 0,
        selectedValues: _startDateValues
      })
      this.setData({ selectedValues: this.data.startDateValues })
      let year = this.data.list[_startDateValues[0]].label.replace('年', '')
      let month = this.data.list[_startDateValues[0]].children[_startDateValues[1]].label.replace('月', '')
      let day = this.data.list[_startDateValues[0]].children[_startDateValues[1]].children[_startDateValues[2]].label.replace('日', '')
      this.setData({ selectStartDate: year + '/' + month + '/' + day })
    } else if (this.data.customTimeActive == 1) {
      this.setData({ selectedValues: this.data.EndDateValues })
      this.setData({
        wagesIndex: this.data.EndDateValues[0],
        wagesIndex2: this.data.EndDateValues[1],
        wagesIndex3: this.data.EndDateValues[2] || 0
      })
      let year = this.data.list[this.data.wagesIndex].label.replace('年', '')
      let month = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].label.replace('月', '')
      let day = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].children[this.data.wagesIndex3].label.replace('日', '')
      this.setData({ selectEndDate: year + '/' + month + '/' + day })
    }
  },
  // 切换tab
  changeTab(event) {
    let { index } = event.currentTarget.dataset
    this.setData({ monthPopupTitleActive: index, customTimeActive: 0 })
    if (index == 1) {
      this.setData({
        selectedValues: this.data.startDateValues,
        wagesIndex: this.data.startDateValues[0],
        wagesIndex2: this.data.startDateValues[1],
        wagesIndex3: this.data.startDateValues[2] || 0
      })
      let year = this.data.list[this.data.wagesIndex].label.replace('年', '')
      let month = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].label.replace('月', '')
      let day = this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].children[this.data.wagesIndex3].label.replace('日', '')
      this.setData({ selectStartDate: year + '/' + month + '/' + day })
    } else if (index == 0) {
      let _yearMonthValues = this.data.yearMonthValues
      this.setData({
        wagesIndex: _yearMonthValues[0],
        wagesIndex2: _yearMonthValues[1],
        wagesIndex3: _yearMonthValues[2],
        // selectStartDate: '',
        // selectEndDate: '',
      })
      this.setData({
        selectedValues: this.data.yearMonthValues
      })
      // 如果切换到按月份，不管开始时间和结束时间有没有填写，都给清空
      // this.setData({
      //   selectStartDate: '',
      //   selectEndDate: '',
      //   wagesIndex: 0,
      //   wagesIndex2: 0,
      //   wagesIndex3: 0,
      //   selectedValues: [0, 0, 0], //重新初始化开始时间
      //   startDateValues: [0, 0, 0], // 重新初始化开始时间
      //   EndDateValues: [0, 0, 0],// 重新初始化开始时间
      // })
    }
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
  // 获取钱包明细
  async accountWalletInfo() {
    const res = await getAccountWalletInfo()
    console.log(res, '钱包详情')
    if (res.code !== 200) return
    this.setData({
      walletInfo: res.data
    })
    this.animate()
  },
  // 获取明细列表
  async douRecordList() {
    let params = {
      type: this.data.tagType,
      year: this.data.initYear,
      month: this.data.initMonth,
    }
    if (this.data.dateStart) {
      params.start = this.data.dateStart
    }
    if (this.data.dateEnd) {
      params.end = this.data.dateEnd
    }
    const res = await getDouRecordList(params)
    console.log(res, '列表数据')
    if (res.code !== 200) return
    this.setData({
      recordList: res.data
    })
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
    this.accountWalletInfo()
    this.douRecordList()
    // console.log(this.getDaysInMonth(2023,4),11111111)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

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
    console.log(list, '99999sdskh')
  },
  // 比较两个时间字符串
  compareAndReturnTimeRange(startTimeStr, endTimeStr) {
    let _startDateValues = this.data.startDateValues
    let _EndDateValues = this.data.EndDateValues
    // 将时间字符串转换为Date对象
    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);
    // 比较两个日期的时间
    if (startTime < endTime) {
      return { 
        startTime: startTimeStr,
        endTime: endTimeStr
      };
    } else if (startTime > endTime) {
      this.setData({
        EndDateValues: _startDateValues,
        startDateValues: _EndDateValues
      })
      return { 
        startTime: endTimeStr,
        endTime: startTimeStr
      };
    } else {
      console.log('开始时间和结束时间相同，无法确定时间范围')
      return startTimeStr
      // throw new Error('开始时间和结束时间相同，无法确定时间范围');
    }
  },


  // 数字动画
  animate() {
    let n1 = new NumberAnimate({
      from: Number(this.data.walletInfo.balance),
      speed: 3000,
      refreshTime: 30,
      decimals: 1,
      onUpdate: () => {
        // this.setData({
        //   balance: n1.tempValue
        // });
        this.setData({
          ['walletInfo.balance'] : n1.tempValue
        })
      },
      onComplete: () => { }
    });
  },
})