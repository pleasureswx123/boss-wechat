// subpackPage/user/setName/setName.js
Page({
    data: {
        name:''
    },
    confirmValue(event){
        this.setData({
            name:event.detail.value
        })
    },
    goBack(){
        let pages = getCurrentPages();
        let beforePage = pages[pages.length -2];  
        beforePage.setProject('dataInfo.name',this.data.name); 
        wx.navigateBack()
    },
    
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(options.val && options.val!='undefined'){
             this.setData({
                name:options.val
            })
        }
    },

})