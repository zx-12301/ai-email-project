import { useState } from 'react';
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

interface Email {
  id: number;
  from: string;
  subject: string;
  date: string;
  size: string;
  hasAttachment?: boolean;
  isRead: boolean;
  isStarred: boolean;
  avatar?: string;
  avatarColor?: string;
}

const mockEmails: Email[] = [
  {
    id: 1,
    from: '星耀科技',
    subject: '协同办公软件推荐',
    date: '11:28',
    size: '10KB',
    hasAttachment: true,
    isRead: false,
    isStarred: true,
    avatar: '星',
    avatarColor: 'bg-orange-100 text-orange-600'
  },
  {
    id: 2,
    from: '95555',
    subject: '招商银行零售贷款电子对账单',
    date: '11 月 23 日',
    size: '19KB',
    hasAttachment: true,
    isRead: false,
    isStarred: false,
    avatar: '9',
    avatarColor: 'bg-amber-100 text-amber-600'
  },
  {
    id: 3,
    from: '三星电子',
    subject: '【三星 Galaxy】瞩目时刻，即将展开。',
    date: '11 月 23 日',
    size: '15KB',
    hasAttachment: true,
    isRead: false,
    isStarred: false,
    avatar: '三',
    avatarColor: 'bg-blue-100 text-blue-600'
  },
  {
    id: 4,
    from: 'Dell Notifications',
    subject: 'XPS 13 9360 有新的更新',
    date: '11 月 22 日',
    size: '28KB',
    hasAttachment: false,
    isRead: false,
    isStarred: true,
    avatar: 'D',
    avatarColor: 'bg-[#0077C8]/10 text-[#0077C8]'
  },
  {
    id: 5,
    from: '京东 JD.com',
    subject: '京东用户，诚邀您参与调研，有机会得 500 京豆！(AD)',
    date: '11 月 22 日',
    size: '11KB',
    hasAttachment: false,
    isRead: false,
    isStarred: false,
    avatar: '京',
    avatarColor: 'bg-[#E1251B]/10 text-[#E1251B]'
  },
  {
    id: 6,
    from: 'Apple',
    subject: '你最近使用 Apple 账户下载的项目',
    date: '11 月 22 日',
    size: '8KB',
    hasAttachment: false,
    isRead: false,
    isStarred: false,
    avatar: 'A',
    avatarColor: 'bg-gray-200 text-gray-600'
  },
];

const earlierEmails: Email[] = Array(15).fill(null).map((_, i) => ({
  id: 100 + i,
  from: '12306@rails.com.cn',
  subject: '网上购票系统 - 用户支付通知',
  date: '11 月 21 日',
  size: '19KB',
  hasAttachment: i % 5 === 0,
  isRead: true,
  isStarred: i === 3,
  avatar: '1',
  avatarColor: 'bg-slate-100 text-slate-600'
}));

export default function InboxPage() {
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
      setSelectedEmails([...mockEmails.map(e => e.id), ...earlierEmails.map(e => e.id)]);
    } else {
      setSelectedEmails([]);
    }
  };

  const handleDelete = () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要删除的邮件');
      return;
    }
    const confirmed = window.confirm(`确定要删除选中的 ${selectedEmails.length} 封邮件吗？`);
    if (confirmed) {
      alert(`已删除 ${selectedEmails.length} 封邮件`);
      setSelectedEmails([]);
      setSelectAll(false);
    }
  };

  const handleForward = () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要转发的邮件');
      return;
    }
    const recipient = window.prompt('请输入收件人邮箱：');
    if (recipient) {
      alert(`已转发 ${selectedEmails.length} 封邮件给 ${recipient}`);
    }
  };

  const handleSpam = () => {
    if (selectedEmails.length === 0) {
      alert('请先选择要标记为垃圾邮件的邮件');
      return;
    }
    const confirmed = window.confirm(`确定要将选中的 ${selectedEmails.length} 封邮件标记为垃圾邮件吗？`);
    if (confirmed) {
      alert(`已将 ${selectedEmails.length} 封邮件标记为垃圾邮件`);
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

  // 渲染邮件行组件
  const renderEmailRow = (email: Email) => (
    <div
      key={email.id}
      onClick={() => handleEmailClick(email.id)}
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
        <span className={`text-xs truncate block ${
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
              <button 
                onClick={handleStar}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Star className="w-3.5 h-3.5" />
                标记为
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleMove}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded transition-colors"
              >
                <Folder className="w-3.5 h-3.5" />
                移动到
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">共 105 封</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <button className="p-1 hover:bg-slate-100 rounded">
                <Square className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 邮件列表 */}
        <div className="flex-1 overflow-y-auto">
          {/* 今天 */}
          <div>
            <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100">
              <span className="text-[10px] font-medium text-slate-500">今天（1 封）</span>
            </div>
            {mockEmails.slice(0, 1).map(renderEmailRow)}
          </div>

          {/* 周二 */}
          <div>
            <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100">
              <span className="text-[10px] font-medium text-slate-500">周二（2 封）</span>
            </div>
            {mockEmails.slice(1, 3).map(renderEmailRow)}
          </div>

          {/* 周一 */}
          <div>
            <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100">
              <span className="text-[10px] font-medium text-slate-500">周一（3 封）</span>
            </div>
            {mockEmails.slice(3, 6).map(renderEmailRow)}
          </div>

          {/* 更早 */}
          <div>
            <div className="px-4 py-1.5 bg-slate-50 border-b border-slate-100">
              <span className="text-[10px] font-medium text-slate-500">更早（99 封）</span>
            </div>
            {earlierEmails.map(renderEmailRow)}
          </div>
        </div>

        {/* 分页 */}
        <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" disabled>
              上一页
            </button>
            <button className="px-2.5 py-1 text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              下一页
            </button>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-500">1/11</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 flex items-center justify-center text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                5
              </button>
              <button className="w-7 h-7 flex items-center justify-center text-xs bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors">
                10
              </button>
              <button className="w-7 h-7 flex items-center justify-center text-xs bg-blue-600 text-white rounded">
                11
              </button>
              <input
                type="text"
                className="w-10 h-7 px-1 text-xs text-center border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="跳转"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
