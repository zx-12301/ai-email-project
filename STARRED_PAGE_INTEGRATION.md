# 星标邮件页面 API 集成

**日期**: 2026-03-19  
**状态**: ✅ 完成

---

## 📋 集成内容

### 1️⃣ API 集成

**数据加载**:
- ✅ 使用 `mailApi.search()` 获取星标邮件
- ✅ 支持分页（currentPage, pageSize）
- ✅ 过滤条件：`isStarred: true`

**工具栏功能**:
- ✅ 删除 - `mailApi.delete()`
- ✅ 转发 - `mailApi.forward()`
- ✅ 垃圾邮件 - `mailApi.moveToFolder('spam')`
- ✅ 标记为已读 - `mailApi.markAsRead(true)`
- ✅ 标记为未读 - `mailApi.markAsRead(false)`
- ✅ 取消星标 - `mailApi.toggleStar()`
- ✅ 移动到文件夹 - `mailApi.moveToFolder()`

---

## 🎨 UI 改进

### 下拉菜单

**标记为**:
- ✅ 已读
- ✅ 未读

**移动到**:
- ✅ 已发送
- ✅ 草稿箱
- ✅ 已删除
- ✅ 垃圾箱

### 分页功能

**布局**:
```
┌─────────────────────────────────────────────────────────────┐
│ [上一页] [下一页]    共 31 封，1/2 页    [5] [10] [20] [1] 跳转 │
└─────────────────────────────────────────────────────────────┘
```

**功能**:
- ✅ 上一页/下一页导航
- ✅ 页码跳转
- ✅ 每页数量切换（5/10/20）
- ✅ 总邮件数和页数显示

---

## 🔧 技术实现

### 状态管理

```typescript
const [starredEmails, setStarredEmails] = useState<Email[]>([]);
const [loading, setLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);
const [totalEmails, setTotalEmails] = useState(0);
```

### 数据加载

```typescript
const loadStarredEmails = async () => {
  const result = await mailApi.search('', currentPage, pageSize, { 
    isStarred: true 
  });
  
  const transformedEmails = result.data.map(mail => ({
    id: mail.id,
    from: mail.fromName || mail.from.split('@')[0],
    subject: mail.subject,
    date: formatDate(mail.createdAt),
    isStarred: mail.isStarred,
    // ...
  }));
  
  setStarredEmails(transformedEmails);
  setTotalEmails(result.total);
};
```

### 自动加载

```typescript
useEffect(() => {
  loadStarredEmails();
}, [currentPage, pageSize]);
```

### 辅助函数

```typescript
// 获取真实数据 ID
const getRealEmailIds = () => {
  return selectedEmails.filter(id => 
    starredEmails.some(email => String(email.id) === String(id))
  );
};

// 显示操作结果
const showResultMessage = (realCount, totalCount, action) => {
  // 智能提示
};
```

---

## 📊 数据流

```
用户访问星标页面
  ↓
调用 mailApi.search(isStarred: true)
  ↓
获取星标邮件列表
  ↓
转换数据格式
  ↓
显示邮件列表
  ↓
用户操作（删除/转发等）
  ↓
调用对应 API
  ↓
刷新列表
```

---

## 🧪 测试步骤

### 测试 1: 加载星标邮件
1. 访问星标邮件页面
2. 验证加载真实数据
3. 查看总邮件数显示

### 测试 2: 删除操作
1. 选择星标邮件
2. 点击"删除"
3. 确认删除
4. 验证邮件从列表消失

### 测试 3: 取消星标
1. 选择星标邮件
2. 点击邮件行的星标按钮
3. 验证取消星标
4. 验证邮件从列表消失

### 测试 4: 分页功能
1. 点击"下一页"
2. 验证加载第二页数据
3. 切换每页数量为 5
4. 验证每页显示 5 封邮件

### 测试 5: 标记为已读/未读
1. 选择邮件
2. 点击"标记为" → "已读"
3. 验证邮件标记为已读
4. 再次选择 → "未读"
5. 验证邮件标记为未读

---

## 📝 API 接口

### 搜索星标邮件

**请求**:
```
GET /api/mail/search?q=&page=1&limit=20&isStarred=true
```

**响应**:
```json
{
  "data": [...],
  "total": 31,
  "page": 1,
  "limit": 20,
  "totalPages": 2
}
```

### 取消星标

**请求**:
```
PATCH /api/mail/:id/star
```

**响应**:
```json
{
  "success": true
}
```

---

## ✅ 完成清单

- [x] 导入 mailApi
- [x] 添加状态管理
- [x] 实现数据加载
- [x] 实现分页功能
- [x] 添加工具栏按钮事件
- [x] 实现下拉菜单
- [x] 实现取消星标功能
- [x] 添加辅助函数
- [x] 添加用户友好提示
- [x] 更新分页栏 UI
- [x] 添加点击外部关闭菜单

---

## 🎯 功能特性

### 智能提示
- ✅ 混合选择时提示真实数据数量
- ✅ 只选择测试数据时提示无法操作
- ✅ 操作成功后显示结果

### 用户体验
- ✅ 加载状态显示
- ✅ 错误提示
- ✅ 自动刷新列表
- ✅ 清空选择状态

### 性能优化
- ✅ 分页加载减少数据量
- ✅ 只加载当前页数据
- ✅ 避免不必要的重新渲染

---

## 🚀 下一步

**可选改进**:
- [ ] 添加批量取消星标
- [ ] 添加排序功能（按日期/发件人）
- [ ] 添加搜索功能
- [ ] 添加快速筛选（已读/未读）

---

*最后更新：2026-03-19 14:18*
