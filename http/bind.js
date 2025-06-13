const { request } = require("./http1");
module.exports = {
  /**
 * 获取绑定公众号url
 */
  getOauth2Url(params) {
    // return request(`system/wx/oauth2Url`,'get')
    return request(`recruitment-weixin-mp/oauth2/url/${params.userId}`, 'get')
  },

  /**
   * 检测是否是统一微信
   * @params  参数 code,userId
   * @return Promise
   */
  checkWx(params) {
    // https://api.test.guochuanyoupin.com/recruitment-weixin-mp/oauth2/url/
    // return request(`system/wx/checkCode`,'get',params)
    return request(`recruitment-weixin-mp/oauth2/checkCode`, 'get', params)
  },

  /**
 * 检测用户是否关注了公众号
 * @params userid
 * @return
 */
  checkOfficial(params) {
    return request(`recruitment-weixin-mp/jobSeeker/msg/follow/${params.userId}`, 'get')
  }
}