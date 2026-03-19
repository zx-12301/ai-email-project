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
  Send,
  FileText,
  Archive,
  X,
  RefreshCw,
  Folder
} from 'lucide-react';
import PageToolbar from '../components/PageToolbar';
import { mailApi } from '../api/mail';

interface Draft {
  id: number | string;
  subject: string;
  content: string;
  date: string;
  size: string;
  hasAttachment?: boolean;
  isTest?: boolean;
}

// 草稿测试数据
const mockDrafts: Draft[] = [
  {
    id: 'test-1',
    subject: '关于召开产品评审会的通知',
    content: '各位同事，大家好！定于本周五下午 2 点召开产品评审会...',
    date: '11 月 26 日',
    size: '12KB',
    isTest: true
  },
  {
    id: 'test-2',
    subject: '2024 年度工作总结报告',
    content: '尊敬的领导：现将本部门 2024 年度工作情况总结如下...',
    date: '11 月 25 日',
    size: '28KB',
    isTest: true
  },
  {
    id: 'test-3',
    subject: '',
    content: '李总，您好！关于上次会议讨论的合作事宜...',
    date: '11 月 24 日',
    size: '5KB',
    isTest: true
  },
];

export default function DraftsPage() {
  const navigate = useNavigate();
  const [selectedDrafts, setSelectedDrafts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalDrafts, setTotalDrafts] = useState(0);
  
  // 下拉菜单状态
  const [showMarkMenu, setShowMarkMenu] = useState(false);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  
  // 加载草稿
  useEffect(() => {
    loadDrafts();
  }, [currentPage, pageSize]);
  
  const loadDrafts = async () => {
    try {
      setLoading(true);
      const result = await mailApi.getDrafts(currentPage, pageSize);
      const draftList = Array.isArray(result.data) ? result.data : (result as any[]);
      
      const transformedDrafts: Draft[] = draftList.map((draft: any) => ({
        id: draft.id,
        subject: draft.subject || '(无主题)',
        content: draft.content.substring(0, 50) + '...',
        date: formatDate(draft.updatedAt || draft.createdAt),
        size: formatSize(draft.content.length),
        hasAttachment: draft.attachments && draft.attachments.length > 0,
        isTest: false,
      }));
      
      // 合并测试数据和真实数据（只在第一页显示测试数据）
      const allDrafts = currentPage === 1 ? [...mockDrafts, ...transformedDrafts] : transformedDrafts;
      setDrafts(allDrafts);
      setTotalDrafts(result.total ? result.total + (currentPage === 1 ? mockDrafts.length : 0) : allDrafts.length);
    } catch (error) {
      console.error('加载草稿失败:', error);
      // API 失败时显示测试数据
      if (currentPage === 1) {
        setDrafts(mockDrafts);
        setTotalDrafts(mockDrafts.length);
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
  const getRealDraftIds = () => {
    return selectedDrafts.filter(id => 
      drafts.some(draft => String(draft.id) === String(id) && !draft.isTest)
    );
  };
  
  // 显示操作结果消息
  const showResultMessage = (realCount: number, totalCount: number, action: string) => {
    const testCount = totalCount - realCount;
    let message = '';
    
    if (realCount > 0 && testCount > 0) {
      message = `已${action} ${realCount} 封真实草稿（测试数据无法${action}）`;
    } else if (realCount > 0) {
      message = `已${action} ${realCount} 封草稿`;
    } else if (testCount > 0) {
      message = `测试数据无法${action}，请选择真实数据草稿`;
    } else {
      message = `请先选择要${action}的草稿`;
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
    const totalPages = Math.ceil(totalDrafts / pageSize);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleJumpToPage = (page: number) => {
    const totalPages = Math.ceil(totalDrafts / pageSize);
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

  const handleDraftClick = (draftId: number | string) => {
    navigate(`/compose?draft=${draftId}`);
  };

  const toggleSelect = (id: number | string) => {
    setSelectedDrafts(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedDrafts(drafts.map(d => d.id));
    } else {
      setSelectedDrafts([]);
    }
  };
  
  const handleDelete = async () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要删除的草稿');
      return;
    }
    const confirmed = window.confirm(`确定要删除选中的 ${selectedDrafts.length} 封草稿吗？`);
    if (confirmed) {
      const realIds = getRealDraftIds();
      if (realIds.length === 0) {
        alert('测试数据无法删除，请选择真实数据草稿');
        setSelectedDrafts([]);
        setSelectAll(false);
        return;
      }
      try {
        for (const id of realIds) {
          await mailApi.delete(Number(id));
        }
        await loadDrafts();
        showResultMessage(realIds.length, selectedDrafts.length, '删除');
        setSelectedDrafts([]);
        setSelectAll(false);
      } catch (error) {
        alert('删除失败：' + (error as any).message);
      }
    }
  };
  
  const handleForward = async () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要转发的草稿');
      return;
    }
    const recipient = window.prompt('请输入收件人邮箱：');
    if (recipient) {
      const realIds = getRealDraftIds();
      if (realIds.length === 0) {
        alert('测试数据无法转发，请选择真实数据草稿');
        setSelectedDrafts([]);
        setSelectAll(false);
        return;
      }
      try {
        for (const id of realIds) {
          await mailApi.forward(Number(id), recipient);
        }
        alert(`已转发 ${realIds.length} 封草稿给 ${recipient}`);
        setSelectedDrafts([]);
        setSelectAll(false);
      } catch (error) {
        alert('转发失败：' + (error as any).message);
      }
    }
  };
  
  const handleMarkAsRead = async () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要标记的草稿');
      return;
    }
    try {
      const realIds = getRealDraftIds();
      if (realIds.length === 0) {
        alert('测试数据无法标记，请选择真实数据草稿');
        setSelectedDrafts([]);
        setSelectAll(false);
        setShowMarkMenu(false);
        return;
      }
      for (const id of realIds) {
        await mailApi.markAsRead(Number(id), true);
      }
      await loadDrafts();
      showResultMessage(realIds.length, selectedDrafts.length, '标记为已读');
      setSelectedDrafts([]);
      setSelectAll(false);
      setShowMarkMenu(false);
    } catch (error) {
      alert('标记失败：' + (error as any).message);
    }
  };
  
  const handleMarkAsUnread = async () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要标记的草稿');
      return;
    }
    try {
      const realIds = getRealDraftIds();
      if (realIds.length === 0) {
        alert('测试数据无法标记，请选择真实数据草稿');
        setSelectedDrafts([]);
        setSelectAll(false);
        setShowMarkMenu(false);
        return;
      }
      for (const id of realIds) {
        await mailApi.markAsRead(Number(id), false);
      }
      await loadDrafts();
      showResultMessage(realIds.length, selectedDrafts.length, '标记为未读');
      setSelectedDrafts([]);
      setSelectAll(false);
      setShowMarkMenu(false);
    } catch (error) {
      alert('标记失败：' + (error as any).message);
    }
  };
  
  const handleStar = async () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要标记为星标的草稿');
      return;
    }
    try {
      const realIds = getRealDraftIds();
      if (realIds.length === 0) {
        alert('测试数据无法标记，请选择真实数据草稿');
        setSelectedDrafts([]);
        setSelectAll(false);
        return;
      }
      for (const id of realIds) {
        await mailApi.toggleStar(Number(id));
      }
      await loadDrafts();
      showResultMessage(realIds.length, selectedDrafts.length, '标记为星标');
      setSelectedDrafts([]);
      setSelectAll(false);
    } catch (error) {
      alert('标记失败：' + (error as any).message);
    }
  };
  
  const handleArchive = async () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要归档的草稿');
      return;
    }
    try {
      const realIds = getRealDraftIds();
      if (realIds.length === 0) {
        alert('测试数据无法归档，请选择真实数据草稿');
        setSelectedDrafts([]);
        setSelectAll(false);
        return;
      }
      for (const id of realIds) {
        await mailApi.archive(Number(id));
      }
      await loadDrafts();
      showResultMessage(realIds.length, selectedDrafts.length, '归档');
      setSelectedDrafts([]);
      setSelectAll(false);
    } catch (error) {
      alert('归档失败：' + (error as any).message);
    }
  };
  
  const handleMove = async (folder: string) => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要移动的草稿');
      return;
    }
    try {
      const realIds = getRealDraftIds();
      if (realIds.length === 0) {
        alert('测试数据无法移动，请选择真实数据草稿');
        setSelectedDrafts([]);
        setSelectAll(false);
        setShowMoveMenu(false);
        return;
      }
      for (const id of realIds) {
        await mailApi.moveToFolder(Number(id), folder);
      }
      await loadDrafts();
      const folderNames: Record<string, string> = {
        'sent': '已发送',
        'drafts': '草稿箱',
        'trash': '已删除',
        'spam': '垃圾箱'
      };
      showResultMessage(realIds.length, selectedDrafts.length, `移动到${folderNames[folder] || folder}`);
      setSelectedDrafts([]);
      setSelectAll(false);
      setShowMoveMenu(false);
    } catch (error) {
      alert('移动失败：' + (error as any).message);
    }
  };

  // 空状态显示
  if (drafts.length === 0) {
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
                <span className="text-blue-500 text-xs">📝</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-4">暂无草稿</p>
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
                <span className="text-sm font-medium text-slate-900">草稿箱</span>
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
                共 {totalDrafts} 封
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <button className="p-1 hover:bg-slate-100 rounded">
                <Square className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 草稿列表 */}
        <div className="flex-1 overflow-y-auto">
          <div>
            <div className="px-4 py-2 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">更早（{drafts.length}封）</span>
            </div>
            {drafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => handleDraftClick(draft.id)}
                className="px-4 py-2.5 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-100"
              >
                <input
                  type="checkbox"
                  checked={selectedDrafts.includes(draft.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSelect(draft.id);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                
                {/* 草稿图标 */}
                <div className="w-5 flex-shrink-0">
                  <FileText className="w-5 h-5 text-slate-300" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-600 truncate">
                    {draft.subject || '无主题'}
                  </span>
                </div>

                <div className="w-32 flex-shrink-0 text-right">
                  <span className="text-xs text-slate-500">{draft.date}</span>
                </div>

                <div className="w-12 flex-shrink-0 text-right">
                  <span className="text-xs text-slate-400">{draft.size}</span>
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
              disabled={currentPage >= Math.ceil(totalDrafts / pageSize)}
              className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">
              共 {totalDrafts} 封，{currentPage}/{Math.ceil(totalDrafts / pageSize) || 1} 页
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
                max={Math.ceil(totalDrafts / pageSize)}
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
