// components/ghy-search/index.js
var app = getApp()
Component({
    // 搜索框高度类名
    externalClasses: (['height-class','selectHeight']),
    /**
     * 组件的属性列表
     */
    properties: {
        // 搜索框的初始值
        value: {
            observer(newVal, oldVal) {
                this.setData({
                    keyWord: newVal
                })
            }
        },
        // 输入框为空时的占位符
        placeholder: {
            type: String,
            value: '搜索'
        },
        // 修改input的样式类
        placeholderStyle: {
            type: String,
            value: 'font-size: 26rpx'
        },
        marginRight: {
            type: String,
            value: '0px'
        },
        // 右下角键盘按钮字体
        confirmType: {
            type: String,
            value: 'search'
        },
        // 是否上推页面
        adjustPosition: {
            type: Boolean,
            value: true
        },
        // 背景颜色
        background: {
            type: String,
            value: '#ffffff',
        },
        // 宽度 在具有定位的搜索框使用, 测试传递107%
        // 其余只有一个input的不需要传递
        width: {
            type: String,
            value: ''
        },
        // 输入框的最大输入
        maxlength: {
            type: Number,
            value: -1,
        },
        // 是否显示清除控件
        clearable: {
            type: Boolean,
            value: true,
        },
        clearTrigger: {
            type: String,
            value: 'focus',
        },
        // 清除控件的图表名称
        clearIcon: {
            type: String,
            value: 'clear',
        },
        // 搜索图标-(图片链接)
        searchIcon: {
            type: String,
            value: 'https://imgcdn.guochuanyoupin.com/resource/wechat/baseimages/searchIcon2.png',
        },
        padding_right: {
            type: Number,
            value: 24
        },
        isShowlistImg: {
            type: Boolean,
            value: true
        },
        selectList: {
            type: Array,
            value: [],
            // 监听
            observer: function (newVal, oldVal) {
                // console.log(newVal)
                // const regex = new RegExp(this.data.keyWord, "gi");
                // // newVal.map(

                // // )
                // const highlightedResult = newVal.map((item) => {
                //     return item.title.replace(regex, (match) => `<span style="color: red;">${match}</span>`);
                // });

                // console.log(highlightedResult);
            }
        }
    },
    options: {
        // styleIsolation: 'shared', // 解除样式隔离
        // addGlobalClass: true
    },
    /**
     * 组件的初始数据
     */
    data: {
        keyWord: '',
        highlightedContent: '',
        baseImageUrl: app.globalData.baseImgUrl
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 确定搜索
        confirm(event) {
            this.triggerEvent('confirm', event.detail.value)
        },
        // 聚焦
        focus() {
            this.triggerEvent('focus',this.data.keyWord)
        },
        // input事件 (实现双向绑定)
        input(event) {
            this.triggerEvent('input', event.detail.value)
        },
        // 点击清除按钮
        clearKeyWord(event) {
            this.setData({
                keyWord: ''
            })
            this.triggerEvent("clear", '')
        },
        // 模糊搜索列表点击事件
        hotSearch(event){
            let {item} = event.currentTarget.dataset
            console.log(item,'点击的项')
            this.triggerEvent("searchitem", item)
        }
    }
})
