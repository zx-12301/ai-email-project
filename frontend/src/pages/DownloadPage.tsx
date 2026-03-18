import { useState } from 'react';
import { MonitorDown, Download, ChevronLeft, Share2, Star, Apple, Monitor, HardDrive } from 'lucide-react';

export default function DownloadPage() {
  const [downloading, setDownloading] = useState<'windows' | 'mac' | null>(null);
  const [progress, setProgress] = useState(0);

  const handleDownload = (platform: 'windows' | 'mac') => {
    setDownloading(platform);
    setProgress(0);
    
    // 模拟下载进度
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(null);
          alert(`下载完成！${platform === 'windows' ? 'Windows' : 'Mac'} 版安装包已保存到下载文件夹`);
          return 0;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* 顶部导航栏 */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-base font-medium text-slate-900">下载桌面端</h1>
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
        <div className="max-w-4xl mx-auto">
          {/* 主标题 */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-xl">
              <MonitorDown className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">速信达企业邮箱桌面版</h1>
            <p className="text-slate-500">更高效、更专业的桌面邮件体验</p>
          </div>

          {/* 下载卡片 */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Windows 版 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center">
                  <Monitor className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">Windows 版</h3>
                  <p className="text-sm text-slate-500">版本 3.2.1 | 156MB</p>
                </div>
              </div>

              <button
                onClick={() => handleDownload('windows')}
                disabled={downloading === 'windows'}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {downloading === 'windows' ? (
                  <>
                    <span>下载中 {progress}%</span>
                    <div className="w-24 h-2 bg-blue-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-100"
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

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
                <span>支持 Win10/Win11</span>
                <span>•</span>
                <span>64 位系统</span>
              </div>
            </div>

            {/* Mac 版 */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Apple className="w-8 h-8 text-slate-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">Mac 版</h3>
                  <p className="text-sm text-slate-500">版本 3.2.1 | 142MB</p>
                </div>
              </div>

              <button
                onClick={() => handleDownload('mac')}
                disabled={downloading === 'mac'}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {downloading === 'mac' ? (
                  <>
                    <span>下载中 {progress}%</span>
                    <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-white transition-all duration-100"
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

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500">
                <span>支持 macOS 11+</span>
                <span>•</span>
                <span>Intel/Apple Silicon</span>
              </div>
            </div>
          </div>

          {/* 功能特性 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">桌面版专属功能</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">⚡</div>
                <h4 className="text-sm font-medium text-slate-900">离线访问</h4>
                <p className="text-xs text-slate-500 mt-1">无网络也能查看已同步邮件</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">🔔</div>
                <h4 className="text-sm font-medium text-slate-900">桌面通知</h4>
                <p className="text-xs text-slate-500 mt-1">新邮件即时弹窗提醒</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">📎</div>
                <h4 className="text-sm font-medium text-slate-900">大附件</h4>
                <p className="text-xs text-slate-500 mt-1">支持最大 3GB 附件传输</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">🔒</div>
                <h4 className="text-sm font-medium text-slate-900">本地加密</h4>
                <p className="text-xs text-slate-500 mt-1">数据本地加密存储</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">⌨️</div>
                <h4 className="text-sm font-medium text-slate-900">快捷键</h4>
                <p className="text-xs text-slate-500 mt-1">丰富快捷键提升效率</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <div className="text-2xl mb-2">💾</div>
                <h4 className="text-sm font-medium text-slate-900">本地归档</h4>
                <p className="text-xs text-slate-500 mt-1">邮件本地备份与归档</p>
              </div>
            </div>
          </div>

          {/* 系统要求 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">系统要求</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <HardDrive className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-900">存储空间</h4>
                  <p className="text-xs text-slate-500 mt-1">至少需要 500MB 可用存储空间</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Monitor className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-900">内存要求</h4>
                  <p className="text-xs text-slate-500 mt-1">建议 4GB 以上内存</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Share2 className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-slate-900">网络要求</h4>
                  <p className="text-xs text-slate-500 mt-1">需要稳定的互联网连接</p>
                </div>
              </div>
            </div>
          </div>

          {/* 底部信息 */}
          <div className="mt-8 text-center text-xs text-slate-400">
            <p>© 2027 速信达集团 版权所有 | 隐私政策 | 用户协议</p>
          </div>
        </div>
      </div>
    </div>
  );
}
