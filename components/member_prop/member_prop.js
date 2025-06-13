var app = getApp()
Component({

    /**
     * 组件的属性列表
     */
    properties: {
        // 是否展示登录弹框
        show: {
            type: Object,
            value: null,
            observer: function (newVal) {
            }
        },
        // 位置
        position: {
            type: String,
            value: 'center'
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        imageUrl: app.globalData.baseImgUrl, //图片路径
    },
    lifetimes: {
        attached() {
            
        }
    },
    /**
     * 组件的方法列表
     */
    methods: {
      onClose(e){
        let { type } = e.currentTarget.dataset;
        this.triggerEvent('onClose',type)
      }
    }
})