import React, { useState, useEffect } from 'react';
import { Wrench, Shield, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface MaintenanceGuardProps {
  children: React.ReactNode;
}

export default function MaintenanceGuard({ children }: MaintenanceGuardProps) {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('nyna_maintenance_unlocked') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [errorInput, setErrorInput] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === '220785') {
      localStorage.setItem('nyna_maintenance_unlocked', 'true');
      setIsUnlocked(true);
      setErrorInput(false);
    } else {
      setErrorInput(true);
      setPasscode('');
      // Reset error feedback after 1.5s
      setTimeout(() => setErrorInput(false), 1500);
    }
  };

  const handleLock = () => {
    localStorage.removeItem('nyna_maintenance_unlocked');
    setIsUnlocked(false);
    setPasscode('');
    setShowInput(false);
  };

  // Allow double pressing escape anywhere to toggle the password box (power user shortcut)
  useEffect(() => {
    let lastEsc = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEsc < 500) {
          setShowInput((prev) => !prev);
        }
        lastEsc = now;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isUnlocked) {
    return (
      <>
        {children}
        {/* Floating Unlock Status Button */}
        <div id="maintenance-unlocked-badge" className="fixed bottom-4 right-4 z-[9999]">
          <button
            onClick={handleLock}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white text-xs font-medium rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
            title="Đang trong chế độ xem trước quản trị viên. Click để khóa lại."
          >
            <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
            Chế độ Xem trước: Bật (Click để Khóa)
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans select-none">
      {/* Background Decorative Rings */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-pink-100/30 dark:bg-pink-900/10 blur-[120px]" />
      </div>

      <div className="max-w-md w-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/80 p-8 text-center relative z-10">
        {/* Logo or Brand Accent */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 rounded-full flex items-center justify-center border border-blue-100 dark:border-blue-900">
              <Wrench className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-pulse" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-white border-2 border-white dark:border-slate-800 shadow-sm animate-bounce">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>

        {/* Maintenance Message */}
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight mb-2">
          Website đang bảo trì
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8">
          Chúng tôi đang thực hiện một số nâng cấp hệ thống định kỳ. Xin lỗi vì sự bất tiện này và vui lòng quay lại sau ít phút.
        </p>

        {/* Elegant/Discreet Lock Input Trigger */}
        {!showInput ? (
          <button
            onClick={() => setShowInput(true)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs flex items-center gap-1.5 mx-auto py-1 px-3.5 rounded-full bg-slate-100 dark:bg-slate-800 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Mã bảo mật chỉnh sửa</span>
          </button>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-slate-100 dark:border-slate-700/50 pt-6"
          >
            <form onSubmit={handleUnlock} className="space-y-4">
              <div className="text-left">
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mb-1.5">
                  Nhập mã bảo mật
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Mã số bảo mật (6 ký tự)..."
                    autoFocus
                    className={`w-full px-4 py-2.5 rounded-xl text-sm border bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white transition-all outline-none pr-10 ${
                      errorInput
                        ? 'border-red-500 ring-2 ring-red-100 dark:ring-red-950/50 animate-shake'
                        : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-950/20'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errorInput && (
                  <p className="text-red-500 text-xs mt-1 font-medium">Mã bảo mật không đúng!</p>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowInput(false);
                    setPasscode('');
                    setErrorInput(false);
                  }}
                  className="flex-1 py-2 px-3 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/15 cursor-pointer"
                >
                  Truy cập <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </div>

      {/* Humble Footer info */}
      <div className="absolute bottom-6 text-center text-slate-400 dark:text-slate-500 text-xs select-none pointer-events-none">
        &copy; 2026 Admin Panel. Mọi quyền được bảo lưu.
      </div>
    </div>
  );
}
