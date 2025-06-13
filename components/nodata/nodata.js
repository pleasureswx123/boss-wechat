var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        type:{
            type:String
        },
        stitle:{
            type:String,
            value:'暂无内容'
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        baseImgUrl:app.globalData.baseImgUrl,
        imImages:app.globalData.imImages,
        show:false
    },
    
    lifetimes: {
      ready() {
          setTimeout(()=>{
            this.setData({
              show:true
            })
          },1000)
      }
  }
})
