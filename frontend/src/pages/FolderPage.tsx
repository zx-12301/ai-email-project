import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import {
  Star,
  Paperclip,
  Trash2,
  ChevronDown,
  MoreVertical,
  Forward,
  Shield,
  CheckCircle,
  Folder,
  List,
  Square,
  Mail
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
  isTest?: boolean;
}

// 国际联盟项目邮件数据
const intlProjectEmails: Email[] = [
  {
    id: 1,
    from: '刘明君，胡总，万总...',
    subject: '国际联盟项目用户使用培训计划',
    date: '10 月 26 日',
    size: '36KB',
    hasAttachment: true,
    isRead: false,
    isStarred: false,
    avatar: '刘',
    isTest: true
  },
  {
    id: 2,
    from: '刘明君，胡总，万总...',
    subject: '国际联盟项目方案确认书',
    date: '08 月 15 日',
    size: '88KB',
    hasAttachment: true,
    isRead: false,
    isStarred: false,
    avatar: '刘',
    isTest: true
  },
  {
    id: 3,
    from: '刘明君，胡总，万总...',
    subject: '国际联盟项目需求调研计划',
    date: '07 月 11 日',
    size: '19KB',
    hasAttachment: true,
    isRead: false,
    isStarred: false,
    avatar: '刘',
    isTest: true
  },
  {
    id: 4,
    from: '刘明君，胡总，万总...',
    subject: '国际联盟项目项目启动会',
    date: '06 月 30 日',
    size: '99KB',
    hasAttachment: true,
    isRead: false,
    isStarred: false,
    avatar: '刘',
    isTest: true
  },
];

// UN 集团项目邮件数据
const unProjectEmails: Email[] = [
  {
    id: 101,
    from: '诸君明君',
    subject: 'UN 集团项目自治公告通知书',
    date: '10 月 25 日',
    size: '19KB',
    hasAttachment: true,
    isRead: false,
    isStarred: false,
    avatar: '诸',
    isTest: true
  },
  {
    id: 102,
    from: '万杆，邓静',
    subject: 'UN 集团项目交流装饰',
    date: '10 月 21 日',
    size: '09KB',
    hasAttachment: true,
    isRead: false,
    isStarred: false,
    avatar: '万',
    isTest: true
  },
  {
    id: 103,
    from: '张三',
    subject: '项目进度汇报 - 请查阅',
    date: '10 月 20 日',
    size: '25KB',
    hasAttachment: true,
    isRead: true,
    isStarred: true,
    avatar: '张',
    isTest: true
  },
  {
    id: 104,
    from: '李四',
    subject: '会议邀请 - 下周产品评审会',
    date: '10 月 18 日',
    size: '05KB',
    hasAttachment: false,
    isRead: true,
    isStarred: false,
    avatar: '李',
    isTest: true
  },
];

export default function FolderPage() {
  const navigate = useNavigate();
  const { folderName } = useParams<{ folderName: string }>();
  const { showToast } = useToast();
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showFolderDropdown, setShowFolderDropdown] = useState(false);

  // 根据文件夹名称获取邮件数据
  const emails = folderName === 'intl' ? intlProjectEmails :
                 folderName === 'un' ? unProjectEmails : [];

  const folderTitle = folderName === 'intl' ? '国际联盟项目' :
                      folderName === 'un' ? 'UN 集团项目' : '文件夹';

  const handleEmailClick = (emailId: number, isTest?: boolean) => {
    if (isTest) {
      showToast('测试数据仅用于展示，无法查看详情', 'warning');
      return;
    }
    const fromPage = `/folder/${folderName}`;
    navigate(`/mail/${emailId}`, { state: { from: fromPage } });
  };

  const toggleSelect = (id: number) => {
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedEmails(emails.map(e => e.id));
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
          {/* 第一行：文件夹选择 + 操作按钮 */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* 文件夹下拉菜单 */}
              <div className="relative">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <button 
                    onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-900 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Folder className="w-4 h-4 text-blue-600" />
                    {folderTitle}
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-1 hover:bg-slate-100 rounded">
                    <List className="w-4 h-4 text-slate-600" />
                  </button>
                </div>

                {/* 文件夹下拉菜单 */}
                {showFolderDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-40 bg-white border border-slate-200 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <button
                        onClick={() => navigate('/folder/intl')}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-100 transition-colors ${
                          folderName === 'intl' ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        国际联盟项目
                      </button>
                      <button
                        onClick={() => navigate('/folder/un')}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-100 transition-colors ${
                          folderName === 'un' ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        UN 集团项目
                      </button>
                    </div>
                  </div>
                )}
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
              <span className="text-sm text-slate-600">共 {emails.length} 封</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
              <button className="p-1.5 hover:bg-slate-100 rounded">
                <Square className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 邮件列表 */}
        <div className="flex-1 overflow-y-auto">
          {/* 更早邮件 */}
          <div>
            <div className="px-4 py-2 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">更早（{emails.length}封）</span>
            </div>
            {emails.map((email) => (
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
