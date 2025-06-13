import { addUseful,updateUseful } from "../../../http/api";
import { showToast } from "../../../utils/util"
Page({
    data: {
        useful:''
    },
    changeText(e){
        this.setData({
            useful:e.detail.value
        })
    },
    onLoad(options){
        if(options.item){
            wx.setNavigationBarTitle({
                title:'编辑常用语'
              });
              this.setData({
                useful:JSON.parse(options.item).content,
                id:JSON.parse(options.item).usualMsgId
            })
        }else{
            wx.setNavigationBarTitle({
                title:'添加常用语'
              });
        }
    },
    save(e) {
        console.log("你点击了按钮")
        if(!this.data.useful){
            uni.showToast({
               title:'您还没有输入哦',
                icon: "none" 
            })
            reutrn
        }
        if(this.data.id){
            updateUseful({content:this.data.useful,usualMsgId:this.data.id}).then(res=>{
                if(res.code==200){
                    showToast('修改成功')
                    setTimeout(() => {
                        wx.navigateBack({
                            delta:1
                        })   
                    }, 300);
                }else{
                    showToast(res.msg)
                }
            })
        }else{
            addUseful({content:this.data.useful}).then(res=>{
                console.log(res,'resresresresresresresresresresresres')
                if(res.code==200){
                    wx.showToast({
                        title:'添加成功',
                        icon: "none"
                    })
                    setTimeout(() => {
                        wx.navigateBack({
                            delta:1
                        })   
                    }, 300);
                }
            })
        }
    }
})