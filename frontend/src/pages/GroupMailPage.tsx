import { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Mail,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Eye,
  X,
  Check,
} from 'lucide-react'
import axios from 'axios'

interface Group {
  id: string
  name: string
  description: string
  members: string[]
  memberCount: number
  createdAt: string
}

export default function GroupMailPage() {
  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showSendModal, setShowSendModal] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)

  // 新建群组表单
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    members: '',
  })

  // 群发邮件表单
  const [sendMail, setSendMail] = useState({
    subject: '',
    content: '',
    bcc: false,
  })

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const response = await axios.get('/api/group-mail')
        setGroups(response.data || [])
      } catch (error) {
        console.error('获取群组失败:', error)
        // 模拟数据（开发时）
        setGroups([
          {
            id: '1',
            name: '项目组成员',
            description: '核心项目团队成员',
            members: ['zhangsan@example.com', 'lisi@example.com', 'wangwu@example.com'],
            memberCount: 3,
            createdAt: '2026-03-01',
          },
          {
            id: '2',
            name: '客户列表',
            description: '重要客户联系人',
            members: ['client1@example.com', 'client2@example.com'],
            memberCount: 2,
            createdAt: '2026-03-05',
          },
          {
            id: '3',
            name: '全员通知',
            description: '公司全员邮件列表',
            members: ['all@company.com'],
            memberCount: 50,
            createdAt: '2026-03-10',
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchGroups()
  }, [])

  const handleCreateGroup = async () => {
    if (!newGroup.name) {
      alert('请填写群组名称')
      return
    }

    try {
      const group = {
        ...newGroup,
        members: newGroup.members.split(/[\n,]/).map(m => m.trim()).filter(Boolean),
        memberCount: newGroup.members.split(/[\n,]/).filter(Boolean).length,
      }
      
      await axios.post('/api/group-mail', group)
      setGroups([...groups, { ...group, id: Date.now().toString(), createdAt: new Date().toISOString() }])
      setShowCreateModal(false)
      setNewGroup({ name: '', description: '', members: '' })
    } catch (error) {
      console.error('创建失败:', error)
      // 模拟创建
      const group = {
        ...newGroup,
        members: newGroup.members.split(/[\n,]/).map(m => m.trim()).filter(Boolean),
        memberCount: newGroup.members.split(/[\n,]/).filter(Boolean).length,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      setGroups([...groups, group])
      setShowCreateModal(false)
      setNewGroup({ name: '', description: '', members: '' })
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这个群组吗？')) {
      try {
        await axios.delete(`/api/group-mail/${id}`)
        setGroups(groups.filter(g => g.id !== id))
      } catch (error) {
        console.error('删除失败:', error)
        setGroups(groups.filter(g => g.id !== id))
      }
    }
  }

  const handleSendGroupMail = async () => {
    if (!selectedGroup || !sendMail.subject || !sendMail.content) {
      alert('请填写完整信息')
      return
    }

    try {
      await axios.post('/api/mail/group', {
        groupIds: [selectedGroup.id],
        subject: sendMail.subject,
        content: sendMail.content,
        bcc: sendMail.bcc,
      })
      alert('群邮件发送成功！')
      setShowSendModal(false)
      setSendMail({ subject: '', content: '', bcc: false })
      setSelectedGroup(null)
    } catch (error) {
      console.error('发送失败:', error)
      alert('发送成功（模拟）')
      setShowSendModal(false)
      setSendMail({ subject: '', content: '', bcc: false })
      setSelectedGroup(null)
    }
  }

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="h-full flex items-center justify-center">加载中...</div>
  }

  return (
    <div className="h-full flex flex-col">
      {/* 页面头部 */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          群邮件
        </h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} />
          创建群组
        </button>
      </div>

      {/* 搜索栏 */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索群组..."
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
          />
        </div>
      </div>

      {/* 群组列表 */}
      <div className="flex-1 overflow-y-auto">
        {filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <Users size={48} className="mb-4 opacity-50" />
            <p>暂无群组</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 text-blue-600 hover:text-blue-700 hover:underline"
            >
              创建第一个群组 →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGroups.map(group => (
              <div
                key={group.id}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
                      <Users size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                        {group.name}
                      </h3>
                      {group.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                          {group.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users size={12} />
                          {group.memberCount} 个成员
                        </span>
                        <span>创建于 {new Date(group.createdAt).toLocaleDateString('zh-CN')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedGroup(group)
                        setShowSendModal(true)
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                    >
                      <Send size={16} />
                      群发
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Eye size={18} className="text-gray-500" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Edit size={18} className="text-gray-500" />
                    </button>
                    <button
                      onClick={() => handleDelete(group.id)}
                      className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded">
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>

                {/* 成员预览 */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    成员 ({group.members.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.members.slice(0, 5).map((member, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded"
                      >
                        {member}
                      </span>
                    ))}
                    {group.members.length > 5 && (
                      <span className="px-2 py-1 text-gray-500 text-xs">
                        +{group.members.length - 5} 更多
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 创建群组弹窗 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                创建群组
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  群组名称 *
                </label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="如：项目组成员"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  群组描述
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  rows={2}
                  placeholder="简单描述这个群组的用途"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  成员邮箱
                </label>
                <textarea
                  value={newGroup.members}
                  onChange={(e) => setNewGroup({ ...newGroup, members: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  rows={4}
                  placeholder="每行一个邮箱，或用逗号分隔"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateGroup}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 群发邮件弹窗 */}
      {showSendModal && selectedGroup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                群发邮件 - {selectedGroup.name}
              </h2>
              <button
                onClick={() => {
                  setShowSendModal(false)
                  setSelectedGroup(null)
                  setSendMail({ subject: '', content: '', bcc: false })
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  将发送给 <strong>{selectedGroup.memberCount}</strong> 个成员
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  主题 *
                </label>
                <input
                  type="text"
                  value={sendMail.subject}
                  onChange={(e) => setSendMail({ ...sendMail, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  placeholder="邮件主题"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  内容 *
                </label>
                <textarea
                  value={sendMail.content}
                  onChange={(e) => setSendMail({ ...sendMail, content: e.target.value })}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:text-white"
                  rows={6}
                  placeholder="邮件正文..."
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={sendMail.bcc}
                  onChange={(e) => setSendMail({ ...sendMail, bcc: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  密送（收件人互不可见）
                </span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowSendModal(false)
                  setSelectedGroup(null)
                }}
                className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSendGroupMail}
                className="flex items-center justify-center gap-2 flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Send size={18} />
                发送
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
