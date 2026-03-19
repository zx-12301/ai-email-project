# 草稿箱页面 API 集成

**日期**: 2026-03-19  
**状态**: ✅ 完成

---

## ✅ 已完成功能

### 1️⃣ API 集成

**数据加载**:
- ✅ 使用 `mailApi.getDrafts()` 获取草稿
- ✅ 支持分页（currentPage, pageSize）
- ✅ 合并测试数据和真实数据

**工具栏功能**:
- ✅ 删除 - `mailApi.delete()`
- ✅ 转发 - `mailApi.forward()`
- ✅ 标记为已读/未读 - `mailApi.markAsRead()`
- ✅ 标记为星标 - `mailApi.toggleStar()`
- ✅ 归档 - `mailApi.archive()`
- ✅ 移动到文件夹 - `mailApi.moveToFolder()`

### 2️⃣ 测试数据

**3 封测试草稿**:
1. 关于召开产品评审会的通知（12KB）
2. 2024 年度工作总结报告（28KB）
3. (无主题) - 李总，您好！关于上次会议讨论的合作事宜（5KB）

**显示逻辑**:
- 第一页：显示 3 封测试数据 + 真实数据
- 其他页：只显示真实数据

### 3️⃣ 分页功能

- ✅ 上一页/下一页导航
- ✅ 页码跳转
- ✅ 每页数量切换（5/10/20）
- ✅ 总草稿数和页数显示

---

## 🔧 技术实现

### 状态管理

```typescript
const [drafts, setDrafts] = useState<Draft[]>([]);
const [loading, setLoading] = useState(false);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(20);
const [totalDrafts, setTotalDrafts] = useState(0);
```

### 数据加载

```typescript
const loadDrafts = async () => {
  const result = await mailApi.getDrafts(currentPage, pageSize);
  const transformedDrafts = result.data.map(draft => ({
    id: draft.id,
    subject: draft.subject || '(无主题)',
    content: draft.content.substring(0, 50) + '...',
    isTest: false,
  }));
  
  // 只在第一页显示测试数据
  const allDrafts = currentPage === 1 
    ? [...mockDrafts, ...transformedDrafts] 
    : transformedDrafts;
  
  setDrafts(allDrafts);
  setTotalDrafts(result.total + (currentPage === 1 ? mockDrafts.length : 0));
};
```

### 辅助函数

```typescript
// 获取真实数据 ID
const getRealDraftIds = () => {
  return selectedDrafts.filter(id => 
    drafts.some(draft => String(draft.id) === String(id) && !draft.isTest)
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
用户访问草稿箱页面
  ↓
调用 mailApi.getDrafts()
  ↓
获取草稿列表
  ↓
合并测试数据（第一页）
  ↓
显示草稿列表
  ↓
用户操作（删除/转发等）
  ↓
调用对应 API
  ↓
刷新列表
```

---

## 🧪 测试步骤

### 测试 1: 加载草稿
1. 访问草稿箱页面
2. 验证显示 3 封测试数据
3. 查看总草稿数显示

### 测试 2: 删除操作
1. 选择草稿
2. 点击"删除"
3. 确认删除
4. 验证草稿从列表消失

### 测试 3: 转发操作
1. 选择草稿
2. 点击"转发"
3. 输入收件人邮箱
4. 验证转发成功

### 测试 4: 分页功能
1. 点击"下一页"
2. 验证加载第二页数据
3. 切换每页数量为 5
4. 验证每页显示 5 封草稿

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

## 📝 注意事项

**草稿特殊性**:
- 草稿没有"已读/未读"状态
- 草稿默认在草稿箱文件夹
- 可以转发草稿
- 可以移动到已发送/垃圾箱

**API 调用**:
- 删除草稿：`DELETE /api/mail/:id`
- 转发草稿：`POST /api/mail` (content 为草稿内容)
- 标记已读：`PATCH /api/mail/:id/read`
- 移动文件夹：`PATCH /api/mail/:id` (folder: 'sent'/'trash')

---

*最后更新：2026-03-19 15:37*
