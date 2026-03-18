import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Save, Upload, X } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notification' | 'security' | 'appearance'>('profile');
  
  const [profile, setProfile] = useState({
    name: '董欣',
    email: 'dongx@Spt.com',
    phone: '138****8888',
    department: '总裁办',
    signature: '',
  });

  const handleSave = () => {
    alert('设置已保存');
  };

  const tabs = [
    { id: 'profile', label: '个人资料', icon: User },
    { id: 'notification', label: '通知设置', icon: Bell },
    { id: 'security', label: '安全隐私', icon: Shield },
    { id: 'appearance', label: '外观显示', icon: Palette },
  ];

  return (
    <div className="h-full flex bg-slate-50">
      {/* 左侧边栏 - 导航 */}
      <div className="w-64 border-r border-slate-200 flex flex-col bg-white">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-medium text-slate-900">设置</h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded mb-0.5 transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 右侧内容区 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl bg-white rounded-lg border border-slate-200">
          {/* 个人资料 */}
          {activeTab === 'profile' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">基本信息</h3>
                
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                    {profile.name.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                      <Upload size={16} />
                      更换头像
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      姓名
                    </label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      邮箱
                    </label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      手机
                    </label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      部门
                    </label>
                    <input
                      type="text"
                      value={profile.department}
                      onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    邮件签名
                  </label>
                  <textarea
                    value={profile.signature}
                    onChange={(e) => setProfile({ ...profile, signature: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    rows={4}
                    placeholder="设置您的默认邮件签名"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Save size={18} />
                  保存设置
                </button>
              </div>
            </div>
          )}

          {/* 通知设置 */}
          {activeTab === 'notification' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">通知偏好</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">新邮件通知</p>
                      <p className="text-sm text-slate-500">收到新邮件时发送通知</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">提示音</p>
                      <p className="text-sm text-slate-500">新邮件到达时播放提示音</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">桌面通知</p>
                      <p className="text-sm text-slate-500">在桌面显示通知弹窗</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Save size={18} />
                  保存设置
                </button>
              </div>
            </div>
          )}

          {/* 安全隐私 */}
          {activeTab === 'security' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">安全设置</h3>
                
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">两步验证</p>
                      <p className="text-sm text-slate-500">登录时需要手机验证码</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div>
                      <p className="font-medium text-slate-900">登录提醒</p>
                      <p className="text-sm text-slate-500">新设备登录时发送邮件提醒</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Save size={18} />
                  保存设置
                </button>
              </div>
            </div>
          )}

          {/* 外观显示 */}
          {activeTab === 'appearance' && (
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-slate-900 mb-4">主题设置</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <button className="p-4 rounded-lg border-2 border-blue-600 bg-blue-50">
                    <div className="w-full h-20 bg-white rounded mb-2"></div>
                    <p className="text-sm font-medium">浅色</p>
                  </button>
                  <button className="p-4 rounded-lg border-2 border-slate-200 hover:border-slate-300">
                    <div className="w-full h-20 bg-slate-800 rounded mb-2"></div>
                    <p className="text-sm font-medium">深色</p>
                  </button>
                  <button className="p-4 rounded-lg border-2 border-slate-200 hover:border-slate-300">
                    <div className="w-full h-20 bg-gradient-to-r from-white to-slate-800 rounded mb-2"></div>
                    <p className="text-sm font-medium">跟随系统</p>
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2"
                >
                  <Save size={18} />
                  保存设置
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
