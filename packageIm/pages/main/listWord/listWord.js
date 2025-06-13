// components/listWord/listWord.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        lastMessageVo:Object,
        keyword:String
    },

    /**
     * 组件的初始数据
     */
    data: {
      hxUserName:null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 关键字变红
        keywordRed (str) {
            if (this.keyword && this.keyword !== '') {
                str = str.split(this.keyword).join(`<span style="color:red;font-weight:bold">` + this.keyword + `</span>`)
                return str
            }else{
                return str
            }
        }
    },
    attached(){
      //console.log(JSON.stringify(this.data.lastMessageVo))
      let _userId=wx.getStorageSync('userInfo').info.userId
      this.setData({
        hxUserName:_userId
      })
    },
})
