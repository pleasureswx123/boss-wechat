
import { setWorkExperience, getJobExpectation, apiResumeWorkExperienceRemove } from '../../../http/user'
import { showToast } from '../../../utils/util'
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth() + 1;

Page({
  data: {
    dataInfo: {
      businessId: null,
      businessName: null,
      corporationId: null, //公司id
      corporationName: null,
      department: null,
      id: null,
      internship: 0,
      postId: null,
      postName: null,
      //"resumeId": "",
      shieldCorporation: 1, //是否对这家公司隐藏
      tag: null,
      thenEndTime: null,
      thenStartTime: null,
      endThisDay: null,
      wokeDetails: null,
      wokePerformance: null,
    },
    multiIndex: '', // 在职开始时间索引
    multiIndex1: '', // 在职结束时间索引
    multiArray: [], // 在职开始时间
    multiArray1: [], // 在职结束时间
    months: [], // 月份
    years: [], // 年 最小为1990年
    yearMonths: [], // 整年月份
    isShowChecked: true
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
        ['dataInfo.thenStartTime']: `${currentTime.currentYeas}/${currentTime.currentMonths}`
      })
    } else { // 离职时间
      let endThisDay = 0
      if (currentTime.currentYeas == "至今") {
        endThisDay = 1
        this.setData({
          ['dataInfo.thenEndTime']: '至今',
          ['dataInfo.endThisDay']: endThisDay
        })
      } else {
        this.setData({
          ['dataInfo.thenEndTime']: `${currentTime.currentYeas}/${currentTime.currentMonths}`,
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
  // 在职
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
  // 离职时间
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
  //工作经历保存
  setWorkExperience() {
    // let thenEndTime = this.data.dataInfo.thenEndTime.split('/')
    // let thenStartTime = this.data.dataInfo.thenStartTime.split('/')
    let param = this.data.dataInfo
    console.log(param)
    param.shieldCorporation = this.data.isShowChecked ? 1 : 0
    if (!param.corporationName) {
      showToast('请填写公司名称')
      return
    }
    if (!param.postName) {
      showToast('请填写职位名称')
      return
    }
    if (!param.businessName) {
      showToast('请选择公司行业')
      return
    }
    if (!param.thenStartTime || !param.thenEndTime) {
      showToast('请选择在职时间')
      return
    }
    if (!param.wokeDetails) {
      showToast('请填写工作内容')
      return
    }
    let flag = false
    if (this.data.dataInfo.endThisDay == 1) { // 结束时间为至今
      this.setData({
        ['dataInfo.thenEndTime']: '至今',
        // ['dataInfo.thenStartTime']: `${thenStartTime[0]}-${thenStartTime[1]}`
      })
      flag = true
    } else {
      // this.setData({
      //     ['dataInfo.thenEndTime']: `${thenEndTime[0]}-${thenEndTime[1]}`,
      //     ['dataInfo.thenStartTime']: `${thenStartTime[0]}-${thenStartTime[1]}`
      // })
      console.log(this.data.dataInfo.thenStartTime, this.data.dataInfo.thenEndTime)
      flag = this.compareAndReturnTimeRange(this.data.dataInfo.thenStartTime, this.data.dataInfo.thenEndTime)
    }
    console.log(flag, '状态')
    if (!flag) return
    if (this.data.dataInfo.endThisDay == 1) param.thenEndTime = null
    setWorkExperience(param).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '修改成功',
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
  // 比较两个时间字符串
  compareAndReturnTimeRange(startTimeStr, endTimeStr) {
    let flag = false
    // const startTime = new Date(startTimeStr);
    // const endTime = new Date(endTimeStr);
    // if (startTime < endTime) {
    //   console.log('开始时间小于结束时间')
    //   flag = true
    // } else if (startTime > endTime) {
    //   showToast('起始时间不能大于结束时间')
    //   flag = false
    // } else if (startTime == endTime) {
    //   console.log('开始时间等于结束时间')
    //   flag = true
    // }
    // return flag
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

  //公司名称
  setCompany(param) {
    console.log(param)
    this.setData({
      ['dataInfo.corporationName']: param
    })
  },
  //职位选择
  selectedPost(param) {
    console.log(param)
    this.setData({
      ['dataInfo.postName']: param.name,
      ['dataInfo.postId']: param.code
    })
  },
  //开始时间
  changeStart(e) {
    if (new Date(e.detail.date).getTime() > new Date().getTime()) {
      showToast('开始时间填写错误')
      return
    }
    if (this.data.dataInfo.thenEndTime && (new Date(e.detail.date).getTime() > new Date(this.data.dataInfo.thenEndTime).getTime())) {
      showToast('离职时间不能小于在职时间')
      return
    }
    this.setData({
      ['dataInfo.thenStartTime']: e.detail.date
    })
  },
  //结束时间
  changeEnd(e) {
    let endThisDay = 0
    if (new Date(e.detail.date).getTime() < new Date(this.data.dataInfo.thenStartTime).getTime()) {
      showToast('离职时间不能小于在职时间')
      return
    }
    if (e.detail.date == "至今") {
      endThisDay = 1
    }
    this.setData({
      ['dataInfo.thenEndTime']: e.detail.date,
      ['dataInfo.endThisDay']: endThisDay
    })
  },
  //行业选择
  selectedHy(param) {
    console.log(param)
    this.setData({
      ['dataInfo.businessId']: param[0].id,
      ['dataInfo.businessName']: param[0].name
    })
  },
  //选择技能
  selectedJN(param) {
    console.log(param)
    let arr = []
    param.map(item => {
      arr.push(item.name)
    })
    this.setData({
      ['dataInfo.tag']: arr.join(',')
    })
  },
  //工作内容
  setContent(param) {
    this.setData({
      ['dataInfo.wokeDetails']: param
    })
  },
  //工作业绩
  setWokePerformance(param) {
    this.setData({
      ['dataInfo.wokePerformance']: param
    })
  },
  //部门
  input(e) {
    this.setData({
      ['dataInfo.department']: e.detail.value
    })
  },
  //是否隐藏信息
  onChange({ detail }) {
    // 需要手动对 checked 状态进行更新
    // this.setData({
    //     ['dataInfo.shieldCorporation']: detail
    // });
    this.setData({
      isShowChecked: detail
    })
  },

  goOtherPage(e) {
    console.log(e);
    let type = e.currentTarget.dataset.type
    let val = e.currentTarget.dataset.val || ''
    let id = e.currentTarget.dataset.id || ''
    let selecdSkill = e.currentTarget.dataset.skill || ''
    let url = `/subpackPage/user/${type}/${type}?val=` + val
    let _num = 6
    if (type == 'desireIndustry') {
      if (val == 'jineng') {
        if (!this.data.dataInfo.postId) {
          wx.showToast({
            title: '请先选择职位',
            icon: 'none'
          })
          return
        }
      }
      if (val == 'hangye') {
        _num = 1
      }
      url = `/subpackPage/user/${type}/${type}?num=` + _num + `&val=` + val + `&id=` + id + `&postId=` + this.data.dataInfo.postId + `&skilllist=` + selecdSkill
    }
    wx.navigateTo({
      url: url,
    })
  },
  //获取详情
  getJobExpectation() {
    getJobExpectation({ id: this.data.dataInfo.id }).then(res => {
      console.log(res.data, '详情')
      if (res.code == 200) {
        if (res.data.endThisDay == 1) {
          res.data.thenEndTime = '至今'
        }
        this.setData({
          dataInfo: res.data,
          isShowChecked: res.data.shieldCorporation == 1 ? true : false
        })
      }
    })
  },
  //删除
  del() {
    apiResumeWorkExperienceRemove({ id: this.data.dataInfo.id }).then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'none'
        })
        wx.navigateBack()
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.type == 'add') {
      wx.setNavigationBarTitle({
        title: '添加工作经历',
      })
    } else {
      this.setData({
        ['dataInfo.id']: options.id
      })
      wx.setNavigationBarTitle({
        title: '修改工作经历',
      })
      this.getJobExpectation()
    }
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
    this.setData({
      months: months,
      yearMonths: yearMonths,
      years: years,
      multiArray: [years, months],
      multiArray1: [['至今', ...years], ['']]
    })
  },
})