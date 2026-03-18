#!/usr/bin/env node

/**
 * 数据库连接测试脚本
 * 用于测试数据库连接和创建初始数据
 */

const { DataSource } = require('typeorm');
const path = require('path');

// 创建数据源
const AppDataSource = new DataSource({
  type: 'sqlite',
  database: path.join(__dirname, 'data/ai_email.db'),
  synchronize: true,
  logging: true,
  entities: [
    {
      name: 'User',
      tableName: 'users',
      columns: {
        id: { type: 'varchar', primary: true, generated: 'uuid' },
        phone: { type: 'varchar', unique: true },
        email: { type: 'varchar', unique: true, nullable: true },
        name: { type: 'varchar', nullable: true },
        avatar: { type: 'varchar', nullable: true },
        signature: { type: 'varchar', nullable: true },
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
        status: { type: 'varchar', default: 'sent' },
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

async function run() {
  console.log('🔌 正在连接数据库...');
  
  try {
    await AppDataSource.initialize();
    console.log('✅ 数据库连接成功！');
    
    // 检查表是否存在
    const queryRunner = AppDataSource.createQueryRunner();
    const tables = await queryRunner.query(`SELECT name FROM sqlite_master WHERE type='table'`);
    console.log('📊 数据库表:');
    tables.forEach(table => {
      console.log(`   - ${table.name}`);
    });
    
    // 创建测试用户
    console.log('\n👤 创建测试用户...');
    const userRepo = AppDataSource.getRepository('User');
    const testUser = userRepo.create({
      id: 'test-user-001',
      phone: '13800138000',
      email: 'test@Spt.com',
      name: '测试用户',
      emailVerified: true
    });
    await userRepo.save(testUser);
    console.log('✅ 测试用户创建成功！');
    
    // 创建测试邮件
    console.log('\n📧 创建测试邮件...');
    const mailRepo = AppDataSource.getRepository('Mail');
    const testMails = [
      {
        id: 'mail-001',
        userId: 'test-user-001',
        folder: 'inbox',
        from: 'star@sunshine.com',
        fromName: '星耀科技',
        to: ['test@Spt.com'],
        subject: '协同办公软件推荐',
        content: '尊敬的客户，您好！我们推荐最新的协同办公软件...',
        isRead: false,
        isStarred: false,
        status: 'delivered'
      },
      {
        id: 'mail-002',
        userId: 'test-user-001',
        folder: 'inbox',
        from: '95555@cmbchina.com',
        fromName: '招商银行',
        to: ['test@Spt.com'],
        subject: '信用卡账单通知',
        content: '您的信用卡本期账单已出...',
        isRead: true,
        isStarred: false,
        status: 'delivered'
      }
    ];
    
    for (const mailData of testMails) {
      const mail = mailRepo.create(mailData);
      await mailRepo.save(mail);
    }
    console.log(`✅ 已创建 ${testMails.length} 封测试邮件！`);
    
    console.log('\n✅ 数据库初始化完成！');
    console.log('\n📊 数据统计:');
    const userCount = await userRepo.count();
    const mailCount = await mailRepo.count();
    console.log(`   - 用户数：${userCount}`);
    console.log(`   - 邮件数：${mailCount}`);
    
    await queryRunner.release();
    await AppDataSource.destroy();
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

run();
