// subpackPage/user/setName/setName.js
        
import { specialty } from '../../../http/user'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        name:'',
        item:{},
        specialtyList:[]
    },
    confirmValue(event){
        this.setData({
            name:event.detail.value
        })
        specialty({key:this.data.name}).then(res =>{
            this.setData({specialtyList:res.data})
        })
    },
    itemHandel(e){
        let item = e.currentTarget.dataset.item
        this.setData({item})
        this.setData({name:item.name})
        this.setData({specialtyList:{}})
    },
    goBack(){
      if(!this.data.item.code){
          wx.showToast({
            title:'请输入选择正确的专业名称',
            icon:'none'
          })
          return
      }
        let pages = getCurrentPages();   
        let beforePage = pages[pages.length -2];  
        beforePage.selectedSpecialty(this.data.item);   
        wx.navigateBack()
    },
    onLoad(options){
      if (options.val != 'undefined') {
        this.setData({
          name: options.val
        })
      }
    }
})