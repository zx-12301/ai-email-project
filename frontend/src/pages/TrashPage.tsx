import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Star, 
  Paperclip, 
  Trash2, 
  ChevronDown, 
  MoreVertical,
  Forward,
  Shield,
  CheckCircle,
  List,
  Square,
  Mail,
  RotateCcw,
  Archive,
  X,
  RefreshCw,
  Folder
} from 'lucide-react';
import { mailApi } from '../api/mail';

interface Email {
  id: number | string;
  from: string;
  subject: string;
  date: string;
  size: string;
  hasAttachment?: boolean;
  isRead: boolean;
  deletedDate?: string;
  isTest?: boolean;
}

// 已删除邮件测试数据
const mockDeletedEmails: Email[] = [
  {
    id: 'test-1',
    from: '京东 JD.com',
    subject: '您的订单已发货',
    date: '11 月 20 日',
    size: '8KB',
    hasAttachment: false,
    isRead: true,
    deletedDate: '11 月 25 日',
    isTest: true
  },
  {
    id: 'test-2',
    from: '招商银行',
    subject: '信用卡账单通知',
    date: '11 月 18 日',
    size: '15KB',
    hasAttachment: true,
    isRead: false,
    deletedDate: '11 月 24 日',
    isTest: true
  },
  {
    id: 'test-3',
    from: 'Apple',
    subject: '您的 Apple 账户登录异常',
    date: '11 月 15 日',
    size: '6KB',
    hasAttachment: false,
    isRead: true,
    deletedDate: '11 月 23 日',
    isTest: true
  },
];

export default function TrashPage() {
  const navigate = useNavigate();
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deletedEmails, setDeletedEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalEmails, setTotalEmails] = useState(0);
  
  // 下拉菜单状态
  const [showMarkMenu, setShowMarkMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  
  // 加载已删除邮件
  useEffect(() => {
    loadDeletedEmails();
  }, [currentPage, pageSize]);
  
  const loadDeletedEmails = async () => {
    try {
      setLoading(true);
      const result = await mailApi.getTrash(currentPage, pageSize);
      const emailList = Array.isArray(result.data) ? result.data : (result as any[]);
      
      const transformedEmails: Email[] = emailList.map((mail: any) => ({
        id: mail.id,
        from: mail.fromName || mail.from.split('@')[0],
        subject: mail.subject,
        date: formatDate(mail.deletedAt || mail.createdAt),
        size: formatSize(Math.random() * 50000),
        hasAttachment: mail.attachments && mail.attachments.length > 0,
        isRead: mail.isRead,
        deletedDate: formatDate(mail.deletedAt),
        isTest: false,
      }));
      
      // 合并测试数据和真实数据（只在第一页显示测试数据）
      const allEmails = currentPage === 1 ? [...mockDeletedEmails, ...transformedEmails] : transformedEmails;
      setDeletedEmails(allEmails);
      setTotalEmails(result.total ? result.total + (currentPage === 1 ? mockDeletedEmails.length : 0) : allEmails.length);
    } catch (error) {
      console.error('加载已删除邮件失败:', error);
      // API 失败时显示测试数据
      if (currentPage === 1) {
        setDeletedEmails(mockDeletedEmails);
        setTotalEmails(mockDeletedEmails.length);
      }
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
      deletedEmails.some(email => String(email.id) === String(id) && !email.isTest)
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
    
    alert(message);
  };
  
  // 分页控制函数
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalEmails / pageSize);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleJumpToPage = (page: number) => {
    const totalPages = Math.ceil(totalEmails / pageSize);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };
  
  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        setShowMarkMenu(false);
        setShowMoveMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleEmailClick = (emailId: number | string) => {
    navigate(`/mail/${emailId}`);
  };

  const toggleSelect = (id: number | string) => {
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedEmails(deletedEmails.map(e => e.id));
    } else {
      setSelectedEmails([]);
    }
  };
  
  const handleDelete = async () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要永久删除的邮件');
      return;
    }
    const confirmed = window.confirm(`确定要永久删除选中的 ${selectedEmails.length} 封邮件吗？此操作不可恢复！`);
    if (confirmed) {
      const realIds = getRealEmailIds();
      if (realIds.length === 0) {
        alert('测试数据无法删除，请选择真实数据邮件');
        setSelectedEmails([]);
        setSelectAll(false);
        return;
      }
      try {
        for (const id of realIds) {
          await mailApi.permanentDelete(Number(id));
        }
        await loadDeletedEmails();
        showResultMessage(realIds.length, selectedEmails.length, '永久删除');
        setSelectedEmails([]);
        setSelectAll(false);
      } catch (error) {
        alert('删除失败：' + (error as any).message);
      }
    }
  };
  
  const handleRestore = async () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要恢复的邮件');
      return;
    }
    const realIds = getRealEmailIds();
    if (realIds.length === 0) {
      alert('测试数据无法恢复，请选择真实数据邮件');
      setSelectedEmails([]);
      setSelectAll(false);
      return;
    }
    try {
      for (const id of realIds) {
        await mailApi.restore(Number(id));
      }
      await loadDeletedEmails();
      showResultMessage(realIds.length, selectedEmails.length, '恢复');
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (error) {
      alert('恢复失败：' + (error as any).message);
    }
  };
  
  const handleForward = async () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要转发的邮件');
      return;
    }
    const recipient = window.prompt('请输入收件人邮箱：');
    if (recipient) {
      const realIds = getRealEmailIds();
      if (realIds.length === 0) {
        alert('测试数据无法转发，请选择真实数据邮件');
        setSelectedEmails([]);
        setSelectAll(false);
        return;
      }
      try {
        for (const id of realIds) {
          await mailApi.forward(Number(id), recipient);
        }
        alert(`已转发 ${realIds.length} 封邮件给 ${recipient}`);
        setSelectedEmails([]);
        setSelectAll(false);
      } catch (error) {
        alert('转发失败：' + (error as any).message);
      }
    }
  };
  
  const handleSpam = async () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要标记为垃圾邮件的邮件');
      return;
    }
    const confirmed = window.confirm(`确定要将选中的 ${selectedEmails.length} 封邮件标记为垃圾邮件吗？`);
    if (confirmed) {
      const realIds = getRealEmailIds();
      if (realIds.length === 0) {
        alert('测试数据无法标记，请选择真实数据邮件');
        setSelectedEmails([]);
        setSelectAll(false);
        return;
      }
      try {
        for (const id of realIds) {
          await mailApi.moveToFolder(Number(id), 'spam');
        }
        await loadDeletedEmails();
        showResultMessage(realIds.length, selectedEmails.length, '标记为垃圾邮件');
        setSelectedEmails([]);
        setSelectAll(false);
      } catch (error) {
        alert('标记失败：' + (error as any).message);
      }
    }
  };
  
  const handleMarkAsRead = async () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要标记的邮件');
      return;
    }
    try {
      const realIds = getRealEmailIds();
      if (realIds.length === 0) {
        alert('测试数据无法标记，请选择真实数据邮件');
        setSelectedEmails([]);
        setSelectAll(false);
        setShowMarkMenu(false);
        return;
      }
      for (const id of realIds) {
        await mailApi.markAsRead(Number(id), true);
      }
      await loadDeletedEmails();
      showResultMessage(realIds.length, selectedEmails.length, '标记为已读');
      setSelectedEmails([]);
      setSelectAll(false);
      setShowMarkMenu(false);
    } catch (error) {
      alert('标记失败：' + (error as any).message);
    }
  };
  
  const handleMarkAsUnread = async () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要标记的邮件');
      return;
    }
    try {
      const realIds = getRealEmailIds();
      if (realIds.length === 0) {
        alert('测试数据无法标记，请选择真实数据邮件');
        setSelectedEmails([]);
        setSelectAll(false);
        setShowMarkMenu(false);
        return;
      }
      for (const id of realIds) {
        await mailApi.markAsRead(Number(id), false);
      }
      await loadDeletedEmails();
      showResultMessage(realIds.length, selectedEmails.length, '标记为未读');
      setSelectedEmails([]);
      setSelectAll(false);
      setShowMarkMenu(false);
    } catch (error) {
      alert('标记失败：' + (error as any).message);
    }
  };
  
  const handleMove = async (folder: string) => {
    if (selectedEmails.length === 0) {
      alert('请先选择要移动的邮件');
      return;
    }
    try {
      const realIds = getRealEmailIds();
      if (realIds.length === 0) {
        alert('测试数据无法移动，请选择真实数据邮件');
        setSelectedEmails([]);
        setSelectAll(false);
        setShowMoveMenu(false);
        return;
      }
      for (const id of realIds) {
        await mailApi.moveToFolder(Number(id), folder);
      }
      await loadDeletedEmails();
      const folderNames: Record<string, string> = {
        'sent': '已发送',
        'drafts': '草稿箱',
        'trash': '已删除',
        'spam': '垃圾箱'
      };
      showResultMessage(realIds.length, selectedEmails.length, `移动到${folderNames[folder] || folder}`);
      setSelectedEmails([]);
      setSelectAll(false);
      setShowMoveMenu(false);
    } catch (error) {
      alert('移动失败：' + (error as any).message);
    }
  };

  const handleStar = async () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要标记为星标的邮件');
      return;
    }
    try {
      const realIds = getRealEmailIds();
      if (realIds.length === 0) {
        alert('测试数据无法标记，请选择真实数据邮件');
        setSelectedEmails([]);
        setSelectAll(false);
        return;
      }
      for (const id of realIds) {
        await mailApi.toggleStar(Number(id));
      }
      await loadDeletedEmails();
      showResultMessage(realIds.length, selectedEmails.length, '标记为星标');
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (error) {
      alert('标记失败：' + (error as any).message);
    }
  };

  // 空状态显示
  if (deletedEmails.length === 0) {
    return (
      <div className="h-full flex bg-white">
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* 空状态插图 */}
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 relative mb-4">
              {/* 电脑图标 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-24 bg-blue-100 rounded-lg border-2 border-blue-300 flex items-center justify-center">
                  <div className="text-4xl">💻</div>
                </div>
              </div>
              {/* 装饰元素 */}
              <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-300 rounded-full"></div>
              <div className="absolute top-4 right-4 w-3 h-3 bg-green-300 rounded-full"></div>
              <div className="absolute bottom-0 left-8 w-3 h-3 bg-pink-300 rounded-full"></div>
              {/* 对话气泡 */}
              <div className="absolute -top-4 right-8 w-12 h-12 bg-blue-50 rounded-full border-2 border-blue-300 flex items-center justify-center">
                <span className="text-blue-500 text-xs">🗑️</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-4">暂无已删除邮件</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white">
      {/* 主内容区 */}
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
                <span className="text-sm font-medium text-slate-900">已删除</span>
                <button className="p-1 hover:bg-slate-100 rounded">
                  <List className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={handleRestore}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                恢复
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                永久删除
              </button>
              <button 
                onClick={handleForward}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Forward className="w-3.5 h-3.5" />
                转发
              </button>
              <button 
                onClick={handleMarkAsRead}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                全部已读
              </button>
              
              {/* 标记为下拉菜单 */}
              <div className="relative">
                <button 
                  onClick={() => setShowMarkMenu(!showMarkMenu)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <Star className="w-3.5 h-3.5" />
                  标记为
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showMarkMenu && (
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <button
                      onClick={handleMarkAsRead}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      已读
                    </button>
                    <button
                      onClick={handleMarkAsUnread}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      未读
                    </button>
                  </div>
                )}
              </div>
              
              {/* 移动到下菜单 */}
              <div className="relative">
                <button 
                  onClick={() => setShowMoveMenu(!showMoveMenu)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
                >
                  <Folder className="w-3.5 h-3.5" />
                  移动到
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showMoveMenu && (
                  <div className="absolute right-0 mt-1 w-40 bg-white border border-slate-200 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => handleMove('sent')}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Forward className="w-3.5 h-3.5" />
                      已发送
                    </button>
                    <button
                      onClick={() => handleMove('drafts')}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <List className="w-3.5 h-3.5" />
                      草稿箱
                    </button>
                    <button
                      onClick={() => handleMove('trash')}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      已删除
                    </button>
                    <button
                      onClick={() => handleMove('spam')}
                      className="w-full px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      垃圾箱
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                共 {totalEmails} 封
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
              <span className="text-xs font-medium text-slate-500">更早（{deletedEmails.length}封）</span>
            </div>
            {deletedEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100"
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

                <div className="w-40 flex-shrink-0">
                  <span className={`text-sm truncate block ${
                    email.isRead ? 'text-slate-600' : 'text-slate-900 font-medium'
                  }`}>
                    {email.from}
                  </span>
                </div>

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
            ))}
          </div>
        </div>

        {/* 分页 */}
        <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            <button 
              onClick={handleNextPage}
              disabled={currentPage >= Math.ceil(totalEmails / pageSize)}
              className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">
              共 {totalEmails} 封，{currentPage}/{Math.ceil(totalEmails / pageSize) || 1} 页
            </span>
            <div className="flex items-center gap-1">
              {[5, 10, 20].map((size) => (
                <button
                  key={size}
                  onClick={() => handlePageSizeChange(size)}
                  className={`w-7 h-7 flex items-center justify-center text-xs border rounded transition-colors ${
                    pageSize === size
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {size}
                </button>
              ))}
              <input
                type="number"
                min="1"
                max={Math.ceil(totalEmails / pageSize)}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value, 10);
                  if (!isNaN(page)) {
                    handleJumpToPage(page);
                  }
                }}
                className="w-12 h-7 px-1 text-xs text-center border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={() => handleJumpToPage(currentPage)}
                className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                跳转
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
