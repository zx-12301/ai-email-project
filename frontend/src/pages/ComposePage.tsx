import { useState } from 'react';
import { 
  X, Paperclip, Image, Smile, AtSign, Send, ChevronDown, 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  List, ListOrdered, Type, Highlighter, Link2, Minus,
  Sparkles, MessageSquare, Trash2, MoreVertical,
  Phone, Mail, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Contact {
  id: number;
  name: string;
  email: string;
  avatar?: string;
}

const mockContacts: Contact[] = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' },
  { id: 4, name: '赵六', email: 'zhaoliu@example.com' },
  { id: 5, name: '钱七', email: 'qianqi@example.com' },
];

const aiSuggestions = [
  {
    title: '会议邀请',
    content: '亲爱的团队成员，\n\n我们将于明早 8 点在会议室召开项目进度会议。会议将讨论以下议题：\n\n1. 项目当前进度汇报\n2. 技术难点及解决方案\n3. 下一阶段工作计划\n\n请各位提前准备好相关材料，准时参会。\n\n祝好，\n董欣',
  },
  {
    title: '项目汇报',
    content: '尊敬的项目组：\n\n现将本周项目进展情况汇报如下：\n\n一、已完成工作\n1. 前端页面开发完成 80%\n2. 后端接口开发完成 90%\n\n二、存在问题\n1. 部分接口性能需优化\n\n三、下周计划\n1. 完成剩余功能开发\n2. 开始系统测试\n\n汇报人：董欣',
  },
  {
    title: '合作邀请',
    content: '尊敬的合作伙伴：\n\n您好！\n\n我们是 XXX 公司，专注于 XXX 领域。了解到贵公司在 XXX 方面有丰富的经验，希望能与贵公司建立合作关系。\n\n我们提供：\n1. 技术支持\n2. 市场推广\n3. 售后服务\n\n期待与您的合作！\n\n此致\n敬礼',
  },
];

export default function ComposePage() {
  const navigate = useNavigate();
  const [showAI, setShowAI] = useState(true);
  const [to, setTo] = useState<Contact[]>([]);
  const [cc, setCc] = useState<string[]>([]);
  const [bcc, setBcc] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState<number | null>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [tone, setTone] = useState('formal');

  const handleAddContact = (contact: Contact) => {
    if (!to.find(c => c.id === contact.id)) {
      setTo([...to, contact]);
    }
  };

  const handleRemoveContact = (contactId: number) => {
    setTo(to.filter(c => c.id !== contactId));
  };

  const handleUseSuggestion = (index: number) => {
    setSelectedSuggestion(index);
    setSubject(aiSuggestions[index].title);
    setContent(aiSuggestions[index].content);
  };

  const handleAIGenerate = () => {
    // 模拟 AI 生成
    const generatedContent = `尊敬的先生/女士：

您好！

${aiPrompt || '这是一封由 AI 助手生成的邮件草稿。'}

感谢您的关注，期待您的回复。

此致
敬礼`;
    
    setContent(generatedContent);
  };

  return (
    <div className="h-full flex bg-slate-50">
      {/* 主写信区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <button className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors">
                  <Send className="w-4 h-4" />
                  发送
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              
              <button className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                存草稿
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                发信设置
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="h-6 w-px bg-slate-200 mx-2" />

              <button 
                onClick={() => setShowCc(!showCc)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <AtSign className="w-4 h-4" />
                抄送
              </button>
              
              <button 
                onClick={() => setShowBcc(!showBcc)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                密送
              </button>
            </div>
            
            <button 
              onClick={() => navigate('/inbox')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* 表单区 */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-6">
            <div className="bg-white rounded-lg border border-slate-200">
              {/* 收件人 */}
              <div className="flex items-start gap-3 p-4 border-b border-slate-200">
                <label className="text-sm text-slate-600 pt-2 w-16 flex-shrink-0">收件人：</label>
                <div className="flex-1">
                  {/* 已选联系人 */}
                  {to.length > 0 && (
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      {to.map((contact) => (
                        <div
                          key={contact.id}
                          className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center gap-2"
                        >
                          <span>{contact.name}</span>
                          <span className="text-xs opacity-75">&lt;{contact.email}&gt;</span>
                          <button
                            onClick={() => handleRemoveContact(contact.id)}
                            className="hover:bg-blue-100 rounded-full p-0.5"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 联系人选择器 */}
                  <div className="relative">
                    <div 
                      className="flex items-center gap-2 text-sm text-slate-500 cursor-text"
                      onClick={() => setShowContactPicker(!showContactPicker)}
                    >
                      <button className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-lg text-xs flex items-center gap-1.5 transition-colors">
                        <MessageSquare className="w-3.5 h-3.5" />
                        选择联系人
                      </button>
                      {to.length === 0 && (
                        <span className="text-xs">或输入邮箱地址</span>
                      )}
                    </div>

                    {/* 联系人选择弹窗 */}
                    {showContactPicker && (
                      <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                        <div className="p-3 border-b border-slate-200">
                          <input
                            type="text"
                            placeholder="搜索联系人..."
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="p-2">
                          {mockContacts.map((contact) => (
                            <div
                              key={contact.id}
                              onClick={() => {
                                handleAddContact(contact);
                                setShowContactPicker(false);
                              }}
                              className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-medium">
                                {contact.name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <div className="text-sm font-medium text-slate-900">{contact.name}</div>
                                <div className="text-xs text-slate-500">{contact.email}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 抄送 */}
                  {showCc && (
                    <div className="mt-2 flex items-center gap-3">
                      <label className="text-sm text-slate-600 w-16 flex-shrink-0">抄送：</label>
                      <input
                        type="text"
                        placeholder="请输入抄送人邮箱"
                        className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={cc.join(', ')}
                        onChange={(e) => setCc(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      />
                    </div>
                  )}

                  {/* 密送 */}
                  {showBcc && (
                    <div className="mt-2 flex items-center gap-3">
                      <label className="text-sm text-slate-600 w-16 flex-shrink-0">密送：</label>
                      <input
                        type="text"
                        placeholder="请输入密送人邮箱"
                        className="flex-1 px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={bcc.join(', ')}
                        onChange={(e) => setBcc(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* 主题 */}
              <div className="flex items-center gap-3 p-4 border-b border-slate-200">
                <label className="text-sm text-slate-600 w-16 flex-shrink-0">主　题：</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="请输入邮件主题..."
                  className="flex-1 px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0"
                />
              </div>

              {/* 工具栏 */}
              <div className="border-b border-slate-200 px-4 py-2 flex items-center gap-1 flex-wrap bg-slate-50">
                <button className="p-2 hover:bg-white rounded transition-colors" title="添加附件">
                  <Paperclip className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors" title="插入图片">
                  <Image className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors" title="插入链接">
                  <Link2 className="w-4 h-4 text-slate-600" />
                </button>
                
                <div className="w-px h-5 bg-slate-200 mx-2" />
                
                <select className="px-3 py-1.5 text-sm border border-slate-200 bg-white rounded hover:bg-slate-50 transition-colors">
                  <option>微软雅黑</option>
                  <option>宋体</option>
                  <option>黑体</option>
                  <option>楷体</option>
                </select>
                
                <select className="px-3 py-1.5 text-sm border border-slate-200 bg-white rounded hover:bg-slate-50 transition-colors">
                  <option>14px</option>
                  <option>12px</option>
                  <option>16px</option>
                  <option>18px</option>
                </select>
                
                <div className="w-px h-5 bg-slate-200 mx-2" />
                
                <button className="p-2 hover:bg-white rounded transition-colors" title="粗体">
                  <Bold className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors" title="斜体">
                  <Italic className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors" title="下划线">
                  <Underline className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors" title="背景色">
                  <Highlighter className="w-4 h-4 text-slate-600" />
                </button>
                
                <div className="w-px h-5 bg-slate-200 mx-2" />
                
                <button className="p-2 hover:bg-white rounded transition-colors" title="左对齐">
                  <AlignLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors" title="居中">
                  <AlignCenter className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors" title="右对齐">
                  <AlignRight className="w-4 h-4 text-slate-600" />
                </button>
                
                <div className="w-px h-5 bg-slate-200 mx-2" />
                
                <button className="p-2 hover:bg-white rounded transition-colors" title="无序列表">
                  <List className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors" title="有序列表">
                  <ListOrdered className="w-4 h-4 text-slate-600" />
                </button>
                
                <div className="w-px h-5 bg-slate-200 mx-2" />
                
                <button className="p-2 hover:bg-white rounded transition-colors" title="分割线">
                  <Minus className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors" title="表情">
                  <Smile className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* 内容编辑区 */}
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="请输入邮件内容..."
                  className="w-full min-h-[400px] p-4 border-0 focus:outline-none focus:ring-0 resize-none text-sm leading-relaxed"
                />
              </div>
            </div>

            {/* 发件人信息 */}
            <div className="mt-4 bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                  董
                </div>
                <div>
                  <div className="font-medium text-slate-900">董欣</div>
                  <div className="text-sm text-slate-500">dongx@Spt.com</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 底部操作栏 */}
        <div className="bg-white border-t border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <span>按 Ctrl+Enter 快速发送</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/inbox')}
                className="px-6 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                取消
              </button>
              <button 
                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
                发送
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 右侧 AI 助手面板 */}
      {showAI && (
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
          {/* AI 助手头部 */}
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-slate-900">AI 写作助手</span>
            </div>
            <button
              onClick={() => setShowAI(false)}
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* AI 输入区 */}
          <div className="p-4 border-b border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              告诉 AI 你想写什么
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="例如：写一封会议邀请邮件，明天下午 3 点，讨论项目进度..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              rows={3}
            />
            
            {/* 语气选择 */}
            <div className="mt-3">
              <label className="block text-xs text-slate-500 mb-1.5">语气：</label>
              <div className="flex items-center gap-2">
                {['formal', 'friendly', 'concise'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                      tone === t
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {t === 'formal' && '正式'}
                    {t === 'friendly' && '友好'}
                    {t === 'concise' && '简洁'}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAIGenerate}
              className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              AI 生成
            </button>
          </div>

          {/* AI 建议区 */}
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              邮件模板
            </h3>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedSuggestion === index
                      ? 'bg-purple-50 border-purple-200'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                  onClick={() => handleUseSuggestion(index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-900 mb-2">{suggestion.title}</div>
                      <p className="text-xs text-slate-600 line-clamp-3">{suggestion.content}</p>
                      <div className="mt-2">
                        <span className="text-xs text-purple-600 hover:underline">使用此模板</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI 助手底部 */}
          <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Sparkles className="w-3 h-3" />
              <span>AI 生成内容仅供参考，请仔细核对</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
