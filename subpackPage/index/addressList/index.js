import { seekerCollectAddress } from '../../../http/index'
const app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        seekerCollectAddressList: [], // 地址
        show: false,
        currentId: null, // 当前需要删除的地址id
        baseImageUrl: app.globalData.baseImgUrl,
        imageUrl: app.globalData.imImages,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        this.getSeekerCollectAddressList()
    },

    // 获取历史地址列表
    async getSeekerCollectAddressList() {
        let params = {}
        const res = await seekerCollectAddress(params, 0)
        if (res.code != 200) return
        this.setData({
            seekerCollectAddressList: res.data
        })
    },
    // 编辑地址或者新增地址
    addOreditAddress(event) {
        let currentId = ''
        if (event.currentTarget.dataset.id) {
            currentId = event.currentTarget.dataset.id
        }
        wx.navigateTo({
            url: `/subpackPage/index/addressDetail/index?id=${currentId}`,
        })
    },
    // 删除地址(二次确认)
    async deteleAddress(event) {
        let currentId = event.currentTarget.dataset.id
        this.setData({
            show: true,
            currentId
        })
    },
    // 取消(关闭弹窗)
    cloneShow() {
        this.setData({
            show: false
        })
    },
    // 确认删除(当前地址)
    async identifyHandle() {
        let params = {
            id: this.data.currentId
        }
        const res = await seekerCollectAddress(params, 4)
        console.log(res, '9999')
        if (res.code !== 200) return
        wx.showToast({
            title: '删除成功',
            icon: 'none',
        })
        this.setData({
            show: false
        })
        this.getSeekerCollectAddressList()
    },
    /**
     * 页面卸载
     */
    onUnload(){
      // 通知地址页面重新请求地址列表接口
      wx.$event.emit('SeekerCollectAddressList')
    }
})