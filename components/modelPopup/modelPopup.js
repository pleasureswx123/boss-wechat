// components/modelPopup/modelPopup.js
Component({
    options: {
      multipleSlots: true
    },
    /**
     * 组件的属性列表
     */
    properties: {
      // 是否展示
      show: {
        type: Boolean,
        value: false
      },
      // 层级
      zIndex: {
        type: Number,
        value: 999
      },
      // popup样式
      customStyle: {
        type: String
      },
      // 开启具名插槽需要将这个属性变成custom
      refresherType: {
        type: String,
        value: 'default'
      },
      // 默认样式的title文本
      releaseText: {
        type: String,
        value: '确定退出登录吗 ？'
      },
      cancelText:{
        type: String,
        value: '取消'
      },
      sureText:{
        type: String,
        value: '确定'
      },
      // 确定按钮的背景颜色
      confirmColor: {
        type: String,
        value: '#F32E2E'
      },
      cancelColor: {
        type: String,
        value: '#666666'
      },
      popupBackground: {
        type: String,
        value: '#fff'
      },
      // 新增配置项（文本是否剧中）
      // 文本是否居中
      isTextContent: {
        type: String,
        value: 'left'
      }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
      // 取消按钮事件
      cancel(e){
        this.triggerEvent('cancel',e)
      },
      // 确定按钮事件
      confirm(e){
        this.triggerEvent('confirm',e)
      }
    }
})