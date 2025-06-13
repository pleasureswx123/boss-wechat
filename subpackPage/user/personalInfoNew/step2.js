var app = getApp()
import { apiUserJobDetails } from '../../../http/api'
Page({

    /**
     * 页面的初始数据
     */
    data: {
      imageUrl: app.globalData.baseImgUrl,
      cardArr:[{ code: 1, name: '学生' }, { code: 2, name: '职场人' }],
      wordYear:1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    //身份选择
    selectedType(e) {
      let _val = e.currentTarget.dataset.value
      this.setData({
        selectedType:_val
      })
    },
    saveData(){
      let _startWorkDate=''
      if(this.data.selectedType==2){
        let dataD=this.selectComponent("#compData").data.dataValues
        let dataStr=dataD[0]+dataD[1]
        _startWorkDate=dataStr.replace(/[年月]/g, '-').slice(0, -1)
        if(_startWorkDate.split('-')[1]<10){
          _startWorkDate=_startWorkDate.split('-')[0]+'-'+'0'+_startWorkDate.split('-')[1]
        }
      }
      this.getSave({ startWorkDate: _startWorkDate })
    },
    getSave(param) {
      apiUserJobDetails(param).then(res => {
        if (res.code == 200) {
          wx.reLaunch({
            url: '/subpackPage/user/personalInfoNew/step3',
          })
        }
      });
    },
    changeDate(data){
      let dataStr=data.detail[0]+data.detail[1]
      let startWorkDate=dataStr.replace(/[年月]/g, '-').slice(0, -1)
      // console.log(this.calculateExperience(startWorkDate))
      this.setData({
        wordYear:this.calculateExperience(startWorkDate).years+1
      })
    },
    calculateExperience(startDateString) {
        const startDate = new Date(startDateString);
        const currentDate = new Date();
        let years = currentDate.getFullYear() - startDate.getFullYear();
        let months = currentDate.getMonth() - startDate.getMonth();
        if (months < 0 || (months === 0 && currentDate.getDate() < startDate.getDate())) {
            months += 12;
            years--;
        }
        return {
            years,
            months,
        };
    }
})