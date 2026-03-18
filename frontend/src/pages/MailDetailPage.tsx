import { useState } from 'react';
import {
  ArrowLeft, Star, Trash2, Forward, MoreVertical, Mail,
  CheckCircle2, X, ChevronDown, Paperclip, Reply,
  Phone, Building, Send, Sparkles,
  ThumbsUp, MessageSquare, Download
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Email {
  id: number;
  from: string;
  fromEmail: string;
  fromPhone?: string;
  fromCompany?: string;
  to: string[];
  cc?: string[];
  subject: string;
  content: string;
  date: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  hasAttachment?: boolean;
  attachments?: Array<{
    name: string;
    size: string;
    type: string;
  }>;
  isPhishing?: boolean;
  phishingScore?: number;
}

const mockEmail: Email = {
  id: 1,
  from: '星辰科技',
  fromEmail: 'xykj@sunshine.com',
  fromPhone: '138****8888',
  fromCompany: '星辰科技有限公司',
  to: ['董欣 <dongx@Spt.com>'],
  subject: '产品功能咨询',
  content: `尊敬的星辰科技：

您好！

我们是华信创研集团，目前正在筹建企业 OA 系统。了解到贵司的 OA 产品在协同办公、流程管理方面有较好的口碑，因此特向您咨询以下几个相关问题，以便进一步评估：

1. 核心功能模块：请问贵司 OA 系统在公文管理、审批流程、日程协作等核心功能上有哪些特色设计？是否支持自定义流程设置？

2. 集成能力：能否与企业现有系统（如 ERP、CRM、企业微信/钉钉等）实现数据互通？是否提供开放 API 接口？

3. 移动办公支持：移动端 APP 或小程序是否具备完整核心功能？是否支持离线操作并同步数据？

4. 权限管理与数据安全：针对不同层级、岗位的权限如何定义？数据备份及恢复机制如何？

5. 定制化与服务：是否支持根据企业实际需求定制？后续技术支持、更新维护政策是怎样的？

若方便，感谢提供产品手册或详细功能演示，期待您的回复。

感谢您的时间与支持！

此致
敬礼

董欣（13888888888）
总裁办
华信创研集团`,
  date: '2026 年 11 月 07 日 10:59',
  status: 'delivered',
  hasAttachment: true,
  attachments: [
    { name: '产品介绍.pdf', size: '2.5MB', type: 'pdf' },
    { name: '功能清单.xlsx', size: '1.2MB', type: 'xlsx' },
  ],
};

// AI 回复建议
const aiSuggestions = [
  '感谢您的咨询，我们非常乐意为您介绍我们的产品。我们的 OA 系统在公文管理、审批流程等方面都有成熟解决方案，支持自定义流程设置。稍后我会安排产品经理与您详细沟通。',
  '您好！感谢关注我们的产品。我们支持与企业微信/钉钉等系统集成，提供完整的 API 接口。移动端 APP 功能完善，支持离线操作。具体方案我们可以安排演示。',
  '感谢您的详细询问！我们提供定制化服务，可根据企业需求灵活配置。权限管理支持多层级、多角色定义，数据备份采用多重机制保障安全。期待进一步合作。',
];

export default function MailDetailPage() {
  const navigate = useNavigate();
  const { mailId } = useParams<{ mailId: string }>();
  const [isReplying, setIsReplying] = useState(false);
  const [showContactCard, setShowContactCard] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [isStarred, setIsStarred] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // 根据邮件 ID 获取不同的邮件内容
  const getEmailById = (id: string): Email => {
    const emailId = parseInt(id, 10);

    if (emailId === 2) {
      return {
        ...mockEmail,
        id: 2,
        from: '95555',
        fromEmail: '95555@cmbchina.com',
        subject: '招商银行零售贷款电子对账单',
        content: '尊敬的客户：\n\n您尾号 8888 的账户本月贷款已发放，详情如下...\n\n招商银行',
        date: '2026 年 11 月 23 日 09:30',
        attachments: [{ name: '对账单.pdf', size: '1.8MB', type: 'pdf' }]
      };
    }
    if (emailId === 3) {
      return {
        ...mockEmail,
        id: 3,
        from: '三星电子',
        fromEmail: 'samsung@samsung.com',
        subject: '【三星 Galaxy】瞩目时刻，即将展开',
        content: '尊敬的三星会员：\n\n全新 Galaxy 系列即将发布，诚邀您参加线上发布会...\n\n三星电子',
        date: '2026 年 11 月 23 日 14:00'
      };
    }
    if (emailId === 4) {
      return {
        ...mockEmail,
        id: 4,
        from: 'Dell Notifications',
        fromEmail: 'notifications@dell.com',
        subject: 'XPS 13 9360 有新的更新',
        content: '尊敬的 Dell 用户：\n\n您的设备有新的驱动程序可用，请及时更新...\n\nDell 技术支持',
        date: '2026 年 11 月 22 日 16:45'
      };
    }

    return mockEmail;
  };

  const currentEmail = getEmailById(mailId || '1');

  const handleUseSuggestion = (index: number) => {
    setSelectedSuggestion(index);
    setReplyContent(aiSuggestions[index]);
    setIsReplying(true);
  };

  return (
    <div className="h-full flex bg-slate-50">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/inbox')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
                <span className="text-sm text-slate-600">返回</span>
              </button>
              
              <div className="h-6 w-px bg-slate-200 mx-2" />
              
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors">
                <Star className={`w-4 h-4 ${isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`} />
                <span className="text-sm text-slate-600">星标</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/reply')}
                className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors"
              >
                <Reply className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">回复</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors">
                <Forward className="w-4 h-4 text-slate-600" />
                <span className="text-sm text-slate-600">转发</span>
              </button>
              <button className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded transition-colors">
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
                  <h1 className="text-xl font-medium text-slate-900">{currentEmail.subject}</h1>
                  <button 
                    onClick={() => setIsStarred(!isStarred)}
                    className="p-2 hover:bg-slate-100 rounded transition-colors"
                  >
                    <Star className={`w-5 h-5 ${isStarred ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
                  </button>
                </div>
              </div>

              {/* 发件人信息 */}
              <div className="px-6 py-4 border-b border-slate-200">
                <div className="flex items-start gap-4">
                  {/* 发件人头像 */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-medium flex-shrink-0">
                    {currentEmail.from.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-medium text-slate-900 text-base">{currentEmail.from}</div>
                        <div className="text-sm text-slate-500">{currentEmail.fromEmail}</div>
                      </div>
                      <div className="text-sm text-slate-500">{currentEmail.date}</div>
                    </div>

                    <div className="text-sm text-slate-600 space-y-1">
                      <div>
                        <span className="text-slate-500">收件人：</span>
                        {currentEmail.to.join(', ')}
                      </div>
                    </div>

                    {/* 发送成功状态 */}
                    <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-xs border border-green-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>发送成功：检查成功</span>
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
                        {currentEmail.from.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{currentEmail.from}</div>
                        <div className="text-sm text-slate-500 mt-0.5">{currentEmail.fromEmail}</div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                          {currentEmail.fromPhone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{mockEmail.fromPhone}</span>
                            </div>
                          )}
                          {currentEmail.fromCompany && (
                            <div className="flex items-center gap-1">
                              <Building className="w-3.5 h-3.5" />
                              <span>{mockEmail.fromCompany}</span>
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
                    {currentEmail.content}
                  </div>
                </div>
              </div>

              {/* 附件列表 */}
              {currentEmail.hasAttachment && currentEmail.attachments && (
                <div className="mx-6 mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-3">
                    附件（{currentEmail.attachments.length}）
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentEmail.attachments.map((attachment, index) => (
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

              {/* 原始邮件信息 */}
              <div className="mx-6 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm">
                <div className="space-y-2 text-slate-600">
                  <div>
                    <span className="text-slate-500">发件人：</span>
                    {currentEmail.from} &lt;{currentEmail.fromEmail}&gt;
                  </div>
                  <div>
                    <span className="text-slate-500">发件时间：</span>
                    {currentEmail.date}
                  </div>
                  <div>
                    <span className="text-slate-500">收件人：</span>
                    董欣 &lt;dongx@Spt.com&gt;
                  </div>
                  <div>
                    <span className="text-slate-500">主题：</span>
                    协同办公软件推荐
                  </div>
                </div>
              </div>
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
                    onClick={() => navigate('/reply')}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    发送
                  </button>
                  <button 
                    onClick={() => navigate('/reply')}
                    className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors"
                  >
                    回复
                  </button>
                  <button className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-colors">
                    存草稿
                  </button>
                  <button className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-medium flex items-center gap-1 transition-colors">
                    发信设置
                    <ChevronDown className="w-4 h-4" />
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
                    <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors">
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
