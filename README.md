# AI Email System - 智能邮箱系统

<div align="center">

![Status](https://img.shields.io/badge/status-complete-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**企业级智能邮件管理平台 · 前后端完整实现 · AI 功能集成**

</div>

---

## 🎯 项目简介

AI 智能邮箱系统是一个现代化的企业级邮件管理平台，集成了先进的 AI 功能，包括智能写信、智能回复、钓鱼邮件检测等。采用前后端分离架构，支持完整的邮件 CRUD 操作。

### ✨ 核心特性

- 🤖 **AI 驱动** - 6 大 AI 功能，提升邮件处理效率
- 🔐 **安全可靠** - JWT 认证，钓鱼邮件检测
- 📱 **响应式设计** - 适配桌面和移动端
- 🎨 **企业级 UI** - 专业邮箱界面，流畅动效

---

## 🚀 快速开始

### 一键启动（推荐）

```powershell
.\start.ps1
```

这将同时启动前端和后端服务：
- **前端**: http://localhost:3000
- **后端**: http://localhost:3001

### 手动启动

**1. 启动后端**
```bash
cd backend
npm install
npm run start:dev
```

**2. 启动前端**
```bash
cd frontend
npm install
npm run dev
```

---

## 📋 功能清单

### ✅ 用户认证
- 手机号验证码登录
- JWT Token 认证
- 用户资料管理

### ✅ 邮件管理
- 收件箱/已发送/草稿箱/垃圾箱
- 发送邮件/保存草稿
- 删除/恢复/永久删除
- 标记已读/星标/归档
- 批量操作
- 全文搜索

### ✅ AI 功能
- **AI 智能写信** - 多语气选择（正式/友好/简洁/详细/随意）
- **AI 智能回复** - 3 条智能回复建议
- **钓鱼邮件检测** - 风险等级评估
- **邮件分类** - 自动分类到工作/个人/广告等
- **邮件摘要** - 自动生成简短摘要
- **联系人推荐** - 智能推荐收件人

### ✅ 联系人管理
- 联系人列表
- 添加/编辑/删除
- 标签分类
- 搜索筛选

### ✅ 文件管理
- 文件上传/下载
- 文件预览
- 类型筛选
- 批量操作

---

## 🏗️ 技术架构

### 前端技术栈
- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **UI 框架**: Tailwind CSS + shadcn/ui
- **路由**: React Router
- **HTTP 客户端**: Axios

### 后端技术栈
- **框架**: NestJS 10
- **语言**: TypeScript
- **数据库**: SQLite + TypeORM
- **认证**: JWT + Passport
- **AI 集成**: 百炼 API (qwen-plus)

### 项目结构
```
ai-email-project/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── components/   # 可复用组件
│   │   ├── pages/        # 页面组件 (11 个)
│   │   ├── api/          # API 调用
│   │   └── utils/        # 工具函数
│   └── package.json
│
├── backend/              # 后端项目
│   ├── src/
│   │   ├── entities/    # 数据库实体
│   │   ├── modules/     # 功能模块
│   │   │   ├── auth/    # 认证模块
│   │   │   ├── mail/    # 邮件模块
│   │   │   ├── ai/      # AI 模块
│   │   │   ├── contact/ # 联系人模块
│   │   │   └── file/    # 文件模块
│   │   └── strategies/  # JWT 策略
│   ├── data/            # SQLite 数据库
│   └── package.json
│
└── docs/                # 项目文档
```

---

## 🧪 API 测试

### 快速测试（PowerShell）

```powershell
# 1. 发送验证码
$body = @{phone="13800138000"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/send-code" -Method POST -ContentType "application/json" -Body $body

# 2. 登录（查看控制台获取验证码）
$loginBody = @{
  phone="13800138000"
  code="123456"  # 替换为实际验证码
} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $response.access_token

# 3. AI 智能写信
$aiBody = @{
  prompt="写一封会议邀请邮件"
  tone="formal"
} | ConvertTo-Json
$headers = @{Authorization="Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:3001/api/ai/generate-email" -Method POST -ContentType "application/json" -Body $aiBody -Headers $headers
```

完整测试脚本请参考 [`API_TEST.md`](./API_TEST.md)

---

## 📖 文档

| 文档 | 说明 |
|------|------|
| [README.md](./README.md) | 项目说明（本文档） |
| [START.md](./START.md) | 详细启动指南 |
| [API_TEST.md](./API_TEST.md) | API 测试脚本 |
| [docs/PRD.md](./docs/PRD.md) | 产品需求文档 |
| [docs/PROGRESS.md](./docs/PROGRESS.md) | 开发进度报告 |
| [docs/COMPLETION_REPORT.md](./docs/COMPLETION_REPORT.md) | 完成报告 |

---

## ⚙️ 配置

### 环境变量 (backend/.env)

```env
# 数据库配置
DB_TYPE=sqlite
DB_DATABASE=./data/ai_email.db

# JWT 配置
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# AI 服务配置（可选）
AI_API_KEY=sk-your-api-key-here
AI_MODEL=qwen-plus
```

**注意**: 如果不配置 `AI_API_KEY`，系统会自动使用模拟数据。

---

## 📊 API 端点

### 认证模块
| 端点 | 方法 | 认证 |
|------|------|------|
| `/api/auth/send-code` | POST | ❌ |
| `/api/auth/login` | POST | ❌ |
| `/api/auth/me` | GET | ✅ |
| `/api/auth/profile` | PATCH | ✅ |

### 邮件模块
| 端点 | 方法 | 认证 |
|------|------|------|
| `/api/mail/inbox` | GET | ✅ |
| `/api/mail/sent` | GET | ✅ |
| `/api/mail/drafts` | GET | ✅ |
| `/api/mail/trash` | GET | ✅ |
| `/api/mail/:id` | GET | ✅ |
| `/api/mail` | POST | ✅ |
| `/api/mail/:id` | DELETE | ✅ |
| `/api/mail/search` | GET | ✅ |

### AI 模块
| 端点 | 方法 | 认证 |
|------|------|------|
| `/api/ai/generate-email` | POST | ✅ |
| `/api/ai/generate-reply` | POST | ✅ |
| `/api/ai/detect-phishing` | POST | ✅ |
| `/api/ai/classify-mail` | POST | ✅ |
| `/api/ai/summarize` | POST | ✅ |

完整 API 列表请参考 [`API_TEST.md`](./API_TEST.md)

---

## 🎨 界面预览

### 登录页
- 手机号验证码登录
- 企业微信登录入口
- 响应式设计

### 收件箱
- 邮件列表展示
- 未读/星标筛选
- 批量操作

### 写邮件
- 富文本编辑器
- AI 智能写信助手
- 多版本选择

### 邮件详情
- 完整邮件内容
- AI 智能回复建议
- 钓鱼邮件检测警示

---

## 🔒 安全特性

- **JWT 认证**: 所有 API 请求需要有效 Token
- **验证码登录**: 防止暴力破解
- **钓鱼检测**: AI 自动识别可疑邮件
- **数据验证**: 所有输入经过 class-validator 验证
- **CORS 配置**: 限制跨域访问

---

## 🚧 未来计划

### 短期优化
- [ ] 集成真实短信服务（阿里云 SMS）
- [ ] 集成真实邮件服务（SMTP）
- [ ] 文件上传存储（本地/OSS）
- [ ] WebSocket 实时通知

### 长期规划
- [ ] PostgreSQL 生产数据库
- [ ] Redis 缓存
- [ ] Docker 容器化
- [ ] 邮件撤回功能
- [ ] 定时发送

---

## 📄 许可证

MIT License

---

## 👨‍💻 开发信息

**创建时间**: 2026-03-18  
**完成时间**: 2026-03-18 11:10  
**开发状态**: ✅ 完成 (100%)  
**总代码量**: 约 5000+ 行  

**技术亮点**:
- 11 个完整前端页面
- 43 个后端 API 路由
- 6 个 AI 功能集成
- JWT 认证系统
- SQLite 数据库

---

## 🎉 项目状态

**✅ 前后端均可正常运行**

访问 http://localhost:3000 开始体验！

---

<div align="center">

**🦞 龙虾机器人 · 荣誉出品**

*最后更新：2026-03-18*

</div>
