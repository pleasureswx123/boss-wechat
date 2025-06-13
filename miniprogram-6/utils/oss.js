const Base64 = require("./cypto/Base64")
require('./cypto/hmac.js');
require('./cypto/sha1.js');
const Crypto = require("./cypto/crypto")
import {getUploadCredential} from "../../http/user.js"

const randomString = (len) => {
  len = len || 32;
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

//生产随机的文件名
const getFileName = (fileName,type,userId,rank) => {
    let timestamp = Date.parse(new Date())/1000
    if(type == "image"){
      if(rank){
        return "head/"+userId + '/'+rank + '/'+ timestamp+ '.'+fileName.split('.').slice(-1)
      } else {
        return "report/"+userId + '/'+ timestamp+ '.'+fileName.split('.').slice(-1)
      }
        // return "image/"+ randomString(32)+timestamp+'.'+fileName.split('.').slice(-1)
    }else if(type == "file"){
        // return "file/"+ randomString(32)+timestamp+'.'+fileName.split('.').slice(-1)
        return "resume/"+userId + "/" + timestamp + '.'+fileName.split('.').slice(-1)
    } else if(type == 'im') {
        return type+"/"+userId + '/'+ timestamp+ '.'+fileName.split('.').slice(-1)
    }
    return "error/error.png"
}

const getToken = () =>{
  return new Promise((resolve, reject) => {
    getUploadCredential({}).then(res=>{
        resolve(res.data)
      }).catch(err=>{
        reject(err)
      })
  })
}
/**
 * @param {*} tempFilePath 上传路径
 * @param {*} type 区分上传的是照片还是附件简历
 * @param {*} userId 用户id
 * @param {*} rank 当前用户身份(1求职者,2招聘者)这里固定1
 */
const ossUpload = (tempFilePath,type,userId,rank) => {
  return new Promise(async (resolve, reject) => {
//从后端接口获取返回的值，可以参考之前写的vue上传php的代码部分
    let sts = await getToken()
    const date = new Date();
    date.setHours(date.getHours() + 1);
    let policyText = {
      "expiration": date.toISOString(), //设置该Policy的失效时间，超过这个失效时间之后，就没有办法通过这个policy上传文件了
      "conditions": [
        ["content-length-range", 0, 1048576000] // 设置上传文件的大小限制
      ]
    }
    let policyBase64 = Base64.encode(JSON.stringify(policyText))
    let bytes = Crypto.HMAC(Crypto.SHA1,policyBase64, sts.accessKeySecret, { asBytes: true }) ;
    let signature = Crypto.util.bytesToBase64(bytes)
    let key = getFileName(tempFilePath,type,userId,rank)
    console.log(key,'00000')
    wx.uploadFile({
      url:'https://imgcdn.guochuanyoupin.com',
      header:{
        "Content-Type":"multipart/form-data",
      },
      filePath:tempFilePath,
      name:'file',
      formData:{
        key:key,
        policy:policyBase64,
        OSSAccessKeyId:sts.accessKeyId,
        signature:signature,
        'success_action_status':'200',
        'x-oss-security-token':sts.securityToken
      },
      success(res){
          console.log(res,11111)
        if(res.statusCode==200){
            resolve({full:'https://imgcdn.guochuanyoupin.com/'+key,shot:key})
        }else{
          reject(res)
        }
      },
      fail(err){
        wx.showToast({title:'上传文件失败'})
        console.log(err)
        reject(err)
      }

    })
  })
}

module.exports = {
  ossUpload
}