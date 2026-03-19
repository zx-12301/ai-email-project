import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Send,
  Eye,
  Save,
  Paperclip,
  FileText,
  Image,
  Link,
  Bold,
  Italic,
  Underline,
  ChevronDown,
  Search,
  Users,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { mailApi } from '../api/mail';
import { useToast } from '../contexts/ToastContext';
import { API_BASE_URL } from '../config/api';

interface OriginalMail {
  id: string;
  from: string;
  fromName: string;
  to: string[];
  subject: string;
  content: string;
  createdAt: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
}

export default function ReplyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { showToast } = useToast();

  const mailId = searchParams.get('mailId');
  const mode = searchParams.get('mode') || 'reply'; // reply, replyAll, forward

  // 获取来源页面（从邮件详情页传递过来）
  const fromPage = (location.state?.from as string) || null;

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [originalMail, setOriginalMail] = useState<OriginalMail | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);

  // 表单数据
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    content: '',
  });

  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // 加载原始邮件和联系人
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // 加载联系人
        const contactsData = await mailApi.getContacts();
        setContacts(contactsData || []);

        // 如果有邮件 ID，加载原始邮件
        if (mailId) {
          const mail = await mailApi.getMailById(mailId);
          setOriginalMail(mail);

          // 根据模式预填充表单
          if (mode === 'reply') {
            setFormData({
              to: mail.from || '',
              cc: '',
              bcc: '',
              subject: `回复：${mail.subject || ''}`,
              content: '',
            });
          } else if (mode === 'replyAll') {
            const allRecipients = [mail.from, ...(mail.to || [])].filter(Boolean).join(', ');
            setFormData({
              to: allRecipients,
              cc: '',
              bcc: '',
              subject: `回复：${mail.subject || ''}`,
              content: '',
            });
          } else if (mode === 'forward') {
            setFormData({
              to: '',
              cc: '',
              bcc: '',
              subject: `转发：${mail.subject || ''}`,
              content: formatForwardContent(mail),
            });
          }
        }
      } catch (error) {
        console.error('加载数据失败:', error);
        showToast('加载数据失败', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [mailId, mode]);

  // 格式化转发内容
  const formatForwardContent = (mail: OriginalMail): string => {
    const date = new Date(mail.createdAt).toLocaleString('zh-CN');
    return `
---------- 转发的邮件 ----------
发件人：${mail.fromName || mail.from} <${mail.from}>
日期：${date}
收件人：${(mail.to || []).join(', ')}
主题：${mail.subject}

${mail.content || ''}
`;
  };

  // 处理发送
  const handleSend = async () => {
    if (!formData.to) {
      showToast('请输入收件人', 'warning');
      return;
    }

    if (!formData.subject) {
      showToast('请输入邮件主题', 'warning');
      return;
    }

    setSending(true);
    try {
      await mailApi.sendMail({
        to: formData.to.split(',').map(e => e.trim()),
        cc: formData.cc ? formData.cc.split(',').map(e => e.trim()) : [],
        subject: formData.subject,
        content: formData.content,
        isDraft: false,
      });

      showToast('邮件发送成功！', 'success');
      // 如果有来源页面，返回到来源页面；否则返回上一页
      if (fromPage) {
        navigate(fromPage);
      } else {
        navigate(-1);
      }
    } catch (error: any) {
      showToast('发送失败：' + error.message, 'error');
    } finally {
      setSending(false);
    }
  };

  // 保存草稿
  const handleSaveDraft = async () => {
    setSending(true);
    try {
      await mailApi.sendMail({
        to: formData.to ? formData.to.split(',').map(e => e.trim()) : [],
        subject: formData.subject,
        content: formData.content,
        isDraft: true,
      });
      showToast('草稿已保存！', 'success');
    } catch (error: any) {
      showToast('保存失败：' + error.message, 'error');
    } finally {
      setSending(false);
    }
  };

  // AI 生成回复
  const handleAIGenerate = async () => {
    if (!aiPrompt) {
      showToast('请输入 AI 提示词', 'warning');
      return;
    }

    setAiGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/ai/generate-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          prompt: aiPrompt,
          tone: 'formal',
          context: originalMail ? `回复这封邮件：${originalMail.subject}` : undefined
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.content) {
          setFormData(prev => ({ ...prev, content: result.content }));
          showToast('AI 生成成功', 'success');
        }
      } else {
        showToast('AI 生成失败', 'error');
      }
    } catch (error) {
      showToast('AI 生成失败', 'error');
    } finally {
      setAiGenerating(false);
    }
  };

  // 格式化日期
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <div className="text-slate-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-white">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="border-b border-slate-200 px-4 py-3 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fromPage ? navigate(fromPage) : navigate(-1)}
              className="p-2 hover:bg-slate-100 rounded-md"
            >
              <ArrowLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={handleSend}
              disabled={sending}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white text-sm rounded-md font-medium transition-colors"
            >
              <Send className="w-4 h-4" />
              {sending ? '发送中...' : '发送'}
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={sending}
              className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
            >
              <Save className="w-4 h-4" />
              存草稿
            </button>
          </div>
        </div>

        {/* 表单区 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-5xl mx-auto">
            {/* 收件人 */}
            <div className="flex items-start gap-3 py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 w-20 flex-shrink-0">
                <span className="text-sm text-slate-600">收件人：</span>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  value={formData.to}
                  onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                  placeholder="请输入收件人邮箱"
                  className="w-full text-sm focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCC(!showCC)}
                  className="text-sm text-slate-600 hover:text-blue-600"
                >
                  抄送
                </button>
                <button
                  onClick={() => setShowBCC(!showBCC)}
                  className="text-sm text-slate-600 hover:text-blue-600"
                >
                  密送
                </button>
              </div>
            </div>

            {/* 抄送 */}
            {showCC && (
              <div className="flex items-start gap-3 py-3 border-b border-slate-100">
                <span className="text-sm text-slate-600 w-20">抄送：</span>
                <input
                  type="text"
                  value={formData.cc}
                  onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                  placeholder="请输入抄送人邮箱"
                  className="flex-1 text-sm focus:outline-none"
                />
              </div>
            )}

            {/* 密送 */}
            {showBCC && (
              <div className="flex items-start gap-3 py-3 border-b border-slate-100">
                <span className="text-sm text-slate-600 w-20">密送：</span>
                <input
                  type="text"
                  value={formData.bcc}
                  onChange={(e) => setFormData({ ...formData, bcc: e.target.value })}
                  placeholder="请输入密送人邮箱"
                  className="flex-1 text-sm focus:outline-none"
                />
              </div>
            )}

            {/* 主题 */}
            <div className="flex items-center gap-3 py-3 border-b border-slate-100">
              <span className="text-sm text-slate-600 w-20">主　题：</span>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="请输入邮件主题"
                className="flex-1 text-sm text-slate-900 font-medium focus:outline-none"
              />
            </div>

            {/* AI 写作面板 */}
            <div className="py-3 border-b border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span className="text-sm font-medium text-slate-700">AI 写作助手</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="描述您想写的内容，例如：礼貌地确认收到邮件并表示感谢"
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleAIGenerate}
                  disabled={aiGenerating}
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-300 text-white text-sm rounded-md transition-colors"
                >
                  {aiGenerating ? '生成中...' : '生成'}
                </button>
              </div>
            </div>

            {/* 编辑区 */}
            <div className="py-4">
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="输入正文"
                className="w-full min-h-[200px] text-sm focus:outline-none resize-none border border-slate-200 rounded-md p-3"
              />
            </div>

            {/* 原始邮件 */}
            {originalMail && mode !== 'forward' && (
              <div className="py-4 border-t border-slate-100">
                <div className="text-sm text-slate-500 mb-3">原始邮件：</div>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div>
                      <span className="text-slate-500">发件人：</span>
                      <span className="text-slate-900">{originalMail.fromName || originalMail.from} &lt;{originalMail.from}&gt;</span>
                    </div>
                    <div>
                      <span className="text-slate-500">发件时间：</span>
                      <span className="text-slate-900">{formatDate(originalMail.createdAt)}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">收件人：</span>
                      <span className="text-slate-900">{(originalMail.to || []).join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">主题：</span>
                      <span className="text-slate-900">{originalMail.subject}</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap border-t border-slate-200 pt-4">
                    {originalMail.content}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 右侧联系人列表 */}
      <div className="w-72 border-l border-slate-200 flex flex-col bg-white">
        {/* 搜索框 */}
        <div className="p-3 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索联系人"
              className="w-full pl-9 pr-3 py-2 bg-slate-100 border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
            />
          </div>
        </div>

        {/* 联系人列表 */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2">
              <ChevronDown className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">联系人</span>
            </div>
            <div className="space-y-1">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setFormData({ ...formData, to: contact.email })}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {(contact.name || contact.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-900 truncate">{contact.name || contact.email}</div>
                    <div className="text-xs text-slate-500 truncate">{contact.email}</div>
                  </div>
                </div>
              ))}
              {contacts.length === 0 && (
                <div className="text-xs text-slate-400 text-center py-4">暂无联系人</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}