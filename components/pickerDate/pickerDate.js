const date = require("../../utils/date.js");
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    fields: {
      type: String,
      value: 'day'
    }, 
    quick: {    //是否带至今
      type: Boolean,
      value: false
    },
    startTime: {    //开始时间
        type: Number,
        value: 1990
      },
    placeholder: {  //提示语
      type: String,
      value: ''
    },
    selectDate: {
      type: String,
      value: '',
    },
    type: {
        type: String,
        value: '',
        observer: (newVal,lodVal)=>{
            
        }
    }
  },
  observers: {  //监听日期是否改变并给年月日赋值
    selectDate: function(val){
      if(val !== ''){
        let arr = val.split('-')
        if(arr.length === 1) {
          this.setData({
            year: Number(arr[0])
          })
        } else if (arr.length === 2) {
          this.setData({
            year: Number(arr[0]),
            month: Number(arr[1])
          })
        } else if (arr.length === 3) {
          this.setData({
            year: Number(arr[0]),
            month: Number(arr[1]),
            day: Number(arr[2])
          })
        }
      }
    }
  },

  /**
   * 页面的初始数据
   */
  data: {
    pickerDateshow: false,
    picker_btn: ['取消', '确定'],
    years: [],
    months: [],
    days: [],
    year: date.nowYear,
    month: date.nowMonth,
    day: date.nowDay,
    value: [], //选中值的下标
    selectDate: ''
  },
  methods: {
    // 打开选框
    showBirthday: function () {
      date.setDate(this.data.quick, this.data.year, this.data.month, this.data.day, this)
      this.setData({
        pickerDateshow: true
      })
      this.value = this.data.value;// 记录改变前的日期
    },
    // 关闭选框
    selectBirthday: function (e) {
      let index = e.currentTarget.dataset.index;
      if (index && index == 1) { // 确定选择 更换改变后的日期
        if (this.val) {
          date.setDate(this.data.quick, this.data.years[this.val[0]], this.data.months[this.val[1]], this.data.days[this.val[2]], this)
        } else {
          date.setDate(this.data.quick, this.data.years[this.value[0]], this.data.months[this.value[1]], this.data.days[this.value[2]], this)
        }

        let res = ''
        let data = {}
        if (this.data.year === '至今') {
          res = this.data.year
          data.date = res
          data.year = this.data.year
        } else if (this.data.fields === 'year') {
          res = this.data.year
          data.date = res
          data.year = this.data.year
        } else if (this.data.fields === 'month') {
          res = this.data.year + '-' + this.data.month
          data.date = res
          data.year = this.data.year
          data.month = this.data.month
        } else {
          res = this.data.year + '-' + this.data.month + '-' + this.data.day
          data.date = res
          data.year = this.data.year
          data.month = this.data.month
          data.day = this.data.day
        }
        this.triggerEvent('changeDate', data)
      } else { // 取消选择 还原改变前的日期
        date.setDate(this.data.quick, this.data.years[this.value[0]], this.data.months[this.value[1]], this.data.days[this.value[2]], this)
      }
      this.setData({
        pickerDateshow: false,
      })
    },
    bindChange: function (e) {
      let val = e.detail.value;
      this.val = e.detail.value; //记录改变后的日期
      date.setDate(this.data.quick, this.data.years[val[0]], this.data.months[val[1]], this.data.days[val[2]], this)
    },
  },
})

