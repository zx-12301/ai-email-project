import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
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
  X,
  User,
  LogOut,
  Shield,
  Monitor,
} from 'lucide-react'
import AIAssistantPanel from './AIAssistantPanel'
import SearchBar from './SearchBar'
import NotificationPanel from './NotificationPanel'

export default function MailLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showFolderDropdown, setShowFolderDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [showNotification, setShowNotification] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const notificationRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFolderDropdown(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }

    if (showFolderDropdown || showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showFolderDropdown, showUserDropdown])

  // 根据当前路径判断哪个文件夹激活
  const getCurrentFolder = () => {
    const path = location.pathname
    if (path === '/inbox') return 'inbox'
    if (path.startsWith('/folder/')) return path
    if (path === '/starred') return '/starred'
    if (path === '/contacts-mail') return '/contacts-mail'
    if (path === '/group-mail') return '/group-mail'
    if (path === '/sent') return '/sent'
    if (path === '/drafts') return '/drafts'
    if (path === '/trash') return '/trash'
    if (path === '/spam') return '/spam'
    return 'inbox'
  }

  const currentFolder = getCurrentFolder()

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
        { path: '/folder/un', label: 'UN 集团项目' },
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

  // 获取当前选中的文件夹名称用于顶部显示
  const getCurrentFolderName = () => {
    // 应用区优先判断
    if (location.pathname === '/files') return '文件中心'
    if (location.pathname === '/attachments') return '邮箱附件'
    if (location.pathname === '/contacts') return '通讯录'
    if (location.pathname === '/invoice') return '发票助手'
    
    // 主导航
    if (currentFolder === '/folder/un') return 'UN 集团项目'
    if (currentFolder === '/folder/intl') return '国际联盟项目'
    if (currentFolder === 'inbox') return '收件箱'
    if (currentFolder === '/starred') return '星标邮件'
    if (currentFolder === '/contacts-mail') return '星标联系人邮件'
    if (currentFolder === '/group-mail') return '群邮件'
    if (currentFolder === '/sent') return '已发送'
    if (currentFolder === '/drafts') return '草稿箱'
    if (currentFolder === '/trash') return '已删除'
    if (currentFolder === '/spam') return '垃圾箱'
    return '收件箱'
  }

  // 切换文件夹
  const handleFolderChange = (path: string) => {
    navigate(path)
    setShowFolderDropdown(false)
  }

  // 获取当前路径对应的导航项
  const getCurrentNavItem = () => {
    return navItems.find(item => location.pathname === item.path)
  }

  return (
    <div className="h-screen flex bg-slate-50">
      {/* 左侧边栏 */}
      <aside className="w-[200px] bg-[#F6F6F6] border-r border-slate-200 flex flex-col">
        {/* Logo 区 */}
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

        {/* 写信按钮 - 放在 Logo 下方 */}
        <div className="p-2 border-b border-slate-200">
          <button
            onClick={handleCompose}
            className="w-full flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-xs font-medium transition-colors"
          >
            <Plus size={16} />
            写信
          </button>
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
              {group.items.map((folder) => {
                const isActive = currentFolder === folder.path
                return (
                  <Link
                    key={folder.path}
                    to={folder.path}
                    className={`flex items-center px-2.5 py-1.5 rounded mb-0.5 text-xs transition-colors ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-slate-700 hover:bg-slate-200/80'
                    }`}
                  >
                    <Folder size={14} className="mr-2" />
                    {folder.label}
                  </Link>
                )
              })}
            </div>
          ))}

          {/* 应用区 */}
          <div className="mt-3">
            <div className="px-2.5 py-1.5 text-[10px] font-medium text-slate-400">
              应用
            </div>
            {appItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded mb-0.5 text-xs transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-200/80'
                  }`}
                >
                  <Icon size={14} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </aside>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部栏 */}
        <header className="bg-white border-b border-slate-200">
          {/* 顶部导航 */}
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
              {/* 通知按钮 */}
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotification(!showNotification)}
                  className="p-1.5 hover:bg-slate-100 rounded-full relative"
                >
                  <Bell size={18} className="text-slate-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                
                {/* 通知面板 */}
                {showNotification && (
                  <div className="absolute right-0 top-full mt-2 z-50">
                    <NotificationPanel onClose={() => setShowNotification(false)} />
                  </div>
                )}
              </div>
              
              {/* 用户头像下拉菜单 */}
              <div className="relative" ref={userDropdownRef}>
                <button 
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 rounded-full cursor-pointer hover:bg-slate-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                    董
                  </div>
                  <span className="text-xs text-slate-700 font-medium">董欣 dongx@Spt.com</span>
                  <ChevronDown size={12} className="text-slate-400" />
                </button>

                {/* 用户信息气泡框 */}
                {showUserDropdown && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl z-10">
                    {/* 用户信息 */}
                    <div className="p-4 border-b border-slate-100 text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-medium mx-auto mb-2">
                        董
                      </div>
                      <h3 className="text-base font-medium text-slate-900">国际科技 - 董欣</h3>
                      <p className="text-sm text-slate-500 mt-1">dongx@Spt.com</p>
                    </div>

                    {/* 存储空间 */}
                    <div className="p-4 border-b border-slate-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-600">存储空间</span>
                        <button className="text-xs text-blue-600 hover:underline">查看详情</button>
                      </div>
                      <div className="mb-1">
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full w-[29%] bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">29G/100G (29%)</p>
                    </div>

                    {/* 功能快捷入口 */}
                    <div className="p-4 grid grid-cols-2 gap-3">
                      <button className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left">
                        <Monitor className="w-5 h-5 text-slate-600 mb-2" />
                        <div className="text-xs text-slate-500">登录情况</div>
                        <div className="text-xs text-slate-400 mt-1">2027.11.27 中国 北京</div>
                      </button>
                      <button className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left">
                        <Smartphone className="w-5 h-5 text-slate-600 mb-2" />
                        <div className="text-xs text-slate-500">手机号码邮箱</div>
                        <div className="text-xs text-slate-400 mt-1">199****0787@Spt.com</div>
                      </button>
                      <button className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left">
                        <HelpCircle className="w-5 h-5 text-slate-600 mb-2" />
                        <div className="text-xs text-slate-500">帮助中心</div>
                      </button>
                      <button className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors text-left">
                        <Shield className="w-5 h-5 text-slate-600 mb-2" />
                        <div className="text-xs text-slate-500">账号与安全</div>
                      </button>
                    </div>

                    {/* 退出登录 */}
                    <div className="p-3 border-t border-slate-100">
                      <button className="w-full text-center text-sm text-slate-600 hover:text-red-600 transition-colors">
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => setShowAIAssistant(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
              >
                <Sparkles size={14} className="text-blue-600" />
                <span className="text-xs text-blue-700 font-medium">AI 助理</span>
              </button>
            </div>
          </div>

          {/* 中间区域：搜索框 + 二级导航 + 文件夹选择 */}
          <div className="flex items-center gap-4 px-4 py-2.5 bg-slate-50 border-t border-slate-100">
            {/* 二级导航按钮 */}
            <div className="flex items-center gap-2">
              <Link
                to="/contacts"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  location.pathname === '/contacts'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Users size={13} />
                通讯录
              </Link>
              <Link
                to="/ai-tools"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md transition-colors ${
                  location.pathname === '/ai-tools'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
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

            {/* 当前文件夹选择 - 根据左侧菜单选中状态同步 */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowFolderDropdown(!showFolderDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                {getCurrentFolderName()}
                <ChevronDown size={14} />
              </button>

              {/* 文件夹下拉菜单 */}
              {showFolderDropdown && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
                  <div className="py-1">
                    {/* 主导航项 */}
                    {navItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleFolderChange(item.path)}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-100 transition-colors flex items-center gap-2 ${
                          currentFolder === item.path ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        <item.icon size={14} />
                        {item.label}
                      </button>
                    ))}
                    
                    <div className="border-t border-slate-100 my-1"></div>
                    
                    {/* 我的文件夹 */}
                    {folderGroups.map((group, groupIndex) => (
                      <div key={groupIndex}>
                        <div className="px-4 py-1.5 text-[10px] text-slate-400 font-medium">
                          {group.name}
                        </div>
                        {group.items.map((folder) => (
                          <button
                            key={folder.path}
                            onClick={() => handleFolderChange(folder.path)}
                            className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-100 transition-colors flex items-center gap-2 ${
                              currentFolder === folder.path ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                            }`}
                          >
                            <Folder size={14} />
                            {folder.label}
                          </button>
                        ))}
                      </div>
                    ))}
                    
                    <div className="border-t border-slate-100 my-1"></div>
                    
                    {/* 应用区 */}
                    <div className="px-4 py-1.5 text-[10px] text-slate-400 font-medium">
                      应用
                    </div>
                    {appItems.map((item) => (
                      <button
                        key={item.path}
                        onClick={() => handleFolderChange(item.path)}
                        className={`w-full text-left px-4 py-2 text-xs hover:bg-slate-100 transition-colors flex items-center gap-2 ${
                          location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-slate-700'
                        }`}
                      >
                        <item.icon size={14} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>

      {/* AI 助理面板 */}
      {showAIAssistant && (
        <AIAssistantPanel onClose={() => setShowAIAssistant(false)} />
      )}
    </div>
  )
}
