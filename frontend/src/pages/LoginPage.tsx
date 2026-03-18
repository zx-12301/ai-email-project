import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, MessageSquare, Eye, EyeOff, User, Phone, Key } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'wechat' | 'phone' | 'password'>('wechat');
  const [rememberMe, setRememberMe] = useState(true);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    navigate('/inbox');
  };

  const handleGetCode = () => {
    console.log('Get verification code:', phone);
  };

  return (
    <div className="min-h-screen flex">
      {/* 左侧深色背景区 */}
      <div className="flex-1 bg-gradient-to-br from-slate-700 to-slate-900 relative overflow-hidden">
        {/* 网格背景图案 */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+")`
          }}
        ></div>
        
        <div className="relative z-10 p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-16">
            <div className="bg-blue-500 px-3 py-1 rounded">
              <span className="font-bold">AI 邮箱</span>
            </div>
            <span className="text-sm">智能企业邮箱</span>
          </div>
          
          {/* 主标题 */}
          <div className="max-w-lg mt-32">
            <h1 className="text-4xl font-medium mb-6">让每封邮件，</h1>
            <h2 className="text-3xl font-light mb-4">速流转、信得过、达到位</h2>
          </div>
        </div>

        {/* 底部信息 */}
        <div className="absolute bottom-8 left-12 text-white text-xs opacity-60">
          <div className="flex gap-4">
            <span className="hover:opacity-100 cursor-pointer">关于 AI 邮箱</span>
            <span className="hover:opacity-100 cursor-pointer">用户协议</span>
            <span className="hover:opacity-100 cursor-pointer">帮助中心</span>
            <span className="hover:opacity-100 cursor-pointer">用户手册</span>
          </div>
          <div className="mt-2">© 2026 AI Mail Inc. All Rights Reserved</div>
        </div>
      </div>

      {/* 右侧登录表单 */}
      <div className="w-[500px] bg-white flex items-center justify-center p-12">
        <div className="w-full max-w-md">
          {/* 标题 */}
          <h2 className="text-2xl font-medium text-center mb-8">
            {loginMethod === 'wechat' && '企业微信登录'}
            {loginMethod === 'phone' && '手机号登录'}
            {loginMethod === 'password' && '账号密码登录'}
          </h2>

          {/* 企业微信登录 */}
          {loginMethod === 'wechat' && (
            <div className="flex flex-col items-center">
              {/* 二维码 */}
              <div className="w-48 h-48 bg-slate-100 flex items-center justify-center mb-6 rounded-lg border border-slate-200">
                <div className="w-40 h-40 bg-white border-2 border-slate-300 flex items-center justify-center">
                  <MessageSquare className="w-12 h-12 text-slate-300" />
                </div>
              </div>
              
              {/* 免登录选项 */}
              <div className="flex items-center gap-2 mb-6">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  id="remember-wechat"
                  className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                />
                <label htmlFor="remember-wechat" className="text-sm text-slate-600 cursor-pointer">
                  30 天内免登录
                </label>
              </div>

              <p className="text-sm text-slate-500">
                使用企业微信扫码，快速安全登录
              </p>
            </div>
          )}

          {/* 手机号登录 */}
          {loginMethod === 'phone' && (
            <div className="space-y-4">
              {/* 手机号输入 */}
              <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-3 py-2.5 bg-slate-50 border-r border-slate-200 text-sm text-slate-600 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  + 86
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="输入手机号码"
                  className="flex-1 px-3 py-2.5 border-0 focus:outline-none focus:ring-0 text-sm"
                />
              </div>

              {/* 验证码输入 */}
              <div className="relative">
                <div className="flex border border-slate-200 rounded-lg overflow-hidden">
                  <div className="flex-1 px-3 py-2.5 border-0 focus:outline-none focus:ring-0 text-sm flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="输入验证码"
                      maxLength={6}
                      className="w-full border-0 focus:outline-none focus:ring-0 text-sm"
                    />
                  </div>
                  <button 
                    onClick={handleGetCode}
                    className="px-4 py-2.5 text-sm text-blue-500 hover:text-blue-600 hover:bg-blue-50 font-medium whitespace-nowrap"
                  >
                    获取验证码
                  </button>
                </div>
              </div>

              {/* 登录按钮 */}
              <button
                onClick={handleLogin}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                登录
              </button>

              {/* 其他选项 */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    id="remember-phone"
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-phone" className="text-slate-600 cursor-pointer">
                    30 天内免登录
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* 账号密码登录 */}
          {loginMethod === 'password' && (
            <div className="space-y-4">
              {/* 账号输入 */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  placeholder="邮箱账号/管理员账号"
                  className="w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>

              {/* 密码输入 */}
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入邮箱密码"
                  className="w-full pl-10 pr-10 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* 记住密码和忘记密码 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    id="remember-password"
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                  />
                  <label htmlFor="remember-password" className="text-sm text-slate-600 cursor-pointer">
                    30 天内免登录
                  </label>
                </div>
                <button className="text-sm text-blue-500 hover:text-blue-600 font-medium">
                  忘记密码？
                </button>
              </div>

              {/* 登录按钮 */}
              <button
                onClick={handleLogin}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                登录
              </button>
            </div>
          )}

          {/* 登录方式切换 */}
          <div className="flex justify-center gap-6 mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={() => setLoginMethod('wechat')}
              className={`text-sm ${
                loginMethod === 'wechat' 
                  ? 'text-blue-500 font-medium' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              企业微信
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`text-sm ${
                loginMethod === 'phone' 
                  ? 'text-blue-500 font-medium' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              手机号
            </button>
            <button
              onClick={() => setLoginMethod('password')}
              className={`text-sm ${
                loginMethod === 'password' 
                  ? 'text-blue-500 font-medium' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              账号密码
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
