// components/company/company.js
var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        companyList: {
            type: Array,
            value: []
        },
        // 融资
        financingList: {
            type: Array,
            value: []
        },
        // 规模
        scaleList: {
            type: Array,
            value: []
        },
        type: {
            type: Number || String,
            value: '1'
        }
    },
    // 外部样式
    externalClasses: ['custom-class','imgae-size'],

    /**
     * 组件的初始数据
     */
    data: {
        baseImageUrl: app.globalData.baseImgUrl
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 去公司详情
        urlCompany(event){
            let {item} = event.currentTarget.dataset
            wx.navigateTo({
              url: `/subpackPage/index/corporation_detail/index?corporationId=${item.corporationId}`,
            })
        }
    }
})
