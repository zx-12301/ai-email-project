const API_BASE_URL = 'http://localhost:3001/api';

// 获取 Token
const getToken = () => {
  return localStorage.getItem('token');
};

// 通用请求头
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// 邮件操作 API
export const mailApi = {
  // 删除单封邮件
  async delete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('删除失败');
    }
  },

  // 批量删除邮件
  async batchDelete(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.delete(id);
    }
  },

  // 恢复邮件（从垃圾箱）
  async restore(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/restore`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('恢复失败');
    }
  },

  // 永久删除邮件
  async permanentDelete(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/permanent`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('永久删除失败');
    }
  },

  // 转发邮件
  async forward(id: number, recipient: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        to: [recipient],
        subject: `Fwd: 原邮件主题`,
        content: `---------- Forwarded message ----------\n\n原邮件内容...`
      })
    });
    if (!response.ok) {
      throw new Error('转发失败');
    }
  },

  // 归档邮件
  async archive(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/archive`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('归档失败');
    }
  },

  // 标记已读/未读
  async markAsRead(id: number, isRead: boolean = true): Promise<void> {
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
  async batchMarkAsRead(ids: number[], isRead: boolean = true): Promise<void> {
    for (const id of ids) {
      await this.markAsRead(id, isRead);
    }
  },

  // 标星/取消标星
  async toggleStar(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/star`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    if (!response.ok) {
      throw new Error('标星失败');
    }
  },

  // 移动邮件到文件夹
  async move(id: number, folder: string): Promise<void> {
    // 暂时模拟实现
    console.log(`Move mail ${id} to ${folder}`);
    return Promise.resolve();
  },

  // 标记为垃圾邮件
  async markAsSpam(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/mail/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ folder: 'spam' })
    });
    if (!response.ok) {
      throw new Error('标记失败');
    }
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
