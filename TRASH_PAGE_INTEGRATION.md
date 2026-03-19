# 已删除页面 API 集成

**日期**: 2026-03-19  
**状态**: ✅ 完成

---

## ✅ 已完成功能

### 1️⃣ API 集成

**数据加载**:
- ✅ 使用 `mailApi.getTrash()` 获取已删除邮件
- ✅ 支持分页（currentPage, pageSize）
- ✅ 合并测试数据和真实数据

**工具栏功能**:
- ✅ 永久删除 - `mailApi.permanentDelete()`
- ✅ 恢复邮件 - `mailApi.restore()`
- ✅ 转发 - `mailApi.forward()`
- ✅ 标记为已读/未读 - `mailApi.markAsRead()`
- ✅ 移动到文件夹 - `mailApi.moveToFolder()`

### 2️⃣ 测试数据

**3 封测试邮件**:
1. 京东 JD.com - 您的订单已发货
2. 招商银行 - 信用卡账单通知
3. Apple - 您的 Apple 账户登录异常

**显示逻辑**:
- 第一页：显示 3 封测试数据 + 真实数据
- 其他页：只显示真实数据

### 3️⃣ 分页功能

- ✅ 上一页/下一页导航
- ✅ 页码跳转
- ✅ 每页数量切换（5/10/20）
- ✅ 总邮件数和页数显示

---

## 🔧 技术实现

### 状态管理

```typescript
const [deletedEmails, setDeletedEmails] = useState<Email[]>([]);
const [loading, setLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);
const [totalEmails, setTotalEmails] = useState(0);
```

### 数据加载

```typescript
const loadDeletedEmails = async () => {
  const result = await mailApi.getTrash(currentPage, pageSize);
  const transformedEmails = result.data.map(mail => ({
    id: mail.id,
    from: mail.fromName,
    deletedDate: formatDate(mail.deletedAt),
    isTest: false,
  }));
  
  // 只在第一页显示测试数据
  const allEmails = currentPage === 1 
    ? [...mockDeletedEmails, ...transformedEmails] 
    : transformedEmails;
  
  setDeletedEmails(allEmails);
  setTotalEmails(result.total + (currentPage === 1 ? mockDeletedEmails.length : 0));
};
```

### 辅助函数

```typescript
// 获取真实数据 ID
const getRealEmailIds = () => {
  return selectedEmails.filter(id => 
    deletedEmails.some(email => String(email.id) === String(id) && !email.isTest)
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
用户访问已删除页面
  ↓
调用 mailApi.getTrash()
  ↓
获取已删除邮件列表
  ↓
合并测试数据（第一页）
  ↓
显示邮件列表
  ↓
用户操作（删除/恢复等）
  ↓
调用对应 API
  ↓
刷新列表
```

---

## 🧪 测试步骤

### 测试 1: 加载已删除邮件
1. 访问已删除页面
2. 验证显示 3 封测试数据
3. 查看总邮件数显示

### 测试 2: 恢复操作
1. 选择已删除邮件
2. 点击"恢复"
3. 验证邮件恢复到收件箱

### 测试 3: 永久删除
1. 选择已删除邮件
2. 点击"删除"
3. 确认删除
4. 验证邮件永久删除

### 测试 4: 分页功能
1. 点击"下一页"
2. 验证加载第二页数据
3. 切换每页数量为 5
4. 验证每页显示 5 封邮件

---

## ✅ 完成清单

- [x] 导入 mailApi
- [x] 添加状态管理
- [x] 实现数据加载
- [x] 实现分页功能
- [x] 添加工具栏按钮事件
- [x] 实现下拉菜单
- [x] 添加辅助函数
- [x] 添加用户友好提示
- [x] 更新分页栏 UI
- [x] 添加测试数据
- [x] 同步样式

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

## 📝 特殊功能

**已删除页面特有**:
- 永久删除（不可恢复）
- 恢复邮件（回到收件箱）
- 清空垃圾箱

**API 调用**:
- 永久删除：`DELETE /api/mail/:id/permanent`
- 恢复邮件：`POST /api/mail/:id/restore`
- 移动文件夹：`PATCH /api/mail/:id`

---

*最后更新：2026-03-19 15:53*
