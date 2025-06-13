// packageIm/pages/report/note_detail.js
import { recordDetail } from '../../../http/user'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        steps: [
            {
                text: '等待受理',
                desc: '您的举报已录入，等待受理中…',
                // inactiveIcon: 'location-o',
                // activeIcon: 'success',
            },
            {
                text: '提交举报信息',
                desc: '描述信息',
            },
        ],
        active: 1
    },
    // 获取对应id的举报详情
    recordDetail() {
        recordDetail({ recordId: this.data.id }).then(res => {
            if (res.code != 200) {
                wx.showToast({
                    title: res.msg,
                    icon: 'none'
                })
                return
            }
            this.data.steps[1].desc = res.data.createTime
            let _steps = this.data.steps
            res.data.imgUrls = JSON.parse(res.data.imgUrls)
            console.log(res.data,'0000')
            this.setData({
                info: res.data,
                steps: _steps
            })
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({ id: options.id })
        this.recordDetail()
    },

})