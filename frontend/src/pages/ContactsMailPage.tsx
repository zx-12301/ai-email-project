import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import {
  Star,
  Paperclip,
  Trash2,
  ChevronDown,
  Forward,
  Shield,
  CheckCircle,
  List,
  Square,
  Mail,
  Search
} from 'lucide-react';
import { mailApi } from '../api/mail';
import { API_BASE_URL } from '../config/api';

interface Contact {
  id: number | string;
  name: string;
  email: string;
  isStarred: boolean;
}

interface Email {
  id: number | string;
  from: string;
  fromEmail?: string;
  subject: string;
  date: string;
  size: string;
  hasAttachment?: boolean;
  isRead: boolean;
  isStarred: boolean;
  isTest?: boolean;
}

// 获取 Token
const getToken = () => {
  return localStorage.getItem('token');
};

// 获取系统所有用户
const getSystemUsers = async (): Promise<any[]> => {
  const response = await fetch(`${API_BASE_URL}/auth/users?excludeCurrent=true`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    }
  });
  if (!response.ok) {
    throw new Error('获取用户列表失败');
  }
  return response.json();
};

export default function ContactsMailPage() {
  const navigate = useNavigate();
  const { showToast, showConfirm } = useToast();
  const [selectedEmails, setSelectedEmails] = useState<(number | string)[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [starredEmails, setStarredEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // 加载联系人列表
  useEffect(() => {
    loadContacts();
  }, []);

  // 加载选中联系人的星标邮件
  useEffect(() => {
    if (selectedContact) {
      loadStarredEmails();
    }
  }, [selectedContact]);

  const loadContacts = async () => {
    try {
      // 获取系统所有用户作为联系人
      const userList = await getSystemUsers();

      const transformedContacts: Contact[] = userList.map((user: any) => ({
        id: user.id,
        name: user.name || user.phone,
        email: user.email || `${user.phone}@aimail.com`,
        isStarred: false,
      }));

      // 如果没有联系人数据，使用测试数据
      if (transformedContacts.length === 0) {
        throw new Error('暂无联系人数据');
      }

      setContacts(transformedContacts);
      setSelectedContact(transformedContacts[0]);
    } catch (error) {
      console.error('加载联系人失败:', error);
      // 使用测试数据
      const testContacts: Contact[] = [
        { id: 'test-1', name: '人保财险', email: 'epolicy@picc.com.cn', isStarred: true },
        { id: 'test-2', name: '墨刀', email: 'dm@mail.modao.cc', isStarred: true },
        { id: 'test-3', name: '梦忻雨', email: 'demon@Spt.com', isStarred: true },
        { id: 'test-4', name: '刘晓华', email: 'liuxh@Spt.com', isStarred: true },
        { id: 'test-5', name: '诸葛明君', email: 'zhugemj@Spt.com', isStarred: true },
        { id: 'test-6', name: '张军俊', email: 'zhangjj@Spt.com', isStarred: true },
        { id: 'test-7', name: '华罗强', email: 'hualq@Spt.com', isStarred: true },
        { id: 'test-8', name: '吴艳君', email: 'wuyj@Spt.com', isStarred: true },
        { id: 'test-9', name: '董明君', email: 'dongmj@Spt.com', isStarred: true },
        { id: 'test-10', name: '华罗忻', email: 'hualx@Spt.com', isStarred: true },
      ];
      setContacts(testContacts);
      setSelectedContact(testContacts[0]);
    }
  };

  const loadStarredEmails = async () => {
    if (!selectedContact) return;

    try {
      setLoading(true);
      // 搜索该联系人的星标邮件
      const result = await mailApi.search('', 1, 50, {
        isStarred: true,
        from: selectedContact.email
      });

      const emailList = Array.isArray(result.data) ? result.data : (result as any[]);

      const transformedEmails: Email[] = emailList.map((mail: any) => ({
        id: mail.id,
        from: mail.fromName || mail.from.split('@')[0],
        fromEmail: mail.from,
        subject: mail.subject,
        date: formatDate(mail.createdAt),
        size: formatSize(Math.random() * 50000),
        hasAttachment: mail.attachments && mail.attachments.length > 0,
        isRead: mail.isRead,
        isStarred: mail.isStarred,
        isTest: false,
      }));

      setStarredEmails(transformedEmails);
    } catch (error) {
      console.error('加载星标邮件失败:', error);
      // API 失败时显示空列表
      setStarredEmails([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days < 7) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekdays[date.getDay()];
    } else {
      return date.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  };

  // 获取选中的真实数据 ID
  const getRealEmailIds = () => {
    return selectedEmails.filter(id =>
      starredEmails.some(email => String(email.id) === String(id) && !email.isTest)
    );
  };

  // 显示操作结果消息
  const showResultMessage = (realCount: number, totalCount: number, action: string) => {
    const testCount = totalCount - realCount;
    let message = '';

    if (realCount > 0 && testCount > 0) {
      message = `已${action} ${realCount} 封真实邮件（测试数据无法${action}）`;
    } else if (realCount > 0) {
      message = `已${action} ${realCount} 封邮件`;
    } else if (testCount > 0) {
      message = `测试数据无法${action}，请选择真实数据邮件`;
    } else {
      message = `请先选择要${action}的邮件`;
    }

    showToast(message, realCount > 0 ? 'success' : 'warning');
  };

  const handleEmailClick = (emailId: number | string, isTest?: boolean) => {
    if (isTest) {
      showToast('测试数据仅用于展示，无法查看详情', 'warning');
      return;
    }
    navigate(`/mail/${emailId}`, { state: { from: '/contacts-mail' } });
  };

  const toggleSelect = (id: number | string) => {
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedEmails(starredEmails.map(e => e.id));
    } else {
      setSelectedEmails([]);
    }
  };

  // 删除邮件
  const handleDelete = async () => {
    if (selectedEmails.length === 0) {
      showToast('请先选择要删除的邮件', 'warning');
      return;
    }
    const confirmed = await showConfirm({
      title: '确认删除',
      message: `确定要删除选中的 ${selectedEmails.length} 封邮件吗？`,
      confirmText: '删除',
      type: 'danger'
    });
    if (confirmed) {
      try {
        const realIds = getRealEmailIds();
        for (const id of realIds) {
          await mailApi.deleteMail(id);
        }
        await loadStarredEmails();
        showResultMessage(realIds.length, selectedEmails.length, '删除');
        setSelectedEmails([]);
        setSelectAll(false);
      } catch (error) {
        showToast('删除失败：' + (error as any).message, 'error');
      }
    }
  };

  // 转发邮件
  const handleForward = () => {
    if (selectedEmails.length === 0) {
      showToast('请先选择要转发的邮件', 'warning');
      return;
    }
    // 转发功能跳转到写信页面
    navigate('/compose');
  };

  // 标记为垃圾邮件
  const handleMarkAsSpam = async () => {
    if (selectedEmails.length === 0) {
      showToast('请先选择要标记的邮件', 'warning');
      return;
    }
    try {
      const realIds = getRealEmailIds();
      for (const id of realIds) {
        await mailApi.markAsSpam(id);
      }
      await loadStarredEmails();
      showResultMessage(realIds.length, selectedEmails.length, '标记为垃圾邮件');
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (error) {
      showToast('标记失败：' + (error as any).message, 'error');
    }
  };

  // 全部已读
  const handleMarkAsRead = async () => {
    if (selectedEmails.length === 0) {
      showToast('请先选择要标记的邮件', 'warning');
      return;
    }
    try {
      const realIds = getRealEmailIds();
      for (const id of realIds) {
        await mailApi.markAsRead(id, true);
      }
      await loadStarredEmails();
      showResultMessage(realIds.length, selectedEmails.length, '标记为已读');
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (error) {
      showToast('标记失败：' + (error as any).message, 'error');
    }
  };

  // 过滤联系人
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 空状态显示
  if (!selectedContact) {
    return (
      <div className="h-full flex bg-white">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="text-slate-500">暂无联系人</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white">
      {/* 左侧联系人列表 */}
      <div className="w-72 border-r border-slate-200 flex flex-col">
        {/* 搜索框 */}
        <div className="p-3 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索联系人"
              className="w-full pl-9 pr-3 py-2 bg-slate-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>
        </div>

        {/* 联系人列表 */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`px-3 py-2.5 cursor-pointer transition-colors border-b border-slate-50 ${
                selectedContact.id === contact.id
                  ? 'bg-blue-50'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                  {contact.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">{contact.name}</div>
                  <div className="text-xs text-slate-500 truncate">{contact.email}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧邮件列表 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="border-b border-slate-200 px-4 py-2 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm font-medium text-slate-900">星标联系人邮件</span>
                <button className="p-1 hover:bg-slate-100 rounded">
                  <List className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                删除
              </button>
              <button
                onClick={handleForward}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Forward className="w-3.5 h-3.5" />
                转发
              </button>
              <button
                onClick={handleMarkAsSpam}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                垃圾邮件
              </button>
              <button
                onClick={handleMarkAsRead}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                全部已读
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                共 {starredEmails.length} 封
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <button className="p-1 hover:bg-slate-100 rounded">
                <Square className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 邮件列表 */}
        <div className="flex-1 overflow-y-auto">
          <div>
            <div className="px-4 py-2 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">更早（{starredEmails.length}封）</span>
            </div>
            {starredEmails.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-sm">
                暂无该联系人的星标邮件
              </div>
            ) : (
              starredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => handleEmailClick(email.id, email.isTest)}
                  className={`px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100 ${
                    !email.isRead ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(email.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleSelect(email.id);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />

                  {/* 已读/未读状态图标 */}
                  <div className="w-5 flex-shrink-0">
                    {email.isRead ? (
                      <Mail className="w-5 h-5 text-slate-300" />
                    ) : (
                      <Mail className="w-5 h-5 text-blue-500 fill-blue-500" />
                    )}
                  </div>

                  <div className="w-32 flex-shrink-0 min-w-0">
                    <span className={`text-sm truncate block ${
                      email.isRead ? 'text-slate-600' : 'text-slate-900 font-medium'
                    }`}>
                      {email.from}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Toggle star:', email.id);
                    }}
                    className="p-1 hover:bg-slate-100 rounded"
                  >
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </button>

                  <div className="flex-1 min-w-0">
                    <span className={`text-sm truncate block ${
                      email.isRead ? 'text-slate-600' : 'text-slate-900 font-medium'
                    }`}>
                      {email.subject}
                    </span>
                  </div>

                  {email.hasAttachment && (
                    <Paperclip className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}

                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="text-xs text-slate-500">{email.date}</span>
                  </div>

                  <div className="w-12 flex-shrink-0 text-right">
                    <span className="text-xs text-slate-400">{email.size}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 分页 */}
        <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              上一页
            </button>
            <button className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              下一页
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">
              共 {starredEmails.length} 封，第 1/1 页
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
