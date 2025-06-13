import { apiResumeProjectExperienceSave, apiResumeProjectExperience, apiResumeProjectExperienceRemove } from '../../../http/user'
import { showToast } from '../../../utils/util'
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;
Page({
  data: {
    dataInfo: {},
    multiIndex: '', // 在职开始时间索引
    multiIndex1: '', // 在职结束时间索引
    multiArray: [], // 在职开始时间
    multiArray1: [], // 在职结束时间
    months: [], // 月份
    years: [] // 年 最小为1990年
  },
  //获取详情
  apiResumeProjectExperience() {
    apiResumeProjectExperience({ id: this.data.dataInfo.id }).then(res => {
      if (res.code == 200) {
        console.log(res.data, '项目详情')
        this.setData({
          dataInfo: res.data
        })
      }
    })
  },
  //删除
  del() {
    apiResumeProjectExperienceRemove({ id: this.data.dataInfo.id }).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        wx.navigateBack()
      }
    })
  },
  //保存
  setProjectExperience() {
    let param = this.data.dataInfo
    console.log(param)
    // return
    if (!param.name) {
      showToast('请填写项目名称')
      return
    }
    if (!param.role) {
      showToast('请填写担任角色')
      return
    }
    if (!param.startTime || !param.endTime) {
      showToast('请选择项目时间')
      return
    }
    if (!param.details) {
      showToast('请填写项目描述')
      return
    }
    let flag = false
    if (this.data.dataInfo.endThisDay == 1) {
      this.setData({
        ['dataInfo.endTime']: '至今',
      })
      flag = true
    } else {
      flag = this.compareAndReturnTimeRange(this.data.dataInfo.startTime, this.data.dataInfo.endTime)
    }
    console.log(flag, '状态')
    console.log(param,'参数')
    if (!flag) return
    if (this.data.dataInfo.endThisDay == 1) param.endTime = null
    apiResumeProjectExperienceSave(param).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })
        wx.navigateBack()
      } else[
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      ]
    })
  },
  goOtherPage(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type
    let val = e.currentTarget.dataset.val
    if (!val) {
      val = ''
    }
    let url = `/subpackPage/user/${type}/${type}?val=${val}`
    wx.navigateTo({
      url: url
    })
  },


  setProject(name, param) {
    console.log(name, param)
    this.setData({
      [name]: param
    })
  },
  // 在职时间选择(点击确定)
  bindMultiPickerChange(event) {
    console.log(event, '99999')
    let { type } = event.currentTarget.dataset
    let { value } = event.detail // 拿到当前选择的数组
    let currentTime = this.dispTime(value, type)
    // 开始时间
    if (type == 'start') {
      this.setData({
        ['dataInfo.startTime']: `${currentTime.currentYeas}/${currentTime.currentMonths}`
      })
    } else { // 离职时间
      let endThisDay = 0
      if (currentTime.currentYeas == "至今") {
        endThisDay = 1
        this.setData({
          ['dataInfo.endTime']: '至今',
          ['dataInfo.endThisDay']: endThisDay
        })
      } else {
        this.setData({
          ['dataInfo.endTime']: `${currentTime.currentYeas}/${currentTime.currentMonths}`,
          ['dataInfo.endThisDay']: endThisDay
        })
      }
    }
  },

  // 处理时间
  dispTime(value, type) {
    let currentYeas = ''
    let currentMonths = ''
    if (type == 'start') {
      currentYeas = this.data.multiArray[0][value[0]].replace('年', '')
      currentMonths = this.data.multiArray[1][value[1]].replace('月', '')
      console.log(currentYeas, currentMonths)
    } else {
      currentYeas = this.data.multiArray1[0][value[0]].replace('年', '')
      currentMonths = this.data.multiArray1[1][value[1]].replace('月', '')
    }
    return { currentYeas, currentMonths }
  },
  // 开始时间
  bindMultiPickerColumnChange(event) {
    if (event.detail.column == 0) {
      if (parseInt(this.data.multiArray[0][event.detail.value].replace('年', '')) < currentYear) {
        this.setData({ ['multiArray[1]']: this.data.yearMonths })
      } else {
        this.setData({
          ['multiArray[1]']: this.data.months
        })
      }
    }
  },
  // 结束时间
  bindMultiPickerColumnChange1(event) {
    console.log(event, '离职')
    if (event.detail.column == 0) {
      console.log(this.data.multiArray1[0][event.detail.value], '离职111')
      if (this.data.multiArray1[0][event.detail.value] !== '至今' && parseInt(this.data.multiArray1[0][event.detail.value].replace('年', '')) == currentYear) {
        this.setData({
          ['multiArray1[1]']: this.data.months
        })
      } else if (parseInt(this.data.multiArray1[0][event.detail.value].replace('年', '')) < currentYear) {
        this.setData({ ['multiArray1[1]']: this.data.yearMonths })
      } else {
        this.setData({
          ['multiArray1[1]']: ['']
        })
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let years = [];
    let months = [];
    let yearMonths = [];
    for (let i = currentYear; i >= 1990; i--) {
      let unit = '年'
      years.push(i.toString() + unit);
    }
    for (let i = currentMonth; i >= 1; i--) {
      months.push(i.toString() + '月');
    }
    // 整年月份
    for (let i = 12; i >= 1; i--) {
      yearMonths.push(i.toString() + '月');
    }
    console.log(currentMonth, months, yearMonths, '3333333')
    this.setData({
      months: months,
      years: years,
      yearMonths: yearMonths,
      multiArray: [years, months],
      multiArray1: [['至今', ...years], ['']]
    })
    if (options.type == 'add') {
      wx.setNavigationBarTitle({
        title: '添加项目经历',
      })
    } else {
      this.setData({
        ['dataInfo.id']: options.id
      })
      wx.setNavigationBarTitle({
        title: '修改项目经历',
      })
      this.apiResumeProjectExperience()
    }
  },
  // 比较两个时间字符串
  compareAndReturnTimeRange(startTimeStr, endTimeStr) {
    let flag = false
    // 解析时间字符串为年份和月份数组
    const parseTime = (str) => str.split('/').map(Number);
    const startTimeParts = parseTime(startTimeStr);
    const endTimeParts = parseTime(endTimeStr);
    // 创建一个便于比较的对象结构
    const startTimeObj = { year: startTimeParts[0], month: startTimeParts[1] };
    const endTimeObj = { year: endTimeParts[0], month: endTimeParts[1] };
    // 比较年份和月份
    if (startTimeObj.year < endTimeObj.year ||
      (startTimeObj.year === endTimeObj.year && startTimeObj.month < endTimeObj.month || startTimeObj.month === endTimeObj.month)) {
      console.log('可能相同，或者开始时间比结束时间小')
      flag = true
      return flag
    } else {
      console.log('进入')
      showToast('起始时间不能大于结束时间')
      flag = false
      return flag
    }
  },
})