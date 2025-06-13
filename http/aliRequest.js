/**
 * 获取阿里云OSS文件上传临时凭证
 * @param {  } 
 * @returns promise
 */
export const apiAliCredential = params => {
    return request({
      url: `aliyun/upload/credential`,
      method: 'get',
      data: params
    })
  };