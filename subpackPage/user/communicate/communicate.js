import { jobSeekerJobRecord } from '../../../http/api'

Page({
    data: {
        datalist:[],
        pageNum:1,
        pageSize:999
    },
    getJobSeekerJobRecord(){
        let param={
            pageNum:this.data.pageNum,
            pageSize:this.data.pageSize,
            userId:wx.getStorageSync('userInfo').info.userId,
            type:1
        }
        let _records = this.data.datalist
        jobSeekerJobRecord(param).then(res=>{
            console.log(res,'数据')
            if(res.code==200){
                res.data.postInfos.records.map(item=>{
                  if(item){
                    item.createTime = item.createTime.split(' ')[0].split('-')[1] + "月" + item.createTime.split(' ')[0].split('-')[2] + "日",
                        item.post= item.title,
                        item.num= this.data.typeList[item.type]?.name,
                        item.year= this.data.sufferList[item.experience]?.name,
                        item.companyName= item.corporationName,
                        item.city= item.city,
                        item.province= item.province,
                        item.tag= item.tag.split(','),
                        item.username=  item.belonger,
                        item.isH=  item.redPacket,
                        item.moneyType=  item.moneyType,
                        item.maximumMoney=  item.maximumMoney,
                        item.lowestMoney=  item.lowestMoney,
                        item.monthMoney=  item.monthMoney,
                        item.postId=  item.id,
                        item.bossUserId= item.belonger,
                        item.outName= item.outName,
                        item.avatar= item.avatar,
                        item.outPost= item.outPost,
                        item.stage= this.data.financingList[item.financeStage]?.name,
                        item.corporationId= item.corporationId,
                        //需要改字段，字段为scale
                        item.scale= this.data.scaleList[item.scale]?.name,
                        item.online = item.online,
                        item.activation = item.activation
                  } 
                })
                if(this.data.pageNum<res.data.postInfos.pages){
                    this.setData({
                        pageNum:res.data.postInfos.current+1
                    })
                }
                this.setData({
                    pages:res.data.postInfos.pages,
                    datalist:_records.concat(res.data.postInfos.records)
                })
            }
        })
    },
     // 字典数据
     getDictionary() {
        if(wx.getStorageSync('dictionary')){
            let resultData = wx.getStorageSync('dictionary')
            this.setData({
                sufferList: this.mapData(resultData[33]),
                scaleList: this.mapData(resultData[5]),
                financingList: this.mapData(resultData[4]),
                typeList: this.mapData(resultData[39])
            })
        }
    },

    // 处理筛选数据的函数
    mapData(data) {
        let add = data.map(item => {
            let isActive = false
            if (item.name == '不限') {
                isActive = true
            } else {
                isActive = false
            }
            return {
                ...item,
                isActive: isActive
            }
        })
        return add
    },
    onLoad(options) {
        this.getDictionary()
        this.getJobSeekerJobRecord()
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if(this.data.pageNum<=this.data.pages){
            this.getJobSeekerJobRecord()
        }
    }
})