import { dictionaryList,recordList } from '../../../http/user'
Page({
    data: {
        show: false,
        radio: '',
        reportList: [],//举报大类型
        detailList: [],//举报详细类型
        detailText: null,//传递的值
        code: null, //大类别code值
        detail_code: null,//详细举报类型code
        active: 0,
        list: [], // 举报记录
    },
    onClose() {
        this.setData({
            show: false
        })
    },
    //举报总类型
    dictionaryList() {
        dictionaryList({ category: 13 }).then(res => {
            if (res.code != 200) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return
            }
            this.setData({ reportList: res.data })
        })
    },
    //举报详细类别
    itemDetailList(e) {
        var code = e.currentTarget.dataset.code
        this.setData({ code })
        dictionaryList({ category: code }).then(res => {
            if (res.code != 200) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return
            }
            this.setData({ detailList: res.data })
            this.setData({ show: true })
        })
    },

    //选中举报类别
    onChange(e) {
        // this.setData({detailText:e.detail})
        let name = e.currentTarget.dataset.name || e.detail
        this.setData({ detailText: name, radio: name })
        //为啥注释
        let param = this.data.detailList.find(item => {
            return item.name == this.data.detailText
        })
        this.setData({ detail_code: param.code })
        this.subReport()
    },

    //确定按钮
    subReport() {
        if (!this.data.detailText) {
            wx.showToast({
                title: '请选择举报信息',
                icon: 'none',
            })
            return
        }
        wx.redirectTo({
            //param=${JSON.stringify(param) 后期补，被举报人详细信息
            url: `./report_detail?positionId=${this.data.positionId}&respondent=${this.data.respondent}&detailText=${this.data.detailText}&code=${this.data.code}&detail_code=${this.data.detail_code}`,
        })
    },

    //举报记录
    // goToReportNote() {
    //     wx.navigateTo({
    //         url: './report_note',
    //     })
    // },

    //顶部导航切换
    changeTabs(event) {
        console.log(event)
        this.setData({
            active: event.detail.index
        })
        if(event.detail.index == 1){
            this.recordList()
        } 
    },

    //举报记录
    recordList(){
        let param = {
            pageNum:1,
            sizeNum:20,
            userId:wx.getStorageSync('userInfo').info.userId
        }
        recordList( param ).then(res =>{
            if(res.code != 200){
                wx.showToast({
                  title: res.msg,
                  icon:'none'
                })
                return
            }
            this.setData({list:res.data.records})
        })
    },

     //查看举报详情
     goToDetail(e){
        var id = e.currentTarget.dataset.id
        wx.navigateTo({
          url: `./note_detail?id=${id}`,
        })
    },


    onLoad(options) {
        this.setData({
            respondent: options.respondent,
            positionId: options.positionId
        })
        this.dictionaryList()
    }
})