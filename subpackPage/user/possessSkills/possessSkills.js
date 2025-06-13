// subpackPage/user/possessSkills/possessSkills.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list:[
            {
                title:'互联网/IT/电子/通信',
                selected:true,
                children:[
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },

                ]
            },
            {
                title:'互联网/IT/电子/通信',
                selected:false,
                children:[
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    
                ]
            },
            {
                title:'互联网/IT/电子/通信',
                selected:false,
                children:[
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    {
                        tag:'电子商务',
                        selected:false,
                    },
                    
                ]
            }
        ],
        handleList:[]
    },
    delHandleList(){
        console.log('删除');
    },
    changeList(e){
        let list = this.data.list
        let index = e.currentTarget.dataset.index
        if(list[index].selected) {
            for (let i = 0; i < list.length; i++) {
                list[i].selected = false
            }
        }else {
            for (let i = 0; i < list.length; i++) {
                list[i].selected = false
            }
            list[index].selected = true
        }
        this.setData({
            list:list
        })
    },
    changeListChildren(e){
        let list = this.data.list
        let handleList = []
        let index = e.currentTarget.dataset.index
        let indexs = e.currentTarget.dataset.indexs
        if(this.data.handleList.length >= 6) {
            return wx.showToast({
              title: '最多选择6个',
              icon:'error'
            })
        }else {
            if(list[index].children[indexs].selected) {
                list[index].children[indexs].selected=false
            }else {
                list[index].children[indexs].selected=true
            }
            for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].children.length; j++) {
                    if(list[i].children[j].selected){
                        handleList.push(list[i].children[j].tag)
                    }                
                }
            }
            this.setData({
                handleList:handleList ,
                list:list
            })
        }
       
        console.log(handleList);
        
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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