# 星标邮件页面测试数据

**日期**: 2026-03-19  
**状态**: ✅ 完成

---

## 📋 添加内容

### 1️⃣ 测试数据列表

**4 封测试邮件**:
1. **Dell Notifications** - XPS 13 9360 有新的更新
2. **Apple Developer** - The Apple Developer Agreement has been updated
3. **张三** - 项目进度汇报 - 请查阅（带附件）
4. **李四** - 会议邀请 - 下周产品评审会

### 2️⃣ 数据显示逻辑

**第一页**:
- ✅ 显示 4 封测试数据
- ✅ 显示真实数据
- ✅ 测试数据带"测试"标签

**其他页**:
- ✅ 只显示真实数据
- ✅ 不显示测试数据

---

## 🎨 测试数据详情

### 邮件 1: Dell Notifications
- **发件人**: Dell Notifications
- **主题**: XPS 13 9360 有新的更新
- **日期**: 11 月 22 日
- **大小**: 28KB
- **状态**: 未读
- **标签**: 测试

### 邮件 2: Apple Developer
- **发件人**: Apple Developer
- **主题**: The Apple Developer Agreement has been updated.
- **日期**: 11 月 01 日
- **大小**: 7KB
- **状态**: 已读
- **标签**: 测试

### 邮件 3: 张三
- **发件人**: 张三
- **主题**: 项目进度汇报 - 请查阅
- **日期**: 10 月 20 日
- **大小**: 25KB
- **状态**: 已读
- **附件**: ✅ 有
- **标签**: 测试

### 邮件 4: 李四
- **发件人**: 李四
- **主题**: 会议邀请 - 下周产品评审会
- **日期**: 10 月 18 日
- **大小**: 05KB
- **状态**: 未读
- **标签**: 测试

---

## 🔧 技术实现

### 数据结构

```typescript
const mockStarredEmails: Email[] = [
  {
    id: 'test-1',
    from: 'Dell Notifications',
    subject: 'XPS 13 9360 有新的更新',
    date: '11 月 22 日',
    size: '28KB',
    isTest: true,
    avatarColor: 'bg-slate-100 text-slate-600'
  },
  // ...
];
```

### 合并逻辑

```typescript
const loadStarredEmails = async () => {
  const result = await mailApi.search('', currentPage, pageSize, { 
    isStarred: true 
  });
  
  // 转换真实数据
  const transformedEmails = result.data.map(mail => ({
    id: mail.id,
    from: mail.fromName,
    isTest: false,
    // ...
  }));
  
  // 只在第一页显示测试数据
  const allEmails = currentPage === 1 
    ? [...mockStarredEmails, ...transformedEmails] 
    : transformedEmails;
  
  setStarredEmails(allEmails);
  setTotalEmails(result.total + (currentPage === 1 ? mockStarredEmails.length : 0));
};
```

### 显示逻辑

```tsx
<div className="flex items-center gap-1">
  <span>{email.from}</span>
  {email.isTest && (
    <span className="px-1 py-0.5 text-[9px] bg-blue-100 text-blue-600 rounded">
      测试
    </span>
  )}
</div>
```

---

## 📊 数据分布

### 第一页（默认 20 封/页）
- 测试数据：4 封
- 真实数据：最多 20 封
- 总计：最多 24 封

### 其他页
- 测试数据：0 封
- 真实数据：最多 20 封
- 总计：最多 20 封

---

## 🧪 测试验证

### 测试 1: 查看测试数据
1. 访问星标邮件页面
2. 验证显示 4 封测试数据
3. 验证测试数据带"测试"标签
4. 验证测试数据在最前面

### 测试 2: 翻页验证
1. 点击"下一页"
2. 验证不显示测试数据
3. 验证只显示真实数据
4. 点击"上一页"返回第一页
5. 验证测试数据重新显示

### 测试 3: 切换每页数量
1. 点击"5"按钮
2. 验证每页显示 5 封邮件
3. 验证第一页包含测试数据
4. 点击"20"按钮
5. 验证每页显示 20 封邮件

### 测试 4: 操作测试数据
1. 选择测试数据邮件
2. 点击"删除"
3. 验证提示"测试数据无法删除"
4. 选择真实数据邮件
5. 点击"删除"
6. 验证真实数据被删除

---

## ✅ 完成清单

- [x] 定义测试数据数组
- [x] 添加 4 封测试邮件
- [x] 设置 isTest 标记
- [x] 添加 avatarColor
- [x] 合并测试和真实数据
- [x] 只在第一页显示测试数据
- [x] 更新总邮件数计算
- [x] 显示测试标签
- [x] 测试数据 ID 使用字符串

---

## 🎯 用户体验

### 视觉识别
- ✅ 测试数据带蓝色"测试"标签
- ✅ 标签位置：发件人右侧
- ✅ 标签样式：小字号，蓝色背景

### 操作提示
- ✅ 删除测试数据时提示无法删除
- ✅ 其他操作同样提示
- ✅ 真实数据操作正常

---

## 🚀 下一步

**可选改进**:
- [ ] 添加更多测试数据
- [ ] 测试数据也支持分页
- [ ] 添加测试数据过滤选项
- [ ] 测试数据支持排序

---

*最后更新：2026-03-19 14:37*
