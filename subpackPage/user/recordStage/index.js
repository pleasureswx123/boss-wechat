import { showToast } from "../../../utils/util"
import { getProductOrders,accountLogList } from '../../../http/user'
import {formatDate} from '../../../utils/util'
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        consumeDescribe: ["知豆充值","购买简历刷新卡","购买曝光卡","购买搜索畅聊卡"],
        active:0,
        sActive:0,
        propList:[],
        tempList: [], // 知豆消费明细
        imageUrl:app.globalData.baseImgUrl,
        tabList:[{
            type:1,
            name:'全部'
        },{
            type:2,
            name:'已获取'
        },{
            type:3,
            name:'已使用'
        }],
        consumeDescribeList: ['知豆充值','购买道具','发布红包岗位', '红包退回','转让管理员', '会员活动赠送','购买会员','会员订单超时'],
    },

    //顶部导航切换
    changeTabs(event) {
        console.log(event.detail.index)
        this.setData({
            active:event.detail.index
        })
        if(event.detail.index===0){
            this.getProductOrders()
        }else{
            this.accountLogList(0)
        }
      },


   // 获取设备屏幕高度
   systemType () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    })
  },
  tabChange (event) {
    this.setData({
        active: event.detail.current
    })
  },

  //获取我的购买记录
  getProductOrders(){
        let params = {
            pageSize: 50,
            pageNum: 1
        }
        getProductOrders(params).then(res =>{
            if(res.code != 200){
                showToast(res.msg)
                return
            }
            let arr = res.data.records.map(item=>{
                return {
                    ...item,
                    time: this.convertToTimestamp(item.updateTime)
                }
            })
            this.setData({propList:arr})
        })
    },
    // 处理时间字符串
    convertToTimestamp(time) {
        return formatDate(time)
    },
    // 获取知豆消费明细
    accountLogList(status){
        let params = {
            status,
            pageNum: 1,
            pageSize: 10
        }
        accountLogList(params).then(res =>{
            if(res.code != 200){
                showToast(res.msg)
                return
            }
            console.log(res,'知豆')
            this.setData({
                tempList:res.data.records
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(options.type){
          this.setData({
            active:options.type
          })
          if(options.type==1){
              this.getProductOrders()
          }else{
              this.accountLogList(0)
          }
        }
        this.systemType()
    },

    changeLab(e) {
        let idx=e.currentTarget.dataset.index || 0
        this.accountLogList(idx) 
        this.setData({
            sActive:idx,
            // propList:propList
        })
    }
})