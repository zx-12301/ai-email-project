import { useState } from 'react';
import { X, MessageSquare, Send, Sparkles, FileText, Reply, BarChart3, Search } from 'lucide-react';

interface AIAssistantPanelProps {
  onClose: () => void;
}

type AIStep = 'welcome' | 'compose' | 'generating' | 'result';

export default function AIAssistantPanel({ onClose }: AIAssistantPanelProps) {
  const [step, setStep] = useState<AIStep>('welcome');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [result, setResult] = useState('');

  const quickActions = [
    { icon: '📧', text: '帮我写一封邀请演讲嘉宾的正式邮件', prompt: '邀请演讲嘉宾的正式邮件' },
    { icon: '⏰', text: '帮我写一封明早 9 点的会议邀请邮件', prompt: '明早 9 点的会议邀请邮件' },
    { icon: '📊', text: '帮我生成本周的周报', prompt: '本周的周报' },
    { icon: '🤝', text: '生成供应商合作邀约回复', prompt: '供应商合作邀约回复' },
    { icon: '📈', text: '生成一个最近一个月发件人邮件量最多的表格', prompt: '最近一个月发件人邮件量最多的表格' },
  ];

  const handleQuickAction = (prompt: string) => {
    setSubject(prompt);
    setStep('compose');
  };

  const handleGenerate = () => {
    setStep('generating');
    // 模拟 AI 生成
    setTimeout(() => {
      setResult(`亲爱的团队成员，

明早 9 点我们将在第一会议室召开项目进度会议，请各位准时参加。

会议议程：
1. 上周工作总结
2. 本周工作计划
3. 需要协调的问题

请提前准备好相关材料。

谢谢！`);
      setStep('result');
    }, 1500);
  };

  return (
    <div className="fixed right-0 top-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col">
      {/* 顶部标题栏 */}
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white text-sm font-medium">AI</span>
          </div>
          <h2 className="text-base font-medium text-slate-900">邮箱 AI 助理</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto p-4">
        {step === 'welcome' && (
          /* 欢迎界面 */
          <div className="space-y-4">
            {/* 问候语 */}
            <div className="text-center">
              <div className="relative inline-block mb-3">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto">
                  <span className="text-white text-2xl font-medium">AI</span>
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-white text-xs">Hi</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">邮箱 AI 助理</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                您好，我可以为您搜索、翻译、撰写邮件及处理相关事项，今天我可以为您做什么？
              </p>
            </div>

            {/* 快捷操作 */}
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-3"
                >
                  <span className="text-lg">{action.icon}</span>
                  <span className="text-sm text-slate-700">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'compose' && (
          /* 撰写邮件界面 */
          <div className="space-y-4">
            {/* 撰写邮件按钮 */}
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 text-sm rounded-lg hover:bg-blue-100 transition-colors">
                撰写邮件
              </button>
            </div>

            {/* 提示语 */}
            <div className="text-sm text-slate-600">
              您想写一封什么邮件，请告诉我吧。
            </div>

            {/* 邮件主题 */}
            <div className="space-y-2">
              <label className="text-sm text-slate-600">邮件主题</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="生成不限主题"
                className="w-full px-3 py-2 bg-slate-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 邮件内容 */}
            <div className="space-y-2">
              <label className="text-sm text-slate-600">邮件内容</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="请输入邮件关键词"
                rows={6}
                className="w-full px-3 py-2 bg-slate-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            {/* 快捷标签 */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setContent('明早 9 点会议邀请')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 rounded-lg transition-colors"
              >
                明早 9 点会议邀请
              </button>
              <button
                onClick={() => setContent('生成本周的周报')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 rounded-lg transition-colors"
              >
                生成本周的周报
              </button>
              <button
                onClick={() => setContent('演讲邀请函')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 rounded-lg transition-colors"
              >
                演讲邀请函
              </button>
            </div>

            {/* 开始生成按钮 */}
            <button
              onClick={handleGenerate}
              className="w-full px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-600 text-sm font-medium rounded-lg transition-colors"
            >
              开始生成
            </button>
          </div>
        )}

        {step === 'generating' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 text-sm rounded-lg">
                撰写邮件
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-600">邮件主题</label>
              <input
                type="text"
                value={subject}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border-0 rounded-lg text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-600">邮件内容</label>
              <textarea
                value={content}
                readOnly
                rows={6}
                className="w-full px-3 py-2 bg-slate-50 border-0 rounded-lg text-sm resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-slate-100 text-xs text-slate-700 rounded-lg">
                明早 9 点会议邀请
              </span>
              <span className="px-3 py-1.5 bg-slate-100 text-xs text-slate-700 rounded-lg">
                生成本周的周报
              </span>
              <span className="px-3 py-1.5 bg-slate-100 text-xs text-slate-700 rounded-lg">
                演讲邀请函
              </span>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full px-4 py-2.5 bg-blue-100 text-blue-600 text-sm font-medium rounded-lg"
            >
              开始生成
            </button>

            {/* 生成中动画 */}
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2 text-slate-500">
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span className="text-sm">AI 正在生成中...</span>
              </div>
            </div>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button className="px-4 py-2 bg-blue-50 text-blue-600 text-sm rounded-lg">
                撰写邮件
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-600">邮件主题</label>
              <input
                type="text"
                value={subject}
                readOnly
                className="w-full px-3 py-2 bg-slate-50 border-0 rounded-lg text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-600">邮件内容</label>
              <textarea
                value={content}
                readOnly
                rows={6}
                className="w-full px-3 py-2 bg-slate-50 border-0 rounded-lg text-sm resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-slate-100 text-xs text-slate-700 rounded-lg">
                明早 9 点会议邀请
              </span>
              <span className="px-3 py-1.5 bg-slate-100 text-xs text-slate-700 rounded-lg">
                生成本周的周报
              </span>
              <span className="px-3 py-1.5 bg-slate-100 text-xs text-slate-700 rounded-lg">
                演讲邀请函
              </span>
            </div>

            <button
              onClick={handleGenerate}
              className="w-full px-4 py-2.5 bg-blue-100 hover:bg-blue-200 text-blue-600 text-sm font-medium rounded-lg transition-colors"
            >
              开始生成
            </button>

            {/* 生成结果 */}
            <div className="pt-4 border-t border-slate-200">
              <div className="text-sm text-slate-600 mb-2">生成结果：</div>
              <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部功能栏 */}
      <div className="px-4 py-3 border-t border-slate-200">
        {/* 功能按钮 */}
        <div className="flex items-center gap-3 mb-3">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span>AI 搜索与回答</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <FileText className="w-3.5 h-3.5" />
            <span>撰写邮件</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <Reply className="w-3.5 h-3.5" />
            <span>回复邮件</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>总结邮件</span>
          </button>
        </div>

        {/* 输入框 */}
        <div className="relative">
          <input
            type="text"
            placeholder="搜索邮件、询问邮箱相关问题..."
            className="w-full px-4 py-2.5 pr-12 bg-slate-50 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-200 rounded-full transition-colors">
            <Send className="w-4 h-4 text-slate-600" />
          </button>
        </div>

        {/* 提示文字 */}
        <p className="text-center text-xs text-slate-400 mt-2">
          AI 生成仅供参考
        </p>
      </div>
    </div>
  );
}
