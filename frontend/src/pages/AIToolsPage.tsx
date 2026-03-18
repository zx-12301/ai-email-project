import { useState } from 'react';
import { Sparkles, Wand2, FileText, Reply, BarChart3, Languages, PenTool, Eraser, ChevronLeft, Star, Share2 } from 'lucide-react';

const aiTools = [
  {
    icon: Wand2,
    name: 'AI 写信',
    description: '输入关键词，AI 自动生成完整邮件',
    color: 'blue',
    action: '写信'
  },
  {
    icon: Reply,
    name: 'AI 回复',
    description: '智能分析邮件内容，生成得体回复',
    color: 'green',
    action: '回复'
  },
  {
    icon: FileText,
    name: '邮件总结',
    description: '快速提炼长邮件核心内容',
    color: 'purple',
    action: '总结'
  },
  {
    icon: BarChart3,
    name: '数据分析',
    description: '生成邮件往来统计报表',
    color: 'orange',
    action: '分析'
  },
  {
    icon: Languages,
    name: '智能翻译',
    description: '支持 50+ 语言实时翻译',
    color: 'pink',
    action: '翻译'
  },
  {
    icon: PenTool,
    name: '润色优化',
    description: '优化邮件措辞和语气',
    color: 'indigo',
    action: '润色'
  },
  {
    icon: Eraser,
    name: '语法检查',
    description: '自动检查并纠正语法错误',
    color: 'red',
    action: '检查'
  },
  {
    icon: Sparkles,
    name: '智能推荐',
    description: '根据上下文推荐最佳操作',
    color: 'yellow',
    action: '推荐'
  }
];

export default function AIToolsPage() {
  const [selectedTool, setSelectedTool] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState('');

  const handleToolClick = (index: number) => {
    setSelectedTool(index);
    setIsProcessing(true);
    setResult('');

    // 模拟 AI 处理
    setTimeout(() => {
      setIsProcessing(false);
      setResult(`这是${aiTools[index].name}的演示结果。在实际应用中，这里会显示 AI 生成的具体内容。`);
    }, 1500);
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      pink: 'from-pink-500 to-pink-600',
      indigo: 'from-indigo-500 to-indigo-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-base font-medium text-slate-900">AI 工具箱</h1>
          <div className="flex-1" />
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <Share2 className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <Star className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto">
          {/* 顶部介绍 */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">AI 智能工具箱</h1>
            <p className="text-slate-500">8 大 AI 功能，让邮件处理更高效</p>
          </div>

          {/* AI 工具网格 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {aiTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleToolClick(index)}
                  className={`bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all text-left ${
                    selectedTool === index ? 'ring-2 ring-purple-500' : ''
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getColorClasses(tool.color)} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1">{tool.name}</h3>
                  <p className="text-xs text-slate-500 mb-3">{tool.description}</p>
                  <span className="text-xs text-purple-600 font-medium">点击体验 →</span>
                </button>
              );
            })}
          </div>

          {/* 演示区域 */}
          {selectedTool !== null && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  {aiTools[selectedTool].name} - 演示
                </h2>
                <button
                  onClick={() => setSelectedTool(null)}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  关闭
                </button>
              </div>

              {isProcessing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3 animate-pulse" />
                    <p className="text-sm text-slate-600">AI 正在处理中...</p>
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-700">{result}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors">
                      使用结果
                    </button>
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                      重新生成
                    </button>
                    <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors">
                      复制
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* 使用指南 */}
          <div className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">AI 使用小贴士</h3>
            <ul className="text-sm text-purple-100 space-y-2">
              <li>• 描述越详细，AI 生成结果越准确</li>
              <li>• 可以指定邮件语气（正式/友好/简洁）</li>
              <li>• 支持多轮对话，持续优化结果</li>
              <li>• AI 生成内容仅供参考，请仔细核对</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
