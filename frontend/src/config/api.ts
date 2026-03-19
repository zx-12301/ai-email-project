/**
 * API 配置
 * 从环境变量获取 API 基础 URL
 */

// Vite 环境变量需要以 VITE_ 开头才能暴露给客户端
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

/**
 * 获取完整的 API URL
 */
export const getApiUrl = (path: string): string => {
  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};