// subpackPage/versions/sclectPost/sclectPost.js
import { getHotpostList, saveSelectpost } from '../../../http/versions.js'
import { showToast } from '../../../utils/util'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    navBarHeight: app.globalData.navBarHeight,
    baseImageUrl: app.globalData.baseImgUrl,
    globalBottom: app.globalData.globalBottom,
    defaultImage: '?x-oss-process=image/resize,w_100/quality,q_90',
    hotPostList: [], // 热门推荐岗位列表
    selectPostList: [], // 选中的岗位列表
    maxLength:3
  },
  // 获取热门推荐岗位列表
  async hotpostList() {
    const res = await getHotpostList()
    console.log(res, '88888')
    if (res.code !== 200) return
    res.data = res.data.map(item => {
      return { ...item, select: false }
    })
    this.setData({ hotPostList: res.data })
    console.log(this.data.hotPostList, '0000')
  },
  // 选中某一个岗位
  selectItem(event) {
    console.log(event, '0000')
    let _selectPostList = this.data.selectPostList
    let _hotPostList = this.data.hotPostList
    let postId = event.currentTarget.dataset.postid
    const screenTrue = _hotPostList.filter(e => e.select == true)
    // 循环查找出选中的选项并且追加到选中的数组中
    _hotPostList = _hotPostList.map(item => {
      if (item.id == postId) {
        if (item.select) {
          item.select = false
          _selectPostList = _selectPostList.filter(e => e.postId !== postId)
        } else {
          if (_selectPostList.length > 2 || screenTrue.length > 2) {
            showToast('最多选择3个')
          } else {
            item.select = true
            _selectPostList.push({id: null,postId: item.id,name: item.name})
          }
        }
      }
      return item
    })
    // 更新
    this.setData({ selectPostList: _selectPostList, hotPostList: _hotPostList })
  },
  //跳转选择多个求职期望
  morePost(){
    
  },
  // 删除当前选中的岗位（某一个）
  deleteCurrent(event) {
    console.log(event, '0000')
    let { postid, index } = event.currentTarget.dataset
    let _hotPostList = this.data.hotPostList
    let _selectPostList = this.data.selectPostList.filter(i=>i.postId != postid)
    // 找到hotPostList中与被删除项相同的postId并将select设置为false
    _hotPostList = _hotPostList.map(item => {
      if (item.id === postid) {
        item.select = false;
      } 
      return item;
    });
    this.setData({
      selectPostList: _selectPostList,
      hotPostList: _hotPostList
    })
  },
  // 清除
  cancelFn() { 
    let _hotPostList = this.data.hotPostList
    // 创建一个空数组存储待删除的索引
    _hotPostList = _hotPostList.map(item=>{
      item.select = false
      return {...item}
    })
    this.setData({
      hotPostList: _hotPostList,
      selectPostList: []
    })
  },
  // 用户点击确定按钮保存选中的求职期望
  async confirmSave() {
    // 从用户第一次登陆获取到的地址信息
    //let postArea = wx.getStorageSync('postArea')
    let params = {
      cityId: this.data.addressDetail.id,
      cityName: this.data.addressDetail.name,
      ids: this.data.selectPostList.map(item=>{
        return {
          postId: item.postId,
          postName: item.name
        }
      })
    }
    console.log(params,'8888::::::::')
    const res = await saveSelectpost(params)
    if (res.code !== 200) return showToast(res.msg)
    showToast('保存成功')
    wx.reLaunch({
      url: `/subpackPage/versions/jobManage/jobManage`,
    })
  },

  // 查看更多
  gotoClassicsPostType(){
    console.log(this.data.selectPostList,'选择的岗位')
    let that=this
    wx.navigateTo({
        url: `/subpackPage/versions/classicsPostType/classicsPostType?step=1&postList=${JSON.stringify(this.data.selectPostList)}`,
        events: {
            selectTags: function (data) {
                console.log(data,'选择后的数据')
                let _selectedList=[]
                let _hotPostList = that.data.hotPostList
                data.selectTags.ids.map(item=>{
                  _selectedList.push({id:item.id,name:item.postName,postId:item.postId})
                })
                _hotPostList = _hotPostList.map(hotPost => {
                  return {
                    ...hotPost,
                    select: _selectedList.some(selected => selected.postId === hotPost.id)
                  };
                });
                setTimeout(() => {
                    that.setData({
                      selectPostList:_selectedList,
                      hotPostList: _hotPostList
                    })
                }, 100)
            }
        }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options,'传递的参数')
    if(options.addressDetail){
      this.setData({
        addressDetail:JSON.parse(options.addressDetail)
      })
    }
    this.hotpostList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },
})