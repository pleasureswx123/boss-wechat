var app = getApp()
let currentYear = new Date().getFullYear(); // 获取当前年份
let currentMonth = new Date().getMonth() + 1;
Component({
    properties: {
      monthPopupTitleActive: {
            type: [Number, null],
            value: 0,
            observer(newVal) {
                this.setData({
                    count: Number(newVal)
                })
            }
        }
    },
    lifetimes:{
        attached(){
            this.onloadFn()
        }
    },
    data: {
      wagesIndex: 0,
      wagesIndex2: 0,
      wagesIndex3: 0,
      selectedValues: [0, 0, 0],
      dataValues:[0,0,0]
    },

    methods: {
      // 选择时间方法
      changeData(event) {
        let { value } = event.detail
        console.log(value, '77777')
        // let _wagesIndex = this.data.wagesIndex
        // let _wagesIndex2 = this.data.wagesIndex2
        // let _wagesIndex3 = this.data.wagesIndex3
        this.setData({
          wagesIndex: value[0] || 0,
          wagesIndex2: value[1] || 0,
          wagesIndex3: value[2] || 0
        })
        this.setData({
          selectedValues: [this.data.wagesIndex, this.data.wagesIndex2, this.data.wagesIndex3],
          dataValues:[this.data.list[this.data.wagesIndex].label,this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].label,this.data.list[this.data.wagesIndex].children[this.data.wagesIndex2].children[this.data.wagesIndex3].label]
        })
        this.triggerEvent('changeDate', this.data.dataValues)
        // if (_wagesIndex !== value[0]) {
        //   this.setData({
        //     selectedValues: [this.data.wagesIndex, 0],
        //     wagesIndex2: 0
        //   })
        // }
        // if (_wagesIndex2 !== value[1]) {
        //   this.setData({
        //     selectedValues: [this.data.wagesIndex, this.data.wagesIndex2, this.data.wagesIndex3]
        //   })
        // }
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
            list: list,
            dataValues:[list[this.data.wagesIndex].label,list[this.data.wagesIndex].children[this.data.wagesIndex2].label,list[this.data.wagesIndex].children[this.data.wagesIndex2].children[this.data.wagesIndex3].label]
          })
          console.log(list, '99999sdskh')
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
    }
})
