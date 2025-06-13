// components/popup-treatment/popup-treatment.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        otherWelfare: {
            type: Array,
            value: [],
        },
        height: {
            type: Number || String,
            value: 0
        },
        companyDetail: {
            type: Object,
            value: {},
            observer: (newVal)=>{
                
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    lifetimes: {
        
    },
    
    /**
     * 组件的方法列表
     */
    methods: {
        
    },
    created(){

        // console.log(this.data.companyDetail,'00000')
    }
})
