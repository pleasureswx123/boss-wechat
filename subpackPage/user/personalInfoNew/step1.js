var app = getApp()
import { showToast } from '../../../utils/util'
import { savePersonInfo } from '../../../http/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      imageUrl: app.globalData.baseImgUrl,
      sexArr: [{ code: 0, name: '男' }, { code: 1, name: '女' }],
      selectedValues: [0, 0], // 默认选中的值
      datalist: [],
      datalist1:[],
      wagesIndex:null,
      wagesIndex2:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    clearNickName(){
      this.setData({
          ['userInfo.info.name']: ''
      })
    },
     //性别
      selectedType(e) {
        let _val = e.currentTarget.dataset.value
        this.setData({
          selectedType:_val,
          ['userInfo.info.sex']: _val
        })
    },
    confirmValue(event) {
        this.setData({
            ['userInfo.info.name']: event.detail.value.replace(/\s+/g, '')
        })
    },
    //判断年龄
     isOver16Years(dateString) {
      let today = new Date();
      let birthDate = new Date(dateString);
      // 计算年龄（四舍五入到最接近的整数年）
      const age = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365));
      // let age = today.getFullYear() - birthDate.getFullYear();
      // let m = today.getMonth() - birthDate.getMonth();
      // if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      //   age--;
      // }
      return age >= 16;
    },
    saveData(){
      let dataD=this.selectComponent("#compData").data.dataValues
      
      // if(dataD[0]==0){
      //   showToast('年龄必须大于16周岁')
      //   return
      // }
      console.log(dataD[0],'1111')
      let dataStr=dataD[0]+dataD[1]+dataD[2]
      let a=dataStr.replace(/[年月日]/g, '-').slice(0, -1)
      console.log(a,'sdds')
      console.log(this.isOver16Years(a))
      if(!this.isOver16Years(a)){
        showToast('年龄必须大于16周岁')
        return
      }else{
        this.setData({
          ['userInfo.info.birthday']:a
        })
      }
      savePersonInfo(this.data.userInfo.info).then(res=>{
        if(res.code==200){
          wx.reLaunch({
            url: '/subpackPage/user/personalInfoNew/step2',
          })
        }
      })
    }
})