var app = getApp()
import { appealSave } from "../../http/user"
import {
  interviewRecord
} from '../../http/api.js'
import { getTimeFormater } from "../../utils/util"
import {
  ossUpload
} from '../../miniprogram-6/utils/oss.js'
import { showToast } from '../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShensu: {
        type: Boolean,
        value: false
    },
    interviewRecordId:{
      type:String,
      observer(newData) {
        if(newData){
          this.getInterviewRecord()
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    ImageArr:[],
    despText:'',
    imImages: app.globalData.imImages,
    baseImgUrl: app.globalData.baseImgUrl
  },
  /**
   * 组件的方法列表
   */
  methods: {
     //通过面试id获取面试信息
  getInterviewRecord() {
    if(this.data.interviewRecordId){
      interviewRecord(this.data.interviewRecordId).then(res => {
        let _msInfo = res.data
        this.msInfo = _msInfo
        let _interviewTime = getTimeFormater(res.data.interviewRecordResult.interviewTime)
        this.setData({
          msInfo: _msInfo,
          interviewTime: _interviewTime
        })
      })
    }
  },
    //文本框输入数量内容
  textareaInput(e) {
    this.setData({
      despText: e.detail.value
    })
  },
  //上传图片
  uploadImage() {
    var that = this
    let userId = wx.getStorageSync('userInfo').info.userId
    let _length = 3 - this.data.ImageArr.length
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
          const result = await ossUpload(tempFiles[i].tempFilePath, 'image', userId)
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
    let imgArr = this.data.ImageArr
    var imageList = imgArr.splice(0, 1)
    console.log(imageList)
    this.setData({
      ImageArr: imgArr
    })
  },
  onClose(){
    wx.$event.emit('onCloseSs')
  },
  appealSave() {
    let params = {
      imgUrls: this.data.ImageArr.join(","),
      interviewRecordId: this.data.interviewRecordId,
      reasonContent: this.data.despText,
      typeId: 1
    }
    appealSave(params).then(res => {
      if (res.code == 200) {
        showToast('申诉成功')
        setTimeout(() => {
          this.onClose()
        }, 500)
      }else{
        showToast(res.msg)
      }
    })
  },
  }
})