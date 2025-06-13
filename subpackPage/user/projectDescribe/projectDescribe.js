// subpackPage/user/setName/setName.js
import {showToast} from '../../../utils/util'
Page({
    data: {
        name:''
    },
    changeText(event){
        this.setData({
            name:event.detail.value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
        })
    },
    goBack(){
        if(this.data.name.length < 2) return showToast('至少要输入两个字')
        let pages = getCurrentPages();
        let beforePage = pages[pages.length -2];  
        beforePage.setProject('dataInfo.details',this.data.name); 
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