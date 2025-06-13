// 引入加密包
const Crypto = require('crypto-js');
 
// 秘钥,转换成utf8格式字符串，用于加密解密，一般长度是16位（由后端提供）
const key = Crypto.enc.Utf8.parse('b1a3ca3c3f51bca3')
// 偏移量，转换成utf8格式字符串，一般长度是16位(由后端提供)
const iv = Crypto.enc.Utf8.parse('')
 
// 解密（使用ECB模式）
export function Decrtpt(value) {
  // 使用外部包中的AES的解密方法
	// value(解密内容)、key(密钥)
  let decrypt = Crypto.AES.decrypt(value, key, {
    iv,							// 偏移量
    mode: Crypto.mode.ECB,		// 模式（五种加密模式，各有优缺）
    padding: Crypto.pad.Pkcs7	// 填充
  })
  // 转成utf8格式字符串，并返回出去
  let decryptedStr = decrypt.toString(Crypto.enc.Utf8)
  return decryptedStr
}
 
//加密（使用ECB模式）
export function Encrypt(value) {
  // 使用外部包中的AES的加密方法
  // value(加密内容)、key(密钥)
  let encrypt = Crypto.AES.encrypt(value, key, {
    iv,							// 偏移量
    mode: Crypto.mode.ECB,		// 模式（五种加密模式）
    padding: Crypto.pad.Pkcs7	// 填充
  })
  // 将加密的内容转成字符串返回出去
  return encrypt.toString()
}
 
// 导出密钥，以防其他地方需要使用
export const privateKey = 'b1a3ca3c3f51bca3'