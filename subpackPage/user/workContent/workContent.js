
Page({

    data: {
        advantage:''
    },
    changeText(e){
        this.setData({
            advantage:e.detail.value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
        })
    },

    goBack(){
        if(this.data.advantage.length<10){
            wx.showToast({
              title: '最少输入10个字',
              icon:'none'
            })
            return
        }
        let pages = getCurrentPages();   
        let beforePage = pages[pages.length -2];  
        beforePage.setContent(this.data.advantage);   
        wx.navigateBack({
            delta: 1 //返回上一级页面
        })
    },
    onLoad(options){
        this.setData({
            advantage:options.val
        })
    }
})