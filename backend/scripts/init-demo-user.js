#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 创建演示用户
 */

const { DataSource } = require('typeorm');
const bcrypt = require('bcrypt');
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
        password: { type: 'varchar', nullable: true },
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
    }
  ]
});

async function initDatabase() {
  console.log('🔌 正在初始化数据库...\n');
  
  try {
    await AppDataSource.initialize();
    console.log('✅ 数据库连接成功！\n');
    
    const userRepo = AppDataSource.getRepository('User');
    
    // 创建演示用户
    console.log('👤 创建演示用户...');
    const demoPhone = '13800138000';
    let demoUser = await userRepo.findOne({ where: { phone: demoPhone } });
    
    if (!demoUser) {
      // 加密演示用户密码
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('123456', saltRounds);
      
      demoUser = userRepo.create({
        id: 'demo-user-001',
        phone: demoPhone,
        password: hashedPassword,
        email: 'demo@aimail.com',
        name: '演示用户',
        emailVerified: true,
      });
      
      await userRepo.save(demoUser);
      console.log('✅ 演示用户创建成功！');
      console.log('   手机号：13800138000');
      console.log('   密码：123456');
      console.log('   邮箱：demo@aimail.com\n');
    } else {
      console.log('ℹ️  演示用户已存在，跳过创建\n');
    }
    
    // 统计用户数
    const userCount = await userRepo.count();
    console.log(`📊 当前用户总数：${userCount}`);
    
    await AppDataSource.destroy();
    console.log('\n✅ 数据库初始化完成！\n');
    
  } catch (error) {
    console.error('❌ 数据库初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();
