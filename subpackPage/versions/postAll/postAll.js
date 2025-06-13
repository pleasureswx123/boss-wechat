import { apiIndustry, apiListByHome } from '../../../http/index'
import {getPostInfoArea,searchPostHome} from '../../../http/api'
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        statusBarHeight: app.globalData.statusBarHeight,
        navBarHeight: app.globalData.navBarHeight,
        baseImageUrl: app.globalData.baseImgUrl,
        defaultImage: '?x-oss-process=image/resize,w_100/quality,q_90',
        globalBottom: app.globalData.globalBottom,
        locationAddress: '不限',
        sxNum: 0, // 筛选数量
        searchPostValue: '', // 全部岗位搜索文本
        postName: '全部职位',
        arrowIcon: 'arrow-down',
        arrowIcon1: 'arrow-down',
        isShow: false, // 筛选弹窗
        isOpen: false, // 职位弹窗
        isOpen1: false, // 地址弹窗
        type: '', // 全部岗位点击
        isSearch: true, // 热门岗位点击tab之后不需要搜索
        popupHeight: 0, // 弹框高度
        jobType: [],
        textData: [], // 期望薪资
        sufferList: [], // 经验
        scaleList: [],// 公司规模
        financingList: [], // 融资
        educationList: [], // 学历
        jsList: [],//结算方式,
        typeList: [], // 招聘类型
        clearing: [], // 兼职薪资
        industryList: [{ name: '不限', isActive: true, code: null }], // 行业
        dataList: [], // 列表数组
        pageNum: 1, // 页码
        pageSize: 10, // 每页多少条
        isRefreshing: false,//是否下拉刷新状态
        isFinish: false,//是否加载完全部数据
        areaId: '', // 区域id
        simpleId: '', // 热门岗位或者严选兼职点击tab进来的id / 全部职位选中的职位id
        indexInfo: {}, // 筛选基础数据
        screen: {}, // 筛选条件
        showLoading: false, // loading效果
    },
    // 获取行业信息
    async getIndustry() {
        const { code, data, msg } = await apiIndustry()
        if (code !== 200) {
            wx.showToast({
                title: msg,
                icon: "none"
            })
            return
        }
        let arr = data.map(item => {
            return {
                ...item,
                isActive: false
            }
        })
        let industryList = [...this.data.industryList, ...arr.slice(6, 11)]
        this.setData({
            industryList
        })
    },
    searchTab(event) {
        let variate = event.currentTarget.dataset.type
        let icon = event.currentTarget.dataset.icon
        let flag = this.data[event.currentTarget.dataset.type]
        this.setData({
            [variate]: !flag,
            [icon]: !flag ? 'arrow-up' : 'arrow-down'
        })
    },
    // 打开筛选弹窗
    screOpen() {
        this.setData({
            isShow: true
        })
    },
    // 筛选确定事件
    screenEvent(event) {
        this.setData({
            screen: event.detail,
            isShow: false,
            showLoading: true
        })
        this.getListByHome(false)
    },
    // 筛选数量统计
    screenNum(event) {
        this.setData({
            sxNum: event.detail
        })
    },
    selectedPost(event){
      if(event=='clear'){
        this.setData({
            pageNum: 1,
            simpleId: null,
            isOpen: false,
            arrowIcon: 'arrow-down',
            postName: '全部职位'
        })
      }else{
        this.setData({
            pageNum: 1,
            simpleId: event.detail.code,
            isOpen: false,
            arrowIcon: 'arrow-down',
            postName: event.detail.name
        })
      }
        this.getListByHome(false)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options,'0000')
        let popupHeight = wx.getSystemInfoSync().windowHeight - 60
        let dictionary = wx.getStorageSync('dictionary')
        dictionary[6].unshift({ name: '不限' })
        this.setData({
            popupHeight: popupHeight,
            areaId: Number(options.areaId), // 区域id
            sufferList: this.mapData(dictionary[33]),
            textData: this.mapData(dictionary[3]),
            scaleList: this.mapData(dictionary[5]),
            financingList: this.mapData(dictionary[4]),
            educationList: this.mapData(dictionary[6]),
            jsList: this.mapData(dictionary[46]),
            typeList: this.mapData(dictionary[39]),
            clearing: this.mapData(dictionary[48]), // 结算方式
        })
        this.setData({ showLoading: true })
        if (options.type && options.type != 'undefined' && options.type != 'null') {
          this.setData({
            type: options.type,
          })
        }
        if (options.currentPost) {
            let transmitData = JSON.parse(options?.currentPost)
            console.log(transmitData,'0000')
            wx.setNavigationBarTitle({
                title: transmitData.name
            })
            this.setData({
                isSearch: false,
                transmitData:transmitData,
                simpleId: transmitData.id, // 热门岗位或者严选兼职点击tab进来
            })
            this.getListByHome(false)
        } else {
            this.setData({
                isSearch: true
            })
            // 调用全部岗位页面列表数据接口
            this.getListByHome(false)
        }
        if(options.city !== 'undefined'){
            this.setData({locationAddress: options.city})
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getIndustry()
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
    // 获取首页列表(全部岗位)
    async getListByHome(isBeachBottom) {
        let params = {
            edition:1,
            module:this.data.type?this.data.type:1,
            pageNum: this.data.pageNum,
            pageSize: this.data.pageSize,
            areaId: this.data.areaId,
            simpleId: this.data.simpleId,
            key: this.data.searchPostValue,
            search: this.data.searchPostValue ? true : false,
            simpleSearch: this.data.isSearch ? true : false,
            ...this.data.screen, // 筛选条件
        }
        this.setData({
            indexInfo: params
        })
        setTimeout(async () => {
            const result = await searchPostHome(params)
            //const result = await apiListByHome(params)
            if (result.code !== 200) {
                wx.showToast({
                    title: result.msg,
                    icon: 'none'
                })
                this.setData({ showLoading: false ,dataList: [] })
                return
            }
            if (isBeachBottom) {
                let arr = this.setListData(result.data.list)
                this.setData({ showLoading: false })
                this.setData({
                    dataList: [...this.data.dataList, ...arr],
                })
            } else {
                let newArr = result.data.list || []
                let arr = []
                arr = this.setListData(newArr)
                this.setData({ showLoading: false })
                this.setData({
                    dataList: arr,
                })
            }
            this.setData({
                isRefreshing: false,//关闭下拉刷新
                isFinish: this.data.dataList.length >= result.data.total //全部加载完毕
            })
        }, 0);
    },
    //列表数据结构整理
    setListData(newArr) {
        return newArr.map(item => {
            return {
                post: item.title,
                num: this.data.typeList[item.type]?.name,
                year: this.data.sufferList[item.experience]?.name || '',
                companyName: item.corporationName,
                city: item.city,
                province: item.province,
                tag: item.tag && item.tag.split(','),
                username: item.belonger,
                isH: item.redPacket,
                moneyType: item.moneyType,
                maximumMoney: item.maximumMoney,
                lowestMoney: item.lowestMoney,
                monthMoney: item.monthMoney,
                postId: item.id,
                bossUserId: item.belonger,
                outName: item.outName,
                avatar: item.avatar,
                outPost: item.outPost,
                stage: this.data.financingList[item.financeStage]?.name,
                corporationId: item.corporationId,
                //需要改字段，字段为scale
                scale: this.data.scaleList[item.scale]?.name,
                // distance: item.distance?.substring(0, 4),
                distance: item.distance,
                clearing: item.settlementUnit && this.data.clearing[item.settlementUnit - 1] ? this.data.clearing[item.settlementUnit - 1].name : '元/时', // 兼职结算方式
                looked: item.looked,
                activation: item.activation || '',
                online: item.online,
                urgent: item.urgent
            }
        })
    },
     //监听scroll滚动事件
     onRefresh() {
        console.log('上拉')
        this.setData({
            pageNum: 1
        })
        this.getListByHome(false)
    },
    onPulling: function (e) {
        // console.log(e,'9999')
    },
    onLoadMore: function () {
        console.log('下拉')
        this.setData({
            pageNum: this.data.pageNum+1
        })
        this.getListByHome(true)
    },
    // 关闭
    onClose() {
        this.setData({
            isOpen: false,
            isShow: false,
            isOpen1: false,
            arrowIcon: 'arrow-down',
            arrowIcon1: 'arrow-down',
        })
        this.selectedPost('clear')
    },
    // 地址确定
    comfirmCity(event){
        console.log(event,'9999:::::::::::::')
        if(!event.detail.name){
          wx.showToast({
              title: '请选择定位',
              icon: "none"
          })
          return
        }
        this.setData({areaId:event.detail.id,locationAddress: event.detail.name})
        this.onClose()
        this.getListByHome(false)
    },

    // 搜索文本清除
    clearKeyWord(){
        this.setData({searchPostValue: '',pageNum: 1})
        this.getListByHome(false)
    },

    confirm(event){
        console.log(event,'0000')
        this.setData({searchPostValue: event.detail})
        this.getListByHome(false)
    }
})