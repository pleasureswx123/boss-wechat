// 引入request请求
const { request } = require("./http");


module.exports = {
  // 经典版
  // ---------- 推荐岗位 ----------

  /**
   * 获取热门推荐岗位列表
   * @param 无/size个数ver:1至臻版；默认2经典版
   * @return Promise
   */
  getHotpostList(params) {
    return request(`classics/hotPosts`, 'get',params)
  },
  /** 经典版获取求职期望
   * @param 无
   * @return Promise
   */
  getJobExpectations() {
    return request(`classics/jobExpectations`, 'get')
  },

  /**
   * 保存选择的求职期望
   * @params 选择的求职期望id数组
   * @returns Promise
   */
  saveSelectpost(params) {
    return request('classics/saveJobExpectation', 'post', params)
  },


  /**
   * 检测是否有求职期望
   * @param 无
   * @returns Promise
   */
  checkIsJobJobExpectation() {
    return request('classics/checkJobExpectation', 'get')
  },

  /**
   * 获取联系我的方式
   * @param 无
   * @returns Promise
   */
  getUserContactMeWay() {
    return request('user/jobSeekerPersonalSettings/getContactMeWay', 'get')
  },
 /**
   * 获取联系时间段
   * @param 无
   * @returns Promise
   */
  getAllowPhoneTime() {
    return request('user/jobSeekerPersonalSettings/getAllowPhoneTime', 'get')
  },
  /**
   * 设置联系时间段
   * @param status 选择的联系方式
   * @returns Promise
   */
  setAllowPhoneTime(params) {
    return request('user/jobSeekerPersonalSettings/setAllowPhoneTime', 'post', params)
  },

  /**
   * 设置联系我的方式
   * @param status 选择的联系方式
   * @returns Promise
   */
  setUserContactMeWay(params) {
    return request('user/jobSeekerPersonalSettings/setContactMeWay', 'post', params)
  },

  /**
   * 获取实探企业列表
   * @params params
   * @returns Promise
   */
  getVisitList(params) {
    return request(`classics/local/visitList`, 'get', params)
  },

  /**
   * 通过类型获取本地大牌企业
   * @params params
   * @return Promise
   */
  getLocalBigList(params) {
    return request(`classics/local/bigList`, 'get', params)
  },

  /**
   * 本地行业列表
   * @param 无
   * @return Promise
   */
  getBigIindustryList(params) {
    return request(`classics/local/bigIindustryList`, 'get', params)
  },

  /**
   * 大牌企业馆轮播图
   * @param 无
   * @return Promise
   */
  getBigCarouselList(params) {
    return request(`classics/local/carousel`, 'get', params)
  },

  /**
   * 本地企业公司轮播图
   * @params areaId
   * @return Promise
   */
  getLocalCarousel(params) {
    return request(`classics/local/carousel`, 'get', params)
  },

  /**
   * 获取经典版职位列表
   * @params 无
   * @return Promise
   */
  getSimpleList() {
    return request(`system/dictionary/posts/simple`, 'get')
  },

  /**
   * 获取当前用户的求职期望以及其他信息
   * @param 无
   * @retuen Promise
   */
  getInitPerfectJobExpectation() {
    return request(`classics/initPerfectJobExpectation`, 'get')
  },

  /**
   * 保存求职期望
   * @param 
   * @return Promise
   */
  savePerfectJobExpectation(params) {
    return request(`classics/perfect1JobExpectation`, 'post', params)
  },

  /**
   * 搜索内容展示
   * @param
   * @return
   */
  searchPostsList(params) {
    return request(`system/dictionary/search/posts`, 'get', params)
  },

  /**
   * 搜索内容展示
   * @param
   * @return
   */
  getOpenArea() {
    return request(`classics/openArea`, 'get')
  },

  /**
   * AI帮写（通过描述）
   * @param requirement 描述信息
   * @return Promise
   */
  getPersonalAdvantage(params) {
    return request(`prop/getPersonalAdvantage`, 'post', params)
  },

  /**
   * 获取开放地区
   * @param 无
   * @return Promise
   */
  getClassicsOpenArea() {
    return request(`classics/openArea`, 'get')
  },

  /**
   * 经典版首页列表（根据求职期望）
   * @return Promise
   */
  classicsPostListBy(params) {
    return request(`classics/postListBy`, 'post', params)
  },

  /**
   * 经典版首页列表（求职期望没有的时候请求）
   * @return Promise
   */
  classicsPostRecommend(params) {
    return request(`classics/postRecommend`, 'post', params)
  },

  /**
   * 经典版职位详情接口
   * @params postId 职位id
   * @retrue Promise
   */
  getclassicsPostDetails(params) {
    return request(`classics/postDetails`, 'post', params)
  },

  /**
   * 获取简历模版
   * @params postId
   * @return Promise
   */
  getClassicsTemplete(params) {
    return request(`classics/templete/resume/${params.postId}`, 'get', params)
  },

  /**
   * 模版信息更换（换一个）
   * @params id
   * @return Promise
   */
  getClassicsTempleteById(id) {
    return request(`classics/templeteById/${id}`, 'get')

  },
  /* 求职期望列表
  * @return Promise
  */
  getSelfJobExpectation() {
    return request(`classics/selfJobExpectation`, 'get')
  },
  /**
  * 求职期望列表
  * @return Promise
  */
  setSelfJobExpectation(params) {
    return request(`classics/saveSelfJobExpectation`, 'post', params)
  },

  /**
   * 隐私通话获取虚拟电话
   * @params toUserId
   * @return phone
   */
  getInventedPhone(params){
    return request(`prop/getPrivatePhone`,'get',params)
  },

  /**
   * 获取购买权益个数(AI帮写/虚拟电话)
   * @params type 0（AI）1（虚拟电话）
   * @return Promise
   */
  getEquityAIOrPhone(type){
    // return request(`equity/getEquity/${type}`,'get')
    return request(`prop/checkAiOrPhone/${type}`)
  },

  /**
   * 获取权益商品列表  
   * @params type 0（AI）1（虚拟电话）
   * @return Promise
   */
  getEquityList(type){
    return request(`api/product/equityList/${type}`,'get')
  },

  /**
   *  购买权益商品
   * @params id 购买商品的id
   * @return Promise
   */
  getBuyEquity(id){
    return request(`equity/buyEquity/${id}`,'post')
  },

  /**
   *  检测当前登录人的简历是否有违规
   * @return Promise
   */
  getCheckIllegal(){
    return request(`resume/resumeNotes/checkIllegal`,'post')
  },

  /**
   * 获取红点信息
   * @params type 需要请求接口的路径尾部
   * @return Promise
   */
  getAllTag(type){
    return request(`system/newNoticeTag/list/${type}`,'get')
  },

  /**
   * 清除红点信息
   * @params type 需要清除红点的类型字符串
   * @return Promise
   */
  cancelRedis(type){
    return request(`system/newNoticeTag/cancel/redis/${type}`,'get')
  },

  /**
   * 检测小程序用户上线
   * @params userid
   * @return Promise
   */
  supervisoryOnlineUser(params){
    return request(`system/wx/online/${params.userId}`,'get')
  },


  /**
   * 检测小程序用户下线
   * @params userid
   * @return Promise
   */
  supervisoryOfflineUser(params){
    return request(`system/wx/offline/${params.userId}`,'get')
  },

  /**
   * 活动弹窗
   * @param {object} params 配置对象
   * @param {number | string} params.lon
   * @param {number | string} params.lat
   * @return Promise
   */
  getWhetherActivePopUp(params){
    return request(`/activity/assistance/showSubsidyAlert`,'get',params)
  },

  /**
 * 查看活动详情
 * @param {number} id
 * @return Promise
 */
  viewActivityDetails(params){
    return request(`activity/assistance/getSubsidyShow`,'get',params)
  },


  /**
   * 金秋活动弹窗
   */
  getWhetherActivePopUpJQ(params){
    return request(`activity/showActivityEquity`,'get',params)
  },

  /**
   * 领取权益
   */
  getDrawInterests(params){
    return request(`activity/receiveEquity`,'get',params)
  },

  /**
   * 未登录状态下获取是否有金秋活动
   */
  notLoginActiveJQ(){
    return request(`activity/showActivityEquityNoLogin`,'get')
  },

  /**
   * 获取推荐道具
   */
  getRecommendPropApi(){
    return request(`prop/recommend`,'get')
  }
}