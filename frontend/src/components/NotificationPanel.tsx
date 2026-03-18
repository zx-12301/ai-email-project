import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Settings } from 'lucide-react';
import { notificationApi } from '../api/mail';

interface Notification {
  id: number;
  type: 'email' | 'system' | 'meeting';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  avatar?: string;
}

interface NotificationPanelProps {
  onClose?: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载通知列表
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const result = await notificationApi.getList();
        setNotifications(result.notifications || []);
      } catch (error) {
        console.error('加载通知失败:', error);
        // 使用模拟数据作为降级方案
        setNotifications([
          {
            id: 1,
            type: 'email',
            title: '新邮件通知',
            message: '星耀科技发送了一封新邮件',
            time: '2 分钟前',
            isRead: false,
            avatar: '星'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error('标记已读失败:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      for (const id of unreadIds) {
        await notificationApi.markAsRead(id);
      }
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('全部标记失败:', error);
    }
  };

  const handleDelete = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleDeleteAll = () => {
    if (window.confirm('确定要清空所有通知吗？')) {
      setNotifications([]);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email':
        return 'bg-blue-500';
      case 'system':
        return 'bg-slate-500';
      case 'meeting':
        return 'bg-orange-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="w-96 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
      {/* 头部 */}
      <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-slate-900">消息通知</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={handleMarkAllAsRead}
            className="p-1.5 hover:bg-slate-100 rounded-full"
            title="全部已读"
          >
            <CheckCheck className="w-4 h-4 text-slate-600" />
          </button>
          <button 
            onClick={handleDeleteAll}
            className="p-1.5 hover:bg-slate-100 rounded-full"
            title="清空通知"
          >
            <Trash2 className="w-4 h-4 text-slate-600" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded-full">
            <Settings className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 筛选 */}
      <div className="px-4 py-2 border-b border-slate-100 flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filter === 'all'
              ? 'bg-blue-100 text-blue-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            filter === 'unread'
              ? 'bg-blue-100 text-blue-700'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          未读
        </button>
      </div>

      {/* 通知列表 */}
      <div className="max-h-96 overflow-y-auto">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                !notification.isRead ? 'bg-blue-50/50' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* 头像/图标 */}
                <div className={`w-8 h-8 rounded-full ${getTypeColor(notification.type)} flex items-center justify-center text-white text-sm font-medium flex-shrink-0`}>
                  {notification.avatar}
                </div>

                {/* 内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-900 mb-0.5">
                        {notification.title}
                      </div>
                      <div className="text-xs text-slate-600 line-clamp-2">
                        {notification.message}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 flex-shrink-0">
                      {notification.time}
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2 mt-2">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        标记为已读
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-500">暂无通知</p>
          </div>
        )}
      </div>

      {/* 底部 */}
      <div className="px-4 py-3 border-t border-slate-100 text-center">
        <button className="text-xs text-blue-600 hover:text-blue-700">
          查看全部通知
        </button>
      </div>
    </div>
  );
}
