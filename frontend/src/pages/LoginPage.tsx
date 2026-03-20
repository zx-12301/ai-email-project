import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, MessageSquare, Eye, EyeOff, User, Phone, Key, CheckCircle, AlertCircle, Shield, Zap, Inbox, Sparkles, Hexagon, Radar, ScanLine, Sun, Moon } from 'lucide-react';
import { authApi } from '../api';
import { useToast } from '../contexts/ToastContext';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { showConfirm } = useToast();
  const [loginMethod, setLoginMethod] = useState<'wechat' | 'phone' | 'password'>('phone');
  const [rememberMe, setRememberMe] = useState(true);
  
  // 手机号登录状态
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [codeSent, setCodeSent] = useState(false);
  const [gettingCode, setGettingCode] = useState(false);  // 获取验证码中
  
  // 密码登录状态
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // 通用状态
  const [loading, setLoading] = useState(false);  // 登录中
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
      setGettingCode(true);  // 只设置获取验证码状态
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
      setGettingCode(false);  // 只清除获取验证码状态
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
    const confirmed = await showConfirm({
      title: '演示登录',
      message: '将以演示用户身份登录，是否确认？',
      confirmText: '确认登录',
      cancelText: '取消'
    });
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
    <div className={`min-h-screen flex ${theme === 'tech' ? 'bg-slate-950' : 'bg-slate-50'}`}>
      {/* 左侧品牌区 */}
      {theme === 'tech' ? (
        /* 科技风格 */
        <div className="flex-1 relative overflow-hidden">
          {/* 深色渐变背景 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950"></div>

          {/* 动态光晕效果 */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/15 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px] animate-pulse delay-500"></div>
          </div>

          {/* 科技网格线 */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
            }}
          ></div>

          {/* 六边形装饰图案 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[15%] left-[8%] w-24 h-24 border border-blue-400/20 rotate-45"></div>
            <div className="absolute top-[18%] left-[11%] w-16 h-16 border border-cyan-400/15 rotate-12"></div>
            <div className="absolute bottom-[25%] right-[12%] w-32 h-32 border border-purple-400/20 -rotate-12"></div>
            <div className="absolute top-[60%] left-[5%] w-20 h-20 border border-indigo-400/15 rotate-45"></div>
          </div>

          {/* 雷达扫描效果 */}
          <div className="absolute bottom-[30%] right-[25%] w-64 h-64 opacity-10">
            <div className="absolute inset-0 border border-blue-400/30 rounded-full animate-[spin_8s_linear_infinite]"></div>
            <div className="absolute inset-4 border border-t-blue-400/50 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-[spin_3s_linear_infinite]"></div>
            <div className="absolute inset-8 border border-blue-400/20 rounded-full"></div>
            <div className="absolute inset-12 border border-blue-400/10 rounded-full"></div>
          </div>

          <div className="relative z-10 h-full flex flex-col justify-between p-16">
            {/* Logo 区 - 玻璃态效果 */}
            <div className="flex items-center gap-4">
              <div className="group relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-blue-400/30 transition-all duration-500">
                  <Inbox className="w-6 h-6 text-blue-400" />
                </div>
                <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl text-white tracking-wide">AI 邮箱</span>
                  <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                </div>
                <span className="text-xs text-slate-400 font-light tracking-wider">INTELLIGENT ENTERPRISE MAIL</span>
              </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 flex flex-col justify-center max-w-2xl">
              {/* 科技标签 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 backdrop-blur-xl border border-blue-400/20 w-fit mb-8">
                <Radar className="w-4 h-4 text-blue-400 animate-pulse" />
                <span className="text-xs text-blue-300 font-medium tracking-wide">NEXT-GEN COMMUNICATION</span>
              </div>

              <h1 className="text-6xl font-bold mb-8 leading-tight">
                <span className="text-white">让每封邮件，</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 animate-[gradient_3s_ease_infinite]">
                  速流转、信得过、达到位
                </span>
              </h1>

              <p className="text-lg text-slate-400 mb-12 leading-relaxed max-w-lg">
                专为企业打造的高效沟通工具，智能分类、安全加密、极速响应
              </p>

              {/* 科技特性卡片 */}
              <div className="grid grid-cols-3 gap-5">
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-2xl border border-white/5 group-hover:border-blue-400/30 transition-all duration-300"></div>
                  <div className="relative p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Zap className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="font-semibold text-white mb-1">极速流转</div>
                    <div className="text-xs text-slate-400">毫秒级收发体验</div>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl border border-white/5 group-hover:border-green-400/30 transition-all duration-300"></div>
                  <div className="relative p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="font-semibold text-white mb-1">安全可靠</div>
                    <div className="text-xs text-slate-400">端到端加密保护</div>
                  </div>
                </div>

                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-white/5 group-hover:border-purple-400/30 transition-all duration-300"></div>
                  <div className="relative p-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <ScanLine className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="font-semibold text-white mb-1">智能管理</div>
                    <div className="text-xs text-slate-400">AI 自动分类处理</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部信息 */}
            <div className="text-sm text-slate-400">
              <div className="flex gap-6 mb-4 backdrop-blur-xl bg-white/5 rounded-2xl p-4 border border-white/5 inline-flex">
                <span className="hover:text-blue-400 cursor-pointer transition-colors duration-300">关于 AI 邮箱</span>
                <span className="w-px h-4 bg-slate-700"></span>
                <span className="hover:text-blue-400 cursor-pointer transition-colors duration-300">用户协议</span>
                <span className="w-px h-4 bg-slate-700"></span>
                <span className="hover:text-blue-400 cursor-pointer transition-colors duration-300">帮助中心</span>
                <span className="w-px h-4 bg-slate-700"></span>
                <span className="hover:text-blue-400 cursor-pointer transition-colors duration-300">用户手册</span>
              </div>
              <div className="text-xs text-slate-500">© 2026 AI Mail Inc. All Rights Reserved</div>
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

          <div className="relative z-10 h-full flex flex-col justify-between p-16">
            {/* Logo 区 */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Inbox className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl text-slate-800 tracking-wide">AI 邮箱</span>
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-xs text-slate-500 font-light tracking-wider">智能企业邮箱系统</span>
              </div>
            </div>

            {/* 主内容区 */}
            <div className="flex-1 flex flex-col justify-center max-w-2xl">
              {/* 产品标签 */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 border border-blue-200 w-fit mb-8">
                <Radar className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-700 font-medium tracking-wide">下一代企业通讯解决方案</span>
              </div>

              <h1 className="text-5xl font-bold mb-6 leading-tight text-slate-800">
                <span>让每封邮件，</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600">
                  速流转、信得过、达到位
                </span>
              </h1>

              <p className="text-lg text-slate-600 mb-12 leading-relaxed max-w-lg">
                专为企业打造的高效沟通工具，智能分类、安全加密、极速响应
              </p>

              {/* 特性卡片 */}
              <div className="grid grid-cols-3 gap-5">
                <div className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="font-semibold text-slate-800 mb-1">极速流转</div>
                  <div className="text-xs text-slate-500">毫秒级收发体验</div>
                </div>

                <div className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="font-semibold text-slate-800 mb-1">安全可靠</div>
                  <div className="text-xs text-slate-500">端到端加密保护</div>
                </div>

                <div className="group relative bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <ScanLine className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="font-semibold text-slate-800 mb-1">智能管理</div>
                  <div className="text-xs text-slate-500">AI 自动分类处理</div>
                </div>
              </div>
            </div>

            {/* 底部信息 */}
            <div className="text-sm text-slate-500">
              <div className="flex gap-6 mb-4 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200 inline-flex">
                <span className="hover:text-blue-600 cursor-pointer transition-colors duration-300">关于 AI 邮箱</span>
                <span className="w-px h-4 bg-slate-300"></span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors duration-300">用户协议</span>
                <span className="w-px h-4 bg-slate-300"></span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors duration-300">帮助中心</span>
                <span className="w-px h-4 bg-slate-300"></span>
                <span className="hover:text-blue-600 cursor-pointer transition-colors duration-300">用户手册</span>
              </div>
              <div className="text-xs text-slate-400">© 2026 AI Mail Inc. All Rights Reserved</div>
            </div>
          </div>
        </div>
      )}

      {/* 右侧登录表单 */}
      {theme === 'tech' ? (
        /* 科技风格表单 */
        <div className="w-[560px] relative flex items-center justify-center p-12 overflow-hidden">
          {/* 背景科技纹路 */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>

          {/* 网格纹路 */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}
          ></div>

          {/* 对角线装饰 */}
          <div className="absolute top-0 right-0 w-40 h-40 border-r border-t border-blue-500/10"></div>
          <div className="absolute top-0 right-4 w-36 h-36 border-r border-t border-cyan-500/10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 border-l border-b border-purple-500/10"></div>

          {/* 浮动光点 */}
          <div className="absolute top-[10%] right-[15%] w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <div className="absolute top-[20%] right-[25%] w-0.5 h-0.5 bg-cyan-400 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-[30%] left-[10%] w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-500"></div>
          <div className="absolute bottom-[15%] left-[20%] w-0.5 h-0.5 bg-green-400 rounded-full animate-pulse delay-700"></div>

          {/* 电路板纹路 */}
          <div className="absolute top-[25%] left-0 w-24 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
          <div className="absolute top-[25%] left-0 w-px h-12 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
          <div className="absolute top-[60%] right-0 w-32 h-px bg-gradient-to-l from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute top-[55%] right-0 w-px h-16 bg-gradient-to-b from-transparent to-cyan-500/20"></div>

          {/* 角落科技装饰 */}
          <div className="absolute top-6 left-6">
            <div className="flex gap-1">
              <div className="w-6 h-px bg-blue-500/30"></div>
              <div className="w-px h-6 bg-blue-500/30"></div>
            </div>
          </div>
          <div className="absolute top-6 right-6">
            <div className="flex gap-1 flex items-end">
              <div className="w-px h-6 bg-cyan-500/30"></div>
              <div className="w-6 h-px bg-cyan-500/30"></div>
            </div>
          </div>
          <div className="absolute bottom-6 left-6">
            <div className="flex gap-1 items-start">
              <div className="w-px h-6 bg-purple-500/30"></div>
              <div className="w-6 h-px bg-purple-500/30"></div>
            </div>
          </div>
          <div className="absolute bottom-6 right-6">
            <div className="flex gap-1 flex items-start">
              <div className="w-6 h-px bg-green-500/30"></div>
              <div className="w-px h-6 bg-green-500/30"></div>
            </div>
          </div>

          {/* 六边形蜂窝纹路 */}
          <div className="absolute top-[15%] left-[20%] opacity-5">
            <svg width="100" height="100" viewBox="0 0 100 100" className="text-blue-400">
              <path d="M50 0 L93 25 L93 75 L50 100 L7 75 L7 25 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="absolute bottom-[20%] right-[25%] opacity-5">
            <svg width="120" height="120" viewBox="0 0 100 100" className="text-purple-400">
              <path d="M50 0 L93 25 L93 75 L50 100 L7 75 L7 25 Z" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>

          {/* 数据流动动画 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-[10%] w-px h-24 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent animate-[dataFlow_3s_linear_infinite]"></div>
            <div className="absolute top-0 left-[30%] w-px h-32 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent animate-[dataFlow_4s_linear_0.5s_infinite]"></div>
            <div className="absolute top-0 right-[15%] w-px h-28 bg-gradient-to-b from-transparent via-purple-400/25 to-transparent animate-[dataFlow_3.5s_linear_1s_infinite]"></div>
          </div>

          {/* 玻璃态遮罩 */}
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-2xl"></div>

          {/* 内容区域 */}
          <div className="relative z-10 w-full max-w-md">
            {/* 表单容器 - 玻璃态面板 */}
            <div className="relative bg-slate-800/40 backdrop-blur-xl rounded-3xl border border-white/5 p-8 shadow-2xl shadow-black/50">
              {/* 主题切换按钮 */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    theme === 'classic'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="切换到经典风格"
                >
                  <Sun className="w-4 h-4" />
                </button>
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    theme === 'tech'
                      ? 'bg-blue-500/20 text-cyan-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="切换到科技风格"
                >
                  <Moon className="w-4 h-4" />
                </button>
              </div>

              {/* 容器顶部光晕 */}
              <div className="absolute -top-px left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>

              {/* 标题区 */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-px bg-gradient-to-r from-blue-500/50 to-transparent"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>
                  <Hexagon className="w-5 h-5 text-blue-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse delay-100"></div>
                  <div className="w-8 h-px bg-gradient-to-l from-cyan-500/50 to-transparent"></div>
                </div>
                <h2 className="text-2xl font-semibold text-white">欢迎回来</h2>
                <p className="text-sm text-slate-400 mt-2">
                  登录您的企业邮箱，开启高效沟通之旅
                </p>
              </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl flex items-center gap-2 text-sm text-red-400">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* 成功提示 */}
          {success && (
            <div className="mb-4 p-3 bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-xl flex items-center gap-2 text-sm text-green-400">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* 登录方式标签页 - 玻璃态 */}
          <div className="relative flex gap-2 mb-6 p-1.5 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden">
            {/* 容器光效 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 pointer-events-none"></div>

            <button
              onClick={() => setLoginMethod('phone')}
              className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden ${
                loginMethod === 'phone'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {loginMethod === 'phone' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_linear_infinite]"></div>
              )}
              <span className="relative z-10">手机号登录</span>
            </button>
            <button
              onClick={() => setLoginMethod('password')}
              className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden ${
                loginMethod === 'password'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {loginMethod === 'password' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_linear_infinite]"></div>
              )}
              <span className="relative z-10">密码登录</span>
            </button>
            <button
              onClick={() => setLoginMethod('wechat')}
              className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 overflow-hidden ${
                loginMethod === 'wechat'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {loginMethod === 'wechat' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_linear_infinite]"></div>
              )}
              <span className="relative z-10">企业微信</span>
            </button>
          </div>

          {/* 企业微信登录 */}
          {loginMethod === 'wechat' && (
            <div className="flex flex-col items-center py-8">
              {/* 二维码 - 科技光晕效果 */}
              <div className="relative mb-8">
                {/* 外圈光晕 */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-3xl blur-2xl animate-pulse"></div>
                {/* 主容器 */}
                <div className="relative w-52 h-52 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl flex items-center justify-center rounded-3xl border border-green-400/20 overflow-hidden">
                  {/* 扫描线动画 */}
                  <div className="absolute inset-0 bg-gradient-to-b from-green-400/0 via-green-400/30 to-green-400/0 h-8 w-full animate-[scan_2s_linear_infinite]"></div>
                  {/* 中心图标 */}
                  <div className="w-44 h-44 bg-slate-900/80 rounded-2xl flex items-center justify-center border border-green-400/10">
                    <MessageSquare className="w-20 h-20 text-green-400" />
                  </div>
                  {/* 四角装饰 */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-green-400/50 rounded-tl-lg"></div>
                  <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-green-400/50 rounded-tr-lg"></div>
                  <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-green-400/50 rounded-bl-lg"></div>
                  <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-green-400/50 rounded-br-lg"></div>
                </div>
              </div>

              <p className="text-sm text-slate-400 mb-8 text-center">
                扫描二维码或使用下方模拟登录
              </p>

              {/* 免登录选项 */}
              <div className="flex items-center gap-2 mb-8">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  id="remember-wechat"
                  className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-green-500 focus:ring-green-500/50"
                />
                <label htmlFor="remember-wechat" className="text-sm text-slate-400 cursor-pointer">
                  30 天内免登录
                </label>
              </div>

              <button
                onClick={handleWechatLogin}
                className="w-full py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500 hover:from-green-600 hover:via-emerald-600 hover:to-green-600 text-white font-semibold rounded-xl transition-all duration-500 flex items-center justify-center gap-2 shadow-lg shadow-green-500/25 hover:shadow-xl hover:shadow-green-500/30 bg-[length:200%_100%] hover:bg-[length:300%_100%]"
              >
                <MessageSquare className="w-5 h-5" />
                模拟登录
              </button>
            </div>
          )}

          {/* 手机号登录 */}
          {loginMethod === 'phone' && (
            <div className="space-y-5">
              {/* 手机号输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  手机号
                </label>
                <div className="relative group">
                  {/* 输入框装饰 - 四角光晕 */}
                  <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  <div className="absolute -inset-px bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 rounded-xl group-focus-within:from-blue-500/30 group-focus-within:via-cyan-500/30 group-focus-within:to-blue-500/30 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                      <Phone className="w-full h-full" />
                    </div>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="请输入手机号"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      maxLength={11}
                    />
                    {/* 右下角装饰 */}
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-blue-500/0 group-focus-within:border-blue-500/30 transition-colors"></div>
                  </div>
                </div>
              </div>

              {/* 验证码输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  验证码
                </label>
                <div className="flex gap-2.5">
                  <div className="relative flex-1 group">
                    {/* 输入框装饰 - 四角光晕 */}
                    <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"></div>
                    <div className="absolute -inset-px bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 rounded-xl group-focus-within:from-blue-500/30 group-focus-within:via-cyan-500/30 group-focus-within:to-blue-500/30 transition-opacity duration-500"></div>

                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                        <Key className="w-full h-full" />
                      </div>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="请输入验证码"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                        maxLength={6}
                      />
                      {/* 右下角装饰 */}
                      <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-blue-500/0 group-focus-within:border-blue-500/30 transition-colors"></div>
                    </div>
                  </div>
                  <button
                    onClick={handleGetCode}
                    disabled={countdown > 0 || !phone || gettingCode}
                    className="relative px-5 py-3.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-medium rounded-xl transition-all duration-300 whitespace-nowrap shadow-lg shadow-blue-500/25 disabled:shadow-none overflow-hidden"
                  >
                    {/* 按钮光效动画 */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-700"></div>

                    {gettingCode ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        发送中
                      </span>
                    ) : (countdown > 0 ? `${countdown}秒` : '获取验证码')}
                  </button>
                </div>
              </div>

              {/* 登录按钮 */}
              <button
                onClick={handlePhoneLogin}
                disabled={loading || gettingCode}
                className="relative w-full py-4 overflow-hidden bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-500 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:shadow-none bg-[length:200%_100%] hover:bg-[length:300%_100%] disabled:bg-[length:100%_100%]"
              >
                {/* 按钮光效动画 */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000"></div>
                {/* 边缘光晕 */}
                <div className="absolute inset-0 rounded-xl ring-2 ring-white/0 hover:ring-white/20 transition-all duration-300"></div>
                {/* 角落装饰 */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-white/20 rounded-tl-lg"></div>
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-white/20 rounded-br-lg"></div>

                {(loading || gettingCode) ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    登录中...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    登 录
                  </>
                )}
              </button>

              {/* 其他选项 */}
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/50"
                  />
                  <span className="text-slate-400">记住我</span>
                </label>
                <button
                  onClick={handleGoToRegister}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  注册账号
                </button>
              </div>
            </div>
          )}

          {/* 密码登录 */}
          {loginMethod === 'password' && (
            <div className="space-y-5">
              {/* 账号输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  手机号
                </label>
                <div className="relative group">
                  {/* 输入框装饰 - 四角光晕 */}
                  <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  <div className="absolute -inset-px bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 rounded-xl group-focus-within:from-blue-500/30 group-focus-within:via-cyan-500/30 group-focus-within:to-blue-500/30 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                      <Phone className="w-full h-full" />
                    </div>
                    <input
                      type="text"
                      value={account}
                      onChange={(e) => setAccount(e.target.value)}
                      placeholder="请输入手机号"
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                      maxLength={11}
                    />
                    {/* 右下角装饰 */}
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-blue-500/0 group-focus-within:border-blue-500/30 transition-colors"></div>
                  </div>
                </div>
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  密码
                </label>
                <div className="relative group">
                  {/* 输入框装饰 - 四角光晕 */}
                  <div className="absolute -inset-px bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-blue-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 blur-sm"></div>
                  <div className="absolute -inset-px bg-gradient-to-r from-blue-500/0 via-cyan-500/0 to-blue-500/0 rounded-xl group-focus-within:from-blue-500/30 group-focus-within:via-cyan-500/30 group-focus-within:to-blue-500/30 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors">
                      <Lock className="w-full h-full" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="请输入密码"
                      className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    {/* 右下角装饰 */}
                    <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-blue-500/0 group-focus-within:border-blue-500/30 transition-colors"></div>
                  </div>
                </div>
              </div>

              {/* 登录按钮 */}
              <button
                onClick={handlePasswordLogin}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-600 disabled:from-slate-700 disabled:via-slate-700 disabled:to-slate-700 text-white font-semibold rounded-xl transition-all duration-500 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 disabled:shadow-none bg-[length:200%_100%] hover:bg-[length:300%_100%]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    登录中...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    登 录
                  </>
                )}
              </button>

              {/* 其他选项 */}
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-500 focus:ring-blue-500/50"
                  />
                  <span className="text-slate-400">记住我</span>
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={handleGoToForgotPassword}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    忘记密码？
                  </button>
                  <button
                    onClick={handleGoToRegister}
                    className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                  >
                    注册账号
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 底部装饰 - 科技风格 */}
          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="text-center text-xs text-slate-500 mb-4">
              登录即表示您同意 <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">用户协议</a> 和 <a href="#" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">隐私政策</a>
            </div>
            {/* 科技装饰线 */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-500/20"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500/20"></div>
              <div className="w-1 h-1 rounded-full bg-cyan-500/20"></div>
              <div className="w-1 h-1 rounded-full bg-purple-500/20"></div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-500/20"></div>
            </div>
          </div>

          {/* 容器底部光晕 */}
          <div className="absolute -bottom-px left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
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

      {/* 内容区域 */}
      <div className="relative z-10 w-full max-w-md">
        {/* 表单容器 */}
        <div className="relative bg-white rounded-3xl border border-slate-200 p-8 shadow-xl shadow-slate-200/50">
          {/* 主题切换按钮 */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                theme === 'classic'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="切换到经典风格"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                theme === 'tech'
                  ? 'bg-blue-100 text-cyan-600'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="切换到科技风格"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* 标题区 */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-gradient-to-r from-blue-400 to-transparent"></div>
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <Inbox className="w-5 h-5 text-blue-500" />
              <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
              <div className="w-8 h-px bg-gradient-to-l from-cyan-400 to-transparent"></div>
            </div>
            <h2 className="text-2xl font-semibold text-slate-800">欢迎回来</h2>
            <p className="text-sm text-slate-500 mt-2">
              登录您的企业邮箱，开启高效沟通之旅
            </p>
          </div>

          {/* 错误提示 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* 成功提示 */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="w-4 h-4" />
              {success}
            </div>
          )}

          {/* 登录方式标签页 */}
          <div className="relative flex gap-2 mb-6 p-1.5 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
            <button
              onClick={() => setLoginMethod('phone')}
              className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                loginMethod === 'phone'
                  ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>手机号登录</span>
            </button>
            <button
              onClick={() => setLoginMethod('password')}
              className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                loginMethod === 'password'
                  ? 'bg-white text-blue-600 shadow-md shadow-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>密码登录</span>
            </button>
            <button
              onClick={() => setLoginMethod('wechat')}
              className={`relative flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 ${
                loginMethod === 'wechat'
                  ? 'bg-white text-green-600 shadow-md shadow-slate-200/50'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <span>企业微信</span>
            </button>
          </div>

          {/* 企业微信登录 */}
          {loginMethod === 'wechat' && (
            <div className="flex flex-col items-center py-8">
              {/* 二维码 */}
              <div className="relative mb-8">
                <div className="w-52 h-52 bg-white rounded-3xl border border-green-200 overflow-hidden shadow-lg shadow-green-100">
                  <div className="w-full h-full flex items-center justify-center">
                    <MessageSquare className="w-20 h-20 text-green-500" />
                  </div>
                </div>
                {/* 四角装饰 */}
                <div className="absolute top-1 left-1 w-6 h-6 border-l-2 border-t-2 border-green-400 rounded-tl-lg"></div>
                <div className="absolute top-1 right-1 w-6 h-6 border-r-2 border-t-2 border-green-400 rounded-tr-lg"></div>
                <div className="absolute bottom-1 left-1 w-6 h-6 border-l-2 border-b-2 border-green-400 rounded-bl-lg"></div>
                <div className="absolute bottom-1 right-1 w-6 h-6 border-r-2 border-b-2 border-green-400 rounded-br-lg"></div>
              </div>

              <p className="text-sm text-slate-500 mb-8 text-center">
                扫描二维码或使用下方模拟登录
              </p>

              {/* 免登录选项 */}
              <div className="flex items-center gap-2 mb-8">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  id="remember-wechat-classic"
                  className="w-4 h-4 rounded border-slate-300 text-green-500 focus:ring-green-500/50"
                />
                <label htmlFor="remember-wechat-classic" className="text-sm text-slate-600 cursor-pointer">
                  30 天内免登录
                </label>
              </div>

              <button
                onClick={handleWechatLogin}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-200 hover:shadow-xl hover:shadow-green-300"
              >
                <MessageSquare className="w-5 h-5" />
                模拟登录
              </button>
            </div>
          )}

          {/* 手机号登录 */}
          {loginMethod === 'phone' && (
            <div className="space-y-5">
              {/* 手机号输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  手机号
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">
                    <Phone className="w-full h-full" />
                  </div>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="请输入手机号"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    maxLength={11}
                  />
                </div>
              </div>

              {/* 验证码输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  验证码
                </label>
                <div className="flex gap-2.5">
                  <div className="relative flex-1">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">
                      <Key className="w-full h-full" />
                    </div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="请输入验证码"
                      className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                      maxLength={6}
                    />
                  </div>
                  <button
                    onClick={handleGetCode}
                    disabled={countdown > 0 || !phone || gettingCode}
                    className="px-5 py-3.5 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-300 text-white font-medium rounded-xl transition-all duration-200 whitespace-nowrap shadow-md shadow-blue-200 disabled:shadow-none"
                  >
                    {gettingCode ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        发送中
                      </span>
                    ) : (countdown > 0 ? `${countdown}秒` : '获取验证码')}
                  </button>
                </div>
              </div>

              {/* 登录按钮 */}
              <button
                onClick={handlePhoneLogin}
                disabled={loading || gettingCode}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 disabled:shadow-none"
              >
                {loading || gettingCode ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    登录中...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    登 录
                  </>
                )}
              </button>

              {/* 其他选项 */}
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500/50"
                  />
                  <span className="text-slate-600">记住我</span>
                </label>
                <button
                  onClick={handleGoToRegister}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  注册账号
                </button>
              </div>
            </div>
          )}

          {/* 密码登录 */}
          {loginMethod === 'password' && (
            <div className="space-y-5">
              {/* 账号输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  手机号
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">
                    <Phone className="w-full h-full" />
                  </div>
                  <input
                    type="text"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    placeholder="请输入手机号"
                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                    maxLength={11}
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">
                    <Lock className="w-full h-full" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full pl-12 pr-12 py-3.5 bg-white border border-slate-300 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* 登录按钮 */}
              <button
                onClick={handlePasswordLogin}
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-300 disabled:to-slate-300 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-200 hover:shadow-xl hover:shadow-blue-300 disabled:shadow-none"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    登录中...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    登 录
                  </>
                )}
              </button>

              {/* 其他选项 */}
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-500 focus:ring-blue-500/50"
                  />
                  <span className="text-slate-600">记住我</span>
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={handleGoToForgotPassword}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    忘记密码？
                  </button>
                  <button
                    onClick={handleGoToRegister}
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    注册账号
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 底部装饰 - 经典风格 */}
          <div className="mt-8 pt-8 border-t border-slate-200">
            <div className="text-center text-xs text-slate-500 mb-4">
              登录即表示您同意 <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">用户协议</a> 和 <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline transition-colors">隐私政策</a>
            </div>
            {/* 装饰线 */}
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-300"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <div className="w-1 h-1 rounded-full bg-cyan-400"></div>
              <div className="w-1 h-1 rounded-full bg-purple-400"></div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-300"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
  );
}
