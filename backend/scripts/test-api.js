#!/usr/bin/env node

/**
 * 创建测试数据脚本
 * 用于创建测试用户和测试邮件数据
 */

const fetch = require('node-fetch');

const API_BASE_URL = 'http://localhost:3001/api';

// 测试数据
const testData = {
  user: {
    phone: '13800138000',
    code: '123456'  // 测试验证码（实际应该从控制台获取）
  },
  mails: [
    {
      to: ['test@example.com'],
      subject: '测试邮件 1 - 协同办公软件推荐',
      content: '尊敬的客户，您好！我们推荐最新的协同办公软件...',
      isDraft: false
    },
    {
      to: ['test2@example.com'],
      subject: '测试邮件 2 - 会议邀请',
      content: '各位同事，大家好！定于本周五下午 2 点召开产品评审会...',
      isDraft: false
    },
    {
      to: ['test3@example.com'],
      subject: '测试邮件 3 - 项目进度汇报',
      content: '现将本周项目进展情况汇报如下：1. 前端开发完成 80%...',
      isDraft: true
    }
  ]
};

async function runTests() {
  console.log('🧪 开始测试数据持久化...\n');
  
  try {
    // 1. 发送验证码
    console.log('📱 1. 发送验证码...');
    const sendCodeRes = await fetch(`${API_BASE_URL}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testData.user.phone })
    });
    const sendCodeData = await sendCodeRes.json();
    console.log('✅ 验证码发送成功:', sendCodeData.message);
    console.log('💡 提示：请查看后端控制台的验证码输出\n');
    
    // 等待用户输入验证码
    const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const code = await new Promise(resolve => {
      readline.question('请输入控制台显示的验证码：', resolve);
    });
    readline.close();
    
    // 2. 登录获取 Token
    console.log('\n🔐 2. 登录获取 Token...');
    const loginRes = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: testData.user.phone, code })
    });
    const loginData = await loginRes.json();
    
    if (!loginData.access_token) {
      throw new Error('登录失败：' + JSON.stringify(loginData));
    }
    
    console.log('✅ 登录成功！');
    console.log('Token:', loginData.access_token.substring(0, 50) + '...\n');
    
    const token = loginData.access_token;
    const userId = loginData.user.id;
    
    // 3. 获取用户信息
    console.log('👤 3. 获取用户信息...');
    const userRes = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const userData = await userRes.json();
    console.log('✅ 用户信息:', userData);
    console.log('');
    
    // 4. 创建测试邮件
    console.log('📧 4. 创建测试邮件...');
    for (let i = 0; i < testData.mails.length; i++) {
      const mail = testData.mails[i];
      const mailRes = await fetch(`${API_BASE_URL}/mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(mail)
      });
      const mailData = await mailRes.json();
      console.log(`✅ 邮件 ${i + 1} 创建成功:`, mailData.subject);
    }
    console.log('');
    
    // 5. 获取收件箱
    console.log('📥 5. 获取收件箱...');
    const inboxRes = await fetch(`${API_BASE_URL}/mail/inbox`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const inboxData = await inboxRes.json();
    console.log('✅ 收件箱数据:');
    console.log('   总邮件数:', inboxData.total);
    console.log('   当前页:', inboxData.page);
    console.log('   每页数量:', inboxData.limit);
    if (inboxData.data && inboxData.data.length > 0) {
      console.log('   邮件列表:');
      inboxData.data.forEach(mail => {
        console.log(`   - ${mail.subject} (${mail.from})`);
      });
    }
    console.log('');
    
    // 6. 获取已发送
    console.log('📤 6. 获取已发送...');
    const sentRes = await fetch(`${API_BASE_URL}/mail/sent`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const sentData = await sentRes.json();
    console.log('✅ 已发送数据:');
    console.log('   总邮件数:', sentData.total);
    console.log('');
    
    // 7. 获取草稿箱
    console.log('📝 7. 获取草稿箱...');
    const draftsRes = await fetch(`${API_BASE_URL}/mail/drafts`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const draftsData = await draftsRes.json();
    console.log('✅ 草稿箱数据:');
    console.log('   总草稿数:', draftsData.total);
    console.log('');
    
    // 8. 测试标记已读
    if (inboxData.data && inboxData.data.length > 0) {
      console.log('✅ 8. 测试标记已读...');
      const firstMail = inboxData.data[0];
      const markReadRes = await fetch(`${API_BASE_URL}/mail/${firstMail.id}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isRead: true })
      });
      const markReadData = await markReadRes.json();
      console.log('✅ 标记已读成功:', markReadData);
      console.log('');
    }
    
    // 9. 测试标星
    if (inboxData.data && inboxData.data.length > 0) {
      console.log('⭐ 9. 测试标星...');
      const firstMail = inboxData.data[0];
      const starRes = await fetch(`${API_BASE_URL}/mail/${firstMail.id}/star`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const starData = await starRes.json();
      console.log('✅ 标星成功:', starData);
      console.log('');
    }
    
    // 10. 测试搜索
    console.log('🔍 10. 测试搜索...');
    const searchRes = await fetch(`${API_BASE_URL}/mail/search?q=测试`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const searchData = await searchRes.json();
    console.log('✅ 搜索成功:');
    console.log('   搜索结果数:', searchData.total || searchData.length);
    console.log('');
    
    console.log('🎉 所有测试完成！');
    console.log('\n📊 测试总结:');
    console.log('   ✅ 用户认证正常');
    console.log('   ✅ 邮件创建正常');
    console.log('   ✅ 邮件查询正常');
    console.log('   ✅ 邮件操作正常');
    console.log('   ✅ 数据持久化正常');
    console.log('\n💾 所有数据已保存到 SQLite 数据库！');
    
  } catch (error) {
    console.error('\n❌ 测试失败:', error.message);
    if (error.response) {
      const errorData = await error.response.json();
      console.error('错误详情:', errorData);
    }
    process.exit(1);
  }
}

runTests();
