// subpackPage/user/setName/setName.js
var app = getApp()
import { school } from '../../../http/user'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:'',
        schoolList:[],
        item:{},
        globalBottom: app.globalData.globalBottom,
    },
    confirmValue(event){
        this.setData({
            name:event.detail.value
        })
        school({key:this.data.name}).then(res =>{
            if(res.data){
                this.setData({schoolList:res.data})
            }
        })
    },
    //
    itemHandel(e){
        let item = e.currentTarget.dataset.item
        this.setData({item})
        this.setData({name:item.name})
        this.setData({schoolList:{}})
    },
    goBack(){
        if(!this.data.item.code){
            wx.showToast({
              title:'请输入选择正确的学校名称',
              icon:'none'
            })
            return
        }
        let pages = getCurrentPages();   
        let beforePage = pages[pages.length -2];  
        console.log(beforePage,'11111')
        beforePage.selectedSchool(this.data.item);   
        wx.navigateBack()
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options){
      if (options.val != 'undefined') {
        this.setData({
          name: options.val
        })
      }
    }
})