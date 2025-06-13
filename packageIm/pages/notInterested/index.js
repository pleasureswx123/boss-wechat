import {
  chatSessionList
} from '../../../http/api.js'
import {
  checkTime
} from '../../../utils/util'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        params:{
          dignity:1,
          userId:null,
          pageNum:1,
          pageSize:10,
          hxUsername:null,
          talentMark: "all",
          msgType: "notInterested"
      },
      sessionList:[],
      showLoading:true
    },
    onShow() {
        if (wx.getStorageSync('userInfo').info) {
          this.setData({
              ['params.userId']: wx.getStorageSync('userInfo').info.userId,
              ['params.hxUsername']: wx.getStorageSync('userInfo').info.hxUname
          })
          this.getData()
        }
    },
    getData() {
      let _params = this.data.params
      if (this.data.sessionList.length < this.data.listTotal || !this.data.listTotal)
          chatSessionList(_params).then((res) => {
              if (res.code == 200) {
                  res.data.sessionList.records.map(item => {
                      item.msgTimestamp = checkTime(item.msgTimestamp,'main')
                  })
                  res.data.topSessionList.map(item => {
                      item.msgTimestamp = checkTime(item.msgTimestamp,'main')
                  })
                  
                  if (_params.pageNum == 1) {
                      this.setData({
                        showLoading:false,
                          // sessionList: res.data.sessionList.records
                          // 2023-10-19 ghy添加
                          sessionList: res.data.sessionList.records.map(item=>{
                              return {
                                  ...item,
                                  islongpressModel: false
                              }
                          })
                      })
                  } else {
                      this.setData({
                        showLoading:false,
                        sessionList: res.data.sessionList.records.concat(this.data.sessionList)
                      })
                  }
              }
          });
  }
})