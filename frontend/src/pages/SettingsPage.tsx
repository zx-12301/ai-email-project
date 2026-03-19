import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Bell, Shield, Monitor, Upload, Save, LogOut, Eye, EyeOff, Key, Moon, Sun, Globe, Mail, Smartphone } from 'lucide-react'
import { authApi } from '../api'
import { useToast } from '../contexts/ToastContext'

interface UserSettings {
  name: string
  email: string
  phone: string
  department: string
  company: string
  signature: string
  avatar: string
}

interface NotificationSettings {
  newMailNotify: boolean
  sentNotify: boolean
  soundEnabled: boolean
  desktopNotify: boolean
  weeklyDigest: boolean
}

interface SecuritySettings {
  twoFactorEnabled: boolean
  loginNotify: boolean
  sessionTimeout: number
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  language: 'zh-CN' | 'en-US'
  fontSize: 'small' | 'medium' | 'large'
  compactMode: boolean
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { showToast, showConfirm } = useToast()
  const [activeTab, setActiveTab] = useState<'profile' | 'notification' | 'security' | 'appearance'>('profile')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // 用户信息
  const [userInfo, setUserInfo] = useState<UserSettings>({
    name: '',
    email: '',
    phone: '',
    department: '',
    company: '',
    signature: '',
    avatar: '',
  })

  // 通知设置
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    newMailNotify: true,
    sentNotify: true,
    soundEnabled: true,
    desktopNotify: false,
    weeklyDigest: false,
  })

  // 安全设置
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotify: true,
    sessionTimeout: 30,
  })

  // 外观设置
  const [appearanceSettings, setAppearanceSettings] = useState<AppearanceSettings>({
    theme: 'light',
    language: 'zh-CN',
    fontSize: 'medium',
    compactMode: false,
  })

  // 修改密码
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

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

        // 加载本地存储的设置
        const savedNotification = localStorage.getItem('notificationSettings')
        if (savedNotification) {
          setNotificationSettings(JSON.parse(savedNotification))
        }

        const savedAppearance = localStorage.getItem('appearanceSettings')
        if (savedAppearance) {
          setAppearanceSettings(JSON.parse(savedAppearance))
        }
      } catch (error) {
        console.error('获取用户信息失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  // 保存用户资料
  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      await authApi.updateProfile({
        name: userInfo.name,
        avatar: userInfo.avatar,
        signature: userInfo.signature,
        department: userInfo.department,
        company: userInfo.company,
      })
      showToast('个人资料已保存', 'success')
    } catch (error: any) {
      showToast('保存失败：' + error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  // 保存通知设置
  const handleSaveNotification = () => {
    localStorage.setItem('notificationSettings', JSON.stringify(notificationSettings))
    showToast('通知设置已保存', 'success')
  }

  // 保存外观设置
  const handleSaveAppearance = () => {
    localStorage.setItem('appearanceSettings', JSON.stringify(appearanceSettings))
    showToast('外观设置已保存', 'success')
  }

  // 修改密码
  const handleChangePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      showToast('请填写所有密码字段', 'warning')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      showToast('新密码至少 6 位', 'warning')
      return
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('两次输入的新密码不一致', 'warning')
      return
    }

    setSaving(true)
    try {
      await authApi.changePassword(passwordForm.oldPassword, passwordForm.newPassword)
      showToast('密码修改成功', 'success')
      setShowPasswordForm(false)
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error: any) {
      showToast('密码修改失败：' + error.message, 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleAvatarChange = () => {
    const initial = userInfo.name ? userInfo.name.charAt(0).toUpperCase() : '用'
    setUserInfo({ ...userInfo, avatar: initial })
  }

  const handleLogout = async () => {
    const confirmed = await showConfirm({
      title: '退出登录',
      message: '确定要退出登录吗？',
      confirmText: '退出',
      type: 'warning'
    })
    if (!confirmed) return

    try {
      await authApi.logout()
      navigate('/login')
    } catch (error) {
      localStorage.removeItem('token')
      navigate('/login')
    }
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

          <div className="mt-8 pt-8 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">退出登录</span>
            </button>
          </div>
        </div>
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {/* 个人资料 */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900">基本信息</h3>
                <p className="text-sm text-slate-500 mt-1">管理您的个人信息和联系方式</p>
              </div>

              <div className="p-8 space-y-8">
                {/* 头像区域 */}
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-medium flex-shrink-0">
                    {userInfo.avatar || (userInfo.name ? userInfo.name.charAt(0) : '用')}
                  </div>
                  <div className="pt-2">
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

                {/* 表单区域 */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">姓名</label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入姓名"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">邮箱</label>
                    <input
                      type="email"
                      value={userInfo.email}
                      onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入邮箱"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">手机</label>
                    <input
                      type="text"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入手机号"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">部门</label>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">邮件签名</label>
                  <textarea
                    value={userInfo.signature}
                    onChange={(e) => setUserInfo({ ...userInfo, signature: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="设置您的默认邮件签名"
                  />
                  <p className="text-xs text-slate-500 mt-2">签名将在发送邮件时自动附加到邮件末尾</p>
                </div>

                {/* 保存按钮 */}
                <div className="flex justify-end pt-6 border-t border-slate-200">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
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

              <div className="p-8 space-y-6">
                {/* 邮件通知 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    邮件通知
                  </h4>

                  <div className="space-y-3 pl-6">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-700">新邮件通知</span>
                        <p className="text-xs text-slate-500">收到新邮件时发送通知</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.newMailNotify}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, newMailNotify: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-700">发送成功通知</span>
                        <p className="text-xs text-slate-500">邮件发送成功时通知</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.sentNotify}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, sentNotify: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-700">每周摘要</span>
                        <p className="text-xs text-slate-500">每周发送邮件活动摘要</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyDigest}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyDigest: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                {/* 提醒方式 */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    提醒方式
                  </h4>

                  <div className="space-y-3 pl-6">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-700">声音提醒</span>
                        <p className="text-xs text-slate-500">收到通知时播放提示音</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.soundEnabled}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, soundEnabled: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-700">桌面通知</span>
                        <p className="text-xs text-slate-500">显示系统桌面通知</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notificationSettings.desktopNotify}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, desktopNotify: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                {/* 保存按钮 */}
                <div className="flex justify-end pt-6 border-t border-slate-200">
                  <button
                    onClick={handleSaveNotification}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    保存设置
                  </button>
                </div>
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

              <div className="p-8 space-y-6">
                {/* 修改密码 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Key className="w-4 h-4" />
                    修改密码
                  </h4>

                  {!showPasswordForm ? (
                    <div className="pl-6">
                      <button
                        onClick={() => setShowPasswordForm(true)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                      >
                        修改密码
                      </button>
                    </div>
                  ) : (
                    <div className="pl-6 space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">当前密码</label>
                        <div className="relative">
                          <input
                            type={showOldPassword ? 'text' : 'password'}
                            value={passwordForm.oldPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                            className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入当前密码"
                          />
                          <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">新密码</label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            className="w-full px-4 py-2.5 pr-10 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入新密码（至少 6 位）"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">确认新密码</label>
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="请再次输入新密码"
                        />
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={handleChangePassword}
                          disabled={saving}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          {saving ? '修改中...' : '确认修改'}
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordForm(false)
                            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
                          }}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          取消
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 安全选项 */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-900">安全选项</h4>

                  <div className="space-y-3 pl-6">
                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-700">登录通知</span>
                        <p className="text-xs text-slate-500">新设备登录时发送通知</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={securitySettings.loginNotify}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, loginNotify: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-700">会话超时时间</span>
                        <p className="text-xs text-slate-500">无操作自动退出时间（分钟）</p>
                      </div>
                      <select
                        value={securitySettings.sessionTimeout}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: Number(e.target.value) })}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={15}>15 分钟</option>
                        <option value={30}>30 分钟</option>
                        <option value={60}>1 小时</option>
                        <option value={120}>2 小时</option>
                      </select>
                    </div>
                  </div>
                </div>
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

              <div className="p-8 space-y-6">
                {/* 主题设置 */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    主题设置
                  </h4>

                  <div className="flex gap-4 pl-6">
                    {[
                      { value: 'light', label: '浅色', icon: Sun },
                      { value: 'dark', label: '深色', icon: Moon },
                      { value: 'system', label: '跟随系统', icon: Monitor },
                    ].map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => setAppearanceSettings({ ...appearanceSettings, theme: theme.value as 'light' | 'dark' | 'system' })}
                        className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-colors ${
                          appearanceSettings.theme === theme.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <theme.icon className="w-6 h-6 text-slate-700" />
                        <span className="text-sm text-slate-700">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 语言设置 */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    语言设置
                  </h4>

                  <div className="flex gap-4 pl-6">
                    {[
                      { value: 'zh-CN', label: '简体中文' },
                      { value: 'en-US', label: 'English' },
                    ].map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => setAppearanceSettings({ ...appearanceSettings, language: lang.value as 'zh-CN' | 'en-US' })}
                        className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                          appearanceSettings.language === lang.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 显示设置 */}
                <div className="space-y-4 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-900">显示设置</h4>

                  <div className="space-y-3 pl-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-700">字体大小</span>
                        <p className="text-xs text-slate-500">调整界面文字大小</p>
                      </div>
                      <select
                        value={appearanceSettings.fontSize}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, fontSize: e.target.value as 'small' | 'medium' | 'large' })}
                        className="px-3 py-1.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="small">小</option>
                        <option value="medium">中</option>
                        <option value="large">大</option>
                      </select>
                    </div>

                    <label className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-slate-700">紧凑模式</span>
                        <p className="text-xs text-slate-500">减少界面间距，显示更多内容</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={appearanceSettings.compactMode}
                        onChange={(e) => setAppearanceSettings({ ...appearanceSettings, compactMode: e.target.checked })}
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                  </div>
                </div>

                {/* 保存按钮 */}
                <div className="flex justify-end pt-6 border-t border-slate-200">
                  <button
                    onClick={handleSaveAppearance}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    保存设置
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}