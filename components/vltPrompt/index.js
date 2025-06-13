var app = getApp()
// import { getCheckIllegal } from '../../http/versions'
import { showToast } from '../../utils/util'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      isShowContact: {
          type: Boolean,
          value: false
      },
      contactStatus:{
          type:Number,
          value:0
      },
      infoObj:{
        type:Object,
        value:{}
      },
      closeable: {
        type: Boolean,
        value: true
      }
    },

    /**
     * 组件的初始数据
     */
    data: {
      imageUrl:app.globalData.baseImgUrl,
      // infoObj:{}
    },
    attached() {
      // this.getCheckIllegal1()
    },              
    /**
     * 组件的方法列表
     */
    methods: {
      // 判断是否违规
      async getCheckIllegal1(){
        const res = await getCheckIllegal()
        console.log(res,'00000')
        if(res.code != 200) return showToast(res.msg)
        this.setData({infoObj:res.data})
      },
      onClose(){
        this.triggerEvent('close')
      },
      gotoJL(){
        wx.navigateTo({
          url: '/subpackPage/user/resume/resume',
        })
      },
      gotoPage(e){
        let {type,val} =e.currentTarget.dataset
        if(type==1){
          wx.navigateTo({
            url: `/subpackPage/user/advantage/advantage?val=${val}`,
          })
        }else if(type==2){
          wx.navigateTo({
            url: `/subpackPage/user/resume/resume?selectorName=gzjlName`,
          })
        }else if(type==3){
          wx.navigateTo({
            url: `/subpackPage/user/resume/resume?selectorName=xmnrName`,
          })
        }else if(type==4){
          wx.navigateTo({
            url: `/subpackPage/user/resume/resume?selectorName=jyjlName`,
          })
        }
      }
    }
})
