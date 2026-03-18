import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw, Trash2, MoreVertical, Paperclip, AlertTriangle } from 'lucide-react'
import axios from 'axios'

interface TrashMail {
  id: string
  from: string
  subject: string
  preview: string
  deletedAt: string
  hasAttachment: boolean
  daysLeft: number
}

export default function TrashPage() {
  const [mails, setMails] = useState<TrashMail[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMails, setSelectedMails] = useState<string[]>([])

  useEffect(() => {
    const fetchTrash = async () => {
      try {
        const response = await axios.get('/api/mail/trash')
        setMails(response.data.mails || [])
      } catch (error) {
        console.error('获取已删除失败:', error)
        // 模拟数据（开发时）
        setMails([
          {
            id: '1',
            from: '广告邮件',
            subject: '限时优惠！立即购买',
            preview: '尊敬的客户，我们现在有超值优惠活动...',
            deletedAt: '2026-03-17 14:00',
            hasAttachment: false,
            daysLeft: 28,
          },
          {
            id: '2',
            from: '张三',
            subject: '项目进度汇报',
            preview: '您好，附件是本周的项目进度汇报...',
            deletedAt: '2026-03-16 10:30',
            hasAttachment: true,
            daysLeft: 27,
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchTrash()
  }, [])

  const toggleSelect = (id: string) => {
    setSelectedMails(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const handleRestore = async (id: string) => {
    try {
      await axios.post(`/api/mail/${id}/restore`)
      setMails(mails.filter(m => m.id !== id))
      alert('邮件已恢复到收件箱')
    } catch (error) {
      console.error('恢复失败:', error)
      alert('恢复失败')
    }
  }

  const handleDeletePermanent = async (id: string) => {
    if (confirm('确定要永久删除这封邮件吗？此操作不可恢复。')) {
      try {
        await axios.delete(`/api/mail/${id}/permanent`)
        setMails(mails.filter(m => m.id !== id))
      } catch (error) {
        console.error('删除失败:', error)
        alert('删除失败')
      }
    }
  }

  const handleEmptyTrash = () => {
    if (confirm('确定要清空垃圾箱吗？所有邮件将永久删除。')) {
      // TODO: 清空垃圾箱
      setMails([])
    }
  }

  const handleBatchRestore = () => {
    // TODO: 批量恢复
    alert(`已恢复 ${selectedMails.length} 封邮件`)
    setSelectedMails([])
  }

  const handleBatchDelete = () => {
    if (confirm(`确定要永久删除选中的 ${selectedMails.length} 封邮件吗？`)) {
      // TODO: 批量删除
      setSelectedMails([])
    }
  }

  if (loading) {
    return <div className="h-full flex items-center justify-center">加载中...</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          已删除
        </h1>
        <div className="flex items-center gap-2">
          {selectedMails.length > 0 && (
            <>
              <button
                onClick={handleBatchRestore}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
              >
                <RotateCcw size={16} />
                恢复选中 ({selectedMails.length})
              </button>
              <button
                onClick={handleBatchDelete}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                <Trash2 size={16} />
                永久删除 ({selectedMails.length})
              </button>
            </>
          )}
          {mails.length > 0 && (
            <button
              onClick={handleEmptyTrash}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              清空垃圾箱
            </button>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400">
            共 {mails.length} 封邮件
          </p>
        </div>
      </div>

      {/* 提示信息 */}
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 已删除的邮件会在垃圾箱中保留 30 天，之后将自动永久删除。
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {mails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <Trash2 size={48} className="mb-4 opacity-50" />
            <p>垃圾箱是空的</p>
          </div>
        ) : (
          mails.map((mail) => (
            <div
              key={mail.id}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              {/* 选择框 */}
              <input
                type="checkbox"
                checked={selectedMails.includes(mail.id)}
                onChange={() => toggleSelect(mail.id)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              {/* 警告图标 */}
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <AlertTriangle size={20} className="text-orange-600 dark:text-orange-400" />
              </div>

              {/* 发件人 */}
              <div className="w-32 text-sm font-medium text-gray-900 dark:text-white truncate">
                {mail.from}
              </div>

              {/* 邮件内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white truncate">
                    {mail.subject}
                  </span>
                  {mail.hasAttachment && (
                    <Paperclip size={14} className="text-gray-400 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {mail.preview}
                </p>
              </div>

              {/* 剩余天数 */}
              <div className="w-24 text-right">
                {mail.daysLeft <= 7 ? (
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded">
                    剩余{mail.daysLeft}天
                  </span>
                ) : (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {mail.daysLeft}天后删除
                  </span>
                )}
              </div>

              {/* 删除时间 */}
              <div className="text-xs text-gray-500 dark:text-gray-400 w-20 text-right">
                {new Date(mail.deletedAt).toLocaleDateString('zh-CN')}
              </div>

              {/* 操作按钮 */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleRestore(mail.id)}
                  className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded text-green-600 dark:text-green-400"
                  title="恢复"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => handleDeletePermanent(mail.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                  title="永久删除"
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
