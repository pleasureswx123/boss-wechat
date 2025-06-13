import { getMemberRecord } from '../../../http/user'
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
       baseImageUrl: app.globalData.baseImgUrl,
       tabList:[
         {type:0,name:'全部'},
         {type:1,name:'待生效'},
         {type:2,name:'生效中'},
         {type:3,name:'已过期'}
        ],
        activeIdx:0,
        recordList:[],
        params:{
          pageNum:1,
          pageSize:10
        }
    },
    onShow() {
      this.getRecord()
    },
    changeTab(e){
      let {idx} = e.currentTarget.dataset
      this.setData({
        activeIdx:idx,
        status:idx-1,
        ['params.pageNum']:1,
        recordList:[]
      })
      this.getRecord()
    },
    getRecord(){
      let p=this.data.params
      if(this.data.activeIdx>0){
        p.status=this.data.status
      }else{
        p.status=''
      }
      if(this.data.recordList.length>0 && this.data.params.pageNum==1) return
      getMemberRecord(p).then(res=>{
        if(res.code==200){
          if(this.data.params.pageNum==1){
            this.setData({
              recordList:res.data.records
            })
          }else{
            this.setData({
              recordList:[...this.data.recordList,...res.data.records]
            })
          }
          
          if(res.data.records.length<res.data.total){
            this.setData({
              ['params.pageNum']:this.data.params.pageNum+1
            })
          }
        }
      })
    }
})