// subpackPage/user/advantage/advantage.js
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
        let pages = getCurrentPages();   
        let beforePage = pages[pages.length -2];  
        beforePage.setWokePerformance(this.data.advantage);   
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