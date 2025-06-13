// components/title_list/title_list.js
var app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title: String,
        colorText: String,
        change: String,
        widthImg: String,
        heightImg: String,
        textColor: String,
        isHot: Boolean,
    },

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
        //删除历史记录
	  delefeEvent(){
        // this.$emit("delefeEvent");//把this.mycounter传递给父组件
        this.triggerEvent('delefeEvent')
    }
    }
})
