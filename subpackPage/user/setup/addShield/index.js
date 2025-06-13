// subpackPage/user/setup/addShield/index.js
import { simplelist, setShieldCorporation } from '../../../../http/user'
import {showToast} from '../../../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    value: '',
    checkedList: [],
    allChecked: true,
    isCheckedOrAll: false, // 是否有选中或者全选
  },

  //搜索公司名称
  change(e) {
    this.setData({ value: e.detail })
    let name = this.data.value
    if (!name) {
      this.setData({ list: [] })
      return
    }
    simplelist({ name }).then(res => {
      if (res.code != 200) return showToast(res.msg)
      var newList = res.rows.map(item => {
        return {
          cid: item.cid,
          name: item.name,
          checked: true
        }
      })
      this.setData({ list: newList,isCheckedOrAll: true,checkedList: newList })
    })
  },

  //单个点击选中事件
  onChange(e) {
    let index = e.currentTarget.dataset.index
    //克隆数组
    let newList = JSON.parse(JSON.stringify(this.data.list))
    //改变选中状态
    newList[index].checked = !newList[index].checked
    //赋值给原数组      
    this.setData({ list: newList })
    //过滤是否还有false的状态，设置全选状态
    let param = newList.filter(item => {
      return item.checked == false
    })
    this.data.isCheckedOrAll = newList.some(i=>i.checked == true)
    console.log(this.data.isCheckedOrAll,'11222skadha')
    if (param.length == 0) {
      this.setData({ allChecked: true })
    } else {
      this.setData({ allChecked: false})
    }
    this.setData({isCheckedOrAll: this.data.isCheckedOrAll})
    
    //选中的添加到新数组中
    let checkedList = newList.filter(item => {
      return item.checked == true
    })
    this.setData({ checkedList: checkedList })
  },

  //全选CheckBox
  allOnChange() {
    this.setData({ allChecked: !this.data.allChecked,isCheckedOrAll: !this.data.allChecked })
    var newlist = this.data.list.map(item => {
      return {
        checked: this.data.allChecked,
        cid: item.cid,
        name: item.name
      }
    })
    this.setData({ list: newlist })
  },

  //屏蔽所选公司
  relieveCompany() {
    let _checkedList = this.data.checkedList
    console.log(_checkedList,'选中的屏蔽公司')
    if(_checkedList.length == 0) return
    var str = _checkedList.map(item => {
      return item.cid
    }).join(',')
    let param = {
      corporationIds: str,
      shieldStatus: 1,
      userId: wx.getStorageSync('userInfo').info.userId
    }
    setShieldCorporation(param).then(res => {
      if (res.code != 200) return showToast(res.msg)
      showToast('屏蔽成功')
      setTimeout(() => {
        wx.navigateBack()
      }, 1000)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  }
})