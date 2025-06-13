// 引入request请求
const { request } = require("./http");

module.exports = {
  /**
   * 获取简历模版列表
   * @params 无
   * @return Promise List
   */

   getResumeList(params){
     return request(`resume/template/list`,'get',params)
   },
  
  /**
   * 在线简历生成附件简历
   * @params jobExpectationId 选择的职位id 
   * @params resumeTemplateId 选择的模版id
   * @returns Promise
   */
  createGenerate(jobExpectationId,resumeTemplateId){
    return request(`resume/resumeFile/generate/${jobExpectationId}/${resumeTemplateId}`)
  }
}