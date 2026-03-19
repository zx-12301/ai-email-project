import { API_BASE_URL } from '../config/api';

// 获取 Token
const getToken = () => {
  return localStorage.getItem('token');
};

// 通用请求头
const getHeaders = (includeToken = true) => ({
  'Content-Type': 'application/json',
  ...(includeToken ? { 'Authorization': `Bearer ${getToken()}` } : {})
});

// 邮件操作 API
export const mailApi = {
  // 获取收件箱
  async getInbox(page: number = 1, limit: number = 20, filters?: {
    isRead?: boolean;
    isStarred?: boolean;
  }) {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
    if (filters?.isRead !== undefined) params.append('isRead', filters.isRead.toString());
    if (filters?.isStarred !== undefined) params.append('isStarred', filters.isStarred.toString());
    
    const response = await fetch(`${API_BASE_URL}/mail/inbox?${params.toString()}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('获取收件箱失败');
    }
    return response.json();
  },

  // 获取已发送
  async getSent(page: number = 1, limit: number = 20) {
    const response = await fetch(`${API_BASE_URL}/mail/sent?page=${page}&limit=${limit}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('获取已发送失败');
    }
    return response.json();
  },

  // 获取草稿箱
  async getDrafts(page: number = 1, limit: number = 20) {
    const response = await fetch(`${API_BASE_URL}/mail/drafts?page=${page}&limit=${limit}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('获取草稿箱失败');
    }
    return response.json();
  },

  // 获取垃圾箱
  async getTrash(page: number = 1, limit: number = 20) {
    const response = await fetch(`${API_BASE_URL}/mail/trash?page=${page}&limit=${limit}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('获取垃圾箱失败');
    }
    return response.json();
  },

  // 获取垃圾邮件
  async getSpam(page: number = 1, limit: number = 20) {
    const response = await fetch(`${API_BASE_URL}/mail/spam?page=${page}&limit=${limit}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('获取垃圾邮件失败');
    }
    return response.json();
  },

  // 获取邮件详情
  async getMailById(id: string) {
    const response = await fetch(`${API_BASE_URL}/mail/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('获取邮件失败');
    }
    return response.json();
  },

  // 发送邮件
  async sendMail(data: {
    to: string[];
    cc?: string[];
    subject: string;
    content: string;
    contentHtml?: string;
    isDraft?: boolean;
    sendViaSmtp?: boolean;
  }) {
    const response = await fetch(`${API_BASE_URL}/mail`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('发送失败');
    }
    return response.json();
  },

  // 保存草稿
  async saveDraft(data: {
    to: string[];
    cc?: string[];
    subject: string;
    content: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/mail/draft`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('保存草稿失败');
    }
    return response.json();
  },

  // 删除单封邮件
  async deleteMail(id: number | string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('删除失败');
    }
  },

  // 批量删除邮件
  async batchDelete(ids: (number | string)[]): Promise<void> {
    for (const id of ids) {
      await this.deleteMail(id);
    }
  },

  // 恢复邮件（从垃圾箱）
  async restore(id: number | string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/restore`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('恢复失败');
    }
  },

  // 永久删除邮件
  async permanentDelete(id: number | string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/permanent`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('永久删除失败');
    }
  },

  // 转发邮件
  async forward(mailId: string | number, recipient: string): Promise<void> {
    // 获取原始邮件
    const originalMail = await this.getMailById(String(mailId));

    const date = new Date(originalMail.createdAt).toLocaleString('zh-CN');
    const forwardContent = `
---------- 转发的邮件 ----------
发件人：${originalMail.fromName || originalMail.from} <${originalMail.from}>
日期：${date}
收件人：${(originalMail.to || []).join(', ')}
主题：${originalMail.subject}

${originalMail.content || ''}
`;

    const response = await fetch(`${API_BASE_URL}/mail`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        to: [recipient],
        subject: `转发：${originalMail.subject || ''}`,
        content: forwardContent
      })
    });
    if (!response.ok) {
      throw new Error('转发失败');
    }
  },

  // 归档邮件
  async archive(id: number | string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/archive`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('归档失败');
    }
  },

  // 标记已读/未读
  async markAsRead(id: number | string, isRead: boolean = true): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ isRead })
    });
    if (!response.ok) {
      throw new Error('标记失败');
    }
  },

  // 批量标记已读
  async batchMarkAsRead(ids: (number | string)[], isRead: boolean = true): Promise<void> {
    for (const id of ids) {
      await this.markAsRead(id, isRead);
    }
  },

  // 标星/取消标星
  async toggleStar(id: number | string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/star`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('标星失败');
    }
  },

  // 移动邮件到文件夹
  async moveToFolder(id: number | string, folder: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ folder })
    });
    if (!response.ok) {
      throw new Error('移动失败');
    }
  },

  // 标记为垃圾邮件
  async markAsSpam(id: number | string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ folder: 'spam' })
    });
    if (!response.ok) {
      throw new Error('标记失败');
    }
  },

  // 搜索邮件
  async search(query: string, page: number = 1, limit: number = 20, filters?: any) {
    const params = new URLSearchParams({ q: query, page: page.toString(), limit: limit.toString() });
    if (filters?.folder) params.append('folder', filters.folder);
    if (filters?.isRead !== undefined) params.append('isRead', filters.isRead.toString());
    if (filters?.isStarred !== undefined) params.append('isStarred', filters.isStarred.toString());
    
    const response = await fetch(`${API_BASE_URL}/mail/search?${params.toString()}`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('搜索失败');
    }
    return response.json();
  },

  // 获取联系人列表
  async getContacts() {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('获取联系人失败');
    }
    return response.json();
  },

  // 获取星标联系人
  async getStarredContacts() {
    const contacts = await this.getContacts();
    return contacts.filter((c: any) => c.isStarred);
  },

  // 生成测试数据
  async generateTestData() {
    const response = await fetch(`${API_BASE_URL}/mail/generate-test-data`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('生成测试数据失败');
    }
    return response.json();
  },

  // 获取未读邮件数量
  async getUnreadCount() {
    const response = await fetch(`${API_BASE_URL}/mail/unread-count`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('获取未读数量失败');
    }
    return response.json();
  }
};

// 搜索 API
export const searchApi = {
  async search(query: string, page: number = 1, limit: number = 20) {
    const response = await fetch(
      `${API_BASE_URL}/mail/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      {
        headers: getHeaders()
      }
    );
    if (!response.ok) {
      throw new Error('搜索失败');
    }
    return response.json();
  }
};

// 通知 API
export const notificationApi = {
  async getUnreadCount() {
    // 暂时返回模拟数据
    return Promise.resolve({ count: 5 });
  },

  async getList() {
    // 暂时返回模拟数据
    return Promise.resolve({
      notifications: [
        {
          id: 1,
          type: 'email',
          title: '新邮件通知',
          message: '星耀科技发送了一封新邮件',
          time: '2 分钟前',
          isRead: false
        }
      ]
    });
  },

  async markAsRead(id: number) {
    // 暂时模拟实现
    return Promise.resolve();
  }
};
