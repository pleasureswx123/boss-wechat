const CryptoJS = require('crypto-js');

// 加密密钥
const SECRET_KEY = 'your-secret-key';

// shareCode工具类
const shareCodeUtil = {
  // 加密shareCode
  encrypt: (shareCode) => {
    try {
      const ciphertext = CryptoJS.AES.encrypt(shareCode, SECRET_KEY).toString();
      return encodeURIComponent(ciphertext);
    } catch (error) {
      console.error('加密shareCode失败:', error);
      return '';
    }
  },

  // 解密shareCode
  decrypt: (encryptedShareCode) => {
    try {
      const decodedShareCode = decodeURIComponent(encryptedShareCode);
      const bytes = CryptoJS.AES.decrypt(decodedShareCode, SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('解密shareCode失败:', error);
      return '';
    }
  }
};

module.exports = shareCodeUtil; 