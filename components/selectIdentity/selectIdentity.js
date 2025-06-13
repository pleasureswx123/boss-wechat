// components/selectIdentity/selectIdentity.js
let currentYear = new Date().getFullYear(); // 获取当前年份
let currentMonth = new Date().getMonth() + 1;
var app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    capsuleData: {
      type: Object,
      value: ()=>{}
    },
    IdentityType: {
      type: Number,
      value: 1
    }
  },
  lifetimes: {
    attached() {
      
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    baseImageUrl: app.globalData.baseImgUrl,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back(){
      this.triggerEvent('close')
    },
    // 切换身份changeWork
    changeBtn(e){
      console.log(this.data.IdentityType)
      if (this.data.IdentityType == 1) {
        this.triggerEvent('changeWork')
      }
      if (this.data.IdentityType == 2) {
        let _currentMonth = currentMonth < 10 ? '0' + currentMonth : currentMonth
        console.log(_currentMonth)
        this.triggerEvent('showPickerDate',{value: `${currentYear}-${_currentMonth}`})
      }
    }
  }
})