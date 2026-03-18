import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, MoreVertical, Paperclip } from 'lucide-react'
import axios from 'axios'

interface Draft {
  id: string
  to: string
  subject: string
  preview: string
  updatedAt: string
  hasAttachment: boolean
}

export default function DraftsPage() {
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDrafts, setSelectedDrafts] = useState<string[]>([])

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const response = await axios.get('/api/mail/drafts')
        setDrafts(response.data.drafts || [])
      } catch (error) {
        console.error('获取草稿失败:', error)
        // 模拟数据（开发时）
        setDrafts([
          {
            id: '1',
            to: 'wangwu@example.com',
            subject: '合作方案讨论',
            preview: '关于上次提到的合作方案，我整理了一份详细的文档...',
            updatedAt: '2026-03-17 15:30',
            hasAttachment: true,
          },
          {
            id: '2',
            to: 'zhaoliu@example.com',
            subject: '会议邀请',
            preview: '您好，邀请您参加下周的项目评审会...',
            updatedAt: '2026-03-16 10:00',
            hasAttachment: false,
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchDrafts()
  }, [])

  const toggleSelect = (id: string) => {
    setSelectedDrafts(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    )
  }

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除这封草稿吗？')) {
      try {
        await axios.delete(`/api/mail/draft/${id}`)
        setDrafts(drafts.filter(d => d.id !== id))
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败')
      }
    }
  }

  const handleBatchDelete = () => {
    if (confirm(`确定要删除选中的 ${selectedDrafts.length} 封草稿吗？`)) {
      // TODO: 批量删除
      setSelectedDrafts([])
    }
  }

  if (loading) {
    return <div className="h-full flex items-center justify-center">加载中...</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          草稿箱
        </h1>
        <div className="flex items-center gap-2">
          {selectedDrafts.length > 0 && (
            <button
              onClick={handleBatchDelete}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              删除选中 ({selectedDrafts.length})
            </button>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            共 {drafts.length} 封草稿
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {drafts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <Edit size={48} className="mb-4 opacity-50" />
            <p>暂无草稿</p>
            <Link
              to="/compose"
              className="mt-4 text-blue-600 hover:text-blue-700 hover:underline"
            >
              去写邮件 →
            </Link>
          </div>
        ) : (
          drafts.map((draft) => (
            <div
              key={draft.id}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              {/* 选择框 */}
              <input
                type="checkbox"
                checked={selectedDrafts.includes(draft.id)}
                onChange={() => toggleSelect(draft.id)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              {/* 草稿图标 */}
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Edit size={20} className="text-yellow-600 dark:text-yellow-400" />
              </div>

              {/* 收件人 */}
              <div className="w-32 text-sm font-medium text-gray-900 dark:text-white truncate">
                {draft.to || '无收件人'}
              </div>

              {/* 邮件内容 */}
              <Link to={`/compose?draft=${draft.id}`} className="flex-1 min-w-0 hover:underline">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {draft.subject || '(无主题)'}
                  </span>
                  {draft.hasAttachment && (
                    <Paperclip size={14} className="text-gray-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {draft.preview}
                </p>
              </Link>

              {/* 更新时间 */}
              <div className="text-xs text-gray-500 dark:text-gray-400 w-24 text-right">
                {new Date(draft.updatedAt).toLocaleString('zh-CN')}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-1">
                <Link
                  to={`/compose?draft=${draft.id}`}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-blue-600 dark:text-blue-400"
                  title="继续编辑"
                >
                  <Edit size={16} />
                </Link>
                <button
                  onClick={() => handleDelete(draft.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                  title="删除"
                >
                  <Trash2 size={16} />
                </button>
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <MoreVertical size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
