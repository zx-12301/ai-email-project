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
  Search,
  User,
  Folder,
  RefreshCw
} from 'lucide-react';
import { mailApi } from '../api/mail';

interface Contact {
  id: number;
  name: string;
  email: string;
  isStarred: boolean;
}

interface Email {
  id: number;
  from: string;
  fromEmail?: string;
  subject: string;
  date: string;
  size: string;
  hasAttachment?: boolean;
  isRead: boolean;
  isStarred: boolean;
}

// 星标联系人数据
const starredContacts: Contact[] = [
  { id: 1, name: '人保财险', email: 'epolicy@picc.com.cn', isStarred: true },
  { id: 2, name: '墨刀', email: 'dm@mail.modao.cc', isStarred: true },
  { id: 3, name: '梦忻雨', email: 'demon@Spt.com', isStarred: true },
  { id: 4, name: '刘晓华', email: 'liuxh@Spt.com', isStarred: true },
  { id: 5, name: '诸葛明君', email: 'zhugemj@Spt.com', isStarred: true },
  { id: 6, name: '张军俊', email: 'zhangjj@Spt.com', isStarred: true },
  { id: 7, name: '华罗强', email: 'hualq@Spt.com', isStarred: true },
  { id: 8, name: '吴艳君', email: 'wuyj@Spt.com', isStarred: true },
  { id: 9, name: '董明君', email: 'dongmj@Spt.com', isStarred: true },
  { id: 10, name: '华罗忻', email: 'hualx@Spt.com', isStarred: true },
  { id: 11, name: '万伟', email: 'wangw@Spt.com', isStarred: true },
  { id: 12, name: '李绅', email: '109832@qq.com', isStarred: true },
  { id: 13, name: '刘海', email: 'liuhai@gmail.com', isStarred: true },
  { id: 14, name: '王总', email: 'wangjianmin@163.com', isStarred: true },
];

// 墨刀的邮件数据
const maodaoEmails: Email[] = [
  {
    id: 1,
    from: '墨刀',
    fromEmail: 'dm@mail.modao.cc',
    subject: '墨刀素材新增收益方式通知',
    date: '10 月 25 日',
    size: '13KB',
    hasAttachment: false,
    isRead: false,
    isStarred: true,
  },
  {
    id: 2,
    from: '墨刀',
    fromEmail: 'dm@mail.modao.cc',
    subject: '从「玩」到「玩转墨刀」，您需要了解这些',
    date: '10 月 18 日',
    size: '33KB',
    hasAttachment: false,
    isRead: false,
    isStarred: true,
  },
  {
    id: 3,
    from: '墨刀',
    fromEmail: 'dm@mail.modao.cc',
    subject: '【工单通知】工单已回复',
    date: '10 月 11 日',
    size: '8KB',
    hasAttachment: false,
    isRead: false,
    isStarred: true,
  },
  {
    id: 4,
    from: '墨刀',
    fromEmail: 'dm@mail.modao.cc',
    subject: '来自万兴科技：订单编号 # AP2024103122001474874536716876',
    date: '10 月 13 日',
    size: '26KB',
    hasAttachment: false,
    isRead: false,
    isStarred: true,
  },
  {
    id: 5,
    from: '墨刀',
    fromEmail: 'dm@mail.modao.cc',
    subject: '墨刀 618 折扣狂欢强势来袭！',
    date: '06 月 01 日',
    size: '35KB',
    hasAttachment: false,
    isRead: false,
    isStarred: true,
  },
  {
    id: 6,
    from: '墨刀',
    fromEmail: 'dm@mail.modao.cc',
    subject: '【墨刀】开工福利来袭，终身会员限时 699 元，联合会员限时 3 折起>>>',
    date: '02 月 11 日',
    size: '56KB',
    hasAttachment: false,
    isRead: false,
    isStarred: true,
  },
];

export default function ContactsMailPage() {
  const navigate = useNavigate();
  const [selectedEmails, setSelectedEmails] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact>(starredContacts[1]); // 默认选中墨刀
  const [searchQuery, setSearchQuery] = useState('');

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
      setSelectedEmails(maodaoEmails.map(e => e.id));
    } else {
      setSelectedEmails([]);
    }
  };

  // 过滤联系人
  const filteredContacts = starredContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                <span className="text-sm font-medium text-slate-900">星标联系人邮件</span>
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
                <ChevronDown className="w-4 h-4" />
                移动到
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">共 {maodaoEmails.length} 封</span>
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
              <span className="text-xs font-medium text-slate-500">更早（{maodaoEmails.length}封）</span>
            </div>
            {maodaoEmails.map((email) => (
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

                <div className="w-32 flex-shrink-0">
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
