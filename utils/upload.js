const oss = require('../../../utils/aliOss')
const host = 'https://imgcdn.guochuanyoupin.com';
const signature = oss;
const ossAccessKeyId = '<accessKey>';
const policy = '<policyBase64Str>';
const key = '<object name>';
const securityToken = '<x-oss-security-token>'; 
const filePath = '<filePath>'; // 待上传文件的文件路径。
wx.uploadFile({
  url: host, // 开发者服务器的URL。
  filePath: filePath,
  name: 'file', // 必须填file。
  formData: {
    key,
    policy,
    OSSAccessKeyId: ossAccessKeyId,
    signature,
    // 'x-oss-security-token': securityToken // 使用STS签名时必传。
  },
  success: (res) => {
    if (res.statusCode === 204) {
      console.log('上传成功');
    }
  },
  fail: err => {
    console.log(err);
  }
});