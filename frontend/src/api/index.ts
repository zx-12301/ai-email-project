const API_BASE_URL = 'http://localhost:3001/api';

// 获取存储的 token
export const getToken = () => {
  return localStorage.getItem('token');
};

// 存储 token
export const setToken = (token: string) => {
  localStorage.setItem('token', token);
};

// 清除 token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// 获取请求头
const getHeaders = (includeToken = true) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (includeToken) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// 通用请求处理
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: '请求失败' }));
    
    // 如果是 401 错误，说明 token 过期或无效
    if (response.status === 401) {
      removeToken();
      throw new Error('登录过期，请重新登录');
    }
    
    throw new Error(error.message || '请求失败');
  }
  return response.json();
};

/**
 * 认证 API
 */
export const authApi = {
  /**
   * 发送验证码
   */
  async sendCode(phone: string) {
    const response = await fetch(`${API_BASE_URL}/auth/send-code`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ phone }),
    });
    return handleResponse(response);
  },

  /**
   * 演示用户登录
   */
  async loginAsDemo() {
    const response = await fetch(`${API_BASE_URL}/auth/login/demo`, {
      method: 'POST',
      headers: getHeaders(false),
    });
    const data = await handleResponse(response);
    if (data.access_token) {
      setToken(data.access_token);
    }
    return data;
  },

  /**
   * 验证码登录/注册
   */
  async loginWithCode(phone: string, code: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ phone, code }),
    });
    const data = await handleResponse(response);
    if (data.access_token) {
      setToken(data.access_token);
    }
    return data;
  },

  /**
   * 密码登录
   */
  async loginWithPassword(phone: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login/password`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ phone, password }),
    });
    const data = await handleResponse(response);
    if (data.access_token) {
      setToken(data.access_token);
    }
    return data;
  },

  /**
   * 用户注册
   */
  async register(data: {
    phone: string;
    password: string;
    email?: string;
    name?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });
    const result = await handleResponse(response);
    if (result.access_token) {
      setToken(result.access_token);
    }
    return result;
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  /**
   * 修改密码
   */
  async changePassword(oldPassword: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    return handleResponse(response);
  },

  /**
   * 重置密码（通过验证码）
   */
  async resetPassword(phone: string, code: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ phone, code, newPassword }),
    });
    return handleResponse(response);
  },

  /**
   * 登出
   */
  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    removeToken();
    return handleResponse(response);
  },
};

/**
 * 邮件 API
 */
export const mailApi = {
  async getInbox(page = 1, limit = 20) {
    const response = await fetch(
      `${API_BASE_URL}/mail/inbox?page=${page}&limit=${limit}`,
      { headers: getHeaders(true) }
    );
    return handleResponse(response);
  },

  async getSent(page = 1, limit = 20) {
    const response = await fetch(
      `${API_BASE_URL}/mail/sent?page=${page}&limit=${limit}`,
      { headers: getHeaders(true) }
    );
    return handleResponse(response);
  },

  async getDrafts(page = 1, limit = 20) {
    const response = await fetch(
      `${API_BASE_URL}/mail/drafts?page=${page}&limit=${limit}`,
      { headers: getHeaders(true) }
    );
    return handleResponse(response);
  },

  async getTrash(page = 1, limit = 20) {
    const response = await fetch(
      `${API_BASE_URL}/mail/trash?page=${page}&limit=${limit}`,
      { headers: getHeaders(true) }
    );
    return handleResponse(response);
  },

  async getMailById(id: number) {
    const response = await fetch(`${API_BASE_URL}/mail/${id}`, {
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async sendMail(data: any) {
    const response = await fetch(`${API_BASE_URL}/mail`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteMail(id: number) {
    const response = await fetch(`${API_BASE_URL}/mail/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async restoreMail(id: number) {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/restore`, {
      method: 'POST',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async permanentlyDeleteMail(id: number) {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/permanent`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async markAsRead(id: number, isRead = true) {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/read`, {
      method: 'PATCH',
      headers: getHeaders(true),
      body: JSON.stringify({ isRead }),
    });
    return handleResponse(response);
  },

  async toggleStar(id: number) {
    const response = await fetch(`${API_BASE_URL}/mail/${id}/star`, {
      method: 'PATCH',
      headers: getHeaders(true),
    });
    return handleResponse(response);
  },

  async searchMail(query: string, page = 1, limit = 20) {
    const response = await fetch(
      `${API_BASE_URL}/mail/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
      { headers: getHeaders(true) }
    );
    return handleResponse(response);
  },
};

/**
 * 搜索 API
 */
export const searchApi = {
  async search(query: string) {
    const response = await fetch(
      `${API_BASE_URL}/mail/search?q=${encodeURIComponent(query)}`,
      { headers: getHeaders(true) }
    );
    return handleResponse(response);
  },
};

/**
 * 通知 API
 */
export const notificationApi = {
  async getList() {
    // 暂时返回模拟数据
    return {
      notifications: [
        {
          id: 1,
          type: 'email',
          title: '新邮件通知',
          message: '星耀科技发送了一封新邮件',
          time: '2 分钟前',
          isRead: false,
        },
      ],
    };
  },

  async markAsRead(id: number) {
    return { success: true };
  },
};
