import { useState } from 'react';
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
  X
} from 'lucide-react';
import PageToolbar from '../components/PageToolbar';

interface Draft {
  id: number;
  subject: string;
  content: string;
  date: string;
  size: string;
}

// 草稿数据（测试数据）
const drafts: Draft[] = [
  {
    id: 1,
    subject: '关于召开产品评审会的通知',
    content: '各位同事，大家好！定于本周五下午 2 点召开产品评审会...',
    date: '11 月 26 日',
    size: '12KB'
  },
  {
    id: 2,
    subject: '2024 年度工作总结报告',
    content: '尊敬的领导：现将本部门 2024 年度工作情况总结如下...',
    date: '11 月 25 日',
    size: '28KB'
  },
  {
    id: 3,
    subject: '',
    content: '李总，您好！关于上次会议讨论的合作事宜...',
    date: '11 月 24 日',
    size: '5KB'
  },
];

export default function DraftsPage() {
  const navigate = useNavigate();
  const [selectedDrafts, setSelectedDrafts] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleDraftClick = (draftId: number) => {
    navigate(`/compose?draft=${draftId}`);
  };

  const toggleSelect = (id: number) => {
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

  const handleDelete = () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要删除的草稿');
      return;
    }
    const confirmed = window.confirm(`确定要删除选中的 ${selectedDrafts.length} 封草稿吗？`);
    if (confirmed) {
      alert(`已删除 ${selectedDrafts.length} 封草稿`);
      setSelectedDrafts([]);
      setSelectAll(false);
    }
  };

  const handleForward = () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要转发的草稿');
      return;
    }
    const recipient = window.prompt('请输入收件人邮箱：');
    if (recipient) {
      alert(`已转发 ${selectedDrafts.length} 封草稿给 ${recipient}`);
      setSelectedDrafts([]);
      setSelectAll(false);
    }
  };

  const handleMarkAsRead = () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要标记为已读的草稿');
      return;
    }
    const confirmed = window.confirm(`确定要将选中的 ${selectedDrafts.length} 封草稿标记为已读吗？`);
    if (confirmed) {
      alert(`已将 ${selectedDrafts.length} 封草稿标记为已读`);
      setSelectedDrafts([]);
      setSelectAll(false);
    }
  };

  const handleStar = () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要标记为星标的草稿');
      return;
    }
    alert(`已将 ${selectedDrafts.length} 封草稿标记为星标`);
    setSelectedDrafts([]);
    setSelectAll(false);
  };

  const handleArchive = () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要归档的草稿');
      return;
    }
    alert(`已将 ${selectedDrafts.length} 封草稿归档`);
    setSelectedDrafts([]);
    setSelectAll(false);
  };

  const handleMove = () => {
    if (selectedDrafts.length === 0) {
      alert('请先选择要移动的草稿');
      return;
    }
    const folder = window.prompt('请输入要移动到的文件夹名称：');
    if (folder) {
      alert(`已将 ${selectedDrafts.length} 封草稿移动到 ${folder}`);
      setSelectedDrafts([]);
      setSelectAll(false);
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
        <div className="border-b border-slate-200 p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
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
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                删除
              </button>
              <button 
                onClick={handleForward}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Forward className="w-4 h-4" />
                转发
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <Shield className="w-4 h-4" />
                垃圾邮件
              </button>
              <button 
                onClick={handleMarkAsRead}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                全部已读
              </button>
              <button 
                onClick={handleStar}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Star className="w-4 h-4" />
                标记为
                <ChevronDown className="w-4 h-4" />
              </button>
              <button 
                onClick={handleMove}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
                移动到
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">共 {drafts.length} 封</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
              <button className="p-1.5 hover:bg-slate-100 rounded">
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
        <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-end">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              上一页
            </button>
            <button className="px-3 py-1.5 text-sm border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
