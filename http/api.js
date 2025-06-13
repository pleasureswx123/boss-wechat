// 引入request请求
const {
  request
} = require('./http')
module.exports = {
  httpUrl: () => {
    //return 'http://192.168.110.244:8082'
    return 'https://api.guochuanyoupin.com/yp-api'
  },
  //字典
  dict: (data) => {
    return request(_url + 'dict/selectDictByType', 'get', data)
  },
  // ----------------- 消息 -----------------
  // 获取环信appkey
  imappkey: () => {
    return request('platform/config/imAppKey', 'get')
  },

  chatSessionList: (params) => {
    return request('message/messageChatSession', 'post', params)
  },
  messageChatSession: (params) => {
    return request('message/messageChatSession/getChatSessionStatus', 'get', params)
  },
  //面试签到
  messageChatSign: (userId, recordId) => {
    return request(`interview/interviewRecord/signInConfirm/${userId}/${recordId}`, 'put')
  },
  // 常用语
  getUseful: () => {
    return request('chat/usualMsg/get', 'get')
  },
  addUseful: (params) => {
    return request('chat/usualMsg/add', 'post', params)
  },
  updateUseful: (params) => {
    return request('chat/usualMsg/save', 'post', params)
  },
  delUseful: (params) => {
    return request('chat/usualMsg/remove', 'post', params)
  },
  //对我感兴趣
  getCollectedToMeList: (params) => {
    return request('alternately/collect/getCollectedToMeList', 'get', params)
  },
  //看过我
  getLookList: (params) => {
    return request('alternately/look/getLookList', 'get', params)
  },
  //新职位
  getNewPostList: (params) => {
    return request('post/publishPost/getNewPostList', 'get', params)
  },
  //查看面试信息
  interviewRecord: (interviewRecordId) => {
    return request(`interview/interviewRecord/${interviewRecordId}`, 'get')
  },
  //设置拉黑状态
  messageChatBlock: (interviewRecordId) => {
    return request(`interview/interviewRecord/${interviewRecordId}`, 'get')
  },
  //会话置顶
  topMessageChatDetail: (params) => {
    return request(`message/messageChatSession/${params.id}/${params.topStatus}`, 'put')
  },
  //会话删除
  delMessageChatDetail: (hxUsername, params) => {
    return request(`message/messageChatSession/${hxUsername}`, 'delete', params)
  },
  //历史消息
  historyMessage: (params) => {
    return request(`message/messageChatDetail/history`, 'post', params)
  },
  //沟通过
  jobSeekerJobRecord: (params) => {
    return request(`interview/interviewRecord/jobSeekerJobRecord`, 'get', params)
  },
  //收藏职位
  getCollectedPostByUserId: () => {
    return request(`alternately/collect/getCollectedPostByUserId`, 'get')
  },
  //收藏公司
  getCollectedCorporationList: () => {
    return request(`correlation/getCollectedCorporationList`, 'get')
  },
  //消息通知
  getSystemMsg: (userId, params) => {
    return request(`system/systemMsg/all`, 'get', params)
  },
  //系统通知详情
  getSystemDetail: (id) => {
    return request(`system/systemMsg/details/${id}`, 'get')
  },
  //待面试
  jobSeekerInterviewSchedule: (params) => {
    return request(`interview/interviewRecord/jobSeekerInterviewSchedule`, 'get', params)
  },
  //求职意向列表
  apiJobExpectationList: () => {
    return request(`resume/jobExpectation/getJobExpectationList`, 'get')
  },
  //获取简历状态
  apiGetStatus: (params) => {
    return request(`user/jobSeekerPersonalSettings/getHideResumeToBoss`, 'post', params)
  },
  //设置简历状态
  apiSetStatus: (params) => {
    return request(`user/jobSeekerPersonalSettings/setHideResumeToBoss`, 'post', params)
  },
  //求职状态用户修改
  apiUserJobDetails: (params) => {
    return request(`user/userJobDetails/update`, 'post', params)
  },
  //求职状态用户修改
  apiWxNo: (params) => {
    return request(`user/set/changeWxNo`, 'put', params)
  },
  //求职状态用户昵称修改
  updateNick: (params) => {
    return request(`user/userJobDetails/updateNick`, 'post', params)
  },
  //获取求职状态
  apiUserJobStatus: () => {
    return request(`user/userJobDetails/status`, 'get')
  },
  // 求职期望新增
  apijobExpectationAdd: (params) => {
    return request(`resume/jobExpectation/add`, 'post', params)
  },
  //求职期望删除
  apiRemoveById: (params) => {
    return request(`resume/jobExpectation/removeById`, 'get', params)
  },
  // 求职期望详情
  apiJobExpectation: (params) => {
    return request(`resume/jobExpectation/getJobExpectation`, 'get', params)
  },
  // 求职期望修改
  apiUpdate: (params) => {
    return request(`resume/jobExpectation/update`, 'post', params)
  },
  //职位数据
  dictionaryPosts: () => {
    return request(`system/dictionary/posts`, 'get')
  },
  //行业数据
  dictionaryIndustry: () => {
    return request(`system/dictionary/industry`, 'get')
  },
  //拥有技能
  apiSystemVocation: (param) => {
    return request(`system/dictionary/vocation/skill`, 'get', param)
  },
  //资格证书
  apiCertification: (param) => {
    return request(`system/dictionary/certification`, 'get', param)
  },
  //查看教育经历
  apiResumeEducationDetail: (param) => {
    return request(`resume/educationExperience/getJobExpectation`, 'get', param)
  },
  //保存教育经历
  apiResumeEducationSave: (param) => {
    return request(`resume/educationExperience/save`, 'post', param)
  },
  //删除教育经历
  apiResumeEducationRemove: (param) => {
    return request(`resume/educationExperience/removeById`, 'get', param)
  },
  //简历附件列表
  resumeFileList: (param) => {
    return request(`resume/resumeFile/list`, 'get', param)
  },
  //简历附件新增
  apiResumeSave: (param) => {
    return request(`resume/resumeFile/save`, 'post', param)
  },
  //简历附件更新
  resumeFileUpdate: (param) => {
    return request(`resume/resumeFile/update`, 'post', param)
  },
  //简历附件删除
  apiResumeRemove: (param) => {
    return request(`resume/resumeFile/removeById`, 'get', param)
  },
  //发送消息
  messageChatDetail: (params) => {
    return request(`message/messageChatDetail`, 'post', params)
  },
  //发送接受面试消息
  agreeInterview: (params) => {
    return request(`interview/agreeInterview`, 'post', params)
  },
  //聊天设置-获取聊天设置状态
  getOptionStatus: (chatSessionId) => {
    return request(`message/optionStatus/${chatSessionId}`, 'get')
  },
  //修改黑名单状态
  messageChatBlock: (params) => {
    return request(`message/messageChatBlock/${params.ownerId}/${params.targetId}/${params.blockStatus}`, 'put')
  },
  //设置不感兴趣
  savaInappropriate(params) {
    return request(`alternately/inappropriate/doInappropriate`, "post", params);
  },
  //获取用户信息
  getMsgUserInfo: (userId) => {
    return request(`message/getUserInfo/${userId}`, 'get')
  },
  //今日速配
  fastMate: () => {
    return request(`post/publishPost/fastMate`, 'get')
  },
  //设置已读
  readMessageChatDetail: (ownerId, targetId) => {
    return request(`message/messageChatDetail/${ownerId}/${targetId}`, 'put')
  },
  //清除待邀请弹窗
  rmInvite: (interviewRecordId) => {
    return request(`interview/interviewRecord/rminvite/${interviewRecordId}`, 'get')
  },
  //清除面试结果弹窗
  rmresult: (interviewRecordId) => {
    return request(`interview/interviewRecord/rmresult/${interviewRecordId}`, 'get')
  },
  //修改消息状态
  updateCustomMsgStatus: (param) => {
    return request(`message/messageChatDetail/updateCustomMsgStatus/${param.hxMsgId}/${param.customMsgStatus}`, 'put')
  },
  //获取消息未读数
  getUnreadCount: (param) => {
    return request(`message/messageChatSession/unreadCount`, 'get', param)
  },
  //检测求职用户信息是否完成
  checkContent: () => {
    return request(`user/set/checkContent`, 'get')
  },
  //获取可修改昵称次数
  changeNickCount: () => {
    return request(`user/userJobDetails/changeNickCount`, 'get')
  },
  //获取可修改微信
  changeWxCount: () => {
    return request(`user/set/changeWxCount`, 'get')
  },
  //获取道具购买订单详情 (刷新卡)
  apiYdOrderDetail: (params) => {
    return request(`prop/payInfo`, 'get', params)
  },
  //获取商品列表
  apiProductList: (params) => {
    return request(`api/product/list`, 'get', params)
  },
  //获取道具购买页面
  apiPropOrderSave: (params) => {
    // return request(`/prop/propOrder/save`,'post',params)
    // 知豆抵扣接口
    return request(`prop/order/directBuy`, 'post', params)
  },
  //获取知豆余额
  apiYdBalance: () => {
    return request(`coins/account/getBalance`, 'get')
  },
  //微信支付接口
  apiWxPay: (params) => {
    return request(`api/wx-pay/createOrder`, 'post', params)
  },
  // 微信支付
  WxcreateOrder: (params) => {
    return request(`pay/createOrder`, 'post', params)
  },
  //道具商城首页获取数据
  wechatCount: () => {
    return request(`prop/wechat/count`, 'get')
  },
  //获取offer信息
  offerRecord: (offerRecordId) => {
    return request(`interview/offerRecord/${offerRecordId}`, 'get')
  },
  //设置消息已读
  changeAlreadyReadStatus: (chatId) => {
    return request(`message/messageChatDetail/changeAlreadyReadStatus/${chatId}`, 'post')
  },

  // 添加求职期望或者获取当前求职期望的期望城市
  getPostInfoArea: (params) => {
    return request(`system/area/getInfo`, 'get', params)
  },
  // app上传简历
  apiUpLoadFileFn: (params) => {
    return request(`wechat/loginUpload/check`, 'post', params)
  },
  // 个人获取全部面试记录
  getInterviewAll(params) {
    return request(`interview/interviewRecord/jobSeekerJobRecord`, 'get', params)
  },
  //消息未读数
  getAllUnMsg: () => {
    return request(`message/messageChatDetail/newCountMark`, 'get')
  },
  //搜索职位类型
  searchPostList: (params) => {
    return request(`system/dictionary/search/posts`, 'get', params)
  },
  //列表
  searchPostHome:(params)=>{
    return request(`search/post/home`, 'post', params)
  },


  /**
   * 求职者获取面试记录
   * @params {Number} pageNum 页码
   * @params {Number} pageSize 每页条数
   * @params {Number} corporationId 
   * @return Promise
   */
  getInterviewRecord:(params)=>{
    return request(`/interview/interviewRecord/historyForSeeker`,'get',params)
  },

  /**
   * 求职者获取提现记录
   * @params {Number} pageNum 页码
   * @params {Number} pageSize 每页条数
   * @return Promise
   */

   getWithdrawalList(params){
    return request(`/red/account/withdrawalList`,'get',params)
   },

    //消息通知一键清除
    oneClickRead:()=>{
    return request(`system/systemMsg/oneClickRead`, 'get')
  },

  // 跳转服务接口
  jumpService: (data) => {
    return request("share/new/toPageData", "post", data);
  },

  // 助力命中统计接口
  helpHitStatistics: (data) => {
    return request("share/new/hit", "post", data);
  },

  // 助力活动相关接口
  helpActivityApi: {
    // 获取助力活动信息
    getActivityInfo: (shareCode) => {
      return request('/api/v1/help/activity/info', 'get', { shareCode })
    },
    
    // 执行助力
    doHelp: (shareCode) => {
      return request('/api/v1/help/do', 'post', { shareCode })
    },
    
    // 获取助力结果
    getHelpResult: (shareCode) => {
      return request('/api/v1/help/result', 'get', { shareCode })
    }
  }
}