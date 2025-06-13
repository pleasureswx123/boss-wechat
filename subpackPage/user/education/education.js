import {
  apiResumeEducationDetail,
} from '../../../http/api'
import { educateSub, deletaEducation } from '../../../http/user'
import { showToast } from '../../../utils/util'
let currentYear = new Date().getFullYear(); // 当前年
Page({
  data: {
    checked: true,
    multiArray: [[],[]], // 学历数组
    education: '',
    dataInfo: {},
    type: false,
    isEdit: false,
    multiArray1: [], // 时间
    leftYears: [], // 年 最小为1990年
    rightYears: [], // 
    showBackground: '' , // 最后展示的学历信息
    typeArray: ['全日制', '非全日制']
  },

  //学历设置
  bindMultiPickerChange(e) {
    console.log(e,'wwwwwwww')
    let index = e.detail.value[0]
    let indexs = e.detail.value[1]
    let _showBackground = ''
    this.setData({
      ['dataInfo.background']: index + 1
    })
    
    if (index > 2) {
      this.setData({
        ['dataInfo.fullTimeType']: indexs
      })
      _showBackground = this.data.multiArray[0][this.data.dataInfo.background - 1] + ',' +  this.data.typeArray[this.data.dataInfo.fullTimeType]
    } else {
      this.setData({
        ['dataInfo.fullTimeType']: undefined
      })
      _showBackground = this.data.multiArray[0][this.data.dataInfo.background - 1]
    }
    
    this.setData({
      showBackground: _showBackground
    })
  },

  bindMultiPickerColumnChange(e) {
    console.log(e,11111)
    if (e.detail.column === 0 && e.detail.value > 2) {
      this.setData({
        ['multiArray[1]']: ['全日制', '非全日制'],
      })
    } else if (e.detail.column === 0 && e.detail.value <= 2) {
      this.setData({
        ['multiArray[1]']: []
      })
    }
  },
  // 选择时间段（在校）
  schoolChangePicker(event) {
    console.log(event, '99999')
    let {value} = event.detail // 拿到当前选择的数组
    let currentTime = this.dispTime(value)
  },
  // 处理时间
  dispTime(value){
    console.log(value,'777777')
    let leftYeas = ''
    let rightYeas = ''
    leftYeas = this.data.multiArray1[0][value[0]].replace('年','')
    rightYeas = this.data.multiArray1[1][value[1]].replace('年','')


    console.log(leftYeas,rightYeas)
    // if(type == 'start'){
      
    //     // currentMonths = this.data.multiArray[1][value[1]].replace('月','')
    //     console.log(currentYeas,currentMonths)
    // } else {
    //     currentYeas = this.data.multiArray1[0][value[0]].replace('年','')
    //     // currentMonths = this.data.multiArray1[1][value[1]].replace('月','')
    // }
    return {leftYeas,rightYeas}
},
  // 
  schoolPickerColumnChange(event) {
    console.log(event, '88888')
    if (event.detail.column == 0) {
      let selectYear = parseInt(this.data.multiArray1[0][event.detail.value].replace('年', ''))
      // this.data.multiArray1[0][event.detail.value]
      let rightYears = []
      for (let i = selectYear + 8; i >= (selectYear + 1); i--) {
        let unit = '年'
        rightYears.push(i.toString() + unit);
      }
      console.log(rightYears, '00000')
      this.setData({ 
        ['multiArray1[1]']: rightYears,
        multiIndex1: [event.detail.value,0]  
      })
    } else {
      this.setData({
        
      })
    }

  },

  onChange({
    detail
  }) {
    // 需要手动对 checked 状态进行更新
    this.setData({
      checked: detail
    });
  },


  //获取详情
  getApiResumeEducationDetail() {
    apiResumeEducationDetail({
      id: this.data.dataInfo.id
    }).then(res => {
      console.log(res,'1112222')
      if (res.code == 200){
        let _showBackground = this.data.showBackground
        _showBackground = this.data.multiArray[0][res.data.background - 1]
        if(res.data.background - 1 > 2 && res.data.fullTimeType >= 0){
          _showBackground = _showBackground + ',' +  this.data.typeArray[res.data.fullTimeType]
        }
        this.setData({
          dataInfo: res.data,
          showBackground: _showBackground
        })
      }
    })
  },

  //学校
  selectedSchool(param) {
    console.log(param, '选中的学校')
    this.setData({
      ['dataInfo.schoolName']: param.name,
      ['dataInfo.schoolId']: param.code
    })
    console.log(this.data.dataInfo)
  },
  //开始时间
  changeStart(e) {
    if (new Date().getTime() < new Date(e.detail.date).getTime() || new Date(this.data.dataInfo.schoolEndTime).getTime() < new Date(this.data.dataInfo.schoolStartTime).getTime()) {
      showToast('学习开始时间错误')
      return
    }
    this.setData({
      ['dataInfo.schoolStartTime']: e.detail.date
    })
  },
  //结束时间
  changeEnd(e) {
    console.log(e, '3333')
    if (new Date(e.detail.date).getTime() <= new Date(this.data.dataInfo.schoolStartTime).getTime()) {
      showToast('结束时间早于或等于开始时间')
      return
    }
    this.setData({
      ['dataInfo.schoolEndTime']: e.detail.date
    })
  },
  //专业信息
  selectedSpecialty(param) {
    console.log(param, '专业')
    this.setData({
      ['dataInfo.specialty']: param.name
    })
    console.log(this.data.dataInfo)
  },

  //跳转在校经历编辑
  goToPerformance() {
    wx.navigateTo({
      url: `/subpackPage/user/projectPerformance/projectPerformance?type=type&val=` + this.data.dataInfo.schoolExperience
    })
  },
  //在校经历
  setProject(param, content) {
    console.log(content)
    this.setData({
      ['dataInfo.schoolExperience']: content
    })
  },
  //保存按钮
  subBtnHandel() {
    console.log(this.data.dataInfo)
    educateSub(this.data.dataInfo).then(res => {
      if (res.code != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        return
      }
      wx.navigateBack()
    })
  },

  // 删除教育经历
  async deletaEducation() {
    const res = await deletaEducation(this.data.dataInfo.id)
    console.log(res, '删除教育经历')
    if (res.code == 200) {
      showToast('删除成功')
      setTimeout(() => {
        wx.navigateBack()
      }, 2000)
    }
  },

  goOtherPage(e) {
    let type = e.currentTarget.dataset.type
    let val = e.currentTarget.dataset.val
    let url = `/subpackPage/user/${type}/${type}?val=${val}`
    wx.navigateTo({
      url: url,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    if (options.type == 'add') {
      wx.setNavigationBarTitle({
        title: '添加教育经历',
      })
    } else {
      this.setData({
        ['dataInfo.id']: options.id,
        isEdit: true
      })
      wx.setNavigationBarTitle({
        title: '编辑教育经历',
      })
      this.getApiResumeEducationDetail()
    }
    let leftYears = [];
    let rightYears = []
    for (let i = currentYear; i >= 1990; i--) {
      let unit = '年'
      leftYears.push(i.toString() + unit);
    }
    for (let i = currentYear + 8; i >= currentYear; i--) {
      let unit = '年'
      rightYears.push(i.toString() + unit);
    }
    // console.log(leftYears,rightYears,'时间段')
    this.setData(
      {
        ['multiArray[0]']: wx.getStorageSync('dictionary')[6].map(item => {
          return item.name
        }),
        leftYears: leftYears,
        rightYears: rightYears,
        multiArray1: [leftYears, rightYears]
      })
  },
})