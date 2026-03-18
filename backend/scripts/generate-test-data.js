#!/usr/bin/env node

/**
 * 生成测试数据脚本
 * 为每个用户生成测试邮件数据
 */

const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');
const path = require('path');

// 创建数据源
const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, 'data/ai_email.db'),
  synchronize: true,
  logging: false,
  entities: [
    {
      name: 'User',
      tableName: 'users',
      columns: {
        id: { type: 'varchar', primary: true, generated: 'uuid' },
        phone: { type: 'varchar', unique: true },
        password: { type: 'varchar', nullable: true },
        email: { type: 'varchar', unique: true, nullable: true },
        name: { type: 'varchar', nullable: true },
        avatar: { type: 'varchar', nullable: true },
        signature: { type: 'varchar', nullable: true },
        department: { type: 'varchar', nullable: true },
        company: { type: 'varchar', nullable: true },
        emailVerified: { type: 'boolean', default: false },
        verificationCode: { type: 'varchar', nullable: true },
        codeExpiresAt: { type: 'datetime', nullable: true },
        createdAt: { type: 'datetime', default: () => 'datetime(\'now\')' },
        updatedAt: { type: 'datetime', default: () => 'datetime(\'now\')' }
      }
    },
    {
      name: 'Mail',
      tableName: 'mails',
      columns: {
        id: { type: 'varchar', primary: true, generated: 'uuid' },
        userId: { type: 'varchar' },
        folder: { type: 'varchar' },
        label: { type: 'varchar', nullable: true },
        from: { type: 'varchar' },
        fromName: { type: 'varchar' },
        to: { type: 'simple-array' },
        cc: { type: 'simple-array', nullable: true },
        bcc: { type: 'simple-array', nullable: true },
        subject: { type: 'varchar' },
        content: { type: 'text' },
        contentHtml: { type: 'text', nullable: true },
        isRead: { type: 'boolean', default: false },
        isStarred: { type: 'boolean', default: false },
        isDeleted: { type: 'boolean', default: false },
        deletedAt: { type: 'datetime', nullable: true },
        attachments: { type: 'simple-array', nullable: true },
        inReplyTo: { type: 'varchar', nullable: true },
        references: { type: 'varchar', nullable: true },
        status: { type: 'varchar', default: 'delivered' },
        aiGenerated: { type: 'boolean', default: false },
        isPhishing: { type: 'boolean', default: false },
        phishingScore: { type: 'int', nullable: true },
        createdAt: { type: 'datetime', default: () => 'datetime(\'now\')' },
        updatedAt: { type: 'datetime', default: () => 'datetime(\'now\')' },
        sentAt: { type: 'datetime', nullable: true }
      }
    },
    {
      name: 'Contact',
      tableName: 'contacts',
      columns: {
        id: { type: 'varchar', primary: true, generated: 'uuid' },
        userId: { type: 'varchar' },
        name: { type: 'varchar' },
        email: { type: 'varchar' },
        phone: { type: 'varchar', nullable: true },
        company: { type: 'varchar', nullable: true },
        position: { type: 'varchar', nullable: true },
        tags: { type: 'simple-array', nullable: true },
        avatar: { type: 'varchar', nullable: true },
        notes: { type: 'text', nullable: true },
        type: { type: 'varchar', default: 'personal' },
        createdAt: { type: 'datetime', default: () => 'datetime(\'now\')' },
        updatedAt: { type: 'datetime', default: () => 'datetime(\'now\')' }
      }
    }
  ]
});

// 测试邮件数据
const testEmails = [
  {
    from: 'star@sunshine.com',
    fromName: '星耀科技',
    subject: '协同办公软件推荐',
    content: `尊敬的客户：

您好！

感谢您对我们产品的关注。我们很高兴向您推荐最新的协同办公软件解决方案。

我们的软件具有以下特点：
1. 实时协作编辑
2. 项目管理功能
3. 即时通讯集成
4. 文件共享与存储

如果您有任何问题，欢迎随时联系我们。

此致
敬礼

星耀科技团队`,
    isRead: false,
    isStarred: true,
  },
  {
    from: '95555@cmbchina.com',
    fromName: '招商银行',
    subject: '信用卡账单通知',
    content: `尊敬的客户：

您尾号 8888 的信用卡本期账单已出。

账单金额：¥10,000.00
最低还款：¥1,000.00
还款日期：2026-04-15

请按时还款，避免产生滞纳金。

招商银行`,
    isRead: false,
    isStarred: false,
  },
  {
    from: 'zhangsan@example.com',
    fromName: '张三',
    subject: '项目进度汇报 - 请查阅',
    content: `李总：

您好！

现将本周项目进展情况汇报如下：

一、已完成工作
1. 前端页面开发完成 80%
2. 后端接口开发完成 90%
3. 数据库设计完成 100%

二、存在问题
1. 部分接口性能需优化
2. UI 细节需要调整

三、下周计划
1. 完成剩余功能开发
2. 开始系统测试
3. 准备上线部署

汇报人：张三`,
    isRead: true,
    isStarred: true,
  },
  {
    from: 'lisi@example.com',
    fromName: '李四',
    subject: '会议邀请 - 下周产品评审会',
    content: `各位同事：

大家好！

定于下周三下午 2 点召开产品评审会，会议内容如下：

1. 产品功能演示
2. 用户体验讨论
3. 上线计划确认

会议地点：第一会议室
参会人员：产品部、技术部、设计部

请准时参加。

李四`,
    isRead: false,
    isStarred: false,
  },
  {
    from: 'wangwu@example.com',
    fromName: '王五',
    subject: '关于系统架构调整的说明',
    content: `各位技术同事：

为了提升系统性能和可维护性，我们计划对现有系统架构进行调整。

调整内容包括：
1. 微服务拆分
2. 数据库读写分离
3. 缓存层优化
4. 消息队列引入

详细方案请查看附件。

如有疑问，请随时沟通。

王五`,
    isRead: true,
    isStarred: false,
  },
];

async function generateTestData() {
  console.log('🔌 正在连接数据库...\n');
  
  try {
    await AppDataSource.initialize();
    console.log('✅ 数据库连接成功！\n');
    
    const userRepo = AppDataSource.getRepository('User');
    const mailRepo = AppDataSource.getRepository('Mail');
    const contactRepo = AppDataSource.getRepository('Contact');
    
    // 获取所有用户
    const users = await userRepo.find();
    console.log(`📊 找到 ${users.length} 个用户\n`);
    
    if (users.length === 0) {
      console.log('❌ 没有用户，请先注册用户');
      await AppDataSource.destroy();
      return;
    }
    
    // 为每个用户生成测试数据
    for (const user of users) {
      console.log(`👤 为用户 ${user.name || user.phone} 生成测试数据...`);
      
      // 生成测试邮件
      let mailCount = 0;
      for (const emailData of testEmails) {
        const mail = mailRepo.create({
          userId: user.id,
          folder: 'inbox',
          ...emailData,
          to: [user.email || user.phone],
          status: 'delivered',
        });
        await mailRepo.save(mail);
        mailCount++;
      }
      
      // 生成一些草稿
      const draft = mailRepo.create({
        userId: user.id,
        folder: 'drafts',
        from: user.email || user.phone,
        fromName: user.name || '用户',
        to: ['test@example.com'],
        subject: '测试草稿',
        content: '这是一封测试草稿邮件',
        status: 'draft',
      });
      await mailRepo.save(draft);
      mailCount++;
      
      console.log(`   ✅ 生成 ${mailCount} 封邮件\n`);
      
      // 生成测试联系人
      const testContacts = [
        { name: '张三', email: 'zhangsan@example.com', phone: '138****1234', company: 'ABC 公司', position: '经理' },
        { name: '李四', email: 'lisi@example.com', phone: '139****5678', company: 'DEF 公司', position: '总监' },
        { name: '王五', email: 'wangwu@example.com', phone: '137****9012', company: 'GHI 公司', position: '工程师' },
      ];
      
      let contactCount = 0;
      for (const contactData of testContacts) {
        const contact = contactRepo.create({
          userId: user.id,
          ...contactData,
          type: 'work',
        });
        await contactRepo.save(contact);
        contactCount++;
      }
      
      console.log(`   ✅ 生成 ${contactCount} 个联系人\n`);
    }
    
    // 统计总数
    const totalMails = await mailRepo.count();
    const totalContacts = await contactRepo.count();
    
    console.log('📊 数据统计:');
    console.log(`   - 总邮件数：${totalMails}`);
    console.log(`   - 总联系人：${totalContacts}`);
    
    await AppDataSource.destroy();
    console.log('\n✅ 测试数据生成完成！\n');
    
  } catch (error) {
    console.error('❌ 生成测试数据失败:', error);
    process.exit(1);
  }
}

generateTestData();
