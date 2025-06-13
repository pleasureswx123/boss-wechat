import { addCostomGreet,updateCostomGreet } from '../../../../http/user'
import { showToast } from '../../../../utils/util'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        greetText: '', // 自定义打招呼数据
        type: '', // 通知上个页面的active分类
        id: ''
    },
    changeText(event){
        this.setData({
            greetText: event.detail.value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
        })
    },
    // 保存自定义打招呼语
    
    async goBack(){
        let params = {
            content: this.data.greetText,
            id: this.data.id
        }
        if(this.data.id){
            const res = await updateCostomGreet(params)
            if(res.code !== 200)return showToast('编辑失败')
            showToast('编辑成功')
        } else {
            const res = await addCostomGreet(params)
            if(res.code !== 200)return showToast('添加失败')
            showToast('添加成功')
        }
        setTimeout(()=>{
            wx.navigateBack({
                url: `/subpackPage/user/setup/greet/index`,
            })
            const eventChannel = this.getOpenerEventChannel()
            eventChannel.emit('changeActive', {type: this.data.type,id: this.data.id});
        },2000)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(options.id !== 'undefined'){
            this.setData({
                greetText:options.content,
                id: options.id
            })
        } 
        this.setData({
            type: options.type
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})