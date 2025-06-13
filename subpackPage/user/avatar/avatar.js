var app = getApp()
import { apiUserJobDetails } from '../../../http/api'
import {
  ossUpload
} from '../../../miniprogram-6/utils/oss.js'
import { showToast } from '../../../utils/util'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        radio:'',
        imageUrl:app.globalData.baseImgUrl,
        defaultImage: '?x-oss-process=image/resize,w_100/quality,q_50', // 图片压缩
    },

    //单选事件
    onChange(e){
        let {imageurl} = e.currentTarget.dataset
        this.setData({radio:imageurl})
    },
    getSave(param) {
        apiUserJobDetails(param).then(res => {
            if (res.code == 200) {
                //showToast('修改成功')
            }
        });
    },
    bindAvatar(){
        let userId = wx.getStorageSync('userInfo').info.userId
        var that = this
        wx.chooseMedia({
            count: 1,
            mediaType: ['image'],
            sizeType: ['compressed'],
            sourceType: ['album'],
            success: async (res) => {
                console.log(res)
                console.log(userId, '9999')
                const result = await ossUpload(res.tempFiles[0].tempFilePath, 'image', userId, 1)
                // let imgStr = `userInfo.info.avatar`
                // that.setData({
                //     [imgStr]: result.full
                // })
                this.getSave({ avatar: result.full })
                wx.navigateBack()
                const eventChannel = this.getOpenerEventChannel()
                eventChannel.emit('updataUserInfoAvatar',result.full);
            }
        })
    },
    upLoadImage(){
        if(!this.data.radio)return 
        apiUserJobDetails({avatar:this.data.radio}).then(res=>{
            if(res.code==200){
                wx.showToast({
                  title: '修改成功',
                })
                wx.navigateBack()
            }
        });
        // 经典版完善求职简历使用和触发
        if(this.data.type == 1){
          const eventChannel = this.getOpenerEventChannel()
          eventChannel.emit('updataUserInfoAvatar',this.data.radio);
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      if(options.type && options.type !== 'undefined'){
        this.setData({type: options.type})
      }
    }
})