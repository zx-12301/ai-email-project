# 星标联系人邮件页面 API 集成指南

**日期**: 2026-03-19  
**状态**: 📝 规划中

---

## 📋 页面结构

```
┌─────────────────────────────────────────────────────────────┐
│ 左侧（288px）           │ 右侧（剩余空间）                  │
├─────────────────────────┼───────────────────────────────────┤
│ 🔍 搜索联系人           │ 工具栏：删除 转发 垃圾邮件...     │
├─────────────────────────┼───────────────────────────────────┤
│ 👤 人保财险             │ 📧 墨刀素材新增收益方式通知       │
│    epolicy@picc.com.cn  │    📎 10 月 25 日  13KB              │
├─────────────────────────┼───────────────────────────────────┤
│ 👤 墨刀                 │ 📧 从「玩」到「玩转墨刀」         │
│    dm@mail.modao.cc     │    📎 10 月 18 日  33KB              │
├─────────────────────────┼───────────────────────────────────┤
│ 👤 梦忻雨               │ ...                               │
│    demon@Spt.com        │                                   │
└─────────────────────────┴───────────────────────────────────┘
```

---

## 🔧 API 集成方案

### 方案 1: 使用现有接口（推荐）

**左侧联系人列表**:
```typescript
// 获取所有联系人，过滤出星标的
const contacts = await mailApi.getContacts();
const starredContacts = contacts.filter(c => c.isStarred);
```

**右侧邮件列表**:
```typescript
// 获取所有邮件，过滤出该联系人的
const emails = await mailApi.getInbox(page, limit);
const contactEmails = emails.filter(e => e.from === selectedContact.email);
```

**优点**:
- ✅ 不需要新 API
- ✅ 使用现有接口
- ✅ 实现简单

**缺点**:
- ❌ 前端过滤，性能稍差
- ❌ 需要加载所有邮件

---

### 方案 2: 新增专用接口

**新增 API**:
```
GET /api/mail/from-contact/:contactId?page=1&limit=20
```

**响应**:
```json
{
  "data": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

**优点**:
- ✅ 后端过滤，性能好
- ✅ 支持分页
- ✅ 数据准确

**缺点**:
- ❌ 需要新增后端接口
- ❌ 开发周期长

---

## 📝 实现步骤（方案 1）

### 步骤 1: 加载星标联系人

```typescript
const loadStarredContacts = async () => {
  try {
    const contacts = await mailApi.getContacts();
    const starred = contacts.filter((c: any) => c.isStarred);
    setStarredContacts(starred);
  } catch (error) {
    console.error('加载星标联系人失败:', error);
    // 使用测试数据
    setStarredContacts(mockStarredContacts);
  }
};
```

### 步骤 2: 加载联系人邮件

```typescript
const loadContactEmails = async (contact: Contact) => {
  try {
    const result = await mailApi.getInbox(currentPage, 20);
    const emails = result.data.filter(
      (mail: any) => mail.from === contact.email
    );
    setContactEmails(emails);
  } catch (error) {
    console.error('加载联系人邮件失败:', error);
    // 使用测试数据
    setContactEmails(mockContactEmails);
  }
};
```

### 步骤 3: 工具栏功能

复用收件箱和星标页面的工具栏功能：
- ✅ 删除
- ✅ 转发
- ✅ 垃圾邮件
- ✅ 标记为已读/未读
- ✅ 移动到文件夹

---

## 🎨 UI 优化建议

### 左侧联系人列表

**当前**:
- ✅ 搜索功能
- ✅ 星标联系人
- ✅ 选中高亮

**建议添加**:
- [ ] 联系人数量显示
- [ ] 未读邮件数标记
- [ ] 联系人头像（已有）
- [ ] 快速操作（星标/取消星标）

### 右侧邮件列表

**当前**:
- ✅ 邮件列表
- ✅ 工具栏
- ✅ 分页（静态）

**建议添加**:
- ✅ 同步收件箱样式
- ✅ 添加分页功能
- ✅ 添加测试数据标记
- ✅ 工具栏下拉菜单

---

## 📊 数据流

```
用户访问页面
  ↓
加载星标联系人列表
  ↓
显示左侧联系人（默认选中第一个）
  ↓
加载选中联系人的邮件
  ↓
显示右侧邮件列表
  ↓
用户切换联系人
  ↓
重新加载邮件列表
```

---

## ✅ 当前状态

**已完成**:
- ✅ 页面布局完整
- ✅ 联系人列表（测试数据）
- ✅ 邮件列表（测试数据）
- ✅ 搜索功能
- ✅ 切换联系人

**待完成**:
- [ ] API 集成联系人
- [ ] API 集成邮件
- [ ] 工具栏功能
- [ ] 分页功能
- [ ] 测试数据标记

---

## 🚀 快速实现建议

由于时间关系，建议：
1. **保留测试数据** - 作为演示
2. **添加 API 调用** - 尝试加载真实数据
3. **失败回退** - API 失败时显示测试数据
4. **样式同步** - 与收件箱保持一致

这样可以保证页面始终可用，同时逐步集成真实数据。

---

*最后更新：2026-03-19 14:51*
