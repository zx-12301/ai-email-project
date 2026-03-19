import { useState, useEffect } from 'react';
import {
  ArrowLeft, Star, Trash2, Forward, MoreVertical, Mail,
  CheckCircle2, X, ChevronDown, Paperclip, Reply,
  Phone, Building, Send, Sparkles,
  ThumbsUp, MessageSquare, Download
} from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { mailApi } from '../api/mail';
import { useToast } from '../contexts/ToastContext';

interface Email {
  id: string;
  from: string;
  fromName: string;
  fromEmail: string;
  fromPhone?: string;
  fromCompany?: string;
  to: string[];
  cc?: string[];
  subject: string;
  content: string;
  date: string;
  status: string;
  hasAttachment?: boolean;
  attachments?: Array<{
    name: string;
    size: string;
    type: string;
  }>;
  isStarred: boolean;
  isRead: boolean;
  folder: string;
}

// AI 回复建议
const aiSuggestions = [
  '感谢您的咨询，我们非常乐意为您介绍我们的产品。我们的 OA 系统在公文管理、审批流程等方面都有成熟解决方案，支持自定义流程设置。稍后我会安排产品经理与您详细沟通。',
  '您好！感谢关注我们的产品。我们支持与企业微信/钉钉等系统集成，提供完整的 API 接口。移动端 APP 功能完善，支持离线操作。具体方案我们可以安排演示。',
  '感谢您的详细询问！我们提供定制化服务，可根据企业需求灵活配置。权限管理支持多层级、多角色定义，数据备份采用多重机制保障安全。期待进一步合作。',
];

export default function MailDetailPage() {
  const navigate = useNavigate();
  const { mailId } = useParams<{ mailId: string }>();
  const { showToast, showConfirm } = useToast();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<Email | null>(null);
  const [isReplying, setIsReplying] = useState(false);
  const [showContactCard, setShowContactCard] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // 获取来源页面，默认为收件箱
  const fromPage = (location.state?.from as string) || '/inbox';

  // 返回按钮处理
  const handleGoBack = () => {
    navigate(fromPage);
  };

  // 加载邮件数据
  useEffect(() => {
    if (mailId) {
      loadEmail(mailId);
    }
  }, [mailId]);

  const loadEmail = async (id: string) => {
    try {
      setLoading(true);
      const data = await mailApi.getMailById(id);

      setEmail({
        id: data.id,
        from: data.from,
        fromName: data.fromName || data.from,
        fromEmail: data.from,
        fromPhone: data.fromPhone,
        fromCompany: data.fromCompany,
        to: data.to || [],
        cc: data.cc || [],
        subject: data.subject || '(无主题)',
        content: data.content || '',
        date: formatDate(data.createdAt),
        status: data.status || 'delivered',
        hasAttachment: data.attachments && data.attachments.length > 0,
        attachments: Array.isArray(data.attachments)
          ? data.attachments.map((att: string) => ({
              name: att.split('/').pop() || att,
              size: '未知',
              type: att.split('.').pop() || 'file'
            }))
          : [],
        isStarred: data.isStarred || false,
        isRead: data.isRead || false,
        folder: data.folder || 'inbox',
      });

      // 标记为已读
      if (!data.isRead) {
        try {
          await mailApi.markAsRead(id, true);
        } catch (e) {
          console.error('标记已读失败', e);
        }
      }
    } catch (error) {
      console.error('加载邮件详情失败:', error);
      showToast('加载邮件详情失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 切换星标
  const handleToggleStar = async () => {
    if (!email) return;

    try {
      await mailApi.toggleStar(email.id);
      setEmail({ ...email, isStarred: !email.isStarred });
      showToast(email.isStarred ? '已取消星标' : '已标记星标', 'success');
    } catch (error) {
      showToast('操作失败', 'error');
    }
  };

  // 删除邮件
  const handleDelete = async () => {
    if (!email) return;

    const confirmed = await showConfirm({
      title: '确认删除',
      message: '确定要删除这封邮件吗？删除后可在垃圾箱中找到。',
      confirmText: '删除',
      type: 'danger'
    });

    if (confirmed) {
      try {
        await mailApi.deleteMail(email.id);
        showToast('邮件已删除', 'success');
        navigate(fromPage);
      } catch (error) {
        showToast('删除失败', 'error');
      }
    }
  };

  // 使用 AI 建议
  const handleUseSuggestion = (index: number) => {
    setSelectedSuggestion(index);
    setReplyContent(aiSuggestions[index]);
    setIsReplying(true);
  };

  // 发送回复
  const handleSendReply = async () => {
    if (!email || !replyContent.trim()) {
      showToast('请输入回复内容', 'warning');
      return;
    }

    try {
      await mailApi.sendMail({
        to: [email.fromEmail],
        subject: `回复：${email.subject}`,
        content: replyContent,
      });
      showToast('回复发送成功', 'success');
      setIsReplying(false);
      setReplyContent('');
      setSelectedSuggestion(null);
    } catch (error) {
      showToast('发送失败', 'error');
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  if (!email) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">邮件不存在</div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-slate-50">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleGoBack}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
                <span className="text-sm text-slate-600">返回</span>
              </button>

              <div className="h-6 w-px bg-slate-200 mx-2" />

              <button
                onClick={handleToggleStar}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors"
              >
                <Star className={`w-4 h-4 ${email.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                <span className="text-sm text-slate-600">星标</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate(`/reply?mailId=${mailId}&mode=reply`, { state: { from: fromPage } })}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors"
              >
                <Reply className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">回复</span>
              </button>
              <button
                onClick={() => navigate(`/reply?mailId=${mailId}&mode=forward`, { state: { from: fromPage } })}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors"
              >
                <Forward className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">转发</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">删除</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors">
                <MoreVertical className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* 邮件内容区 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6">
            {/* 邮件主体卡片 */}
            <div className="bg-white rounded-lg border border-slate-200 mb-4">
              {/* 邮件主题 */}
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h1 className="text-xl font-medium text-slate-900">{email.subject}</h1>
                  <button
                    onClick={handleToggleStar}
                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Star className={`w-5 h-5 ${email.isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>

              {/* 发件人信息 */}
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  {/* 发件人头像 */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-medium flex-shrink-0">
                    {email.fromName.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-slate-900 text-base">{email.fromName}</div>
                        <div className="text-sm text-slate-500">{email.fromEmail}</div>
                      </div>
                      <div className="text-sm text-slate-500">{email.date}</div>
                    </div>

                    <div className="text-sm text-slate-600 space-y-1">
                      <div>
                        <span className="text-slate-500">收件人：</span>
                        {email.to.join(', ')}
                      </div>
                      {email.cc && email.cc.length > 0 && (
                        <div>
                          <span className="text-slate-500">抄送：</span>
                          {email.cc.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* 发送状态 */}
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>已送达</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 联系人卡片 */}
              {showContactCard && (
                <div className="mx-6 my-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                        {email.fromName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{email.fromName}</div>
                        <div className="text-sm text-slate-500 mt-0.5">{email.fromEmail}</div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          {email.fromPhone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{email.fromPhone}</span>
                            </div>
                          )}
                          {email.fromCompany && (
                            <div className="flex items-center gap-1">
                              <Building className="w-3.5 h-3.5" />
                              <span>{email.fromCompany}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowContactCard(false)}
                      className="p-1.5 hover:bg-slate-200 rounded transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              )}

              {/* 邮件正文 */}
              <div className="px-6 py-4">
                <div className="prose prose-slate max-w-none">
                  <div className="whitespace-pre-wrap text-slate-700 leading-relaxed text-sm">
                    {email.content}
                  </div>
                </div>
              </div>

              {/* 附件列表 */}
              {email.hasAttachment && email.attachments && email.attachments.length > 0 && (
                <div className="mx-6 mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-3">
                    附件（{email.attachments.length}）
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {email.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 rounded bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <Paperclip className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-slate-900 truncate">{attachment.name}</div>
                          <div className="text-xs text-slate-500">{attachment.size}</div>
                        </div>
                        <button className="p-2 hover:bg-white rounded transition-colors">
                          <Download className="w-4 h-4 text-slate-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI 回复建议 */}
            <div className="bg-white rounded-lg border border-slate-200 mb-4">
              <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-slate-900">AI 智能回复建议</span>
                </div>
                <button
                  onClick={() => setShowAIPanel(!showAIPanel)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {showAIPanel ? '收起' : '展开'}
                </button>
              </div>

              {showAIPanel && (
                <div className="p-4 space-y-3">
                  {aiSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedSuggestion === index
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                      onClick={() => handleUseSuggestion(index)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <p className="text-sm text-slate-700 leading-relaxed">{suggestion}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-slate-500">建议 {index + 1}</span>
                            <button className="text-xs text-blue-600 hover:underline">使用此回复</button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-white rounded transition-colors">
                            <ThumbsUp className="w-4 h-4 text-slate-400" />
                          </button>
                          <button className="p-1.5 hover:bg-white rounded transition-colors">
                            <MessageSquare className="w-4 h-4 text-slate-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 回复编辑器 */}
            {!isReplying ? (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(`/reply?mailId=${mailId}&mode=reply`)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    发送
                  </button>
                  <button
                    onClick={() => navigate(`/reply?mailId=${mailId}&mode=reply`)}
                    className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                  >
                    回复
                  </button>
                  <button className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors">
                    存草稿
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">回复内容：</label>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="请输入回复内容..."
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm min-h-[200px] resize-y"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSendReply}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      发送
                    </button>
                    <button
                      onClick={() => {
                        setIsReplying(false);
                        setReplyContent('');
                        setSelectedSuggestion(null);
                      }}
                      className="px-6 py-2.5 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                    >
                      取消
                    </button>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    AI 润色
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}