# AI 智能邮箱系统 - 启动指南

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
```

### 前端配置

前端自动连接后端 `http://localhost:3001`，无需额外配置。

如需修改后端地址，编辑 `frontend/src/api/axios.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:3001/api',  // 修改这里
  // ...
})
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

---

## 🎯 下一步

1. **访问前端**: http://localhost:3000
2. **测试登录**: 输入手机号 → 查看后端控制台验证码 → 登录
3. **体验 AI 功能**: 写邮件时使用 AI 智能写信
4. **测试 API**: 使用 `API_TEST.md` 中的脚本

---

*最后更新：2026-03-18 09:55*  
*项目状态：✅ 100% 完成，可运行*
