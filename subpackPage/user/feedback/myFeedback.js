// subpackPage/user/feedback/myFeedback.js
var app = getApp()
import { getOpinionList } from '../../../http/user'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        dataList:[],
        typeList:[],
        repValue:'',
        disabled: true,
        baseImgUrl:app.globalData.baseImgUrl,
    },
    //官方回复内容
    repAreaValue(e){
        this.setData({repValue:e.detail.value})
    },
     // 查看图片
     previewImage(event){
        let {url,current} = event.currentTarget.dataset
        wx.previewImage({
            urls: url,
            current: current,
            showmenu: true
        })
    },
    getList(){
        getOpinionList().then(res=>{
            if(res.code != 200){
                wx.showToast({
                  title: res.msg,
                  icon:'none'
                })
                return
            }
            let arr = res.data.map( item => {
              return{
                createTime:item.createTime.replace(/-/g,'/'),
                opinionText:item.opinionText,
                pictureUrl:item.pictureUrl?item.pictureUrl.split(',') : null,
                type:item.type,
                updateTime:item.updateTime,
                response:item.response,
                responseTime:item.responseTime
              } 
            })
            this.setData({dataList :arr})
            console.log(this.data.dataList)
        })
    },
   
    onShow(){
        this.setData({typeList : wx.getStorageSync('dictionary')[1].map(item =>{return item.name})})
        this.getList()
    }
})