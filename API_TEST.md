# AI 邮箱系统 - API 测试指南

## 🚀 快速测试

### 1. 发送验证码

```powershell
$body = @{phone="13800138000"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/send-code" -Method POST -ContentType "application/json" -Body $body
```

**响应**:
```json
{
  "success": true,
  "message": "验证码已发送（开发环境请查看控制台）"
}
```

**查看控制台验证码**:
后端控制台会输出：`📱 验证码 [13800138000]: 123456 (有效期 5 分钟)`

---

### 2. 登录

```powershell
$loginBody = @{
  phone="13800138000"
  code="123456"  # 替换为控制台显示的验证码
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $response.access_token
Write-Host "Token: $token"
```

**响应**:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "phone": "13800138000",
    "email": null,
    "name": null,
    "avatar": null
  }
}
```

---

### 3. 获取用户信息

```powershell
$headers = @{Authorization="Bearer $token"}
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/me" -Headers $headers
```

---

### 4. AI 智能写信

```powershell
$aiBody = @{
  prompt="写一封会议邀请邮件，明天下午 3 点，讨论项目进度"
  tone="formal"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/ai/generate-email" -Method POST -ContentType "application/json" -Body $aiBody -Headers $headers
```

**响应**:
```json
{
  "content": "尊敬的先生/女士：\n\n您好！特此邀请您参加项目进度讨论会议...\n\n此致\n敬礼",
  "alternatives": ["..."]
}
```

---

### 5. 发送邮件

```powershell
$mailBody = @{
  to=@("test@example.com")
  subject="测试邮件"
  content="这是一封测试邮件"
  isDraft=$false
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/mail" -Method POST -ContentType "application/json" -Body $mailBody -Headers $headers
```

---

### 6. 获取收件箱

```powershell
Invoke-RestMethod -Uri "http://localhost:3001/api/mail/inbox?page=1&limit=10" -Headers $headers
```

**响应**:
```json
{
  "data": [...],
  "total": 1,
  "page": 1,
  "limit": 10,
  "totalPages": 1
}
```

---

### 7. AI 钓鱼邮件检测

```powershell
$phishingBody = @{
  mailContent="恭喜您中奖了！请点击链接领取奖金..."
  sender="winner@scam.com"
  subject="中奖通知"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3001/api/ai/detect-phishing" -Method POST -ContentType "application/json" -Body $phishingBody -Headers $headers
```

---

## 📝 完整测试脚本 (PowerShell)

```powershell
# AI 邮箱系统 API 测试脚本

$BASE_URL = "http://localhost:3001/api"

Write-Host "🧪 AI 邮箱系统 API 测试" -ForegroundColor Cyan
Write-Host "========================"
Write-Host ""

# 1. 发送验证码
Write-Host "📱 1. 发送验证码..." -ForegroundColor Yellow
$sendCodeBody = @{phone="13800138000"} | ConvertTo-Json
$sendCodeResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/send-code" -Method POST -ContentType "application/json" -Body $sendCodeBody
Write-Host "响应：$($sendCodeResponse.message)" -ForegroundColor Green
Write-Host "⚠️  请查看后端控制台获取验证码" -ForegroundColor Yellow
Write-Host ""

# 2. 登录
Write-Host "🔐 2. 登录" -ForegroundColor Yellow
$code = Read-Host "输入控制台显示的验证码"
$loginBody = @{
  phone="13800138000"
  code=$code
} | ConvertTo-Json
$loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
$token = $loginResponse.access_token
Write-Host "✅ 登录成功！Token: ${token:0:30}..." -ForegroundColor Green
Write-Host ""

$headers = @{Authorization="Bearer $token"}

# 3. 获取用户信息
Write-Host "👤 3. 获取用户信息..." -ForegroundColor Yellow
$userResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/me" -Headers $headers
Write-Host "用户 ID: $($userResponse.id)" -ForegroundColor Green
Write-Host ""

# 4. AI 智能写信
Write-Host "✉️  4. AI 智能写信..." -ForegroundColor Yellow
$aiBody = @{
  prompt="写一封会议邀请邮件，明天下午 3 点，讨论项目进度"
  tone="formal"
} | ConvertTo-Json
$aiResponse = Invoke-RestMethod -Uri "$BASE_URL/ai/generate-email" -Method POST -ContentType "application/json" -Body $aiBody -Headers $headers
Write-Host "AI 生成内容:" -ForegroundColor Cyan
Write-Host $($aiResponse.content) -ForegroundColor White
Write-Host ""

# 5. 发送邮件
Write-Host "📤 5. 发送邮件..." -ForegroundColor Yellow
$mailBody = @{
  to=@("test@example.com")
  subject="AI 生成的会议邀请"
  content=$aiResponse.content
  isDraft=$false
} | ConvertTo-Json
$mailResponse = Invoke-RestMethod -Uri "$BASE_URL/mail" -Method POST -ContentType "application/json" -Body $mailBody -Headers $headers
Write-Host "✅ 邮件发送成功！ID: $($mailResponse.id)" -ForegroundColor Green
Write-Host ""

# 6. 获取收件箱
Write-Host "📥 6. 获取收件箱..." -ForegroundColor Yellow
$inboxResponse = Invoke-RestMethod -Uri "$BASE_URL/mail/inbox?page=1&limit=10" -Headers $headers
Write-Host "收件箱邮件数：$($inboxResponse.total)" -ForegroundColor Green
Write-Host ""

# 7. AI 钓鱼检测
Write-Host "🛡️  7. AI 钓鱼邮件检测..." -ForegroundColor Yellow
$phishingBody = @{
  mailContent="恭喜您中奖了！请立即点击链接 www.scam.com 领取 100 万元奖金！"
  sender="winner@unknown.com"
  subject="中奖通知"
} | ConvertTo-Json
$phishingResponse = Invoke-RestMethod -Uri "$BASE_URL/ai/detect-phishing" -Method POST -ContentType "application/json" -Body $phishingBody -Headers $headers
Write-Host "检测结果:" -ForegroundColor Cyan
Write-Host "  是否钓鱼：$($phishingResponse.isPhishing)" -ForegroundColor $(if($phishingResponse.isPhishing){"Red"}else{"Green"})
Write-Host "  风险等级：$($phishingResponse.riskLevel)" -ForegroundColor $(if($phishingResponse.riskLevel -eq "high"){"Red"}elseif($phishingResponse.riskLevel -eq "medium"){"Yellow"}else{"Green"})
Write-Host "  风险评分：$($phishingResponse.score)" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ 所有测试完成！" -ForegroundColor Green
```

---

## 🎯 API 端点总览

| 模块 | 端点 | 方法 | 认证 |
|------|------|------|------|
| **认证** |
| 发送验证码 | `/api/auth/send-code` | POST | ❌ |
| 登录 | `/api/auth/login` | POST | ❌ |
| 获取用户 | `/api/auth/me` | GET | ✅ |
| 更新资料 | `/api/auth/profile` | PATCH | ✅ |
| 登出 | `/api/auth/logout` | POST | ✅ |
| **邮件** |
| 收件箱 | `/api/mail/inbox` | GET | ✅ |
| 已发送 | `/api/mail/sent` | GET | ✅ |
| 草稿箱 | `/api/mail/drafts` | GET | ✅ |
| 垃圾箱 | `/api/mail/trash` | GET | ✅ |
| 邮件详情 | `/api/mail/:id` | GET | ✅ |
| 发送邮件 | `/api/mail` | POST | ✅ |
| 保存草稿 | `/api/mail/draft` | POST | ✅ |
| 删除邮件 | `/api/mail/:id` | DELETE | ✅ |
| 恢复邮件 | `/api/mail/:id/restore` | POST | ✅ |
| 永久删除 | `/api/mail/:id/permanent` | DELETE | ✅ |
| 标记已读 | `/api/mail/:id/read` | PATCH | ✅ |
| 切换星标 | `/api/mail/:id/star` | PATCH | ✅ |
| 搜索 | `/api/mail/search` | GET | ✅ |
| AI 写信 | `/api/mail/send-with-ai` | POST | ✅ |
| AI 回复 | `/api/mail/:id/reply-with-ai` | POST | ✅ |
| **AI** |
| 生成邮件 | `/api/ai/generate-email` | POST | ✅ |
| 生成回复 | `/api/ai/generate-reply` | POST | ✅ |
| 钓鱼检测 | `/api/ai/detect-phishing` | POST | ✅ |
| 邮件分类 | `/api/ai/classify-mail` | POST | ✅ |
| 邮件摘要 | `/api/ai/summarize` | POST | ✅ |
| 联系人推荐 | `/api/ai/suggest-contacts` | POST | ✅ |

---

*最后更新：2026-03-18 09:50*
