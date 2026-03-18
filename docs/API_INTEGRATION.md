# API 集成指南

## 📦 已创建 API 服务

**文件位置**: `frontend/src/api/mail.ts`

**已实现功能**:
- ✅ 删除邮件 (`DELETE /api/mail/:id`)
- ✅ 批量删除
- ✅ 恢复邮件 (`POST /api/mail/:id/restore`)
- ✅ 永久删除 (`DELETE /api/mail/:id/permanent`)
- ✅ 转发邮件 (`POST /api/mail`)
- ✅ 归档邮件 (`POST /api/mail/:id/archive`)
- ✅ 标记已读 (`PATCH /api/mail/:id/read`)
- ✅ 批量标记已读
- ✅ 标星/取消标星 (`PATCH /api/mail/:id/star`)
- ✅ 移动邮件 (模拟)
- ✅ 标记垃圾邮件 (模拟)

## 🔧 集成步骤

### 1. 导入 API 服务

```typescript
import { mailApi } from '../api/mail';
```

### 2. 替换处理函数

**删除邮件示例**:
```typescript
// 替换前
const handleDelete = () => {
  if (selectedEmails.length === 0) {
    alert('请先选择要删除的邮件');
    return;
  }
  const confirmed = window.confirm(`确定要删除选中的 ${selectedEmails.length} 封邮件吗？`);
  if (confirmed) {
    alert(`已删除 ${selectedEmails.length} 封邮件`);
    setSelectedEmails([]);
    setSelectAll(false);
  }
};

// 替换后
const handleDelete = async () => {
  if (selectedEmails.length === 0) {
    alert('请先选择要删除的邮件');
    return;
  }
  const confirmed = window.confirm(`确定要删除选中的 ${selectedEmails.length} 封邮件吗？`);
  if (!confirmed) return;
  
  try {
    await mailApi.batchDelete(selectedEmails);
    alert(`已成功删除 ${selectedEmails.length} 封邮件`);
    setSelectedEmails([]);
    setSelectAll(false);
    // TODO: 刷新邮件列表
  } catch (error) {
    alert('删除失败，请重试');
  }
};
```

### 3. 需要更新的页面

**已完成**:
- ✅ API 服务创建 (`api/mail.ts`)

**待完成**:
- ⏸️ InboxPage.tsx
- ⏸️ SentPage.tsx
- ⏸️ DraftsPage.tsx
- ⏸️ TrashPage.tsx
- ⏸️ SpamPage.tsx
- ⏸️ StarredPage.tsx

## 📝 待实现功能

### 后端 API（需要后端支持）

**缺失的 API 端点**:
- [ ] `POST /api/mail/batch-delete` - 批量删除
- [ ] `POST /api/mail/:id/forward` - 转发邮件
- [ ] `POST /api/mail/:id/move` - 移动邮件
- [ ] `PATCH /api/mail/:id/spam` - 标记垃圾邮件

**临时方案**: 使用现有 API 组合实现

## 🎯 下一步

1. ✅ API 服务已创建
2. ⏸️ 在各页面中导入并使用
3. ⏸️ 添加错误处理
4. ⏸️ 添加加载状态
5. ⏸️ 刷新邮件列表

---

*创建时间：2026-03-18 17:35*
