import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, MessageSquare, Eye, EyeOff, User, Phone, Key, CheckCircle, AlertCircle } from 'lucide-react';
import { authApi } from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState<'wechat' | 'phone' | 'password'>('phone');
  const [rememberMe, setRememberMe] = useState(true);
  
  // 手机号登录状态
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  
  // 密码登录状态
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 通用状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 检查是否已登录
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/inbox');
    }
  }, [navigate]);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 获取验证码
  const handleGetCode = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const result = await authApi.sendCode(phone);
      
      // 显示验证码在前端控制台
      console.log('📱 验证码登录提示:');
      console.log('   手机号:', phone);
      console.log('   验证码:', result.code);
      console.log('   有效期：5 分钟');
      console.log('   是否新用户:', result.isNewUser ? '是（将自动注册）' : '否');
      
      setCodeSent(true);
      setCountdown(60);
      
      if (result.isNewUser) {
        setSuccess(`验证码已发送（新用户将自动注册），验证码：${result.code}`);
      } else {
        setSuccess(`验证码已发送，验证码：${result.code}`);
      }
      setTimeout(() => setSuccess(''), 10000);
    } catch (err: any) {
      setError(err.message || '发送失败');
    } finally {
      setLoading(false);
    }
  };

  // 手机号登录
  const handlePhoneLogin = async () => {
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号');
      return;
    }

    if (!code || code.length !== 6) {
      setError('请输入 6 位验证码');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const result = await authApi.loginWithCode(phone, code);
      console.log('登录成功:', result);
      navigate('/inbox');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 密码登录
  const handlePasswordLogin = async () => {
    if (!account || !/^1[3-9]\d{9}$/.test(account)) {
      setError('请输入正确的手机号');
      return;
    }

    if (!password || password.length < 6) {
      setError('密码长度至少 6 位');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const result = await authApi.loginWithPassword(account, password);
      console.log('登录成功:', result);
      navigate('/inbox');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 企业微信登录（演示用户）
  const handleWechatLogin = async () => {
    const confirmed = window.confirm('将以演示用户身份登录，是否确认？');
    if (!confirmed) return;
    
    try {
      setError('');
      setLoading(true);
      const result = await authApi.loginAsDemo();
      console.log('演示用户登录成功:', result);
      navigate('/inbox');
    } catch (err: any) {
      setError(err.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  // 切换到注册页面
  const handleGoToRegister = () => {
    navigate('/register');
  };

  // 切换到忘记密码页面
  const handleGoToForgotPassword = () => {
    navigate('/forgot-password');
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

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* 成功提示 */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

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

              <button
                onClick={handleWechatLogin}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-5 h-5" />
                模拟登录
              </button>
            </div>
          )}

          {/* 手机号登录 */}
          {loginMethod === 'phone' && (
            <div className="space-y-4">
              {/* 手机号输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  手机号
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={11}
                  />
                </div>
              </div>

              {/* 验证码输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  验证码
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="请输入验证码"
                      className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={6}
                    />
                  </div>
                  <button
                    onClick={handleGetCode}
                    disabled={countdown > 0 || !phone}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
                  </button>
                </div>
              </div>

              {/* 登录按钮 */}
              <button
                onClick={handlePhoneLogin}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? '登录中...' : '登录'}
              </button>

              {/* 其他选项 */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-slate-600">记住我</span>
                </label>
                <button
                  onClick={handleGoToRegister}
                  className="text-blue-600 hover:text-blue-700"
                >
                  注册账号
                </button>
              </div>
            </div>
          )}

          {/* 密码登录 */}
          {loginMethod === 'password' && (
            <div className="space-y-4">
              {/* 账号输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  手机号
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="请输入手机号"
                    className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={11}
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 登录按钮 */}
              <button
                onClick={handlePasswordLogin}
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? '登录中...' : '登录'}
              </button>

              {/* 其他选项 */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-slate-600">记住我</span>
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={handleGoToForgotPassword}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    忘记密码？
                  </button>
                  <button
                    onClick={handleGoToRegister}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    注册账号
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 登录方式切换 */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="text-center text-sm text-slate-600 mb-4">其他登录方式</div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setLoginMethod('wechat')}
                className={`p-3 rounded-lg transition-colors ${
                  loginMethod === 'wechat'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <MessageSquare className="w-6 h-6" />
              </button>
              <button
                onClick={() => setLoginMethod('phone')}
                className={`p-3 rounded-lg transition-colors ${
                  loginMethod === 'phone'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Phone className="w-6 h-6" />
              </button>
              <button
                onClick={() => setLoginMethod('password')}
                className={`p-3 rounded-lg transition-colors ${
                  loginMethod === 'password'
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Lock className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
