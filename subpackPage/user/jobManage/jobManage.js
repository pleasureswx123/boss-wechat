import { apiJobExpectationList, apiUserJobStatus, apiGetStatus, apiSetStatus, apiUserJobDetails } from '../../../http/api'
import { getUserContactMeWay } from '../../../http/versions'
var app = getApp()
Page({
    /**
     * 页面的初始数据
     */
    data: {
        checked: false,
        show: false,
        statausData: [],
        ExpType: '请选择求职状态',
        imageUrl: app.globalData.baseImgUrl, //图片路径
        jobList: [], // 求职期望管理列表
        isEdit: false,
        selectIndex:null,
        isShowContact:false
    },
      // 怎么联系你
    changeContact(){
      this.setData({ isShowContact: true })
    },
      // 获取联系我的方式
    async getContactMeWay() {
      const res = await getUserContactMeWay()
      console.log(res, '获取联系我的方式')
      if (res.code != 200) return showToast(res.msg)
      this.setData({ selectIndex: res.data })
    },
    onjobClose(){
      this.setData({ isShowContact:false })
      this.getContactMeWay()
    },
    goEdit(e) {
        let id = e.currentTarget.dataset.id
        let item = e.currentTarget.dataset.item
        let that = this
        // 获取到点击对应的求职期望经纬度
        let location = item.lon + ',' + item.lat
        wx.navigateTo({
            url: '/subpackPage/user/editJobExpOld/editJobExp?id=' + id + '&num=' + this.data.jobList.length + '&location=' + location,
            events: {
                changeEdit: (flag) => {
                    that.setData({isEdit: flag})
                }
            }
        })
    },
    goAdd() {
        let that = this
        wx.navigateTo({
            url: '/subpackPage/user/editJobExpOld/editJobExp',
            events: {
                changeEdit: (flag) => {
                    that.setData({isEdit: flag})
                }
            }
        })
    },
    openExp() {
        let list = this.data.statausData
        list.map(res => {
            if (res.name == this.data.ExpType) {
                res.selected = true
            }
        })
        this.setData({
            show: true,
            statausData: list
        })
    },
    changeSel(e) {
        let index = e.currentTarget.dataset.index
        let list = this.data.statausData
        for (let i = 0; i < list.length; i++) {
            list[i].selected = false
        }
        list[index].selected = true
        this.setData({
            statausData: list,
            ExpType: list[index].name,
            show: false
        })
        apiUserJobDetails({ jobWantedStatus: list[index].code }).then(res => {
            if (res.code == 200) wx.showToast({
                title: '状态修改成功',
                icon: 'none'
            })
        })
    },
    onClose() {
        this.setData({
            show: false
        })
    },
    onChange({ detail }) {
        // 需要手动对 checked 状态进行更新
        this.setData({ checked: detail });
        this.setStatusFn()
    },
    //获取简历列表
    apiJobExpectationList() {
        apiJobExpectationList().then(res => {
            if (res.code == 200) {
                this.setData({
                    jobList: res.data
                })
            }
        })
    },
    //console.log(result,'获取求职状态')
    getApiUserJobStatus() {
        apiUserJobStatus().then(res => {
            if (res.code == 200) {
                let statausData = this.data.statausData
                if (res.data == 0) {
                    this.setData({
                        ExpType: statausData[res.data].name
                    })
                } else {
                    this.setData({
                        ExpType: statausData[res.data - 1].name
                    })
                }
                console.log(res.data, '获取求职状态')
            }
        })
    },
    //console.log(result,'查看简历隐藏状态')
    getApiGetStatus() {
        apiGetStatus().then(res => {
            console.log(res, '888')
            if (res.code == 200) {
                this.setData({
                    checked: res.data == 1 ? true : false
                    // checked: true
                })
            }
        })
    },
    //设置简历隐藏状态
    async setStatusFn() {
        let status;
        status = this.data.checked == true ? 1 : 0
        const result = await apiSetStatus({ status })
        console.log(result, '设置简历隐藏状态')
        wx.showToast({
            title: '设置成功',
            icon: 'none'
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onShow(options) {
        let _statausData = wx.getStorageSync('dictionary')[34]
        this.setData({
            statausData: _statausData
        })
        this.apiJobExpectationList()
        this.getApiGetStatus()
        this.getApiUserJobStatus()
        this.getContactMeWay()
    },
    onUnload(){
        const eventChannel = this.getOpenerEventChannel();
        console.log(this.data.isEdit,'状态')
        if(this.data.isEdit){
            // 触发事件并传递数据
            eventChannel.emit('changeTab');
        }
    }
})