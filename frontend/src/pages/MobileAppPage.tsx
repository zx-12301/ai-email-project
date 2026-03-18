import { useState } from 'react';
import { Smartphone, Download, ChevronLeft, Share2, Star, QrCode } from 'lucide-react';

export default function MobileAppPage() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleDownload = () => {
    setDownloading(true);
    // 模拟下载进度
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          alert('下载完成！安装包已保存到下载文件夹');
          return 0;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-base font-medium text-slate-900">手机 APP</h1>
          <div className="flex-1" />
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <Share2 className="w-5 h-5 text-slate-600" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <Star className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* 内容区 */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto">
          {/* APP 信息卡片 */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900 mb-1">速信达企业邮箱</h2>
                <p className="text-sm text-slate-500">版本 3.2.1 | 89.5MB</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded">官方正版</span>
                  <span className="px-2 py-0.5 bg-green-50 text-green-600 text-xs rounded">安全认证</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <span>下载中 {progress}%</span>
                  <div className="w-32 h-2 bg-blue-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>立即下载</span>
                </>
              )}
            </button>
          </div>

          {/* 下载方式 */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">下载方式</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <QrCode className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">扫码下载</h4>
                  <p className="text-xs text-slate-500 mt-1">使用手机扫描二维码下载安装包</p>
                </div>
                <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                  查看二维码
                </button>
              </div>

              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-slate-900">短信下载</h4>
                  <p className="text-xs text-slate-500 mt-1">输入手机号，接收下载链接短信</p>
                </div>
                <button className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">
                  发送短信
                </button>
              </div>
            </div>
          </div>

          {/* 功能特性 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">功能特性</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">📧</div>
                <h4 className="text-sm font-medium text-slate-900">邮件管理</h4>
                <p className="text-xs text-slate-500 mt-1">随时随地处理邮件</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">🔔</div>
                <h4 className="text-sm font-medium text-slate-900">实时通知</h4>
                <p className="text-xs text-slate-500 mt-1">新邮件即时提醒</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="text-sm font-medium text-slate-900">安全加密</h4>
                <p className="text-xs text-slate-500 mt-1">端到端加密保护</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">🤖</div>
                <h4 className="text-sm font-medium text-slate-900">AI 助手</h4>
                <p className="text-xs text-slate-500 mt-1">智能回复与撰写</p>
              </div>
            </div>
          </div>

          {/* 版本信息 */}
          <div className="mt-6 text-center text-xs text-slate-400">
            <p>适用于 iOS 12.0+ 和 Android 8.0+</p>
            <p className="mt-1">© 2027 速信达集团 版权所有</p>
          </div>
        </div>
      </div>
    </div>
  );
}
