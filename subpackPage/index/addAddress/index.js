// subpackPage/index/addAddress/index.js
var app = getApp()
import { apiSetAddress, apiSaveAddress } from '../../../http/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isScrolling: true,
        searchAddress: '',
        clearable: false,
        addressList: [], // 地址列表
        baseImageUrl: app.globalData.baseImgUrl,
        locationAddress: '',
        adcode: '',
        adcodeId: '',
        timefn: null,
        id: null,
        timefn1: null
    },

    debounce(func, delay) {
        let timer = null;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    },
    // 搜索地址
    async input(event) {
        this.setData({
            timefn: this.debounce(() => {
                if (event.detail.trim()) {
                    let params = {
                        key: event.detail,
                        adcode: 130000, // 固定河北省
                        page: 1
                    }
                    apiSetAddress(params).then(result => {
                        console.log(result, '位置')
                        if (result.code !== 200) {
                            wx.showToast({
                                title: result.msg,
                                icon: 'none'
                            })
                            return
                        }
                        this.setData({
                            addressList: result.data
                        })
                    })
                } else {
                    this.setData({
                        addressList: []
                    })
                }
            }, 500)
        })
        this.data.timefn()
    },
    // 选择地址(某一个)
    async addressItem(event) {
        let { addressitem } = event.currentTarget.dataset
        console.log(addressitem, '地址')
        let params = {
            details: addressitem.address,
            lon: addressitem.location.split(',')[0],
            lat: addressitem.location.split(',')[1],
            province: addressitem.pname,
            city: addressitem.cityname,
            district: addressitem.adname,
            id: this.data.id
        }
        // 调用更新地址接口
        const { code, data, msg } = await apiSaveAddress(params)
        console.log(data, '保存地址')
        if (code !== 200) {
            wx.showToast({
                title: '保存地址失败',
                icon: 'none'
            })
            return
        }
        wx.navigateBack({
            delta: 1
        })
    },

    // 滚动到底部
    scrolltolower() {
        console.log(333)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options, '000')
        if (options.id === "undefined") {
            options.id = ''
        }
        this.setData({
            locationAddress: options.locationAddress,
            adcode: options.adcode,
            adcodeId: options.adcode,
            id: options.id ? options.id : null
        })
        // wx.setNavigationBarColor({
        //     frontColor: '#F5F5F5', // 导航栏标题颜色，包括返回按钮和标题文字

        //     backgroundColor: '#F5F5F5', // 导航栏背景颜色

        //     success: function (res) {
        //         console.log('导航栏颜色设置成功');
        //     },
        //     fail: function (res) {
        //         console.log('导航栏颜色设置失败：', res);
        //     }
        // });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})