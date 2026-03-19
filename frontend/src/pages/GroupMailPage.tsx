import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../contexts/ToastContext';
import { mailApi } from '../api/mail';
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
  Users
} from 'lucide-react';

interface GroupEmail {
  id: number | string;
  groupName: string;
  subject: string;
  from: string;
  date: string;
  size: string;
  memberCount: number;
  hasAttachment?: boolean;
  isRead: boolean;
  isTest?: boolean;
}

// 群邮件数据（测试数据）
const groupEmails: GroupEmail[] = [
  {
    id: 1,
    groupName: '集团领导班子',
    from: '刘明君',
    subject: '关于召开 2024 年度工作总结会议的通知',
    date: '11 月 26 日',
    size: '28KB',
    hasAttachment: true,
    isRead: false,
    memberCount: 12,
    isTest: true
  },
  {
    id: 2,
    groupName: '中层干部',
    from: '胡总',
    subject: '各部门提交 2025 年工作计划的通知',
    date: '11 月 25 日',
    size: '15KB',
    hasAttachment: false,
    isRead: false,
    memberCount: 45,
    isTest: true
  },
  {
    id: 3,
    groupName: 'UN 集团项目组',
    from: '诸君明君',
    subject: 'UN 集团项目进度汇报 - 第 12 期',
    date: '11 月 24 日',
    size: '56KB',
    hasAttachment: true,
    isRead: true,
    memberCount: 18,
    isTest: true
  },
  {
    id: 4,
    groupName: '国际联盟项目组',
    from: '万杆',
    subject: '国际联盟项目用户需求确认书',
    date: '11 月 23 日',
    size: '32KB',
    hasAttachment: true,
    isRead: false,
    memberCount: 23,
    isTest: true
  },
];

export default function GroupMailPage() {
  const navigate = useNavigate();
  const { showToast, showConfirm } = useToast();
  const [selectedEmails, setSelectedEmails] = useState<(number | string)[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [groupEmailsList, setGroupEmailsList] = useState<GroupEmail[]>([]);
  const [loading, setLoading] = useState(false);

  // 加载群邮件
  useEffect(() => {
    loadGroupEmails();
  }, []);

  const loadGroupEmails = async () => {
    try {
      setLoading(true);
      // TODO: 实现群邮件 API 调用
      // 暂时使用测试数据
      setGroupEmailsList(groupEmails);
    } catch (error) {
      console.error('加载群邮件失败:', error);
      setGroupEmailsList(groupEmails);
    } finally {
      setLoading(false);
    }
  };

  // 获取选中的真实数据 ID
  const getRealEmailIds = () => {
    return selectedEmails.filter(id =>
      groupEmailsList.some(email => String(email.id) === String(id) && !email.isTest)
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
    navigate(`/mail/${emailId}`, { state: { from: '/group-mail' } });
  };

  const toggleSelect = (id: number | string) => {
    setSelectedEmails(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedEmails(groupEmailsList.map(e => e.id));
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
        await loadGroupEmails();
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
      await loadGroupEmails();
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
      await loadGroupEmails();
      showResultMessage(realIds.length, selectedEmails.length, '标记为已读');
      setSelectedEmails([]);
      setSelectAll(false);
    } catch (error) {
      showToast('标记失败：' + (error as any).message, 'error');
    }
  };

  // 空状态显示
  if (groupEmailsList.length === 0 && !loading) {
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
                <span className="text-blue-500 text-xs">👥</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm mt-4">暂无群邮件</p>
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
                <span className="text-sm font-medium text-slate-900">群邮件</span>
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
                共 {groupEmailsList.length} 封
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              <button className="p-1 hover:bg-slate-100 rounded">
                <Square className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 群邮件列表 */}
        <div className="flex-1 overflow-y-auto">
          <div>
            <div className="px-4 py-2 bg-slate-50">
              <span className="text-xs font-medium text-slate-500">更早（{groupEmailsList.length}封）</span>
            </div>
            {groupEmailsList.map((email) => (
              <div
                key={email.id}
                onClick={() => handleEmailClick(email.id, email.isTest)}
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

                {/* 群组图标 */}
                <div className="w-9 h-9 rounded bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm truncate block ${
                      email.isRead ? 'text-slate-600' : 'text-slate-900 font-medium'
                    }`}>
                      {email.groupName}
                    </span>
                    <span className="text-xs text-slate-500">({email.memberCount}人)</span>
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    来自：{email.from}
                  </div>
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
