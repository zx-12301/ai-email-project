# AI 智能邮箱系统 - 启动指南

**版本**: 2.0 (2026-03-19 更新)  
**新增功能**: ✅ SMTP 邮件发送 | ✅ WebSocket 实时通知 | ✅ 全文搜索 + 高级过滤

---

## 🚀 快速启动

### 方式一：手动启动（推荐开发使用）

**1. 启动后端** (终端 1)
```bash
cd backend
npm run start:dev
```
后端运行在：`http://localhost:3001`

**2. 启动前端** (终端 2)
```bash
cd frontend
npm run dev
```
前端运行在：`http://localhost:3000`

---

### 方式二：一键启动脚本 (PowerShell)

创建文件 `start.ps1`:

```powershell
# AI 邮箱系统 - 一键启动脚本

Write-Host "🚀 AI 智能邮箱系统启动中..." -ForegroundColor Cyan
Write-Host ""

# 启动后端
Write-Host "📦 启动后端服务..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm run start:dev"

# 等待 3 秒
Start-Sleep -Seconds 3

# 启动前端
Write-Host "🎨 启动前端界面..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm run dev"

Write-Host ""
Write-Host "✅ 启动完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📍 访问地址：" -ForegroundColor Cyan
Write-Host "   前端：http://localhost:3000" -ForegroundColor White
Write-Host "   后端：http://localhost:3001" -ForegroundColor White
Write-Host "   API 文档：http://localhost:3001/api" -ForegroundColor White
Write-Host ""
Write-Host "按任意键退出..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
```

**使用方式**:
```powershell
.\start.ps1
```

---

## 🧪 测试 API

### 快速测试（PowerShell）

```powershell
# 1. 发送验证码
$body = @{phone="13800138000"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/send-code" -Method POST -ContentType "application/json" -Body $body

# 查看后端控制台获取验证码

# 2. 登录
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

### 完整测试脚本

参考 `API_TEST.md` 文档中的完整测试流程。

---

## 🚀 新功能测试

### 1. SMTP 邮件发送测试

**配置 SMTP** (在 `backend/.env`):
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**测试 SMTP 连接**:
```powershell
$headers = @{Authorization="Bearer $token"}

# 检查 SMTP 状态
Invoke-RestMethod -Uri "http://localhost:3001/api/mail/smtp/status" -Headers $headers

# 测试 SMTP 连接
$body = @{
  host="smtp.gmail.com"
  port=587
  user="your-email@gmail.com"
  pass="your-app-password"
} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/api/mail/smtp/test" -Method POST -ContentType "application/json" -Body $body -Headers $headers
```

### 2. WebSocket 实时通知测试

**前端已自动集成**:
- 登录后自动连接 WebSocket
- 收到新邮件时显示通知 Toast
- 发送成功时显示通知

**查看 WebSocket 状态**:
```typescript
// 控制台会显示连接状态
console.log('[Notification] 连接状态:', NotificationService.isConnected())
```

### 3. 全文搜索 + 高级过滤测试

**基础搜索**:
```powershell
$headers = @{Authorization="Bearer $token"}

# 搜索包含 "项目" 的邮件
Invoke-RestMethod "http://localhost:3001/api/mail/search?q=项目" -Headers $headers

# 高级过滤：搜索未读星标邮件
Invoke-RestMethod "http://localhost:3001/api/mail/search?q=项目&isRead=false&isStarred=true" -Headers $headers

# 搜索含附件的邮件
Invoke-RestMethod "http://localhost:3001/api/mail/search?q=报告&hasAttachments=true" -Headers $headers
```

**搜索参数说明**:
| 参数 | 说明 | 示例 |
|------|------|------|
| `q` | 搜索关键词 | `q=项目` |
| `folder` | 文件夹过滤 | `folder=inbox` |
| `isRead` | 是否已读 | `isRead=false` |
| `isStarred` | 是否星标 | `isStarred=true` |
| `hasAttachments` | 是否有附件 | `hasAttachments=true` |
| `from` | 发件人 | `from=张三` |
| `dateFrom` | 开始日期 | `dateFrom=2026-03-01` |
| `dateTo` | 结束日期 | `dateTo=2026-03-19` |

---

## 📁 项目结构

```
ai-email-project/
├── frontend/              # 前端项目 (React + Vite)
│   ├── src/
│   │   ├── components/   # 组件
│   │   ├── pages/        # 页面 (11 个)
│   │   └── ...
│   ├── package.json
│   └── vite.config.ts
│
├── backend/              # 后端项目 (NestJS)
│   ├── src/
│   │   ├── entities/    # 数据库实体
│   │   ├── modules/     # 功能模块
│   │   ├── strategies/  # JWT 策略
│   │   └── ...
│   ├── data/            # SQLite 数据库
│   ├── .env             # 环境变量配置
│   └── package.json
│
├── docs/                # 项目文档
│   ├── PRD.md          # 产品需求文档
│   ├── PROGRESS.md     # 进度报告
│   └── FINAL_REPORT.md # 最终报告
│
├── API_TEST.md         # API 测试指南
└── README.md           # 项目说明
```

---

## ⚙️ 配置说明

### 后端配置 (backend/.env)

```env
# 数据库配置
DB_TYPE=sqlite
DB_DATABASE=./data/ai_email.db

# 应用配置
NODE_ENV=development
PORT=3001

# JWT 配置
JWT_SECRET=ai-email-system-secret-key-2026
JWT_EXPIRES_IN=7d

# AI 服务配置（可选）
AI_API_KEY=sk-your-api-key-here
AI_API_URL=https://dashscope.aliyuncs.com/api/v1
AI_MODEL=qwen-plus

# SMTP 邮件发送配置（可选 - 新增 ✨）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# WebSocket 配置（自动启用 ✨）
WS_CORS_ORIGIN=*
```

### 前端配置

前端自动连接后端 `http://localhost:3001` 和 WebSocket，无需额外配置。

如需修改后端地址，编辑 `frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:3001
```

---

## 🔧 常见问题

### 1. 端口被占用

**错误**: `EADDRINUSE: address already in use`

**解决**: 
```bash
# Windows - 查找占用端口的进程
netstat -ano | findstr :3001
taskkill /PID <进程 ID> /F
```

### 2. 依赖安装失败

**解决**:
```bash
# 删除 node_modules 和锁文件
rm -rf node_modules package-lock.json
npm install
```

### 3. AI API 未配置

如果不配置 `AI_API_KEY`，系统会自动使用模拟数据，功能正常但返回固定响应。

---

## 📊 系统状态

| 组件 | 状态 | 地址 |
|------|------|------|
| 前端 | ✅ React + Vite | http://localhost:3000 |
| 后端 | ✅ NestJS | http://localhost:3001 |
| 数据库 | ✅ SQLite | backend/data/ai_email.db |
| AI 服务 | ✅ 百炼 API | 可配置 |
| SMTP 发送 | ✅ Nodemailer | 可配置 |
| WebSocket | ✅ Socket.io | 自动启用 |

---

## 🎯 下一步

1. **访问前端**: http://localhost:3000
2. **测试登录**: 输入手机号 → 查看后端控制台验证码 → 登录
3. **配置 SMTP** (可选): 配置后可在 `email` 页面发送真实邮件
4. **开启实时通知**: 登录后自动连接 WebSocket，收到新邮件时会有 Toast 提示
5. **测试全文搜索**: 使用高级搜索参数过滤邮件
6. **体验 AI 功能**: 写邮件时使用 AI 智能写信

---

*最后更新：2026-03-19 09:40*  
*项目状态：✅ 100% 完成，新增 SMTP/WebSocket/全文搜索*  
*版本：2.0*
