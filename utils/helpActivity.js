const api = require('../http/api');
const shareCodeUtil = require('./shareCode');
const app = getApp();

class HelpActivityHandler {
  constructor() {
    this.shareCode = '';
    this.decryptedShareCode = '';
    this.initFromStorage();
  }

  // 从本地存储初始化数据
  initFromStorage() {
    try {
      const storageData = wx.getStorageSync('helpActivityShareCode');
      if (storageData) {
        this.shareCode = storageData.encrypted || '';
        this.decryptedShareCode = storageData.decrypted || '';
      }
    } catch (error) {
      console.error('从本地存储获取shareCode失败:', error);
    }
  }

  // 保存到本地存储
  saveToStorage() {
    try {
      wx.setStorageSync('helpActivityShareCode', {
        encrypted: this.shareCode,
        decrypted: this.decryptedShareCode
      });
    } catch (error) {
      console.error('保存shareCode到本地存储失败:', error);
    }
  }

  // 处理H5传入的shareCode
  async handleShareCode(encryptedShareCode) {
    try {
      this.shareCode = encryptedShareCode;
      this.decryptedShareCode = shareCodeUtil.decrypt(encryptedShareCode);
      
      // 保存到本地存储
      this.saveToStorage();
      
      // 调用跳转服务接口
      const jumpResult = await api.jumpService({
        shareCode: this.decryptedShareCode,
        source: "wx_mini",
      });

      // 已登录用户直接调用命中统计接口
      if (app.globalData.isLogin) {
        await this.recordHitStatistics();
      }

      return jumpResult;
    } catch (error) {
      console.error('处理shareCode失败:', error);
      throw error;
    }
  }

  // 清除本地存储的shareCode
  clearStorageShareCode() {
    try {
      wx.removeStorageSync('helpActivityShareCode');
      this.shareCode = '';
      this.decryptedShareCode = '';
    } catch (error) {
      console.error('清除本地存储shareCode失败:', error);
    }
  }

  // 记录命中统计
  async recordHitStatistics() {
    try {
      await api.helpHitStatistics({
        shareCode: this.decryptedShareCode
      });
    } catch (error) {
      console.error('记录命中统计失败:', error);
      // 不抛出错误，因为这是非关键操作
    }
  }

  // 登录后处理
  async handleAfterLogin() {
    if (this.decryptedShareCode) {
      try {
        // 登录后再次调用命中统计接口
        await this.recordHitStatistics();
        
        // 获取助力结果
        const result = await api.helpActivityApi.getHelpResult(this.decryptedShareCode);
        return result;
      } catch (error) {
        console.error('登录后处理失败:', error);
        throw error;
      }
    }
  }

  // 获取当前shareCode
  getShareCode() {
    return {
      encrypted: this.shareCode,
      decrypted: this.decryptedShareCode
    };
  }
}

// 创建单例
const helpActivityHandler = new HelpActivityHandler();
module.exports = helpActivityHandler; 