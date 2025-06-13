import {getOptionStatus,messageChatBlock,delMessageChatDetail,savaInappropriate} from '../../../http/api'
import {showToast} from '../../../utils/util'
const app =  getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseImgUrl:app.globalData.baseImgUrl,
        checked:false,
        isChecked:false,
        defaultImage: '?x-oss-process=image/resize,w_100/quality,q_50', // 图片压缩
        outShow:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            userInfo:JSON.parse(options.userInfo)
        })
        console.log(this.data.userInfo)
        //获取聊天设置状态
        this.getOptionStatus()
    },
    chatNot(e){
      this.setData({
        isChecked:e.detail
      })
      this.interChange(e.detail)
    },
    chatChenge(e){
        this.setData({
            checked:e.detail
        })
        this.blackChange(e.detail)
    },
    async getOptionStatus(){
        let {code,data,msg} = await getOptionStatus(this.data.userInfo.chatId)
        if(code==200) 
            this.setData({
                checked:data.blockStatus?true : false,
                isChecked:data.inappropriateStatus?true:false
            })
    },
    goPage(e){
        let positionId = this.data.userInfo.publishPostId ? this.data.userInfo.publishPostId : this.data.userInfo.jobId
        wx.navigateTo({
            url: '/packageIm/pages/report/index?respondent='+this.data.userInfo.targetUserIds+'&positionId='+positionId
        })
    },
    gotoCurrentInvite(){
        let belonger = this.data.userInfo.targetUserIds
        let avatar = this.data.userInfo.targetAvatar
        let outPost = this.data.userInfo.targetName
        let outName = this.data.userInfo.targetJob
        let corporationName = this.data.userInfo.targetCompany
        let corporationId = this.data.userInfo.publishPostId
        wx.navigateTo({
            url: `/subpackPage/index/post_detail/index?belonger=${belonger}&outPost=${outPost}&outName=${outName}&corporationName=${corporationName}&avatar=${avatar}&corporationId=${corporationId}`,
        })
    },
    interChange(e){
      console.log('修改不感兴趣状态')
        let param={
          type: 2,
          status: e ? 1 : 0,
          recruiterUserId: this.data.userInfo.targetUserIds,
          reason: null
        }
        savaInappropriate(param).then(res=>{
            if(res.code==200) showToast('操作成功')
        })
    },
    blackChange(e){
        console.log('修改黑名单状态')
        let _blockStatus=''
        if(e==true){
            _blockStatus = 'block'
        }else{
            _blockStatus = 'unblock'
        }
        let param={
            blockStatus:_blockStatus,
            ownerId:this.data.userInfo.myHx,
            targetId:this.data.userInfo.your
        }
        messageChatBlock(param).then(res=>{
            if(res.code==200) showToast('操作成功')
        })
    },
    del(){
      this.setData({
        outShowMsg:'将对方从你的列表中删除，同时删除聊天记录？',
        sureText:'删除',
        outShow:true
      })
    },
    cloneShow(){
      this.setData({
        outShow:false
      })
    },
    confirmFun(event) {
        let detail = this.data.userInfo;
        let param = {
          channel:detail.your,
          delete_roam:true,
          type:'chat'
          }
          let hxUname = detail.myHx
          delMessageChatDetail(hxUname,param).then(res=>{
              if(res.code==200){
                  showToast('删除成功')
                  setTimeout(()=>{
                      wx.reLaunch({
                          url: '/packageIm/pages/main/index?pageType=tabBar',
                      })
                  },800)
              }
          })
        // wx.showModal({
        //     title: "将对方从你的列表中删除，同时删除聊天记录？",
        //     confirmText: "删除",
        //     success: function (res) {
        //     if (res.confirm) {
        //         /////
        //     }
        //     },
        //     fail: function (err) {
        //         console.log('删除列表', err);
        //     }
        // });
},
})