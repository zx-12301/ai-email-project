import { useState } from 'react';
import { HelpCircle, Search, ChevronRight, MessageSquare, Phone, Mail } from 'lucide-react';

const faqCategories = [
  {
    name: '账号安全',
    questions: [
      '如何修改登录密码？',
      '如何绑定手机号码？',
      '如何设置二次验证？',
      '忘记密码怎么办？',
      '账号被盗如何处理？'
    ]
  },
  {
    name: '邮件收发',
    questions: [
      '如何发送邮件？',
      '如何添加附件？',
      '如何设置邮件签名？',
      '如何设置自动回复？',
      '如何过滤垃圾邮件？'
    ]
  },
  {
    name: '文件夹管理',
    questions: [
      '如何创建新文件夹？',
      '如何移动邮件到文件夹？',
      '如何删除文件夹？',
      '文件夹容量限制是多少？'
    ]
  },
  {
    name: '联系人管理',
    questions: [
      '如何添加联系人？',
      '如何导入联系人？',
      '如何创建联系人分组？',
      '如何合并重复联系人？'
    ]
  },
  {
    name: 'AI 功能',
    questions: [
      '如何使用 AI 写信？',
      'AI 回复准确吗？',
      '如何训练 AI 助手？',
      'AI 功能收费吗？'
    ]
  }
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const handleQuestionClick = (question: string) => {
    setSelectedQuestion(selectedQuestion === question ? null : question);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* 顶部搜索区 */}
      <div className="bg-gradient-to-b from-blue-600 to-blue-700 px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">帮助中心</h1>
            <p className="text-blue-100 text-sm">有什么问题可以帮您？</p>
          </div>

          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索帮助文档、常见问题..."
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          {/* 快捷入口 */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <MessageSquare className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <span className="text-sm text-slate-700">在线咨询</span>
            </button>
            <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <Phone className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <span className="text-sm text-slate-700">电话咨询</span>
            </button>
            <button className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow text-center">
              <Mail className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <span className="text-sm text-slate-700">邮件支持</span>
            </button>
          </div>

          {/* 常见问题分类 */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">常见问题</h2>
            </div>

            <div className="divide-y divide-slate-100">
              {faqCategories.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <button
                    onClick={() => setExpandedCategory(expandedCategory === categoryIndex ? null : categoryIndex)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-900">{category.name}</span>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${
                      expandedCategory === categoryIndex ? 'rotate-90' : ''
                    }`} />
                  </button>

                  {expandedCategory === categoryIndex && (
                    <div className="px-4 pb-3 pt-1">
                      {category.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="mb-2 last:mb-0">
                          <button
                            onClick={() => handleQuestionClick(question)}
                            className="w-full text-left py-2 px-3 text-sm text-slate-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            {question}
                          </button>
                          {selectedQuestion === question && (
                            <div className="mt-2 p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed">
                              <p>这是关于"{question}"的详细解答内容。在实际应用中，这里会显示完整的帮助文档内容，包括步骤说明、截图示例、注意事项等。</p>
                              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                                <span>有帮助</span>
                                <button className="text-blue-600 hover:underline">是</button>
                                <button className="text-blue-600 hover:underline">否</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 联系客服 */}
          <div className="mt-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">需要更多帮助？</h3>
            <p className="text-blue-100 text-sm mb-4">我们的客服团队随时为您服务</p>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-white text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
                联系客服
              </button>
              <button className="px-4 py-2 bg-blue-700 text-white text-sm font-medium rounded-lg hover:bg-blue-800 transition-colors">
                提交工单
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
