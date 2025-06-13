import { apiUserJobDetails } from '../../../http/api'
import { showToast } from '../../../utils/util'
Page({
    data: {
        name:''
    },
    confirmValue(event){
        this.setData({
            name:event.detail.value
        })
    },
    goBtn(){
        if(!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/).test(this.data.name)){
            showToast('邮箱格式错误')
            return
        }
        apiUserJobDetails({email:this.data.name}).then(res=>{
            if(res.code==200){
                showToast('修改成功')
                setTimeout(() => {
                    wx.navigateBack()
                }, 1000);
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            name:options.val
        })
    },

})