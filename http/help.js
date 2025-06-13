// 引入request请求
const {
    request
} = require('./http')
module.exports = {
    // 查询助力
    apiInquire: ()=>{
        return request(`activity/assistance/assistanceByUser`,'get')
    },

    // 创建助力信息
    establishHelp: ()=>{
        return request(`activity/assistance/createAssistance`,'post')
    },

    // 帮助好友助力
    help: (activityId)=>{
        return request(`activity/assistance/doAssistance/${activityId}`,'post')
    },

    // 完成任务领取道具
    comfinmHelp: (activityId)=>{
        return request(`activity/assistance/getAssistancePrize/${activityId}`,'get')
    },

    // 是否是好友点击链接
    isClickApi(){
        return request(`activity/assistance/friendLookAssistance/{activityId}`,'get')
    },

    index(activityId){
        return request(`activity/assistance/index`,'post',activityId)
    },
    notLogin(activityId){
        return request(`activity/assistance/noLoginIndex`,'post',activityId)
    }
}