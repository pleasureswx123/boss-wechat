import { getHotpostList } from '../../../http/versions'
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imageUrl: app.globalData.baseImgUrl,
    textData:[],
    selectedIdx:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getHotPostList()
  },
  goSearch(){
    wx.navigateTo({
      url: '/subpackPage/user/positionTypeNew/positionType',
    })
  },
  // 获取岗位热门推荐
  async getHotPostList() {
      const result = await getHotpostList({ver:1})
      console.log(result, '热门推荐')
      if (result.code !== 200) {
          wx.showToast({
              title: result.mag,
              icon: 'none'
          })
          return
      }
      this.setData({
          textData: result.data
      })
  },
  selectedItem(e){
    let item = e.currentTarget.dataset.item
    this.setData({
      selectedIdx:item.id
    })
    let itemobj={
      level3Name:item.name,
      level3:item.id
    }
    wx.reLaunch({
      url: `/subpackPage/user/editJobExpStep2/editJobExp?postItem=${JSON.stringify(itemobj)}`,
    })
  }
})