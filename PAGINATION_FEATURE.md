# 收件箱分页功能

**日期**: 2026-03-19  
**状态**: ✅ 完成

---

## 📋 功能说明

为收件箱页面添加了完整的分页功能，支持：
- ✅ 上一页/下一页导航
- ✅ 页码跳转
- ✅ 每页数量切换（5/10/20）
- ✅ 总邮件数和页数显示
- ✅ 自动加载对应页数据

---

## 🎨 UI 设计

### 分页栏布局
```
┌─────────────────────────────────────────────────────────────┐
│ [上一页] [下一页]    共 31 封，1/3 页    [5] [10] [20] [11] 跳转 │
└─────────────────────────────────────────────────────────────┘
```

### 功能区域

**左侧导航**:
- 上一页按钮（第一页时禁用）
- 下一页按钮（最后一页时禁用）

**中间信息**:
- 总邮件数
- 当前页/总页数

**右侧控制**:
- 每页数量快捷按钮（5/10/20）
- 页码输入框
- 跳转按钮

---

## 🔧 技术实现

### 1️⃣ 状态管理

```typescript
// 分页状态
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(11);  // 默认每页 11 封
const [totalEmails, setTotalEmails] = useState(0);
```

### 2️⃣ API 集成

```typescript
const loadRealEmails = async () => {
  const result = await mailApi.getInbox(currentPage, pageSize);
  setRealEmails(transformedEmails);
  setTotalEmails(result.total || emailList.length);
};
```

### 3️⃣ 自动加载

```typescript
useEffect(() => {
  loadRealEmails();
}, [currentPage, pageSize]);  // 页码或每页数量变化时重新加载
```

### 4️⃣ 分页控制函数

```typescript
// 上一页
const handlePreviousPage = () => {
  if (currentPage > 1) {
    setCurrentPage(currentPage - 1);
  }
};

// 下一页
const handleNextPage = () => {
  const totalPages = Math.ceil(totalEmails / pageSize);
  if (currentPage < totalPages) {
    setCurrentPage(currentPage + 1);
  }
};

// 跳转到指定页
const handleJumpToPage = (page: number) => {
  const totalPages = Math.ceil(totalEmails / pageSize);
  if (page >= 1 && page <= totalPages) {
    setCurrentPage(page);
  }
};

// 切换每页数量
const handlePageSizeChange = (size: number) => {
  setPageSize(size);
  setCurrentPage(1);  // 重置到第一页
};
```

---

## 📊 数据流

```
用户操作（翻页/切换数量）
  ↓
更新分页状态（currentPage/pageSize）
  ↓
触发 useEffect 监听
  ↓
调用 API 加载对应页数据
  ↓
更新邮件列表和总数
  ↓
重新渲染页面
```

---

## 🎯 功能特性

### 智能禁用
- ✅ 第一页时"上一页"禁用
- ✅ 最后一页时"下一页"禁用
- ✅ 输入框限制在有效范围内

### 用户体验
- ✅ 切换每页数量时自动回到第一页
- ✅ 输入页码后按回车或点击跳转按钮
- ✅ 实时显示总邮件数和页数
- ✅ 当前页码高亮显示

### 性能优化
- ✅ 只加载当前页数据
- ✅ 减少单次请求数据量
- ✅ 避免不必要的重新渲染

---

## 🧪 测试步骤

### 测试 1: 基本翻页
1. 访问收件箱
2. 点击"下一页"
3. 验证加载第二页数据
4. 点击"上一页"
5. 验证返回第一页

### 测试 2: 切换每页数量
1. 点击"5"按钮
2. 验证每页显示 5 封邮件
3. 验证自动回到第一页
4. 点击"20"按钮
5. 验证每页显示 20 封邮件

### 测试 3: 页码跳转
1. 在输入框输入页码
2. 点击"跳转"按钮
3. 验证跳转到指定页
4. 输入无效页码（如 0 或超过总页数）
5. 验证不执行跳转

### 测试 4: 边界情况
1. 在第一页点击"上一页"
2. 验证无反应（已禁用）
3. 在最后一页点击"下一页"
4. 验证无反应（已禁用）

---

## 📝 API 接口

### 获取收件箱（带分页）

**请求**:
```
GET /api/mail/inbox?page=1&limit=11
```

**响应**:
```json
{
  "data": [...],
  "total": 31,
  "page": 1,
  "limit": 11,
  "totalPages": 3
}
```

---

## 🎨 样式说明

### 按钮状态
- **默认**: 白色背景，灰色边框
- **悬停**: 浅灰色背景
- **当前页**: 蓝色背景，白色文字
- **禁用**: 50% 透明度，不可点击

### 输入框
- **默认**: 白色背景，灰色边框
- **聚焦**: 蓝色光晕
- **宽度**: 固定 12 像素（3 个字符）

---

## ✅ 完成清单

- [x] 添加分页状态管理
- [x] 实现上一页/下一页功能
- [x] 实现页码跳转功能
- [x] 实现每页数量切换
- [x] 更新 API 调用支持分页
- [x] 添加自动加载机制
- [x] 更新分页栏 UI
- [x] 添加边界检查
- [x] 添加禁用状态
- [x] 优化用户体验

---

## 🚀 下一步

**可选改进**:
- [ ] 添加快速翻页（+10/-10）
- [ ] 添加页码列表（1 2 3 ... 10）
- [ ] 记住用户的分页偏好
- [ ] 添加加载动画
- [ ] 支持无限滚动

---

*最后更新：2026-03-19 14:05*
