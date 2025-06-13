// subpackPage/user/customer/index.js

import { getCustomerList } from '../../../http/user'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        active:0,
        PhoneShow:false,
        codeShow:false,
        typeList:[],    
        detailList:[],
        imageUrl:app.globalData.baseImgUrl, //图片路径
        statusBarHeight: app.globalData.statusBarHeight,
        navBarHeight: app.globalData.navBarHeight,
        selIdx:0
    },
    freeTell(){
      wx.makePhoneCall({
        // phoneNumber: '400-9961-770',
        phoneNumber: '400-809-8688'
      })
  },
    phoneShowClick(){
        this.setData({PhoneShow :true})
    },
    codeShowClick(){
        this.setData({codeShow:true})
    },
    onClickHide(){
        this.setData({PhoneShow :false})
        this.setData({codeShow :false})
    },
    //问题详情
    goToDetail(e){
        let item = e.currentTarget.dataset.index
        wx.navigateTo({
          url: `./detail?item=${JSON.stringify(item)}`,
        })
    },

    //导航切换
    switchNavType(e){
      let index = e.currentTarget.dataset.index
      this.setData({
        selIdx:index
      })
        getCustomerList({typeId:index +1}).then(res=>{
            if(res.code != 200){
                wx.showToast({
                  title: res.msg,
                  icon:'none'
                })
                return
            }
            this.setData({detailList:res.data.contents})
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        getCustomerList().then((res)=>{
            this.setData({typeList:res.data.types})
            this.setData({detailList:res.data.contents})
        })
    },

    back(){
      wx.navigateBack()
    }
})