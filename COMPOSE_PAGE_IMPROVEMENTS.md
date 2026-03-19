# 写信页面改进总结

**日期**: 2026-03-19  
**状态**: 🔄 进行中

---

## ✅ 已完成改进

### 1️⃣ 默认打开 AI 写作面板

**修改**:
```typescript
// 修改前
const [showAIPanel, setShowAIPanel] = useState(false)

// 修改后
const [showAIPanel, setShowAIPanel] = useState(true)  // 默认打开
```

### 2️⃣ 集成百炼 AI API

**修改**:
```typescript
const handleAIGenerate = async () => {
  try {
    // 调用百炼 AI API
    const response = await fetch('http://localhost:3001/api/ai/generate-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        prompt: aiPrompt,
        tone: aiTone  // formal, friendly, concise
      })
    })
    
    if (response.ok) {
      const result = await response.json()
      setFormData({ ...formData, content: result.content })
    }
  } catch (error) {
    // API 失败时使用模板
  }
}
```

**新增状态**:
```typescript
const [aiTone, setAiTone] = useState('formal')  // 语气选择
```

### 3️⃣ 收件人选择展示系统内所有用户

**新增状态**:
```typescript
const [allUsers, setAllUsers] = useState<User[]>([])  // 系统内所有用户
const [showUserPicker, setShowUserPicker] = useState(false)
```

**加载用户**:
```typescript
useEffect(() => {
  // 加载系统内所有用户
  const usersResponse = await fetch('http://localhost:3001/api/contact', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })
  if (usersResponse.ok) {
    const usersData = await usersResponse.json()
    setAllUsers(usersData || [])
  }
}, [])
```

**用户选择器 UI**:
```tsx
{showContactPicker && (
  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg">
    <div className="p-3 border-b">
      <div className="text-xs font-medium text-slate-500 mb-2">系统用户</div>
      <input type="text" placeholder="搜索用户..." />
    </div>
    <div className="p-2">
      {/* 系统用户列表 */}
      {allUsers.map((user) => (
        <div onClick={() => selectUser(user)} className="flex items-center gap-3 p-2 hover:bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-medium">{user.name}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
        </div>
      ))}
      
      {/* 联系人列表 */}
      {contacts.map((contact) => (...)}
    </div>
  </div>
)}
```

### 4️⃣ 发送后收件人可在收件箱查看

**后端已实现**:
- ✅ `POST /api/mail` - 发送邮件
- ✅ 邮件自动保存到收件箱（folder: 'inbox'）
- ✅ 支持 SMTP 发送（sendViaSmtp 参数）

**前端已实现**:
- ✅ 发送邮件时调用 `mailApi.sendMail()`
- ✅ 支持 SMTP 发送选项
- ✅ 发送成功后跳转到收件箱

---

## 📝 待完成修改

### 联系人选择器改进

需要在 `ComposePage.tsx` 中添加系统用户显示：

```tsx
{/* 联系人选择器 */}
{showContactPicker && (
  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
    <div className="p-3 border-b border-slate-200">
      <div className="text-xs font-medium text-slate-500 mb-2">系统用户</div>
      <input
        type="text"
        placeholder="搜索用户..."
        className="w-full px-3 py-2 text-sm bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
    <div className="p-2">
      {/* 系统用户列表 */}
      {allUsers.length > 0 && (
        <div className="mb-2">
          {allUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => {
                const newTo = formData.to ? `${formData.to}, ${user.email}` : user.email
                setFormData({ ...formData, to: newTo })
                setShowContactPicker(false)
              }}
              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900">{user.name}</div>
                <div className="text-xs text-slate-500">{user.email}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* 联系人列表 */}
      {contacts.map((contact) => (...)}
    </div>
  </div>
)}
```

### AI 语气选择 UI

在 AI 写作面板中添加语气选择：

```tsx
<div className="mb-4">
  <label className="block text-sm font-medium text-slate-700 mb-2">
    语气
  </label>
  <div className="flex gap-2">
    <button
      onClick={() => setAiTone('formal')}
      className={`px-3 py-1.5 text-xs rounded-lg ${
        aiTone === 'formal'
          ? 'bg-purple-50 text-purple-600'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      正式
    </button>
    <button
      onClick={() => setAiTone('friendly')}
      className={`px-3 py-1.5 text-xs rounded-lg ${
        aiTone === 'friendly'
          ? 'bg-purple-50 text-purple-600'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      友好
    </button>
    <button
      onClick={() => setAiTone('concise')}
      className={`px-3 py-1.5 text-xs rounded-lg ${
        aiTone === 'concise'
          ? 'bg-purple-50 text-purple-600'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      简洁
    </button>
  </div>
</div>
```

---

## 🧪 测试步骤

### 测试 1: AI 写作默认打开
1. 访问写信页面
2. 验证 AI 写作面板默认打开
3. 输入提示词
4. 选择语气（正式/友好/简洁）
5. 点击"AI 生成"
6. 验证邮件内容生成

### 测试 2: 选择系统用户
1. 点击收件人输入框旁的联系人图标
2. 验证显示系统用户列表
3. 点击某个用户
4. 验证用户邮箱自动填入收件人

### 测试 3: 发送邮件
1. 填写收件人、主题、内容
2. 点击"发送"
3. 验证发送成功
4. 登录收件人账号
5. 验证收件箱显示新邮件

---

## ✅ 完成清单

- [x] 默认打开 AI 写作面板
- [x] 集成百炼 AI API
- [x] 添加语气选择状态
- [x] 加载系统内所有用户
- [x] 添加用户选择器状态
- [ ] 更新联系人选择器 UI（添加系统用户）
- [ ] 添加 AI 语气选择 UI
- [ ] 测试完整流程

---

*最后更新：2026-03-19 17:05*
