# 优聘小程序

优聘小程序是一个专业的招聘求职平台，为企业和求职者提供便捷的招聘服务。

## 技术架构

- 开发框架：微信小程序原生框架
- UI 组件库：Vant Weapp (v1.10.19)
- 核心依赖：
  - crypto-js: 加密解密功能
  - lottie-miniprogram: 动画效果
  - miniprogram-sm-crypto: 小程序加密库
  - qrcode: 二维码生成

## 目录结构

```
├── components/         # 公共组件
├── http/              # 网络请求相关
├── image/             # 图片资源
├── json/             # JSON 配置文件
├── libs/             # 第三方库
├── pages/            # 主包页面
│   ├── index/       # 首页
│   ├── match/       # 匹配
│   ├── login/       # 登录
│   └── user/        # 用户中心
├── packageIm/        # 即时通讯分包
├── subpackPage/      # 功能分包
│   ├── index/       # 基础功能
│   ├── user/        # 用户相关
│   ├── member/      # 会员相关
│   ├── versions/    # 版本相关
│   └── playVideo/   # 视频播放
├── utils/            # 工具函数
├── app.js           # 小程序入口文件
├── app.json         # 小程序配置文件
└── app.wxss         # 全局样式文件
```

## 功能模块

### 1. 核心功能
- 职位搜索和浏览
- 简历管理
- 即时通讯
- 面试管理
- 企业信息查看

### 2. 用户中心
- 个人信息管理
- 简历编辑
- 投递记录
- 收藏管理
- 面试记录

### 3. 会员服务
- 会员购买
- 权益中心
- 交易记录

### 4. 即时通讯
- 聊天室
- 面试沟通
- Offer 发送
- 系统消息

### 5. 其他功能
- 地址管理
- 隐私设置
- 通知管理
- 意见反馈
- 企业微信集成

## 开发环境要求

- 微信开发者工具
- Node.js 环境

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 在微信开发者工具中导入项目

3. 构建 npm：
   - 在微信开发者工具中点击"工具" -> "构建 npm"

## 注意事项

- 项目使用分包加载，提高首次启动速度
- 使用 Vant Weapp 组件库，确保按照文档正确安装和使用
- 注意微信小程序的相关规范和限制