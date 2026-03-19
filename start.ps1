# AI 智能邮箱系统 - 一键启动脚本
# 使用方式：.\start.ps1

Write-Host ""
Write-Host "🦞  AI 智能邮箱系统" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 启动中..." -ForegroundColor Yellow
Write-Host ""

# 启动后端
Write-Host "📦 [1/2] 启动后端服务 (NestJS + SQLite)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; Write-Host '后端启动中...' -ForegroundColor Cyan; npm run start:dev"

# 等待后端启动
Start-Sleep -Seconds 5

# 启动前端
Write-Host "🎨 [2/2] 启动前端界面 (React + Vite)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; Write-Host '前端启动中...' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "✅ 启动完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📍 访问地址：" -ForegroundColor Cyan
Write-Host "   🌐 前端：http://localhost:3000" -ForegroundColor White
Write-Host "   🔌 后端：http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "🧪 快速测试：" -ForegroundColor Cyan
Write-Host "   1. 打开浏览器访问 http://localhost:3000" -ForegroundColor White
Write-Host "   2. 输入手机号（如：13800138000）" -ForegroundColor White
Write-Host "   3. 查看后端控制台获取验证码" -ForegroundColor White
Write-Host "   4. 输入验证码登录" -ForegroundColor White
Write-Host ""
Write-Host "📖 更多文档：" -ForegroundColor Cyan
Write-Host "   - START.md     : 详细启动指南" -ForegroundColor White
Write-Host "   - API_TEST.md  : API 测试脚本" -ForegroundColor White
Write-Host "   - docs/        : 项目文档" -ForegroundColor White