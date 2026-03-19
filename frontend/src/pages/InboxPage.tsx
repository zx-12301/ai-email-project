import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Star,
  Paperclip,
  Trash2,
  Archive,
  ChevronDown,
  MoreVertical,
  RefreshCw,
  Tag,
  Mail,
  X,
  List,
  Square,
  Forward,
  Shield,
  CheckCircle,
  Folder
} from 'lucide-react';
import PageToolbar from '../components/PageToolbar';
import { mailApi } from '../api/mail';
import { useToast } from '../contexts/ToastContext';

interface Email {
  id: number | string;
  from: string;
  subject: string;
  date: string;
  size: string;
  hasAttachment?: boolean;
  isRead: boolean;
  isStarred: boolean;
  avatar?: string;
  avatarColor?: string;
  isTest?: boolean;  // 标记是否为测试数据
}

export default function InboxPage() {
  const navigate = useNavigate();
  const { showToast, showConfirm } = useToast();
  const [selectedEmails, setSelectedEmails] = useState<(number | string)[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [realEmails, setRealEmails] = useState<Email[]>([]);  // 真实数据
  const [loading, setLoading] = useState(false);
  
  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(11);  // 默认每页 11 封
  const [totalEmails, setTotalEmails] = useState(0);
  
  // 下拉菜单状态
  const [showMarkMenu, setShowMarkMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);

  // 加载真实数据
  useEffect(() => {
    loadRealEmails();
  }, [currentPage, pageSize]);  // 当页码或每页数量变化时重新加载

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

  // 获取选中的真实数据 ID
  const getRealEmailIds = () => {
    return selectedEmails.filter(id => 
      realEmails.some(email => String(email.id) === String(id))
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
    } else {
      message = `测试数据无法${action}，请选择真实数据邮件`;
    }

    showToast(message, realCount > 0 ? 'success' : 'warning');
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
    setCurrentPage(1);  // 重置到第一页
  };

  const loadRealEmails = async () => {
    try {
      setLoading(true);
      const result = await mailApi.getInbox(currentPage, pageSize);
      const emailList = Array.isArray(result.data) ? result.data : (result as any[]);

      const transformedEmails: Email[] = emailList.map((mail: any) => ({
        id: mail.id,
        from: mail.fromName || mail.from.split('@')[0],
        subject: mail.subject,
        date: formatDate(mail.createdAt),
        size: formatSize(Math.random() * 50000),
        hasAttachment: mail.attachments && mail.attachments.length > 0,
        isRead: mail.isRead,
        isStarred: mail.isStarred,
        avatar: (mail.fromName || mail.from).charAt(0),
        avatarColor: getAvatarColor(mail.fromName || mail.from),
        isTest: mail.isTest || false,  // 保留后端的 isTest 标记
      }));

      setRealEmails(transformedEmails);
      setTotalEmails(result.total || emailList.length);
    } catch (error) {
      console.error('加载真实数据失败:', error);
      setRealEmails([]);
      setTotalEmails(0);
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
      return '今天 ' + date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '昨天';
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

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-orange-100 text-orange-600',
      'bg-amber-100 text-amber-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-pink-100 text-pink-600',
      'bg-red-100 text-red-600',
      'bg-slate-100 text-slate-600',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const handleEmailClick = (emailId: number | string) => {
    navigate(`/mail/${emailId}`, { state: { from: '/inbox' } });
  };

  const toggleSelect = (id: number | string) => {
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedEmails(realEmails.map(e => e.id));
    } else {
      setSelectedEmails([]);
    }
  };

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
        // 删除真实数据
        const realIds = getRealEmailIds();
        for (const id of realIds) {
          await mailApi.deleteMail(id);
        }

        // 刷新真实数据
        await loadRealEmails();

        // 显示结果
        showResultMessage(realIds.length, selectedEmails.length, '删除');
        setSelectedEmails([]);
        setSelectAll(false);
      } catch (error) {
        console.error('Delete error:', error);
        showToast('删除失败：' + (error as any).message, 'error');
      }
    }
  };

  const handleForward = () => {
    if (selectedEmails.length === 0) {
      showToast('请先选择要转发的邮件', 'warning');
      return;
    }
    // 转发功能暂时跳转到写信页面
    navigate('/compose');
  };

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

      await loadRealEmails();
      showResultMessage(realIds.length, selectedEmails.length, '标记为已读');
      setSelectedEmails([]);
      setSelectAll(false);
      setShowMarkMenu(false);
    } catch (error) {
      showToast('标记失败：' + (error as any).message, 'error');
    }
  };

  const handleMarkAsUnread = async () => {
    if (selectedEmails.length === 0) {
      showToast('请先选择要标记的邮件', 'warning');
      return;
    }
    try {
      const realIds = getRealEmailIds();
      for (const id of realIds) {
        await mailApi.markAsRead(id, false);
      }

      await loadRealEmails();
      showResultMessage(realIds.length, selectedEmails.length, '标记为未读');
      setSelectedEmails([]);
      setSelectAll(false);
      setShowMarkMenu(false);
    } catch (error) {
      showToast('标记失败：' + (error as any).message, 'error');
    }
  };

  const handleRefresh = async () => {
    await loadRealEmails();
    showToast('已刷新', 'success');
  };

  const handleGenerateTestData = async () => {
    try {
      await mailApi.generateTestData();
      await loadRealEmails();
      showToast('测试数据已生成', 'success');
    } catch (error) {
      showToast('生成失败：' + (error as any).message, 'error');
    }
  };

  const handleStar = async () => {
    if (selectedEmails.length === 0) {
      showToast('请先选择要标记为星标的邮件', 'warning');
      return;
    }
    try {
      const realIds = getRealEmailIds();
      for (const id of realIds) {
        await mailApi.toggleStar(id);
      }

      await loadRealEmails();
      showResultMessage(realIds.length, selectedEmails.length, '标记为星标');
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (error) {
      showToast('标记失败：' + (error as any).message, 'error');
    }
  };

  // 单个邮件切换星标
  const handleToggleStarSingle = async (emailId: number | string, isStarred: boolean, isTest?: boolean) => {
    // 测试数据无法切换
    if (isTest) {
      showToast('测试数据无法修改', 'warning');
      return;
    }
    try {
      await mailApi.toggleStar(emailId);
      // 刷新列表
      await loadRealEmails();
      showToast(isStarred ? '已取消星标' : '已标记星标', 'success');
    } catch (error) {
      showToast('操作失败：' + (error as any).message, 'error');
    }
  };

  const handleArchive = async () => {
    if (selectedEmails.length === 0) {
      showToast('请先选择要归档的邮件', 'warning');
      return;
    }
    try {
      const realIds = getRealEmailIds();
      for (const id of realIds) {
        await mailApi.archive(id);
      }

      await loadRealEmails();
      showResultMessage(realIds.length, selectedEmails.length, '归档');
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (error) {
      showToast('归档失败：' + (error as any).message, 'error');
    }
  };

  const handleMove = async (folder: string) => {
    if (selectedEmails.length === 0) {
      showToast('请先选择要移动的邮件', 'warning');
      return;
    }
    try {
      const realIds = getRealEmailIds();
      for (const id of realIds) {
        await mailApi.moveToFolder(id, folder);
      }

      await loadRealEmails();

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
      showToast('移动失败：' + (error as any).message, 'error');
    }
  };

  const handleSpam = async () => {
    if (selectedEmails.length === 0) {
      showToast('请先选择要标记为垃圾邮件的邮件', 'warning');
      return;
    }
    const confirmed = await showConfirm({
      title: '标记为垃圾邮件',
      message: `确定要将选中的 ${selectedEmails.length} 封邮件标记为垃圾邮件吗？`,
      confirmText: '确定',
      type: 'warning'
    });
    if (confirmed) {
      try {
        const realIds = getRealEmailIds();
        for (const id of realIds) {
          await mailApi.moveToFolder(id, 'spam');
        }

        await loadRealEmails();
        showResultMessage(realIds.length, selectedEmails.length, '标记为垃圾邮件');
        setSelectedEmails([]);
        setSelectAll(false);
      } catch (error) {
        showToast('标记失败：' + (error as any).message, 'error');
      }
    }
  };

  // 渲染邮件行组件
  const renderEmailRow = (email: Email) => (
    <div
      key={email.id}
      onClick={() => {
        // 测试数据无法查看详情
        if (email.isTest) {
          showToast('测试数据仅用于展示，无法查看详情', 'warning');
          return;
        }
        handleEmailClick(email.id);
      }}
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
        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />

      {/* 已读/未读状态图标 */}
      <div className="w-5 flex-shrink-0">
        {email.isRead ? (
          <Mail className="w-5 h-5 text-slate-300" />
        ) : (
          <Mail className="w-5 h-5 text-blue-500 fill-blue-500" />
        )}
      </div>

      <div className={`w-9 h-9 rounded flex items-center justify-center text-xs font-medium flex-shrink-0 ${email.avatarColor || 'bg-slate-100 text-slate-600'}`}>
        {email.avatar}
      </div>

      <div className="w-36 flex-shrink-0">
        <div className="flex items-center gap-1">
          <span className={`text-xs truncate block ${
            email.isRead ? 'text-slate-600' : 'text-slate-900 font-medium'
          }`}>
            {email.from}
          </span>
          {email.isTest && (
            <span className="px-1 py-0.5 text-[9px] bg-blue-100 text-blue-600 rounded">
              测试
            </span>
          )}
        </div>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          handleToggleStarSingle(email.id, email.isStarred, email.isTest);
        }}
        className="p-1 hover:bg-slate-100 rounded flex-shrink-0"
      >
        <Star className={`w-4 h-4 ${
          email.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300 hover:text-amber-400'
        }`} />
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

      <div className="w-14 flex-shrink-0 text-right">
        <span className="text-xs text-slate-400">{email.size}</span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
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
                <span className="text-sm font-medium text-slate-900">收件箱</span>
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
                onClick={handleSpam}
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
              <button 
                onClick={handleRefresh}
                className="p-1 hover:bg-slate-100 rounded"
                title="刷新"
              >
                <RefreshCw className="w-4 h-4 text-slate-600" />
              </button>
              <button 
                onClick={handleGenerateTestData}
                className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded"
                title="生成测试数据"
              >
                生成测试数据
              </button>
              <span className="text-xs text-slate-500">
                共 {realEmails.length} 封
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
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-slate-500">加载中...</div>
            </div>
          ) : realEmails.length === 0 ? (
            <div className="flex items-center justify-center h-40">
              <div className="text-center">
                <div className="text-slate-400 text-sm mb-2">暂无邮件</div>
                <button
                  onClick={handleGenerateTestData}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded"
                >
                  生成测试数据
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* 今天 */}
              {realEmails.some(e => e.date.includes('今天')) && (
                <div>
                  <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-500">今天</span>
                    <span className="text-[10px] text-slate-400">
                      （{realEmails.filter(e => e.date.includes('今天')).length} 封）
                    </span>
                  </div>
                  {realEmails.filter(e => e.date.includes('今天')).map(renderEmailRow)}
                </div>
              )}

              {/* 昨天 */}
              {realEmails.some(e => e.date.includes('昨天')) && (
                <div>
                  <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-500">昨天</span>
                    <span className="text-[10px] text-slate-400">
                      （{realEmails.filter(e => e.date.includes('昨天')).length} 封）
                    </span>
                  </div>
                  {realEmails.filter(e => e.date.includes('昨天')).map(renderEmailRow)}
                </div>
              )}

              {/* 本周 */}
              {realEmails.some(e => ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].some(day => e.date.includes(day)) && !e.date.includes('昨天')) && (
                <div>
                  <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-500">本周</span>
                    <span className="text-[10px] text-slate-400">
                      （{realEmails.filter(e => ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].some(day => e.date.includes(day)) && !e.date.includes('昨天')).length} 封）
                    </span>
                  </div>
                  {realEmails.filter(e => ['周一', '周二', '周三', '周四', '周五', '周六', '周日'].some(day => e.date.includes(day)) && !e.date.includes('昨天')).map(renderEmailRow)}
                </div>
              )}

              {/* 更早 */}
              {realEmails.some(e => !e.date.includes('今天') && !e.date.includes('昨天') && !['周一', '周二', '周三', '周四', '周五', '周六', '周日'].some(day => e.date.includes(day))) && (
                <div>
                  <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-medium text-slate-500">更早</span>
                    <span className="text-[10px] text-slate-400">
                      （{realEmails.filter(e => !e.date.includes('今天') && !e.date.includes('昨天') && !['周一', '周二', '周三', '周四', '周五', '周六', '周日'].some(day => e.date.includes(day))).length} 封）
                    </span>
                  </div>
                  {realEmails.filter(e => !e.date.includes('今天') && !e.date.includes('昨天') && !['周一', '周二', '周三', '周四', '周五', '周六', '周日'].some(day => e.date.includes(day))).map(renderEmailRow)}
                </div>
              )}
            </>
          )}
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
