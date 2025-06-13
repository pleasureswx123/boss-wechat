// subpackPage/user/advantage/advantage.js
import { setSave } from '../../../http/user'
import { showToast } from '../../../utils/util'
import {getClassicsTemplete,getClassicsTempleteById} from '../../../http/versions'
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        baseImageUrl: app.globalData.baseImgUrl,
        advantage:'',
        masterplate: false, // 看看别人怎么写
        templeteData: {}, // 模版详情
        baseImageUrlList: [], // 默认图片数组
    },
    changeText(e){
        this.setData({
            advantage:e.detail.value.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "")
        })
    },
    //个人优势保存
    subTextHandle(){
        if(this.data.advantage.length<10){
           showToast('至少输入10个字')
           return
        }
        let param ={
            personalStrength:this.data.advantage,
            userId:wx.getStorageSync('userInfo').info.userId
        }
        setSave(param).then(res=>{
            if(res.code != 200){
                showToast(res.msg)
                return
            }
            setTimeout(() => {
                wx.navigateBack() 
            }, 500);
        }) 
    },

    // AI帮写
    gotoAI(){
      wx.navigateTo({
        url: `/subpackPage/versions/indexAI/indexAI?val=${this.data.advantage}`,
      })
    },

    // 看看别人怎么写
    // 根据求职期望中第一个来进行推荐书写模版（模版为自己添加而不是查看别人）
    async recommendFn(){
      let versions = wx.getStorageSync('versions')
      console.log(this.data.jobPostItem,'0000')
      let params = {
        postId: this.data.jobPostItem.postId,
        edition: Number(versions)
      }
      const res = await getClassicsTemplete(params)
      console.log(res,'shuju')
      if(res.code !== 200) return
      if(res.data){
        res.data.postName = this.data.jobPostItem.postName
        this.setData({
          templeteData: res.data,
          masterplate: true
        })
      }else{
        showToast('对应求职期望无参考实例')
      }
    },
    // 换一个
    async renewalTemplete(){
      this.recommendFn()
    },
    // 长按复制
    copyTemplate(e){
      let key = e.currentTarget.dataset.key;
      wx.setClipboardData({ //设置系统剪贴板的内容
        data: key,
        success(res) {
          // console.log(res, key);
          wx.getClipboardData({ // 获取系统剪贴板的内容
            success(res) {
              showToast('内容已复制')
            }
          })
        }
      })
    },
    onLoad(options) {
        console.log(options,'00000')
        let _baseImageUrlList = this.data.baseImageUrlList
        for(let k = 1;k<=8;k++){
          _baseImageUrlList.push(this.data.baseImageUrl + `/avatar/avatar${k}.png`)
        }
        this.setData({
            jobPostItem:(options.jobPostItem && JSON.parse(options.jobPostItem)) || {postId:wx.getStorageSync('postId')}, // 存储当前求职期望第一条数据的postid
            baseImageUrlList: _baseImageUrlList
        })
        if (options.val && options.val !== 'null' && options.val !== 'undefined') {
          console.log(options.val,'成立？')
          this.setData({
            advantage:options.val,
          })
        }
    }
})