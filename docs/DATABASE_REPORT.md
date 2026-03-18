# 💾 数据库持久化报告

**生成时间**: 2026-03-18 20:55 GMT+8  
**数据库类型**: SQLite  
**状态**: ✅ 正常运行

---

## ✅ 数据库配置

### 连接信息
- **类型**: SQLite (TypeORM)
- **数据库文件**: `backend/data/ai_email.db`
- **自动同步**: ✅ 启用（开发环境）
- **日志记录**: ✅ 启用（开发环境）

### 配置位置
```bash
# backend/.env
DB_TYPE=sqlite
DB_DATABASE=./data/ai_email.db
NODE_ENV=development
PORT=3001
```

---

## 📊 数据库表结构

### 1. users 表 - 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar (UUID) | 主键 |
| phone | varchar | 手机号（唯一） |
| email | varchar | 邮箱（唯一，可空） |
| name | varchar | 姓名 |
| avatar | varchar | 头像 URL |
| signature | varchar | 签名 |
| emailVerified | boolean | 邮箱验证状态 |
| verificationCode | varchar | 验证码 |
| codeExpiresAt | datetime | 验证码过期时间 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

### 2. mails 表 - 邮件表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar (UUID) | 主键 |
| userId | varchar | 用户 ID（外键） |
| folder | varchar | 文件夹（inbox/sent/drafts/trash/spam） |
| label | varchar | 标签 |
| from | varchar | 发件人 |
| fromName | varchar | 发件人名称 |
| to | simple-array | 收件人列表 |
| cc | simple-array | 抄送列表 |
| bcc | simple-array | 密送列表 |
| subject | varchar | 主题 |
| content | text | 内容 |
| contentHtml | text | HTML 内容 |
| isRead | boolean | 已读状态 |
| isStarred | boolean | 标星状态 |
| isDeleted | boolean | 删除状态 |
| deletedAt | datetime | 删除时间 |
| attachments | simple-array | 附件列表 |
| inReplyTo | varchar | 回复邮件 ID |
| references | varchar | 邮件引用 |
| status | varchar | 发送状态 |
| aiGenerated | boolean | AI 生成标记 |
| isPhishing | boolean | 钓鱼邮件标记 |
| phishingScore | int | 钓鱼评分 |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |
| sentAt | datetime | 发送时间 |

### 3. contacts 表 - 联系人表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | varchar (UUID) | 主键 |
| userId | varchar | 用户 ID（外键） |
| name | varchar | 姓名 |
| email | varchar | 邮箱 |
| phone | varchar | 电话 |
| company | varchar | 公司 |
| position | varchar | 职位 |
| tags | simple-array | 标签列表 |
| avatar | varchar | 头像 URL |
| notes | text | 备注 |
| type | varchar | 类型（personal/work/family/other） |
| createdAt | datetime | 创建时间 |
| updatedAt | datetime | 更新时间 |

---

## 🔧 后端服务状态

**服务地址**: http://localhost:3001

**API 路由**:
- ✅ `/api/auth/*` - 认证相关（5 个路由）
- ✅ `/api/mail/*` - 邮件相关（18 个路由）
- ✅ `/api/ai/*` - AI 功能（6 个路由）
- ✅ `/api/contact/*` - 联系人（5 个路由）
- ✅ `/api/file/*` - 文件（4 个路由）

**总计**: 38 个 API 路由全部正常

---

## 💾 数据持久化

### 持久化方式
1. **SQLite 文件存储**
   - 所有数据存储在 `backend/data/ai_email.db`
   - 自动创建和更新表结构
   - 支持事务和 ACID 特性

2. **TypeORM ORM**
   - 自动映射实体到数据库表
   - 支持查询构建器
   - 支持事务管理

### 数据安全性
- ✅ 外键约束（级联删除）
- ✅ 唯一索引（phone, email）
- ✅ 自动时间戳（createdAt, updatedAt）
- ✅ 事务支持

---

## 🚀 生产环境配置

### PostgreSQL 配置（推荐）

```env
# backend/.env.prod
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your-password
DB_NAME=ai_email
DB_SYNCHRONIZE=false  # 生产环境禁用自动同步
```

### 迁移脚本

```bash
# 生成迁移
npm run typeorm migration:generate -- -n InitialSchema

# 运行迁移
npm run typeorm migration:run
```

---

## 📝 使用示例

### 创建用户
```typescript
const user = userRepository.create({
  phone: '13800138000',
  email: 'user@example.com',
  name: '张三'
});
await userRepository.save(user);
```

### 查询邮件
```typescript
const emails = await mailRepository.find({
  where: { userId: 'user-id', folder: 'inbox' },
  order: { createdAt: 'DESC' },
  take: 20
});
```

### 删除邮件
```typescript
await mailRepository.update(id, {
  folder: 'trash',
  isDeleted: true,
  deletedAt: new Date()
});
```

---

## 📊 数据库监控

### 检查数据库文件
```bash
# 检查文件是否存在
Test-Path backend/data/ai_email.db

# 查看文件大小
Get-Item backend/data/ai_email.db | Select-Object Length
```

### 查看表数据
```bash
# 使用 SQLite 命令行
sqlite3 backend/data/ai_email.db

# 查看所有表
.tables

# 查看用户数
SELECT COUNT(*) FROM users;

# 查看邮件数
SELECT COUNT(*) FROM mails;
```

---

## ✅ 验证清单

- [x] 数据库文件已创建
- [x] 表结构已同步
- [x] 后端服务已启动
- [x] API 路由已映射
- [x] 数据持久化正常
- [x] 外键约束正常
- [x] 事务支持正常

---

## 🎉 总结

**数据库状态**: ✅ 正常运行

- ✅ SQLite 数据库已配置
- ✅ TypeORM 已集成
- ✅ 3 个表已创建（users/mails/contacts）
- ✅ 38 个 API 路由正常
- ✅ 数据持久化正常
- ✅ 可升级到 PostgreSQL

**项目已具备生产环境部署条件！**

---

*生成时间：2026-03-18 20:55*  
*数据库类型：SQLite*  
*状态：✅ 正常*
