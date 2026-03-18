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
  AlertTriangle,
  RotateCcw,
  Archive,
  X
} from 'lucide-react';

interface Email {
  id: number;
  from: string;
  subject: string;
  date: string;
  size: string;
  hasAttachment?: boolean;
  isRead: boolean;
  spamReason?: string;
}

// 垃圾邮件数据（测试数据）
const spamEmails: Email[] = [
  {
    id: 1,
    from: 'unknown@spam.com',
    subject: '恭喜您获得 100 万元奖金！请立即领取',
    date: '11 月 22 日',
    size: '5KB',
    hasAttachment: false,
    isRead: false,
    spamReason: '疑似诈骗'
  },
  {
    id: 2,
    from: 'service@fake-bank.com',
    subject: '您的银行账户已被冻结，请立即验证',
    date: '11 月 21 日',
    size: '8KB',
    hasAttachment: false,
    isRead: false,
    spamReason: '钓鱼邮件'
  },
  {
    id: 3,
    from: 'promotion@marketing.com',
    subject: '【促销】全场 1 折起，限时抢购！',
    date: '11 月 20 日',
    size: '12KB',
    hasAttachment: true,
    isRead: true,
    spamReason: '广告推广'
  },
];

export default function SpamPage() {
  const navigate = useNavigate();
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleEmailClick = (emailId: number) => {
    navigate(`/mail/${emailId}`);
  };

  const toggleSelect = (id: number) => {
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedEmails(spamEmails.map(e => e.id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleDelete = () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要永久删除的邮件');
      return;
    }
    const confirmed = window.confirm(`确定要永久删除选中的 ${selectedEmails.length} 封邮件吗？此操作不可恢复！`);
    if (confirmed) {
      alert(`已永久删除 ${selectedEmails.length} 封邮件`);
      setSelectedEmails([]);
      setSelectAll(false);
    }
  };

  const handleRestore = () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要恢复的邮件');
      return;
    }
    alert(`已将 ${selectedEmails.length} 封邮件恢复到收件箱`);
    setSelectedEmails([]);
    setSelectAll(false);
  };

  const handleForward = () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要转发的邮件');
      return;
    }
    const recipient = window.prompt('请输入收件人邮箱：');
    if (recipient) {
      alert(`已转发 ${selectedEmails.length} 封邮件给 ${recipient}`);
      setSelectedEmails([]);
      setSelectAll(false);
    }
  };

  const handleMarkAsRead = () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要标记为已读的邮件');
      return;
    }
    const confirmed = window.confirm(`确定要将选中的 ${selectedEmails.length} 封邮件标记为已读吗？`);
    if (confirmed) {
      alert(`已将 ${selectedEmails.length} 封邮件标记为已读`);
      setSelectedEmails([]);
      setSelectAll(false);
    }
  };

  const handleStar = () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要标记为星标的邮件');
      return;
    }
    alert(`已将 ${selectedEmails.length} 封邮件标记为星标`);
    setSelectedEmails([]);
    setSelectAll(false);
  };

  const handleArchive = () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要归档的邮件');
      return;
    }
    alert(`已将 ${selectedEmails.length} 封邮件归档`);
    setSelectedEmails([]);
    setSelectAll(false);
  };

  const handleMove = () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要移动的邮件');
      return;
    }
    const folder = window.prompt('请输入要移动到的文件夹名称：');
    if (folder) {
      alert(`已将 ${selectedEmails.length} 封邮件移动到 ${folder}`);
      setSelectedEmails([]);
      setSelectAll(false);
    }
  };

  // 空状态显示
  if (spamEmails.length === 0) {
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
                <span className="text-blue-500 text-xs">🛡️</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-4">暂无垃圾邮件</p>
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
                <span className="text-sm font-medium text-slate-900">垃圾箱</span>
                <button className="p-1 hover:bg-slate-100 rounded">
                  <List className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={handleRestore}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                不是垃圾邮件
              </button>
              <button 
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                永久删除
              </button>
              <button 
                onClick={handleForward}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Forward className="w-4 h-4" />
                转发
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
              <span className="text-sm text-slate-600">共 {spamEmails.length} 封</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
              <button className="p-1.5 hover:bg-slate-100 rounded">
                <Square className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 邮件列表 */}
        <div className="flex-1 overflow-y-auto">
          <div>
            <div className="px-4 py-2 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">更早（{spamEmails.length}封）</span>
            </div>
            {spamEmails.map((email) => (
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
                
                {/* 垃圾邮件图标 */}
                <div className="w-5 flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                </div>

                <div className="w-40 flex-shrink-0">
                  <span className="text-sm text-slate-600 truncate">
                    {email.from}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="text-sm text-slate-600 truncate">
                    {email.subject}
                  </span>
                </div>

                {email.spamReason && (
                  <div className="w-32 flex-shrink-0 text-right">
                    <span className="text-xs text-orange-600">{email.spamReason}</span>
                  </div>
                )}

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
