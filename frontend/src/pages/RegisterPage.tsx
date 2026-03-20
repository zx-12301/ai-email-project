import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Mail, User, Eye, EyeOff, CheckCircle, AlertCircle, Sparkles, Hexagon, Shield, Zap, Inbox } from 'lucide-react';
import { authApi } from '../api';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

export default function RegisterPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 表单状态
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 注册
  const handleRegister = async () => {
    // 验证手机号
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      setError('请输入正确的手机号');
      return;
    }

    // 验证密码
    if (!password || password.length < 6) {
      setError('密码长度至少 6 位');
      return;
    }

    // 验证密码一致性
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }

    try {
      setError('');
      setLoading(true);
      
      const result = await authApi.register({
        phone,
        password,
        email: email || undefined,
        name: name || undefined,
      });
      
      console.log('注册成功:', result);
      navigate('/inbox');
    } catch (err: any) {
      setError(err.message || '注册失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${theme === 'tech' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* 左侧品牌区 */}
      {theme === 'tech' ? (
        /* 科技风格 */
        <div className="flex-1 relative overflow-hidden">
          {/* 深邃渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"></div>

          {/* 动态环境光斑 */}
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[100px] animate-[pulse-glow_4s_ease-in-out_infinite]"></div>

          {/* 科技网格 */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
          }}></div>

          {/* 雷达扫描效果 */}
          <div className="absolute bottom-[30%] right-[25%] w-64 h-64 opacity-10">
            <div className="absolute inset-0 border border-blue-400/30 rounded-full animate-[spin_8s_linear_infinite]"></div>
            <div className="absolute inset-4 border border-cyan-400/20 rounded-full animate-[spin_6s_linear_infinite_reverse]"></div>
          </div>

          <div className="relative z-10 p-12 text-white h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg font-bold text-lg shadow-glow">
                  AI 邮箱
                </div>
                <span className="text-sm text-slate-400">智能企业邮箱系统</span>
              </div>

              <div className="max-w-lg mt-20">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  注册账号
                </h1>
                <h2 className="text-2xl font-light text-slate-300 mb-8">开启智能邮件新体验</h2>

                {/* 功能特性卡片 */}
                <div className="grid grid-cols-2 gap-4 mt-12">
                  <div className="glass p-4 rounded-xl backdrop-blur-xl bg-white/5 border-white/10">
                    <Zap className="w-8 h-8 text-blue-400 mb-2" />
                    <h3 className="font-medium mb-1">智能处理</h3>
                    <p className="text-xs text-slate-400">AI 驱动的高效邮件管理</p>
                  </div>
                  <div className="glass p-4 rounded-xl backdrop-blur-xl bg-white/5 border-white/10">
                    <Shield className="w-8 h-8 text-cyan-400 mb-2" />
                    <h3 className="font-medium mb-1">安全防护</h3>
                    <p className="text-xs text-slate-400">企业级数据加密保护</p>
                  </div>
                  <div className="glass p-4 rounded-xl backdrop-blur-xl bg-white/5 border-white/10">
                    <Inbox className="w-8 h-8 text-purple-400 mb-2" />
                    <h3 className="font-medium mb-1">无限存储</h3>
                    <p className="text-xs text-slate-400">海量空间随心使用</p>
                  </div>
                  <div className="glass p-4 rounded-xl backdrop-blur-xl bg-white/5 border-white/10">
                    <Sparkles className="w-8 h-8 text-pink-400 mb-2" />
                    <h3 className="font-medium mb-1">智能分类</h3>
                    <p className="text-xs text-slate-400">自动识别重要邮件</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部信息 */}
            <div className="text-white text-xs opacity-60">
              <div className="flex gap-4 mb-2">
                <span className="hover:opacity-100 cursor-pointer transition-opacity">关于 AI 邮箱</span>
                <span className="hover:opacity-100 cursor-pointer transition-opacity">用户协议</span>
                <span className="hover:opacity-100 cursor-pointer transition-opacity">帮助中心</span>
              </div>
              <div>© 2026 AI Mail Inc. All Rights Reserved</div>
            </div>
          </div>
        </div>
      ) : (
        /* 经典风格 - 浅色简约设计 */
        <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
          {/* 装饰性背景 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-blue-100/50 to-cyan-100/50 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-gradient-to-tr from-purple-100/40 to-blue-100/40 rounded-full blur-[60px]"></div>
          </div>

          {/* 细线网格装饰 */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(#1e40af 1px, transparent 1px),
                linear-gradient(90deg, #1e40af 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          ></div>

          <div className="relative z-10 p-12 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-lg font-bold text-lg shadow-lg shadow-blue-500/20 text-white">
                  AI 邮箱
                </div>
                <span className="text-sm text-slate-500">智能企业邮箱系统</span>
              </div>

              <div className="max-w-lg mt-20">
                <h1 className="text-5xl font-bold mb-4 text-slate-800">
                  注册账号
                </h1>
                <h2 className="text-2xl font-light text-slate-600 mb-8">开启智能邮件新体验</h2>

                {/* 功能特性卡片 */}
                <div className="grid grid-cols-2 gap-4 mt-12">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center mb-2">
                      <Zap className="w-5 h-5 text-amber-600" />
                    </div>
                    <h3 className="font-medium mb-1 text-slate-800">智能处理</h3>
                    <p className="text-xs text-slate-500">AI 驱动的高效邮件管理</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center mb-2">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-medium mb-1 text-slate-800">安全防护</h3>
                    <p className="text-xs text-slate-500">企业级数据加密保护</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mb-2">
                      <Inbox className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-medium mb-1 text-slate-800">无限存储</h3>
                    <p className="text-xs text-slate-500">海量空间随心使用</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center mb-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-medium mb-1 text-slate-800">智能分类</h3>
                    <p className="text-xs text-slate-500">自动识别重要邮件</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部信息 */}
            <div className="text-slate-500 text-xs">
              <div className="flex gap-4 mb-2 bg-white/80 backdrop-blur-sm rounded-lg p-3 border border-slate-200 inline-flex">
                <span className="hover:text-blue-600 cursor-pointer transition-colors">关于 AI 邮箱</span>
                <span className="w-px h-4 bg-slate-300"></span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">用户协议</span>
                <span className="w-px h-4 bg-slate-300"></span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors">帮助中心</span>
              </div>
              <div>© 2026 AI Mail Inc. All Rights Reserved</div>
            </div>
          </div>
        </div>
      )}

      {/* 右侧注册表单 */}
      {theme === 'tech' ? (
        /* 科技风格表单 */
        <div className="w-[560px] relative flex items-center justify-center p-12 overflow-hidden">
          {/* 深色背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

          {/* 科技网格纹路 */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
          }}></div>

          {/* 浮动光点 */}
          <div className="absolute top-[10%] right-[15%] w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-[20%] left-[10%] w-1 h-1 bg-cyan-400 rounded-full animate-pulse delay-100"></div>
          <div className="absolute bottom-[15%] right-[25%] w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-200"></div>

          {/* 电路板纹路 */}
          <div className="absolute top-[25%] left-0 w-24 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          <div className="absolute bottom-[35%] right-0 w-32 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute top-[60%] left-[20%] w-px h-16 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>

          {/* 六边形装饰 */}
          <div className="absolute top-[15%] right-[10%] opacity-10">
            <Hexagon className="w-16 h-16 text-blue-400" />
          </div>
          <div className="absolute bottom-[25%] left-[5%] opacity-10">
            <Hexagon className="w-12 h-12 text-cyan-400" />
          </div>

          {/* 数据流动动画 */}
          <div className="absolute top-0 left-[10%] w-px h-24 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-[dataFlow_3s_linear_infinite]"></div>
          <div className="absolute bottom-0 right-[15%] w-px h-20 bg-gradient-to-t from-transparent via-cyan-400/30 to-transparent animate-[dataFlow_2.5s_linear_infinite_reverse]"></div>

          {/* 表单容器 */}
          <div className="relative z-10 w-full max-w-md glass p-8 rounded-2xl backdrop-blur-xl bg-slate-900/60 border-white/10 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

            <h2 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              创建账号
            </h2>

            {/* 错误提示 */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-sm text-red-400 backdrop-blur-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* 手机号 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  手机号 <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500/50 rounded-tl-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500/50 rounded-tr-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500/50 rounded-bl-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500/50 rounded-br-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    maxLength={11}
                  />
                </div>
              </div>

              {/* 密码 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  密码 <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500/50 rounded-tl-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500/50 rounded-tr-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500/50 rounded-bl-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500/50 rounded-br-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码（至少 6 位）"
                    className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 确认密码 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  确认密码 <span className="text-red-400">*</span>
                </label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500/50 rounded-tl-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500/50 rounded-tr-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500/50 rounded-bl-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500/50 rounded-br-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入密码"
                    className="w-full pl-12 pr-12 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 邮箱（可选） */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  邮箱 <span className="text-slate-500">（可选）</span>
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500/50 rounded-tl-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500/50 rounded-tr-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500/50 rounded-bl-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500/50 rounded-br-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱"
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* 姓名（可选） */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  姓名 <span className="text-slate-500">（可选）</span>
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                  <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-blue-500/50 rounded-tl-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-blue-500/50 rounded-tr-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-blue-500/50 rounded-bl-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-blue-500/50 rounded-br-lg opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入姓名"
                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              {/* 注册按钮 */}
              <button
                onClick={handleRegister}
                disabled={loading}
                className="relative w-full py-3.5 mt-6 overflow-hidden rounded-xl font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 bg-[length:200%_100%] animate-[gradient_3s_ease_infinite]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      注册中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      立即注册
                    </>
                  )}
                </span>
              </button>

              {/* 登录链接 */}
              <div className="text-center text-sm text-slate-400 mt-6">
                已有账号？{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-400 hover:text-cyan-400 font-medium transition-colors relative group"
                >
                  立即登录
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* 经典风格表单 */
        <div className="w-[560px] relative flex items-center justify-center p-12 overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* 装饰性背景 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-gradient-to-br from-blue-100/40 to-cyan-100/40 rounded-full blur-[60px]"></div>
            <div className="absolute bottom-[-5%] left-[10%] w-[350px] h-[350px] bg-gradient-to-tr from-purple-100/30 to-blue-100/30 rounded-full blur-[50px]"></div>
          </div>

          {/* 细线网格装饰 */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(#1e40af 1px, transparent 1px),
                linear-gradient(90deg, #1e40af 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px'
            }}
          ></div>

          {/* 表单容器 */}
          <div className="relative z-10 w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/50">
            <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">
              创建账号
            </h2>

            {/* 错误提示 */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-600">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-5">
              {/* 手机号 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  手机号 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    maxLength={11}
                  />
                </div>
              </div>

              {/* 密码 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  密码 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码（至少 6 位）"
                    className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 确认密码 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  确认密码 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="请再次输入密码"
                    className="w-full pl-12 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 邮箱（可选） */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  邮箱 <span className="text-slate-500">（可选）</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="请输入邮箱"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* 姓名（可选） */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  姓名 <span className="text-slate-500">（可选）</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="请输入姓名"
                    className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* 注册按钮 */}
              <button
                onClick={handleRegister}
                disabled={loading}
                className="w-full py-3.5 mt-6 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-300 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    注册中...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    立即注册
                  </>
                )}
              </button>

              {/* 登录链接 */}
              <div className="text-center text-sm text-slate-600 mt-6">
                已有账号？{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors underline-offset-2 hover:underline"
                >
                  立即登录
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
