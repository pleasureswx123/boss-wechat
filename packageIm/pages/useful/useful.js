const app =  getApp();
import { getUseful,delUseful } from "../../../http/api";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        usefulArr:[],
        imImages:app.globalData.imImages
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow(options) {
        this.getUseful()
    },
    //查询常用语
    getUseful(){
        var that=this
        getUseful().then(res=>{
            if(res.code==200){
                that.setData({
                    usefulArr:res.data
                })
            }
        })
    },
    addUseFul(){
        wx.navigateTo({
            url: `/packageIm/pages/useful/addUseful`
        })
    },
    editUse(e){
        let item=JSON.stringify(e.currentTarget.dataset.item);
        wx.navigateTo({
            url: `/packageIm/pages/useful/addUseful?item=`+item
        })
    },
    delUseful(e) {
        console.log(111)
        delUseful({usualMsgId:e.currentTarget.dataset.num}).then(res=>{
            if(res.code==200){
                wx.showToast({
                    title:'删除成功',
                    icon:'none'
                })
                setTimeout(()=>{
                    this.getUseful()
                },500)
            }
        })
    }
})