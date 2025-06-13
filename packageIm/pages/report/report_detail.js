// packageIm/pages/report/report_detail.js

import {ossUpload} from '../../../miniprogram-6/utils/oss'
import { complaintRecord } from '../../../http/user'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        reasonContent:'',
        detailText:'',
        typeId:null,
        detail_code:null,
        ImageArr:[],
        areaValue:''
    },
    //文本框输入内容
    textareaInput(e){
        this.setData({reasonContent:e.detail.value})
    },

    subReport(){
        let userInfo=wx.getStorageSync('userInfo').info
        let param={
            //投诉人ID
            complainant:userInfo.userId,
            //举报图片
            imgUrls:JSON.stringify(this.data.ImageArr),
            //举报类型说明
            reasonContent:this.data.reasonContent,
            //举报详细类型id原因
            reasonIds:this.data.detail_code.toString(), 
            //被投诉人Id 
            respondent:this.data.respondent,
            //投诉举报类型字典表id
            typeId:this.data.typeId,
            //岗位id
            positionId:this.data.positionId
        }
        if(!param.reasonContent){
            wx.showToast({
                icon:'none',
              title: '请输入补充说明'
            })
            return
        }
        complaintRecord(param).then(res=>{
            if(res.code != 200) {
                wx.showToast({
                  title: res.msg,
                  icon:'none'
                })
                return
            }
            wx.showToast({
              title: '举报成功',
              icon:'none'
            })
            setTimeout(()=>{
                wx.navigateBack()
            },1000)
        })
    },

    //上传图片
    uploadImage() {
        var that = this
        let _length=6-this.data.ImageArr.length
        wx.chooseMedia({
            count: _length,
            mediaType: ['image'],
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: async (res) => {
                res.tempFiles.map(item=>{
                    ossUpload(item.tempFilePath, 'image').then(res=>{
                        var imageList = that.data.ImageArr
                        imageList.push(res.full)
                        console.log(imageList)
                        that.setData({
                            ImageArr: imageList
                        })
                    })
                    
                })
            }
        })
    },
    //删除上传的图片
    removeImage(e) {
        var index = e.currentTarget.dataset.index
        let imgArr=this.data.ImageArr
        var imageList = imgArr.splice(index,1)
        this.setData({
            ImageArr: imgArr
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            detailText:options.detailText,//详细举报类型
            typeId:options.code,//大类型Id
            detail_code:options.detail_code,    //详细类型举报code值
            respondent:options.respondent, //被投诉人id
            positionId:options.positionId
        })
        
        //举报人的详细信息
        if(options.param) this.setData({info:JSON.parse(options.param)})
        // console.log(options)
    }, 

})