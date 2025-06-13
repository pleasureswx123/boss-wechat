// subpackPage/user/setName/setName.js
Page({
    data: {
        name: ''
    },
    changeText(event) {
        this.setData({
            name: event.detail.value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
        })
    },
    goBack() {
        let pages = getCurrentPages();
        let beforePage = pages[pages.length - 2];
        beforePage.setProject('dataInfo.performance', this.data.name);
        wx.navigateBack()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if (options.val && options.val != 'undefined' && options.val != 'null') {
            this.setData({
                name: options.val
            })

        }
        if(options.type){
            wx.setNavigationBarTitle({
                title: '在校经历',
            })
        }
    },

})