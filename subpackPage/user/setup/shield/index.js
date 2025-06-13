// subpackPage/user/setup/shield/index.js

import { shieldCorporation,setShieldCorporation } from '../../../../http/user'


Page({

    /**
     * 页面的初始数据
     */
    data: {
        manage:true,
        userId:null,
        list:[],
        allChecked:false,
        value:'',
        clearable: true,
        page: 1, // 当前页码
        limit: 6, // 每页多少条
        totalPage: 0,
        total: 0, // 总条数
    },
    // 清除控件清除内容
    clearKeyWord(){
        this.setData({value: ''})
    },
    // input事件
    input(e){
        this.chengeCompany(e.detail.value)
    },
    // 确定事件
    confirm(e){
        this.chengeCompany(e.detail.value)
    },

     //搜索已屏蔽公司名称
     chengeCompany(data){
        this.setData({value:data})
        shieldCorporation({companyName:this.data.value,userId:this.data.userId}).then(res=>{
            if(res.code != 200){
                wx.showToast({
                  title: res.msg,
                  icon:'none'
                })
                return
            }
            let newList = res.data.map(item=>{
                return{
                    corporationId:item.corporationId,
                    corporationName:item.corporationName,
                    checked:false
                }
            })
            this.setData({list:newList})
        })
    },


    //批量管理，完成事件
    manageHandle(){
        this.setData({manage:!this.data.manage})
    },
    //添加屏蔽公司
    goToAddShield(){
        wx.navigateTo({
          url: '../addShield/index',
        })
    },

    //选中事件
    onChange(e){
        var index = e.currentTarget.dataset.index
        //克隆数组
        var newList = JSON.parse(JSON.stringify(this.data.list))
        //改变选中状态
        newList[index].checked = !newList[index].checked  
        //赋值给原数组      
        this.setData({list:newList})
        //过滤是否还有false的状态，设置全选状态
        var param = newList.filter(item =>{
            return item.checked == false
        })
        if(param.length == 0){
            this.setData({allChecked:true})
        }else{
            this.setData({allChecked:false})
        }
        //选中的添加到新数组中
        var checkedList = newList.filter(item=>{
            return item.checked == true
        })
        this.setData({checkedList:checkedList})
    },

    //全选按钮事件
    allOnChange(){
        let allChecked = !this.data.allChecked
        const list = this.data.list.map(item =>{
            item.checked = allChecked
            return item
        })
        this.setData({allChecked,list})
        
    },

    //解除屏蔽公司
    async relieveCompany(e){
        if(e.currentTarget.dataset.type){
            //解除选中屏蔽列表
            var newList = this.data.list.filter(item =>{
                return item.checked == true
            })
            var param = newList.map(item =>{
                return item.corporationId
            }).join(',')

        }else if(e.currentTarget.dataset.every){
            //清空屏蔽公司列表
            var param = this.data.list.map(item =>{
                return item.corporationId
            }).join(',')
        }else{
            //单个解除列表
            var param = e.currentTarget.dataset.id
        }
        console.log(param)
        if(!param) return
        const res = await setShieldCorporation({
            shieldStatus:0,
            userId:this.data.userId,
            corporationIds:param
        })
        if(res.code != 200) {
            wx.showToast({
              title: res.msg,
              icon:'none'
            })
            return
        }
        wx.showToast({
          title: '解除成功',
        })
        this.setData({allChecked:false})
        this.shieldCorporation()
    },
    // 获取已屏蔽的公司列表
    shieldCorporation(isLook){
        //查看屏蔽公司列表
        shieldCorporation({userId:this.data.userId,pageNum: this.data.page,pageSize: this.data.limit}).then(res=>{
            if(res.code != 200){
                wx.showToast({
                  title: res.msg,
                  icon:'none'
                })
                return
            }
            console.log(res,'9999')
            this.setData({page: res.data.current,totalPage: res.data.pages,total: res.data.total})
            var list = res.data.records.map(item =>{
                return {
                     corporationId:item.corporationId,
                     corporationName:item.corporationName,
                     checked:false
                }
             })
            if(isLook){
                let paging = [...this.data.list,...list]
                this.setData({list:paging})
            } else {
                this.setData({list:list})
            }
            // var list = res.data.records.map(item =>{
            //    return {
            //         corporationId:item.corporationId,
            //         corporationName:item.corporationName,
            //         checked:false
            //    }
            // })
        })
    },

    // 查看更多已屏蔽公司
    lookAll(){
        console.log(111)
        if(this.data.page != this.data.totalPage){
            this.setData({page: this.data.page += 1})
            this.shieldCorporation(true)
        } else {
            return
        }
        
    },

    onLoad(){
        this.setData({userId:wx.getStorageSync('userInfo').info.userId})
    },
    onShow(){
        this.setData({page: 1})
        this.shieldCorporation()
    }
})