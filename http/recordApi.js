// 引入request请求
const {
  request
} = require('./http')

module.exports = {
  /**
   * 某一条记录详情
   * @params id
   * @return Promise
   */
  getConsumeDetail(params){
    return request(`coins/account/consume/details`,'get',params)
  }, 

  /**
   * 获取钱包详情
   * @params 无
   * @return Promise
   */
  getAccountWalletInfo(){
    return request(`coins/account/walletInfo`,'get')
  },

  /**
   * 获取对应的消费详情
   * @params type（0: 全部，1：已消费，4:已充值）
   * @params year 筛选项（年） 按月份筛选时传递
   * @params month 筛选项（月）按月份筛选时传递
   * @params start 筛选项（区间）按区间筛选时传递
   * @params end 筛选项（区间）按区间筛选时传递
   * @return Promise
   */
  getDouRecordList(params){
    return request(`/coins/account/dou/records`,'get',params)
  }
}