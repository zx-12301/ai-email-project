import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Send,
  Eye,
  Save,
  Settings,
  Plus,
  Paperclip,
  FileText,
  Image,
  Link,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Type,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Indent,
  Outdent,
  Quote,
  Code,
  ChevronDown,
  Search,
  Users,
  Folder,
  X,
  MoreVertical,
  User,
  Phone,
  MessageSquare,
  Sparkles
} from 'lucide-react';

interface Contact {
  id: number;
  name: string;
  email: string;
  group?: string;
}

const recentContacts: Contact[] = [
  { id: 1, name: '梦忻雨', email: 'demon@Spt.com' },
  { id: 2, name: '刘晓华', email: 'liuxh@Spt.com' },
  { id: 3, name: '诸葛明君', email: 'zhugemj@Spt.com' },
  { id: 4, name: '张军俊', email: 'zhangjj@Spt.com' },
  { id: 5, name: '华罗强', email: 'hualq@Spt.com' },
  { id: 6, name: '吴艳君', email: 'wuyj@Spt.com' },
  { id: 7, name: '董明君', email: 'dongmj@Spt.com' },
  { id: 8, name: '华罗忻', email: 'hualx@Spt.com' },
  { id: 9, name: '万伟', email: 'wangw@Spt.com' },
  { id: 10, name: '李绅', email: '109832@qq.com' },
  { id: 11, name: '刘海', email: 'liuhai@gmail.com' },
  { id: 12, name: '王总', email: 'wangjianmin@163.com' },
];

const contactGroups = [
  { name: '集团领导班子', count: 12 },
  { name: '中层干部', count: 45 },
  { name: '运营班子成员', count: 8 },
  { name: '集团审计小组', count: 6 },
  { name: '国际联盟项目组', count: 23 },
];

export default function ReplyPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [showCC, setShowCC] = useState(false);
  const [showBCC, setShowBCC] = useState(false);
  const [showSignature, setShowSignature] = useState(true);

  return (
    <div className="h-full flex bg-white">
      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="border-b border-slate-200 px-4 py-3 bg-white">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-md font-medium transition-colors">
              <Send className="w-4 h-4" />
              发送
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
              <Eye className="w-4 h-4" />
              预览
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
              <Save className="w-4 h-4" />
              存草稿
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
              <Settings className="w-4 h-4" />
              发信设置
              <ChevronDown className="w-4 h-4" />
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
                <button className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <Plus className="w-3 h-3 text-white" />
                </button>
              </div>
              <div className="flex-1">
                <div className="text-sm text-slate-700">
                  <span className="text-slate-900 font-medium">星耀科技</span>
                  <span className="text-slate-500 ml-1">&lt;xykj@sunshine.com&gt;</span>
                </div>
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
                <button className="text-sm text-slate-600 hover:text-blue-600">
                  单独发送
                </button>
              </div>
            </div>

            {/* 抄送 */}
            {showCC && (
              <div className="flex items-start gap-3 py-3 border-b border-slate-100">
                <span className="text-sm text-slate-600 w-20">抄送：</span>
                <input
                  type="text"
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
                defaultValue="回复：协同办公软件推荐"
                className="flex-1 text-sm text-slate-900 font-medium focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600">已于</span>
                <button className="text-sm text-green-600 hover:underline">保存草稿</button>
              </div>
            </div>

            {/* 工具栏 */}
            <div className="py-3 border-b border-slate-100">
              {/* 第一行：附件、模板、签名 */}
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <button className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600">
                    <Paperclip className="w-4 h-4" />
                    <span>添加附件</span>
                    <span className="text-xs text-slate-400">（单个附件最大为 2G）</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
                <button className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600">
                  <FileText className="w-4 h-4" />
                  <span>邮件模板</span>
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded">
                  <Image className="w-4 h-4 text-blue-600" />
                </button>
                <div className="flex-1" />
                <button
                  onClick={() => setShowSignature(!showSignature)}
                  className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-blue-600"
                >
                  <span>签名</span>
                </button>
                <button className="p-1.5 hover:bg-slate-100 rounded">
                  <MoreVertical className="w-4 h-4 text-slate-600" />
                </button>
              </div>

              {/* 第二行：富文本工具栏 */}
              <div className="flex items-center gap-1 p-2 bg-slate-50 rounded-lg">
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Image className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Link className="w-4 h-4 text-slate-600" />
                </button>
                <div className="w-px h-5 bg-slate-200 mx-2" />
                <select className="px-3 py-1.5 text-sm border border-slate-200 bg-white rounded hover:bg-slate-50">
                  <option>默认字体</option>
                  <option>微软雅黑</option>
                  <option>宋体</option>
                  <option>黑体</option>
                </select>
                <select className="px-3 py-1.5 text-sm border border-slate-200 bg-white rounded hover:bg-slate-50">
                  <option>字号</option>
                  <option>12px</option>
                  <option>14px</option>
                  <option>16px</option>
                  <option>18px</option>
                </select>
                <div className="w-px h-5 bg-slate-200 mx-2" />
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Bold className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Italic className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Underline className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Strikethrough className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Type className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Highlighter className="w-4 h-4 text-slate-600" />
                </button>
                <div className="w-px h-5 bg-slate-200 mx-2" />
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <AlignLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <AlignCenter className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <AlignRight className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <AlignJustify className="w-4 h-4 text-slate-600" />
                </button>
                <div className="w-px h-5 bg-slate-200 mx-2" />
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <List className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <ListOrdered className="w-4 h-4 text-slate-600" />
                </button>
                <div className="w-px h-5 bg-slate-200 mx-2" />
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Indent className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Outdent className="w-4 h-4 text-slate-600" />
                </button>
                <div className="w-px h-5 bg-slate-200 mx-2" />
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Quote className="w-4 h-4 text-slate-600" />
                </button>
                <button className="p-2 hover:bg-white rounded transition-colors">
                  <Code className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* 编辑区 */}
            <div className="py-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="输入正文"
                className="w-full min-h-[200px] text-sm focus:outline-none resize-none"
              />
            </div>

            {/* 原始邮件 */}
            <div className="py-4 border-t border-slate-100">
              <div className="text-sm text-slate-500 mb-3">原始邮件：</div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="space-y-2 text-sm text-slate-600 mb-4">
                  <div>
                    <span className="text-slate-500">发件人：</span>
                    <span className="text-slate-900">星耀科技 &lt;xykj@sunshine.com&gt;</span>
                  </div>
                  <div>
                    <span className="text-slate-500">发件时间：</span>
                    <span className="text-slate-900">2027 年 11 月 07 日 10:59</span>
                  </div>
                  <div>
                    <span className="text-slate-500">收件人：</span>
                    <span className="text-slate-900">董欣 &lt;dongx@Spt.com&gt;</span>
                  </div>
                  <div>
                    <span className="text-slate-500">主题：</span>
                    <span className="text-slate-900">协同办公软件推荐</span>
                  </div>
                </div>

                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {`尊敬的董主任，

您好！

我是星耀科技的售前顾问刘军，很高兴通过这封邮件向您介绍我们最新的协同办公软件。

在当今快节奏的工作环境中，团队协作的效率直接影响到项目的成功与否。我们的协同办公软件正是为了解决这个问题而设计，旨在提升团队之间的沟通、协作与管理效率。

主要功能特点：
1. 实时协作编辑 - 支持多人同时在线编辑文档
2. 项目管理 - 完整的项目进度跟踪和任务分配
3. 即时通讯 - 内置企业级即时通讯工具
4. 文件共享 - 安全便捷的文件存储和共享
5. 日程管理 - 团队日程安排和会议管理

我们相信这款软件能够显著提升贵司的办公效率。如果您有兴趣了解更多详情，我很乐意安排一次产品演示。

期待您的回复！

此致
敬礼

刘军
星耀科技 售前顾问
电话：138-8888-8888
邮箱：liujun@xykj.com`}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-200 text-sm text-slate-500">
                  <div>发件人：董欣 dongx@Spt.com</div>
                </div>
              </div>
            </div>
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
          {/* 最近联系人 */}
          <div className="mb-4">
            <div className="flex items-center gap-1 mb-2 cursor-pointer">
              <ChevronDown className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">最近联系人</span>
            </div>
            <div className="space-y-1">
              {recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-900 truncate">{contact.name}</div>
                    <div className="text-xs text-slate-500 truncate">{contact.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 邮箱联系人 */}
          <div>
            <div className="flex items-center gap-1 mb-2 cursor-pointer">
              <ChevronDown className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-700">邮箱联系人</span>
            </div>
            <div className="space-y-1">
              {contactGroups.map((group, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer"
                >
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-700">{group.name}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                <Users className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-700">全部联系人</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
