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
    avatar: '星'
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
    avatar: '9'
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
    avatar: '三'
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
    avatar: 'D'
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
    avatar: '京'
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
    avatar: 'A'
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
  avatar: '1'
}));

export default function InboxPage() {
  const navigate = useNavigate();
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleEmailClick = (emailId: number) => {
    navigate(`/mail/detail/${emailId}`);
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

  return (
    <div className="h-full flex bg-white">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="border-b border-slate-200 p-4 bg-white">
          {/* 第一行：收件箱选择 + 操作按钮 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-900">收件箱</span>
                <button className="p-1 hover:bg-slate-100 rounded">
                  <List className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <Trash2 className="w-4 h-4" />
                删除
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <Forward className="w-4 h-4" />
                转发
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <Shield className="w-4 h-4" />
                垃圾邮件
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <CheckCircle className="w-4 h-4" />
                全部已读
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <Star className="w-4 h-4" />
                标记为
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 rounded transition-colors">
                <Folder className="w-4 h-4" />
                移动到
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">共 105 封</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
              <button className="p-1.5 hover:bg-slate-100 rounded">
                <Square className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 邮件列表 */}
        <div className="flex-1 overflow-y-auto">
          {/* 今天 */}
          <div className="border-b border-slate-100">
            <div className="px-4 py-2 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">今天（1 封）</span>
            </div>
            {mockEmails.slice(0, 1).map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={`px-4 py-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 ${
                  !email.isRead ? 'bg-blue-50/30' : ''
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
                
                <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-medium flex-shrink-0">
                  {email.avatar}
                </div>

                <div className="w-40 flex-shrink-0">
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
                  <Star className={`w-4 h-4 ${
                    email.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
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

                <div className="w-12 flex-shrink-0 text-right">
                  <span className="text-xs text-slate-400">{email.size}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 周二 */}
          <div className="border-b border-slate-100">
            <div className="px-4 py-2 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">周二（2 封）</span>
            </div>
            {mockEmails.slice(1, 3).map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={`px-4 py-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 ${
                  !email.isRead ? 'bg-blue-50/30' : ''
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
                
                <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-600 text-sm font-medium flex-shrink-0">
                  {email.avatar}
                </div>

                <div className="w-40 flex-shrink-0">
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
                  <Star className={`w-4 h-4 ${
                    email.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
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

                <div className="w-12 flex-shrink-0 text-right">
                  <span className="text-xs text-slate-400">{email.size}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 周一 */}
          <div className="border-b border-slate-100">
            <div className="px-4 py-2 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">周一（3 封）</span>
            </div>
            {mockEmails.slice(3, 6).map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={`px-4 py-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 ${
                  !email.isRead ? 'bg-blue-50/30' : ''
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
                
                <div className="w-8 h-8 rounded flex items-center justify-center text-slate-600 text-sm font-medium flex-shrink-0" style={{
                  backgroundColor: email.from === 'Dell Notifications' ? '#0077C815' : email.from === '京东 JD.com' ? '#E1251B15' : '#A1A1A115'
                }}>
                  {email.avatar}
                </div>

                <div className="w-40 flex-shrink-0">
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
                  <Star className={`w-4 h-4 ${
                    email.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
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

                <div className="w-12 flex-shrink-0 text-right">
                  <span className="text-xs text-slate-400">{email.size}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 更早 */}
          <div>
            <div className="px-4 py-2 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">更早（99 封）</span>
            </div>
            {earlierEmails.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email.id)}
                className={`px-4 py-3 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 ${
                  !email.isRead ? 'bg-blue-50/30' : ''
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
                
                <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-medium flex-shrink-0">
                  {email.avatar}
                </div>

                <div className="w-40 flex-shrink-0">
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
                  <Star className={`w-4 h-4 ${
                    email.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
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
