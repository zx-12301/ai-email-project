import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Archive, Trash2, MoreVertical, Paperclip, Eye } from 'lucide-react'
import axios from 'axios'

interface Mail {
  id: string
  to: string
  subject: string
  preview: string
  time: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  hasAttachment: boolean
}

export default function SentPage() {
  const [mails, setMails] = useState<Mail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSentMails = async () => {
      try {
        const response = await axios.get('/api/mail/sent')
        setMails(response.data.mails || [])
      } catch (error) {
        console.error('获取已发送失败:', error)
        // 模拟数据（开发时）
        setMails([
          {
            id: '1',
            to: 'zhangsan@example.com',
            subject: '项目进度汇报 - 请查阅',
            preview: '您好，附件是本周的项目进度汇报...',
            time: '2026-03-17 10:30',
            status: 'read',
            hasAttachment: true,
          },
          {
            id: '2',
            to: 'lisi@example.com',
            subject: 'Re: 合作方案讨论',
            preview: '感谢您的来信，我已经仔细阅读...',
            time: '2026-03-17 09:15',
            status: 'delivered',
            hasAttachment: false,
          },
        ])
      } finally {
        setLoading(false)
      }
    }
    
    fetchSentMails()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'read':
        return <span className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs rounded">已读</span>
      case 'delivered':
        return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded">已送达</span>
      case 'failed':
        return <span className="px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded">发送失败</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">已发送</span>
    }
  }

  if (loading) {
    return <div className="h-full flex items-center justify-center">加载中...</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          已发送
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          共 {mails.length} 封邮件
        </p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {mails.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <Archive size={48} className="mb-4 opacity-50" />
            <p>暂无已发送邮件</p>
          </div>
        ) : (
          mails.map((mail) => (
            <div
              key={mail.id}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
              {/* 状态图标 */}
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Eye size={20} className="text-blue-600 dark:text-blue-400" />
              </div>

              {/* 收件人 */}
              <div className="w-32 text-sm font-medium text-gray-900 dark:text-white truncate">
                {mail.to}
              </div>

              {/* 邮件内容 */}
              <Link to={`/mail/${mail.id}`} className="flex-1 min-w-0 hover:underline">
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
              </Link>

              {/* 状态 */}
              <div className="w-24">
                {getStatusBadge(mail.status)}
              </div>

              {/* 时间 */}
              <div className="text-xs text-gray-500 dark:text-gray-400 w-20 text-right">
                {mail.time}
              </div>

              {/* 更多操作 */}
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                <MoreVertical size={16} className="text-gray-500" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
