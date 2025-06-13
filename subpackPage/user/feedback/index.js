// subpackPage/user/feedback/index.js

import {
    ossUpload
} from '../../../miniprogram-6/utils/oss.js'
import {
    addOpinion
} from '../../../http/user'
Page({

    data: {
        typeList: [],
        isActive: 1,
        areaValue: '',
        ImageArr: [],
        phone: '',
        token: null
    },

    //手机号输入
    phoneInput(e) {
        this.setData({
            phone: e.detail.value
        })
    },

    //文本框输入数量内容
    textareaInput(e) {
        this.setData({
            areaValue: e.detail.value
        })
    },

    //跳转我的反馈列表
    goToMyFeb() {
        wx.navigateTo({
            url: './myFeedback',
        })
    },
    //切换反馈类型
    switchType(e) {
        this.setData({
            isActive: e.currentTarget.dataset.index
        })
    },

    //上传图片
    uploadImage() {
        var that = this
        let userId = wx.getStorageSync('userInfo').info.userId
        let _length=4-this.data.ImageArr.length
        wx.chooseMedia({
            count: _length,
            mediaType: ['image'],
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: async (res) => {
                const tempFiles = res.tempFiles
                var imageList = that.data.ImageArr
                for (let i = 0; i < tempFiles.length; i++) {
                    console.log(tempFiles[i])
                    const result = await ossUpload(tempFiles[i].tempFilePath, 'image',userId)
                    imageList.push(result.full)
                }
                that.setData({
                    ImageArr: imageList
                })      
            }
        })
    },
    //删除上传的图片
    removeImage(e) {
        var index = e.currentTarget.dataset.index
        console.log(index)
        let imgArr=this.data.ImageArr
        var imageList = imgArr.splice(0,1)
        console.log(imageList)
        this.setData({
            ImageArr: imgArr
        })
    },
    //添加意见反馈
    addOpinionHandel() {
        let param = {
            type: this.data.isActive - 1,
            opinionText: this.data.areaValue,
            pictureUrl: this.data.ImageArr,
            phoneNumber: Number(this.data.phone)
        }
        // console.log(param)
        if(param.phoneNumber){
            if (!/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(param.phoneNumber)) {
                wx.showToast({
                    title: '请输入正确的手机号',
                    icon: 'none'
                })
                return
            }
        }
        wx.showLoading({
          title: '提交中',
        })
        addOpinion(param).then((res) => {
          wx.hideLoading()
            if (res.code != 200) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return
            }
            wx.showToast({
                title: res.msg,
                icon: 'none'
            })
            this.setData({
                phone: ''
            })
            this.setData({
                isActive: 1
            })
            this.setData({
                areaValue: ''
            })
            this.setData({
                ImageArr: ''
            })
            setTimeout(() => {
                wx.navigateBack()
            }, 1000)
        })
    },

    onLoad() {
      let _token = wx.getStorageSync('token') // 获取token
        this.setData({
            token:_token,
            typeList: wx.getStorageSync('dictionary')[1]
        })
    }






})