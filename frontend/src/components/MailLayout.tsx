import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Inbox,
  Send,
  FileText,
  Trash2,
  Users,
  Folder,
  Plus,
  Search,
  Star,
  MessageSquare,
  Archive,
  Paperclip,
  Sparkles,
  ChevronDown,
  Settings,
  Smartphone,
  MonitorDown,
  HelpCircle,
  Bell,
} from 'lucide-react'

export default function MailLayout() {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/inbox', icon: Inbox, label: '收件箱', count: 5 },
    { path: '/starred', icon: Star, label: '星标邮件' },
    { path: '/contacts-mail', icon: Users, label: '星标联系人邮件' },
    { path: '/group-mail', icon: MessageSquare, label: '群邮件' },
    { path: '/sent', icon: Send, label: '已发送' },
    { path: '/drafts', icon: FileText, label: '草稿箱' },
    { path: '/trash', icon: Trash2, label: '已删除' },
    { path: '/spam', icon: Archive, label: '垃圾箱' },
  ]

  const folderGroups = [
    {
      name: '我的文件夹',
      items: [
        { path: '/folder/intl', label: '国际联盟项目' },
        { path: '/folder/un', label: 'UN 集团项目', active: true },
      ],
    },
  ]

  const appItems = [
    { path: '/files', icon: Folder, label: '文件中心' },
    { path: '/attachments', icon: Paperclip, label: '邮箱附件' },
    { path: '/contacts', icon: Users, label: '通讯录' },
    { path: '/invoice', icon: Sparkles, label: '发票助手' },
  ]

  const handleCompose = () => {
    navigate('/compose')
  }

  return (
    <div className="h-screen flex bg-slate-50">
      {/* 左侧边栏 - 优化宽度为 200px */}
      <aside className="w-[200px] bg-[#F6F6F6] border-r border-slate-200 flex flex-col">
        {/* Logo 区 - 更紧凑 */}
        <div className="px-3 py-2.5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 px-2.5 py-1 rounded text-white font-bold text-xs">
              速信达
            </div>
            <div className="text-[10px] text-slate-500 leading-tight">
              <div className="font-medium">企业邮箱</div>
              <div className="text-slate-400">mail.Spt.com</div>
            </div>
          </div>
        </div>

        {/* 导航菜单 */}
        <nav className="flex-1 overflow-y-auto p-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded mb-0.5 transition-colors ${
                  isActive
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon size={15} />
                  <span className="text-xs">{item.label}</span>
                </div>
                {item.count && (
                  <span className="text-[10px] text-slate-500">({item.count})</span>
                )}
              </Link>
            )
          })}

          {/* 文件夹分组 */}
          {folderGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mt-3">
              <div className="flex items-center justify-between px-2.5 py-1.5 text-[10px] font-medium text-slate-400">
                <span>{group.name}</span>
              </div>
              {group.items.map((folder) => (
                <Link
                  key={folder.path}
                  to={folder.path}
                  className={`flex items-center px-2.5 py-1.5 rounded mb-0.5 text-xs transition-colors ${
                    folder.active
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <Folder size={14} className="mr-2" />
                  {folder.label}
                </Link>
              ))}
            </div>
          ))}

          {/* 应用区 */}
          <div className="mt-3">
            <div className="px-2.5 py-1.5 text-[10px] font-medium text-slate-400">
              应用
            </div>
            {appItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded mb-0.5 text-xs text-slate-700 hover:bg-slate-200/80 transition-colors"
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        {/* 写信按钮 - 固定在底部 */}
        <div className="p-2 border-t border-slate-200">
          <button
            onClick={handleCompose}
            className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors"
          >
            <Plus size={16} />
            写信
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 - 白色背景 */}
        <header className="bg-white border-b border-slate-200">
          {/* 顶部导航 - 标签式 */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-1.5">
              <Link
                to="/settings"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                <Settings size={14} />
                设置
              </Link>
              <Link
                to="/mobile"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                <Smartphone size={14} />
                手机 APP
              </Link>
              <Link
                to="/download"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                <MonitorDown size={14} />
                下载桌面端
              </Link>
              <Link
                to="/help"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded transition-colors"
              >
                <HelpCircle size={14} />
                自助查询
              </Link>
            </div>

            {/* 用户信息和通知 */}
            <div className="flex items-center gap-3">
              <button className="p-1.5 hover:bg-slate-100 rounded-full relative">
                <Bell size={18} className="text-slate-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                  董
                </div>
                <span className="text-xs text-slate-700 font-medium">董欣 dongx@Spt.com</span>
                <ChevronDown size={12} className="text-slate-400" />
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 rounded-full">
                <Sparkles size={14} className="text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">AI 助理</span>
              </div>
            </div>
          </div>

          {/* 中间区域：搜索框 + 二级导航 */}
          <div className="flex items-center gap-4 px-4 py-2.5 bg-slate-50 border-t border-slate-100">
            {/* 二级导航按钮 */}
            <div className="flex items-center gap-2">
              <Link
                to="/contacts"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors text-slate-700"
              >
                <Users size={13} />
                通讯录
              </Link>
              <Link
                to="/ai-tools"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors text-slate-700"
              >
                <Sparkles size={13} />
                AI 工具箱
              </Link>
            </div>

            {/* 搜索框 */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  placeholder="支持邮件全文检索"
                  className="w-full pl-9 pr-16 py-1.5 bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-xs"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] rounded transition-colors">
                  AI 搜
                </button>
              </div>
            </div>

            {/* 当前文件夹选择 */}
            <div className="flex items-center gap-1.5">
              <button className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
                UN 集团项目
              </button>
              <button className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
