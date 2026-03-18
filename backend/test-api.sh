#!/bin/bash
# AI 邮箱系统 API 测试脚本

BASE_URL="http://localhost:3001/api"

echo "🧪 AI 邮箱系统 API 测试"
echo "========================"
echo ""

# 1. 发送验证码
echo "📱 1. 发送验证码..."
SEND_CODE_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/send-code" \
  -H "Content-Type: application/json" \
  -d '{"phone": "13800138000"}')
echo "$SEND_CODE_RESPONSE"
echo ""

# 2. 登录（使用控制台显示的验证码）
echo "🔐 2. 登录（请查看控制台验证码）..."
# 等待用户输入
read -p "输入验证码：" CODE
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"phone\": \"13800138000\", \"code\": \"$CODE\"}")
echo "$LOGIN_RESPONSE"

# 提取 token
TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
if [ -z "$TOKEN" ]; then
  echo "❌ 登录失败，未获取到 token"
  exit 1
fi
echo ""
echo "✅ Token 获取成功：${TOKEN:0:20}..."
echo ""

# 3. 获取用户信息
echo "👤 3. 获取用户信息..."
curl -s "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN"
echo ""
echo ""

# 4. AI 智能写信
echo "✉️ 4. AI 智能写信..."
AI_EMAIL_RESPONSE=$(curl -s -X POST "$BASE_URL/ai/generate-email" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"prompt": "写一封会议邀请邮件，明天下午 3 点，讨论项目进度", "tone": "formal"}')
echo "$AI_EMAIL_RESPONSE"
echo ""

# 5. 发送邮件
echo "📤 5. 发送邮件..."
curl -s -X POST "$BASE_URL/mail" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "to": ["test@example.com"],
    "subject": "测试邮件",
    "content": "这是一封测试邮件",
    "isDraft": false
  }'
echo ""
echo ""

# 6. 获取收件箱
echo "📥 6. 获取收件箱..."
curl -s "$BASE_URL/mail/inbox?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"
echo ""

echo ""
echo "✅ 测试完成！"
