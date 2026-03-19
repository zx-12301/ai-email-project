# AI 智能邮箱系统 - 项目上下文

**请 Claude Code 阅读此文档以快速了解项目**

---

## 📋 项目概述

**项目名称**: AI 智能邮箱系统 (AI Email System)

**技术栈**:
- **前端**: React 18 + TypeScript + Vite + Tailwind CSS
- **后端**: NestJS + TypeScript + SQLite + TypeORM
- **AI 服务**: 百炼 API (qwen3.5-plus)
- **邮件发送**: Nodemailer (SMTP)
- **实时通知**: WebSocket (Socket.io)

**核心功能**:
1. 邮件收发（支持 SMTP 真实发送）
2. AI 智能写信/回复
3. 实时通知（WebSocket）
4. 邮件管理（删除/恢复/标记/移动）
5. 联系人管理
6. 文件中心

---

## 🏗️ 项目结构

```
ai-email-project/
├── frontend/              # 前端项目
│   ├── src/
│   │   ├── api/          # API 调用封装
│   │   ├── components/   # 公共组件
│   │   ├── pages/        # 页面组件
│   │   ├── services/     # 服务（WebSocket 等）
│   │   └── ...
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
│   │   │   ├── file/    # 文件模块
│   │   │   └── notification/ # WebSocket 通知
│   │   └── main.ts
│   └── package.json
│
└── START.md             # 启动指南
```

---

## 🔑 核心功能说明

### 1. 邮件发送流程

**前端** (`frontend/src/pages/ComposePage.tsx`):
```typescript
// 发送邮件
await mailApi.sendMail({
  to: ['recipient@example.com'],
  subject: '邮件主题',
  content: '邮件内容',
  sendViaSmtp: true  // 通过 SMTP 真实发送
})
```

**后端** (`backend/src/modules/mail/mail.service.ts`):
- 保存到发件箱 (`folder: 'sent'`)
- 如果 `sendViaSmtp=true`，调用 `MailSenderService` 发送真实邮件
- 使用 QQ 邮箱 SMTP 配置

### 2. AI 写信功能

**前端** (`frontend/src/pages/ComposePage.tsx`):
```typescript
// AI 生成邮件
const response = await fetch('/api/ai/generate-email', {
  method: 'POST',
  body: JSON.stringify({
    prompt: '写一封会议邀请',
    tone: 'formal'  // formal/friendly/concise
  })
})
```

**后端** (`backend/src/modules/ai/ai.service.ts`):
- 调用百炼 API (`qwen3.5-plus` 模型)
- 超时时间：60 秒
- 失败时返回模拟数据

### 3. WebSocket 实时通知

**前端** (`frontend/src/services/NotificationService.ts`):
```typescript
// 连接 WebSocket
NotificationService.connect(userId, token)

// 监听通知
NotificationService.onNotification((payload) => {
  // payload.type: 'new_mail' | 'mail_sent' | 'system'
})
```

**后端** (`backend/src/modules/notification/notification.gateway.ts`):
- Gateway: `/notifications`
- 事件：`authenticate`, `notification`

### 4. 收件箱 API 集成

**所有页面都已集成真实 API**:
- `InboxPage` - 收件箱
- `SentPage` - 已发送
- `DraftsPage` - 草稿箱
- `TrashPage` - 已删除
- `SpamPage` - 垃圾邮件
- `StarredPage` - 星标邮件

**通用模式**:
```typescript
// 加载数据
const result = await mailApi.getInbox(page, limit)
const emails = result.data.map(mail => ({
  id: mail.id,
  from: mail.fromName,
  subject: mail.subject,
  isTest: mail.isTest  // 测试数据标记
}))
```

---

## 🔧 关键配置

### 后端环境变量 (`backend/.env`)

```env
# 数据库
DB_TYPE=sqlite
DB_DATABASE=./data/ai_email.db

# JWT
JWT_SECRET=your-secret
JWT_EXPIRES_IN=7d

# AI 服务
AI_API_KEY=sk-xxxxx
AI_API_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
AI_MODEL=qwen3.5-plus

# SMTP 邮件发送
SMTP_HOST=smtp.qq.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@qq.com
SMTP_PASS=your-auth-code
```

### 前端 API 配置 (`frontend/src/api/mail.ts`)

```typescript
const API_BASE_URL = 'http://localhost:3001/api'

// 主要 API 方法
mailApi.getInbox(page, limit)
mailApi.getSent(page, limit)
mailApi.getDrafts(page, limit)
mailApi.getTrash(page, limit)
mailApi.getSpam(page, limit)
mailApi.getMailById(id)
mailApi.sendMail(data)
mailApi.delete(id)
mailApi.restore(id)
mailApi.markAsRead(id, isRead)
mailApi.toggleStar(id)
mailApi.moveToFolder(id, folder)
```

---

## 📊 数据库实体

### User (`backend/src/entities/user.entity.ts`)
```typescript
{
  id: string (UUID)
  phone: string
  email: string
  name: string
  password: string
  verificationCode: string
  codeExpiresAt: Date
  // ...
}
```

### Mail (`backend/src/entities/mail.entity.ts`)
```typescript
{
  id: string (UUID)
  userId: string
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam'
  from: string
  to: string[]
  subject: string
  content: string
  isRead: boolean
  isStarred: boolean
  isTest: boolean  // 测试数据标记
  // ...
}
```

### Contact (`backend/src/entities/contact.entity.ts`)
```typescript
{
  id: string
  userId: string
  name: string
  email: string
  phone: string
  isStarred: boolean
  // ...
}
```

---

## 🎨 UI 组件规范

### 工具栏样式（统一）
```tsx
<button className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded">
  <Icon className="w-3.5 h-3.5" />
  按钮文字
</button>
```

### 分页栏样式（统一）
```tsx
<div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-between bg-slate-50">
  {/* 上一页/下一页 */}
  {/* 页码显示 */}
  {/* 每页数量切换 (5/10/20) */}
  {/* 页码跳转 */}
</div>
```

---

## 🐛 已知问题和解决方案

### 1. AI 生成超时
**问题**: AI 生成时间长，可能超时  
**解决**: 超时时间已增加到 60 秒，失败时返回模拟数据

### 2. 测试数据与真实数据混合
**问题**: 需要区分测试数据和真实数据  
**解决**: 添加 `isTest` 字段标记，前端显示"测试"标签

### 3. SMTP 发件人地址
**问题**: QQ 邮箱要求发件人必须与 SMTP 登录账号一致  
**解决**: 强制使用 SMTP 配置中的邮箱地址作为发件人

---

## 🚀 开发指南

### 添加新页面
1. 在 `frontend/src/pages/` 创建页面组件
2. 在 `backend/src/modules/mail/` 添加对应 API
3. 在 `frontend/src/api/mail.ts` 添加 API 调用方法
4. 同步工具栏和分页栏样式

### 添加新功能
1. 后端：在对应 module 中添加 service 方法
2. 后端：在 controller 中添加路由
3. 前端：在 api 中添加调用方法
4. 前端：在页面中使用

### 调试技巧
1. **后端日志**: 查看控制台输出（AI 调用/SMTP 发送等）
2. **前端日志**: 浏览器控制台（API 调用/WebSocket 连接）
3. **数据库**: SQLite 数据库在 `backend/data/ai_email.db`

---

## 📝 当前开发状态

**已完成**:
- ✅ 所有页面 API 集成
- ✅ AI 写信/回复功能
- ✅ SMTP 邮件发送
- ✅ WebSocket 实时通知
- ✅ 统一 UI 样式
- ✅ 测试数据标记

**待开发**:
- ⏳ 邮件撤回功能
- ⏳ 定时发送
- ⏳ 邮件模板管理
- ⏳ 批量操作优化

---

## 🔗 重要文件

- `START.md` - 启动指南
- `TEST_FLOW_GUIDE.md` - 完整测试流程
- `backend/src/modules/ai/ai.service.ts` - AI 服务实现
- `backend/src/modules/mail/mail.service.ts` - 邮件服务实现
- `frontend/src/pages/ComposePage.tsx` - 写信页面
- `frontend/src/services/NotificationService.ts` - WebSocket 服务

---

## 💡 给 Claude Code 的建议

1. **阅读顺序**:
   - 先看 `START.md` 了解如何启动
   - 再看 `backend/src/modules/mail/mail.service.ts` 了解核心逻辑
   - 然后看 `frontend/src/pages/ComposePage.tsx` 了解前端实现

2. **修改建议**:
   - 保持工具栏和分页栏样式统一
   - 新增 API 时遵循现有模式
   - 测试数据添加 `isTest: true` 标记

3. **注意事项**:
   - AI API 超时时间 60 秒
   - SMTP 发件人必须与配置一致
   - WebSocket 需要认证 token

---

**最后更新**: 2026-03-19 19:42  
**项目状态**: 核心功能已完成，可正常开发