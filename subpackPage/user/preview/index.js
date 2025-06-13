// subpackPage/user/preview/index.js
import {baseUrl as env} from '../../../http/http'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //你的pdf链接
        fileUrl: "",
        // baseUrl: 'http://test.pc.guochuanyoupin.com/pdfH5/pdf.html',
        baseUrl: 'https://pc.guochuanyoupin.com/pdfH5/pdf.html',  // 上传pc正式版本时使用
        suffix: '', // 文件后缀
    },
    h5Message(event){
      console.log(event,'h5发送的信息')
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(params) {
        // http链接无法访问
        console.log(params,'点击的简历')
        let token = wx.getStorageSync('token')
        // 处理成https
        // let https = params.fileUrl.split(':')[0] + ':' + params.fileUrl.split(':')[1]
        // console.log(https,'999')
        // let fileUrl = encodeURIComponent(decodeURIComponent(https));
        let baseUrl = `${this.data.baseUrl}?url=${params.fileUrl}&fileName=${params.fileName}&token=${token}&size=${params.size}&templateId=${params.templateId}&ENV=${env}`
        console.log(baseUrl,'链接')
        this.setData({
            baseUrl: baseUrl
        })
        // let suffix = params.fileUrl.split('.')[params.fileUrl.split('.').length - 1]
        // console.log(suffix,'后缀')

        // wx.downloadFile({
        //   url: params.fileUrl,
        //   success: (res)=>{
        //     let filePath = res.tempFilePath
        //     console.log(res,'下载简历')

        //     wx.openDocument({
        //       filePath: filePath,
        //       fileType: suffix,
        //       success: (res)=>{
        //           console.log('打开简历成功')
        //           console.log(res,'000000')
        //       }
        //     })
        //   }
        // })
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
      console.log('组件卸载')
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