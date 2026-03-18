import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Send, Paperclip, Image as ImageIcon, Smile, AtSign,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link2, Minus, X, Sparkles
} from 'lucide-react'
import { authApi, mailApi } from '../api'

interface Contact {
  id: number
  name: string
  email: string
}

export default function ComposePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  
  // 表单数据
  const [formData, setFormData] = useState({
    to: '',
    cc: '',
    bcc: '',
    subject: '',
    content: '',
  })
  
  // UI 状态
  const [showCC, setShowCC] = useState(false)
  const [showBCC, setShowBCC] = useState(false)
  const [showContactPicker, setShowContactPicker] = useState(false)
  const [showAIPanel, setShowAIPanel] = useState(false)
  const [contacts, setContacts] = useState<Contact[]>([])
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)

  // 获取当前用户信息
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    const initPage = async () => {
      try {
        const user = await authApi.getCurrentUser()
        setCurrentUser(user)
        
        // 检查是否有草稿 ID
        const params = new URLSearchParams(location.search)
        const draftId = params.get('draft')
        if (draftId) {
          // TODO: 加载草稿
        }
      } catch (error) {
        console.error('初始化失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    initPage()
  }, [location])

  // 处理发送
  const handleSend = async () => {
    if (!formData.to) {
      alert('请输入收件人')
      return
    }
    
    if (!formData.subject) {
      alert('请输入邮件主题')
      return
    }
    
    setSending(true)
    try {
      await mailApi.sendMail({
        to: formData.to.split(',').map(e => e.trim()),
        cc: formData.cc ? formData.cc.split(',').map(e => e.trim()) : [],
        subject: formData.subject,
        content: formData.content,
        isDraft: false,
      })
      alert('邮件发送成功！')
      navigate('/inbox')
    } catch (error: any) {
      alert('发送失败：' + error.message)
    } finally {
      setSending(false)
    }
  }

  // 保存草稿
  const handleSaveDraft = async () => {
    setSending(true)
    try {
      await mailApi.sendMail({
        to: formData.to ? formData.to.split(',').map(e => e.trim()) : [],
        subject: formData.subject,
        content: formData.content,
        isDraft: true,
      })
      alert('草稿已保存！')
    } catch (error: any) {
      alert('保存失败：' + error.message)
    } finally {
      setSending(false)
    }
  }

  // AI 生成邮件
  const handleAIGenerate = async () => {
    if (!aiPrompt) {
      alert('请输入 AI 提示词')
      return
    }
    
    setAiGenerating(true)
    try {
      // TODO: 调用 AI API
      const generatedContent = `尊敬的先生/女士：

您好！

${aiPrompt}

感谢您的关注，期待您的回复。

此致
敬礼`
      
      setFormData({ ...formData, content: generatedContent })
      setShowAIPanel(false)
      setAiPrompt('')
    } catch (error: any) {
      alert('AI 生成失败：' + error.message)
    } finally {
      setAiGenerating(false)
    }
  }

  // 工具栏按钮
  const ToolbarButton = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <button
      type="button"
      title={title}
      className="p-2 hover:bg-slate-100 rounded transition-colors"
    >
      <Icon className="w-4 h-4 text-slate-600" />
    </button>
  )

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-slate-50">
      {/* 写信区域 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="bg-white border-b border-slate-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleSend}
                disabled={sending}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? '发送中...' : '发送'}
              </button>
              
              <button
                onClick={handleSaveDraft}
                disabled={sending}
                className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 disabled:bg-slate-100 text-slate-700 font-medium rounded-lg transition-colors"
              >
                存草稿
              </button>
            </div>
            
            <button
              onClick={() => navigate('/inbox')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* 表单区域 */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-5xl mx-auto p-6 space-y-4">
            {/* 收件人 */}
            <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
              <label className="text-sm text-slate-600 pt-2 w-16 flex-shrink-0">收件人：</label>
              <div className="flex-1 relative">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="请输入收件人邮箱，多个邮箱用逗号分隔"
                    className="flex-1 px-3 py-2 text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => setShowContactPicker(!showContactPicker)}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                  >
                    <AtSign className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                
                {/* 联系人选择器 */}
                {showContactPicker && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    <div className="p-3 border-b border-slate-200">
                      <input
                        type="text"
                        placeholder="搜索联系人..."
                        className="w-full px-3 py-2 text-sm bg-slate-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="p-2">
                      {contacts.map((contact) => (
                        <div
                          key={contact.id}
                          onClick={() => {
                            setFormData({ ...formData, to: formData.to ? `${formData.to}, ${contact.email}` : contact.email })
                            setShowContactPicker(false)
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer"
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
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
              
              <div className="flex items-center gap-2">
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
              <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
                <label className="text-sm text-slate-600 pt-2 w-16 flex-shrink-0">抄送：</label>
                <input
                  type="text"
                  value={formData.cc}
                  onChange={(e) => setFormData({ ...formData, cc: e.target.value })}
                  placeholder="请输入抄送人邮箱"
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            )}

            {/* 密送 */}
            {showBCC && (
              <div className="flex items-start gap-3 border-b border-slate-200 pb-4">
                <label className="text-sm text-slate-600 pt-2 w-16 flex-shrink-0">密送：</label>
                <input
                  type="text"
                  value={formData.bcc}
                  onChange={(e) => setFormData({ ...formData, bcc: e.target.value })}
                  placeholder="请输入密送人邮箱"
                  className="flex-1 px-3 py-2 text-sm focus:outline-none"
                />
              </div>
            )}

            {/* 主题 */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              <label className="text-sm text-slate-600 w-16 flex-shrink-0">主　题：</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="请输入邮件主题"
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
              />
            </div>

            {/* 工具栏 */}
            <div className="flex items-center gap-1 flex-wrap border-b border-slate-200 pb-2">
              <ToolbarButton icon={Bold} title="粗体" />
              <ToolbarButton icon={Italic} title="斜体" />
              <ToolbarButton icon={Underline} title="下划线" />
              
              <div className="w-px h-6 bg-slate-200 mx-2" />
              
              <ToolbarButton icon={AlignLeft} title="左对齐" />
              <ToolbarButton icon={AlignCenter} title="居中" />
              <ToolbarButton icon={AlignRight} title="右对齐" />
              
              <div className="w-px h-6 bg-slate-200 mx-2" />
              
              <ToolbarButton icon={List} title="无序列表" />
              <ToolbarButton icon={ListOrdered} title="有序列表" />
              
              <div className="w-px h-6 bg-slate-200 mx-2" />
              
              <ToolbarButton icon={Paperclip} title="添加附件" />
              <ToolbarButton icon={ImageIcon} title="插入图片" />
              <ToolbarButton icon={Link2} title="插入链接" />
              <ToolbarButton icon={Smile} title="插入表情" />
              <ToolbarButton icon={Minus} title="分割线" />
              
              <div className="flex-1" />
              
              <button
                onClick={() => setShowAIPanel(!showAIPanel)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                  showAIPanel ? 'bg-purple-50 text-purple-600' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span className="text-sm">AI 写作</span>
              </button>
            </div>

            {/* 内容编辑区 */}
            <div>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="请输入邮件内容..."
                className="w-full h-96 px-3 py-2 text-sm focus:outline-none resize-none"
              />
            </div>

            {/* 发件人信息 */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                  {currentUser?.name?.charAt(0) || '用'}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900">{currentUser?.name || '用户'}</div>
                  <div className="text-xs text-slate-500">{currentUser?.email || currentUser?.phone}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI 写作面板 */}
      {showAIPanel && (
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-slate-900">AI 写作助手</span>
            </div>
            <button
              onClick={() => setShowAIPanel(false)}
              className="p-1.5 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                告诉 AI 你想写什么
              </label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="例如：写一封会议邀请邮件，明天下午 3 点，讨论项目进度..."
                rows={6}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                语气
              </label>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-xs bg-purple-50 text-purple-600 rounded-lg">
                  正式
                </button>
                <button className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                  友好
                </button>
                <button className="px-3 py-1.5 text-xs bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                  简洁
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-slate-200">
            <button
              onClick={handleAIGenerate}
              disabled={aiGenerating}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-purple-300 disabled:to-purple-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {aiGenerating ? '生成中...' : 'AI 生成'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
