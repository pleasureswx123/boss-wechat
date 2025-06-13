// 引入request请求
const {
  request
} = require('./http')
module.exports = {
  //获取用户信息
  getUserInfo: () => {
    return request('user/info', 'get')
  },
  //获取我的页面沟通过，收藏，数据
  getMyPageInfo: (params) => {
    return request('message/messageChatSession/myPageInfo', 'get', params)
  },
  //获取阿里云临时长传凭证
  getUploadCredential: () => {
    return request('aliyun/upload/credential', 'get')
  },
  //添加意见反馈
  addOpinion(params) {
    return request('opinion/add', 'post', params)
  },
  //我的反馈列表
  getOpinionList(params) {
    return request('opinion/get', 'get', params)
  },
  //我的客服
  getCustomerList(params) {
    return request('system/customerServiceHelpType/info', 'get', params)
  },
  //关于详情
  getAboutDetail(params) {
    return request(`system/common/systemText/${params}`, 'get')
  },
  //修改手机号
  changePhone(params) {
    return request(`user/set/changePhone`, 'put', params)
  },
  //绑定手机发送验证码
  phoneBind(params) {
    return request(`sms/bind`, 'get', params)
  },
  //设置通知与提醒
  setNotification(params) {
    return request(`user/jobSeekerPersonalSettings/notificationAndReminder`, 'post', params)
  },
  //查看通知与提醒
  notification(params) {
    return request(`user/jobSeekerPersonalSettings/notificationAndReminder/${params}`, 'get')
  },
  //查看BOSS查看权限
  privacyProtectionBoss(params) {
    return request(`user/jobSeekerPersonalSettings/privacyProtectionBoss/${params}`, 'get')
  },
  //设置BOSS查看权限
  setPrivacyProtectionBoss(params) {
    return request(`user/jobSeekerPersonalSettings/privacyProtectionBoss/${params.userId}`, 'post', params)
  },
  //打招呼列表
  getList(params) {
    return request(`chat/greetings/getList`, 'get', params)
  },
  //查看打招呼语信息
  greeting(params) {
    return request(`user/jobSeekerPersonalSettings/greeting/${params}`, 'get')
  },
  //设置打招呼语信息
  setGreeting(params) {
    return request(`user/jobSeekerPersonalSettings/greeting/${params.userId}`, 'post', params)
  },
  //查看屏蔽公司列表
  shieldCorporation(params) {
    return request(`system/shieldCorporation/${params.userId}`, 'get', params)
  },
  //修改屏蔽公司
  setShieldCorporation(params) {
    return request(`system/shieldCorporation`, 'post', params)
  },
  //企业列表查询
  simplelist(params) {
    return request(`company/noBlackList`, 'get', params)
  },
  //查看求职红包信息
  jobRedEnvelopeInfo(params) {
    return request(`interview/interviewRecord/jobRedEnvelopeInfo/${params.userId}`, 'get', params)
  },
  //查看简历详情
  getResumeNotes(params) {
    return request(`resume/resumeNotes/getResumeNotes`, 'post', params)
  },
  //在线简历保存（资格证书，个人优势，隐藏简历）
  setSave(params) {
    return request(`resume/resumeNotes/save`, 'post', params)
  },
  //工作经历保存
  setWorkExperience(params) {
    return request(`resume/workExperience/save`, 'post', params)
  },
  //获取工作经历详情
  getJobExpectation(params) {
    return request(`resume/workExperience/getJobExpectation`, 'get', params)
  },
  //删除工作经历
  apiResumeWorkExperienceRemove(params) {
    return request(`resume/workExperience/removeById`, 'get', params)
  },
  //项目保存
  apiResumeProjectExperienceSave(params) {
    return request(`resume/projectExperience/save`, 'post', params)
  },
  //项目详情
  apiResumeProjectExperience(params) {
    return request(`resume/projectExperience/getJobExpectation`, 'get', params)
  },
  //删除项目
  apiResumeProjectExperienceRemove(params) {
    return request(`resume/projectExperience/removeById`, 'get', params)
  },
  //举报总类型
  dictionaryList(params) {
    return request(`system/dictionary/list`, 'get', params)
  },
  //提交投诉举报
  complaintRecord(params) {
    return request(`system/complaintRecord`, 'post', params)
  },
  //获取投诉举报记录
  recordList(params) {
    return request(`system/complaintRecord/list/${params.userId}`, 'get', params)
  },
  //获取投诉举报详情
  recordDetail(params) {
    return request(`system/complaintRecord/${params.recordId}`, 'get', params)
  },
  //获取道具详情
  getProp(params) {
    return request(`prop/myProps`, 'get', params)
  },
  //使用道具后，沟通过的列表
  getPostListByConcatAndPropUsed(params) {
    return request(`prop/refresh/getConcatPropData`, 'get', params)
  },
  //使用道具后，查看过的列表
  getPostListByLookedAndPropUsed(params) {
    return request(`prop/refresh/getLookedPropData`, 'get', params)
  },
  // 使用道具(激活道具)
  saveaProp(params) {
    return request(`prop/activate`, 'post', params)
  },
  // 查看道具使用状态
  propStatus(params) {
    return request(`prop/status`, 'get', params)
  },
  //道具列表
  getPhoneProp(aid){
    return request(`/prop/phone/phoneFromMeList/${aid}`,'get')
  },
  //院校信息
  school(params) {
    return request(`system/dictionary/school`, 'get', params)
  },
  //职位信息
  specialty(params) {
    return request(`system/dictionary/specialty`, 'get', params)
  },
  //教育经历保存
  educateSub(params) {
    return request(`resume/educationExperience/save`, 'post', params)
  },
  // 教育经历删除
  deletaEducation(id) {
    return request(`resume/educationExperience/removeById?id=${id}`)
  },
  //查看是否有道具在使用
  propUsing(propType) {
    return request(`prop/using/${propType}`, 'get')
  },
  //道具使用  沟通过  的折线图
  getConcatPropChart(params) {
    return request(`prop/refresh/getConcatPropChart/${params}`, 'get', params)
  },
  //道具使用  查看过  的折线图
  getLookPropChart(params) {
    return request(`prop/refresh/getLookPropChart/${params}`, 'get', params)
  },
  //查看隐藏保护-boss权限
  apigetBossStatus: (params) => {
    return request(`user/jobSeekerPersonalSettings/privacyProtectionBoss/${params.userId}`, 'get', params)
  },
  //获取购买记录
  getPropOrderLog: (params) => {
    return request(`api/order-info/list`, 'get', params)
  },
  //获取消费明细 (0.全部 1.i获取 3.已使用)
  accountLogList: (params) => {
    return request(`coins/accountLog/getList`, 'get', params)
  },
  //评分
  resumeSocre: () => {
    return request(`resume/resumeNotes/resumeSocre`, 'get')
  },
  //修改手机号次数
  changePhoneCount: () => {
    return request(`user/set/changePhoneCount`, 'get')
  },
  // 添加自定义打招呼语
  addCostomGreet(params) {
    return request(`chat/greetings/add`, 'post', params)
  },
  // 删除打招呼语
  deleteCostomGreet(id) {
    return request(`chat/greetings/del/${id}`, 'delete')
  },
  // 修改打招呼语
  updateCostomGreet(params) {
    return request(`chat/greetings/update/${params.id}`, 'post', params)
  },
  /**
 * 获取会员列表
 */
  getViprightsList(params) {
    return request('vip/rightsList', 'get', params)
  },
  /**
   * 获取会员详情
   * @param {*} params 
   * @returns Promise
   */
  getBeforePayDetails(params) {
    return request(`vip/beforePayDetails`, 'get', params)
  },
  // vip会员
  setVipDirectBuy(params) {
    return request(`vip/directBuy`, 'post', params)
  },
  /**
 * 获取会员购买详情
 */
  getVipCenterRights(params) {
    return request(`vip/vipCenterRights`, 'get', params)
  },
  // 购买记录
  getMemberRecord(params) {
    return request(`vip/getRecord`, 'get', params)
  },
  //vip会员过期提醒
  getVipExpireAlert: () => {
    return request(`vip/vipExpireAlert`, 'get')
  },
  //vip会员过期提醒消除
  getVipExpireAlertBtn: (params) => {
    return request(`vip/vipExpireAlertBtn`, 'get', params)
  },
  //设置邀请码
  setInviteCode: (params) => {
    return request(`user/set/set/inviteCode`, 'post', params)
  },
  //道具购买明细
  getProductOrders: (params) => {
    return request('api/order-info/productOrders/', 'get', params)
  },

  /**
   * 获取标记列表
   * @params 无
   * @return Promise
   */
  getNewNoticeTag(){
    return request(`system/newNoticeTag/list`,'get')
  },

  /**
   * 取消标记
   * @params myWallet string 标记字符串（展示红点的名称）
   * @return Promsie
   */
  cancelNoticeTag(myWallet){
    return request(`system/newNoticeTag/cancel/${myWallet}`,'get')
  },
   /**
    * 获取公司名称列表
    * @params name
    * @return Promise
    */
  getCompanySimplelist(params){
    return request(`company/simplelist`,'get',params)
  },
  // 我的道具使用之后数据：置顶卡-查看过我的统计
  getLookPropCensus(id){
    return request(`prop/top/getLookPropCensus/${id}`,'get')
  },
  // 我的道具使用之后数据：置顶卡-沟通过我的统计
  getTopConcatProp(id){
    return request(`prop/top/getConcatPropCensus/${id}`,'get')
  },
  // 我的道具使用之后数据：刷新简历-查看过我的统计
  getReLookPropCensus(id){
    return request(`prop/refresh/getReLookPropCensus/${id}`,'get')
  },
  // 我的道具使用之后数据：刷新简历-沟通过我的统计
  getRefreshConcatProp(id){
    return request(`prop/refresh/getConcatPropCensus/${id}`,'get')
  },
  //使用效果：电话和AI使用记录(按天统计)
  getUsedByDayRecords(aid){
    return request(`prop/getUsedByDayRecords/${aid}`,'get')
  },
  //ai点击列表展示的具体详情列表(按天)
  getDayDataRecords(param){
    return request(`prop/ai/getDayDataRecords`,'get',param)
  },
  //虚拟电话展示的具体详情列表（按天）
  getPhoneDataRecords(param){
    return request(`prop/phone/getDayDataRecords`,'get',param)
  },
  //aI帮写/虚拟电话激活并使用接口
  getCheckAiOrPhone(param){
    return request(`prop/activateAndUsed`,'post',param)
  },
  //求职端红包没得到去申诉
  appealSave:(params)=>{
    return request(`system/appeal/save`, 'post', params)
  },
  //提现
  withdrawal:(params)=>{
    return request(`coins/positionRedpacket/withdrawal`, 'post', params)
  },
  //求职红包金额
  redView:()=>{
    return request(`red/account/redView`, 'get')
  },
  //求职红包列表
  getJobRedEnvelopeInfo:(params)=>{
    return request(`red/account/interviewRecord/jobRedEnvelopeInfo`, 'get',params)
  },
  /**
   * 是否有活动并且展示路费红包
   * @param 无
   * @return Promise
   */
  showActivity(){
    return request(`/activity/assistance/showActivity`,'get')
  }
}