import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Bell, Shield, Monitor, Upload, Save, LogOut } from 'lucide-react'
import { authApi } from '../api'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'profile' | 'notification' | 'security' | 'appearance'>('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // 用户信息
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    company: '',
    signature: '',
    avatar: '',
  })

  // 获取用户信息
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const user = await authApi.getCurrentUser()
        if (user) {
          setUserInfo({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            department: user.department || '',
            company: user.company || '',
            signature: user.signature || '',
            avatar: user.avatar || '',
          })
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchUserInfo()
  }, [])

  // 保存设置
  const handleSave = async () => {
    setSaving(true)
    try {
      await authApi.updateProfile({
        name: userInfo.name,
        avatar: userInfo.avatar,
        signature: userInfo.signature,
        department: userInfo.department,
        company: userInfo.company,
      })
      alert('设置已保存！')
    } catch (error: any) {
      alert('保存失败：' + error.message)
    } finally {
      setSaving(false)
    }
  }

  // 更换头像
  const handleAvatarChange = () => {
    // 简单实现：使用姓名首字
    const initial = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '用'
    setUserInfo({ ...userInfo, avatar: initial })
  }

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
        {/* 左侧菜单栏 */}
        <div className="w-64 bg-white border-r border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">设置</h2>
          </div>
          
          <div className="p-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">个人资料</span>
            </button>
            
            <button
              onClick={() => setActiveTab('notification')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                activeTab === 'notification'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="text-sm font-medium">通知设置</span>
            </button>
            
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
                activeTab === 'security'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">安全隐私</span>
            </button>
            
            <button
              onClick={() => setActiveTab('appearance')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeTab === 'appearance'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span className="text-sm font-medium">外观显示</span>
            </button>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            {/* 个人资料 */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">基本信息</h3>
                  <p className="text-sm text-slate-500 mt-1">管理您的个人信息和联系方式</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* 头像 */}
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-medium">
                      {userInfo.avatar || (userInfo.name ? userInfo.name.charAt(0) : '用')}
                    </div>
                    <div>
                      <button
                        onClick={handleAvatarChange}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        更换头像
                      </button>
                      <p className="text-xs text-slate-500 mt-2">支持 JPG、PNG 格式，大小不超过 2MB</p>
                    </div>
                  </div>

                  {/* 姓名 */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        姓名
                      </label>
                      <input
                        type="text"
                        value={userInfo.name}
                        onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入姓名"
                      />
                    </div>

                    {/* 邮箱 */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        邮箱
                      </label>
                      <input
                        type="email"
                        value={userInfo.email}
                        onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入邮箱"
                      />
                    </div>

                    {/* 手机 */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        手机
                      </label>
                      <input
                        type="text"
                        value={userInfo.phone}
                        onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入手机号"
                      />
                    </div>

                    {/* 部门 */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        部门
                      </label>
                      <input
                        type="text"
                        value={userInfo.department}
                        onChange={(e) => setUserInfo({ ...userInfo, department: e.target.value })}
                        className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="请输入部门"
                      />
                    </div>
                  </div>

                  {/* 邮件签名 */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      邮件签名
                    </label>
                    <textarea
                      value={userInfo.signature}
                      onChange={(e) => setUserInfo({ ...userInfo, signature: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="设置您的默认邮件签名"
                    />
                    <p className="text-xs text-slate-500 mt-2">签名将在发送邮件时自动附加到邮件末尾</p>
                  </div>

                  {/* 保存按钮 */}
                  <div className="flex justify-end pt-6 border-t border-slate-200">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? '保存中...' : '保存设置'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 通知设置 */}
            {activeTab === 'notification' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">通知设置</h3>
                  <p className="text-sm text-slate-500 mt-1">管理您的邮件通知偏好</p>
                </div>
                
                <div className="p-6">
                  <p className="text-slate-600">通知设置功能开发中...</p>
                </div>
              </div>
            )}

            {/* 安全隐私 */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">安全隐私</h3>
                  <p className="text-sm text-slate-500 mt-1">管理您的账号安全设置</p>
                </div>
                
                <div className="p-6">
                  <p className="text-slate-600">安全隐私功能开发中...</p>
                </div>
              </div>
            )}

            {/* 外观显示 */}
            {activeTab === 'appearance' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-900">外观显示</h3>
                  <p className="text-sm text-slate-500 mt-1">自定义界面显示偏好</p>
                </div>
                
                <div className="p-6">
                  <p className="text-slate-600">外观显示功能开发中...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
