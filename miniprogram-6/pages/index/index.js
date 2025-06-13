// index.js
// 获取应用实例
import oss from '../../utils/oss.js'
const app = getApp()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    code: ''
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    this.idingyu();
    wx.login({
      success: (res) => {
        console.log(res)
        this.setData({
            avatarUrl: defaultAvatarUrl
        })
      }
    })
  },
  onChooseAvatar(e) {
    const { avatarUrl } = e.detail 
    this.setData({
      avatarUrl
    })
  },
  upfile(){
    wx.chooseImage({
        count: 1, // 最多可以选择的图片张数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            let type ='image'
            oss.ossUpload(res.tempFilePaths[0],type).then(res1=>{
                console.log(res1)
            }).catch(err=>{
            
            })
        }
      })

  },
  idingyu(){
    console.log("进阿里了")
    wx.requestSubscribeMessage({
        tmplIds: ['t9AFvkl_txGiWyj6enkL3rOGeCuxltHISeIYKr7S87E','VHIblSVP8LQC2_sJ6w2RGwdKP9Ni3mbujUdmXpawaNw','MRZtDbNnG1FV8mOZHRRc2D7CyQwlAtCpbQJA1eBZZqI'],
        success (res) {
            console.log(res)
        },
        fail(e){
            console.log(e)
        }
    })
  }
})
