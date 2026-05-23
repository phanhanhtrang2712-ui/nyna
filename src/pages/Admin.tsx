import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Newspaper, Package, Briefcase, 
  MapPin, LogOut, Plus, Trash2, Edit, Save, X, Image as ImageIcon, FileText, ShieldCheck,
  PlayCircle, Settings, Download, Upload, Database, CreditCard,
  Calendar, TrendingUp, BarChart3, Filter, Mail, MessageSquare, Menu
} from 'lucide-react';
import { getSupabase } from '../lib/supabase';
import { dataService } from '../services/dataService';
import { VideoItem, OrderItem, ProductItem, BrandItem, CmsUser } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { getYoutubeThumbnail } from '../lib/youtube';

const AdminPage = () => {
  const [currentUser, setCurrentUser] = useState<{ email: string; fullName: string; role: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showSuccess = (msg: string) => setNotification({ message: msg, type: 'success' });
  const showError = (msg: string) => setNotification({ message: msg, type: 'error' });

  // Check existing session on boot
  useEffect(() => {
    const checkSession = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        if (session && session.user && session.user.email) {
          const { data, error } = await supabase
            .from('cms_users')
            .select('*')
            .eq('email', session.user.email)
            .maybeSingle();

          if (data) {
            setCurrentUser({
              email: session.user.email,
              fullName: data.full_name || 'Quản trị viên',
              role: data.role || 'nhân viên'
            });
            setIsAuthenticated(true);
          } else {
            // Logged in but not in cms_users. Sign out.
            await supabase.auth.signOut();
            setIsAuthenticated(false);
          }
        }
      } catch (err) {
        console.error("Lỗi kiểm tra phiên đăng nhập:", err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      dataService.list('news').then(() => setDbStatus('connected')).catch(() => setDbStatus('error'));
    }
  }, [isAuthenticated]);

  const [activeTab, setActiveTab] = useState<'news' | 'products' | 'jobs' | 'distributors' | 'pages' | 'videos' | 'settings' | 'sales_report' | 'cms_users' | 'contacts'>('news');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.username, // Username input receives email
        password: loginData.password,
      });

      if (error) {
        setLoginError(error.message === 'Invalid login credentials' ? 'Email hoặc mật khẩu không chính xác' : error.message);
        setIsLoggingIn(false);
        return;
      }

      if (data && data.user && data.user.email) {
        const { data: userData, error: userError } = await supabase
          .from('cms_users')
          .select('*')
          .eq('email', data.user.email)
          .maybeSingle();

        if (userData) {
          setCurrentUser({
            email: data.user.email,
            fullName: userData.full_name || 'Quản trị viên',
            role: userData.role || 'nhân viên'
          });
          setIsAuthenticated(true);
          showSuccess(`Xin chào ${userData.full_name || data.user.email}!`);
        } else {
          await supabase.auth.signOut();
          setLoginError('Tài khoản này chưa được cấp quyền truy cập hệ thống CMS. Vui lòng liên hệ quản trị viên.');
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Lỗi đăng nhập hệ thống.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mb-4"></div>
        <div className="text-blue-900 font-bold mb-4">Đang khởi tạo hệ thống...</div>
        <a href="/" className="text-gray-400 text-sm hover:underline">Quay về trang chủ</a>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl max-w-md w-full border border-blue-50">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <LayoutDashboard className="text-blue-900 w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-blue-900 mb-2 text-center uppercase tracking-tighter">NYNA CMS</h1>
          <p className="text-gray-500 mb-8 text-center text-sm">Hệ thống quản trị nội dung website</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email đăng nhập</label>
              <input 
                type="email"
                required
                disabled={isLoggingIn}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-medium disabled:opacity-50"
                placeholder="VD: admin@example.com"
                value={loginData.username}
                onChange={e => setLoginData({...loginData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mật khẩu</label>
              <input 
                type="password"
                required
                disabled={isLoggingIn}
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-medium disabled:opacity-50"
                placeholder="Nhập mật khẩu"
                value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})}
              />
            </div>

            {loginError && (
              <div className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-xl text-center">
                {loginError}
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider mt-4 disabled:bg-blue-950 disabled:scale-100 disabled:opacity-80"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ĐANG ĐĂNG NHẬP...
                </span>
              ) : 'ĐĂNG NHẬP HỆ THỐNG'}
            </button>
            
            <a 
              href="/"
              className="block w-full py-4 text-center text-gray-400 font-bold hover:text-blue-900 transition-all text-sm"
            >
              Quay lại trang chủ
            </a>
          </form>
          
          <div className="mt-8 pt-8 border-t border-gray-100 text-[10px] text-center text-gray-400 uppercase tracking-widest leading-relaxed">
            QUẢN TRỊ: PHAN THÁI BÌNH
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-blue-900 text-white px-6 py-4 flex items-center justify-between shadow-md sticky top-0 z-45">
        <h2 className="text-xl font-black tracking-tighter uppercase mb-0">NYNA CMS</h2>
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="p-2 hover:bg-white/10 rounded-xl transition-all"
        >
          <Menu size={24} />
        </button>
      </header>

      {/* Mobile Sidebar (Drawer) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Sidebar Content */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-80 bg-blue-900 text-white p-6 flex flex-col h-full z-10 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black tracking-tighter uppercase">NYNA CMS</h2>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/15 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-4 py-2 rounded-xl bg-white/5 flex items-center gap-2 mb-6 w-fit">
                <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : dbStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                  {dbStatus === 'connected' ? 'Database Online' : dbStatus === 'error' ? 'Database Offline' : 'Connecting...'}
                </span>
              </div>

              <nav className="flex-1 space-y-2">
                {[
                  { id: 'news', icon: <Newspaper size={18} />, label: 'Quản lý Tin tức' },
                  { id: 'products', icon: <Package size={18} />, label: 'Quản lý Sản phẩm' },
                  { id: 'sales_report', icon: <BarChart3 size={18} />, label: 'Báo cáo Bán hàng' },
                  { id: 'videos', icon: <PlayCircle size={18} />, label: 'Thư viện Video' },
                  { id: 'jobs', icon: <Briefcase size={18} />, label: 'Quản lý Tuyển dụng' },
                  { id: 'distributors', icon: <MapPin size={18} />, label: 'Nhà phân phối' },
                  { id: 'pages', icon: <FileText size={18} />, label: 'Nội dung trang' },
                  { id: 'contacts', icon: <Mail size={18} />, label: 'Tin nhắn liên hệ' },
                  ...(currentUser?.role === 'quản trị' ? [{ id: 'cms_users', icon: <ShieldCheck size={18} />, label: 'Phân quyền CMS' }] : []),
                  { id: 'settings', icon: <Settings size={18} />, label: 'Cấu hình & Backup' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3.5 px-5 py-3 border border-transparent rounded-2xl transition-all duration-300 text-left ${
                      activeTab === tab.id ? 'bg-white text-blue-900 shadow-xl shadow-black/10 font-bold' : 'hover:bg-white/10 text-blue-100 font-semibold'
                    }`}
                  >
                    {tab.icon}
                    <span className="text-xs tracking-wide">{tab.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 mb-6 bg-white/5 p-3.5 rounded-2xl">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white shadow-lg text-xs">
                    {currentUser?.fullName 
                      ? currentUser.fullName.split(' ').pop()?.slice(0, 2).toUpperCase() 
                      : currentUser?.email?.slice(0, 2).toUpperCase() || 'AD'}
                  </div>
                  <div>
                    <div className="text-[12px] font-black tracking-tight truncate max-w-[150px]" title={currentUser?.fullName || currentUser?.email}>
                      {currentUser?.fullName || currentUser?.email}
                    </div>
                    <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">
                      {currentUser?.role === 'quản trị' ? 'Quản trị viên' : 'Nhân viên CMS'}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMobileSidebarOpen(false);
                  }}
                  className="w-full flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white transition-all duration-300"
                >
                  <LogOut size={18} />
                  <span className="font-bold text-xs uppercase tracking-wider">Đăng xuất</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-72 bg-blue-900 text-white p-8 hidden md:flex flex-col border-r border-white/5">
        <h2 className="text-3xl font-black mb-12 tracking-tighter uppercase">NYNA</h2>
        <div className="mt-4 px-6 py-2 rounded-xl bg-white/5 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : dbStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
            {dbStatus === 'connected' ? 'Database Online' : dbStatus === 'error' ? 'Database Offline' : 'Connecting...'}
          </span>
        </div>
        <nav className="flex-1 space-y-3 mt-10">
          {[
            { id: 'news', icon: <Newspaper size={20} />, label: 'Quản lý Tin tức' },
            { id: 'products', icon: <Package size={20} />, label: 'Quản lý Sản phẩm' },
            { id: 'sales_report', icon: <BarChart3 size={20} />, label: 'Báo cáo Bán hàng' },
            { id: 'videos', icon: <PlayCircle size={20} />, label: 'Thư viện Video' },
            { id: 'jobs', icon: <Briefcase size={20} />, label: 'Quản lý Tuyển dụng' },
            { id: 'distributors', icon: <MapPin size={20} />, label: 'Nhà phân phối' },
            { id: 'pages', icon: <FileText size={20} />, label: 'Nội dung trang' },
            { id: 'contacts', icon: <Mail size={20} />, label: 'Tin nhắn liên hệ' },
            ...(currentUser?.role === 'quản trị' ? [{ id: 'cms_users', icon: <ShieldCheck size={20} />, label: 'Phân quyền CMS' }] : []),
            { id: 'settings', icon: <Settings size={20} />, label: 'Cấu hình & Backup' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
                activeTab === tab.id ? 'bg-white text-blue-900 shadow-xl shadow-black/10' : 'hover:bg-white/10 text-blue-100'
              }`}
            >
              {tab.icon}
              <span className="font-bold text-sm tracking-wide">{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-8 border-t border-white/10">
          <div className="flex items-center gap-4 mb-8 bg-white/5 p-4 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white shadow-lg text-sm">
              {currentUser?.fullName 
                ? currentUser.fullName.split(' ').pop()?.slice(0, 2).toUpperCase() 
                : currentUser?.email?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div className="overflow-hidden">
              <div className="text-[14px] font-black tracking-tight truncate max-w-[150px]" title={currentUser?.fullName || currentUser?.email}>
                {currentUser?.fullName || currentUser?.email}
              </div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                {currentUser?.role === 'quản trị' ? 'Quản trị viên' : 'Nhân viên CMS'}
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-300 hover:text-white transition-all duration-300 shadow-lg hover:shadow-red-500/20"
          >
            <LogOut size={20} />
            <span className="font-bold text-sm uppercase tracking-wider">Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'news' && <NewsManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'products' && <ProductManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'sales_report' && <SalesReportManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'videos' && <VideoManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'jobs' && <JobManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'distributors' && <DistributorManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'pages' && <PageManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'contacts' && <ContactsManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'cms_users' && currentUser?.role === 'quản trị' && <CmsUserManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'settings' && <SettingsManager onSuccess={showSuccess} onError={showError} />}
        </div>
      </main>

      {/* Toast Notification */}
      {notification && (
        <div className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up ${
          notification.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {notification.type === 'success' ? <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">✓</div> : <X size={20} />}
          <span className="font-bold tracking-tight">{notification.message}</span>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS (MANAGERS) ---

const NewsManager = ({ onSuccess, onError }: { onSuccess: (m: string) => void, onError: (m: string) => void }) => {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', date: '', excerpt: '', image: '', content: '' });
  const [uploading, setUploading] = useState(false);

  const load = () => {
    dataService.list<any>('news').then(setItems);
  };
  
  useEffect(() => { load(); }, []);

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      date: item.date,
      excerpt: item.excerpt,
      image: item.image,
      content: item.content || ''
    });
    setEditingId(item.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Dung lượng ảnh quá lớn (Vui lòng chọn ảnh < 2MB)");
      return;
    }

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData({ ...formData, image: reader.result as string });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      if (editingId) {
        await dataService.update('news', editingId, formData);
        onSuccess("Đã cập nhật bài viết thành công!");
      } else {
        await dataService.create('news', formData);
        onSuccess("Đã đăng bài viết thành công!");
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', date: '', excerpt: '', image: '', content: '' });
      await load();
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('column') || err.message?.includes('category') || err.message?.includes('description')) {
        onError("Lỗi: Thiếu cột dữ liệu trong Database. Vui lòng copy nội dung file 'supabase_schema.sql' vào SQL Editor trên Supabase Dashboard và nhấn RUN để cập nhật. Sau khi chạy SQL, hãy tải lại trang (F5) để áp dụng.");
      } else {
        onError(err.message || "Có lỗi khi lưu bài viết");
      }
    } finally {
      setUploading(false);
    }
  };

  const cancelForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ title: '', date: '', excerpt: '', image: '', content: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Quản lý tin tức</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-emerald-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 transition-all"
        >
          <Plus size={20} /> Thêm bài viết
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-xl mb-8 border border-blue-50">
          <h3 className="text-xl font-black text-blue-900 mb-6 uppercase tracking-tight">{editingId ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề bài viết</label>
              <input 
                required
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-900 focus:bg-white outline-none transition-all"
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-2">Ngày đăng</label>
              <input 
                type="date"
                required
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-900 focus:bg-white outline-none transition-all"
                value={formData.date} 
                onChange={e => setFormData({...formData, date: e.target.value})} 
              />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Hình ảnh bài viết</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 flex items-center justify-center gap-2 hover:border-blue-900 transition-all bg-gray-50">
                    <ImageIcon className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-500">{uploading ? 'Đang tải...' : 'Chọn ảnh từ máy'}</span>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                {formData.image && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden border">
                    <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Tóm tắt nội dung (Hiển thị ở danh sách ngoài trang chủ)</label>
              <textarea 
                required
                className="w-full p-3 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-900 focus:bg-white outline-none transition-all h-24"
                value={formData.excerpt} 
                onChange={e => setFormData({...formData, excerpt: e.target.value})} 
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung chi tiết bài viết (Toàn bộ bài viết)</label>
              <p className="text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest italic flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                Hỗ trợ Markdown. Để chèn ảnh: ![Tên mô tả](đường-dẫn-ảnh)
              </p>
              <textarea 
                className="w-full p-4 bg-gray-50 rounded-xl border-2 border-transparent focus:border-blue-900 focus:bg-white outline-none transition-all h-64"
                value={formData.content} 
                onChange={e => setFormData({...formData, content: e.target.value})} 
                placeholder="Nhập nội dung đầy đủ của bài viết tại đây..."
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={uploading} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2">
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (editingId ? 'Cập nhật bài viết' : 'Lưu bài viết')}
            </button>
            <button type="button" onClick={cancelForm} className="px-8 py-3 rounded-xl font-bold text-gray-500">Hủy</button>
          </div>
        </form>
      )}

      <div className="grid gap-4">
        {items.length === 0 && <div className="text-center py-12 text-gray-400 font-bold italic">Chưa có bài viết nào.</div>}
        {items.map(item => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className="w-16 h-12 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                <img src={item.image} className="w-full h-full object-cover" alt="Thumb" />
              </div>
              <div>
                <h4 className="font-bold text-blue-900 line-clamp-1">{item.title}</h4>
                <p className="text-[12px] text-gray-400">{item.date}</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit size={18} />
              </button>
              <button 
                onClick={async () => { 
                  if(confirm('Bạn có chắc muốn xóa bài viết này?')) { 
                    await dataService.delete('news', item.id); 
                    load(); 
                    onSuccess("Đã xóa bài viết!");
                  } 
                }} 
                className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MOCK PRODUCT MANAGER (Similar pattern) ---
const ProductManager = ({ onSuccess, onError }: { onSuccess: (m: string) => void, onError: (m: string) => void }) => {
  const [items, setItems] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    brand: '', 
    image: '', 
    images: [] as string[],
    price: '', 
    original_price: '',
    category: '', 
    description: '' 
  });
  const [brandFormData, setBrandFormData] = useState({ 
    name: '', 
    description: '', 
    color: 'text-blue-600',
    image: '',
    content: '',
    slug: ''
  });
  const [uploading, setUploading] = useState(false);
  const [uploadingBrandImage, setUploadingBrandImage] = useState(false);

  const [filterCategory, setFilterCategory] = useState('Tất cả');
  const [filterBrand, setFilterBrand] = useState('Tất cả');

  const filterCategories = React.useMemo(() => {
    return ['Tất cả', ...Array.from(new Set(items.map(item => item.category).filter(Boolean)))];
  }, [items]);

  const filterBrands = React.useMemo(() => {
    return ['Tất cả', ...Array.from(new Set(items.map(item => item.brand).filter(Boolean)))];
  }, [items]);

  const filteredItems = React.useMemo(() => {
    return items.filter(item => {
      const matchCategory = filterCategory === 'Tất cả' || item.category === filterCategory;
      const matchBrand = filterBrand === 'Tất cả' || item.brand === filterBrand;
      return matchCategory && matchBrand;
    });
  }, [items, filterCategory, filterBrand]);

  const load = () => {
    dataService.list<any>('products').then(setItems).catch(err => {
      console.error("Lỗi tải sản phẩm:", err);
      if (err.message?.includes('category')) {
        onError("Database thiếu cột 'category'. Vui lòng chạy lệnh SQL trong file schema để cập nhật.");
      }
    });
    dataService.list<any>('brands').then(res => {
      setBrands(res);
      if (res.length > 0 && !formData.brand) {
        setFormData(prev => ({ ...prev, brand: res[0].name }));
      }
    });
  };

  useEffect(() => { load(); }, []);

  const handleEditProduct = (item: any) => {
    setFormData({
      title: item.title,
      brand: item.brand,
      image: item.image,
      images: item.images || [],
      price: item.price.toString(),
      original_price: (item.original_price || '').toString(),
      category: item.category || '',
      description: item.description || ''
    });
    setEditingId(item.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditBrand = (brand: any) => {
    setBrandFormData({
      name: brand.name,
      description: brand.description || '',
      color: brand.color,
      image: brand.image || '',
      content: brand.content || '',
      slug: brand.slug || ''
    });
    setEditingBrandId(brand.id);
    setIsAddingBrand(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = true) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Dung lượng ảnh quá lớn (Vui lòng chọn ảnh < 2MB)");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (isMain) {
        setFormData({ ...formData, image: reader.result as string });
      } else {
        const newImages = [...formData.images, reader.result as string].slice(0, 3);
        setFormData({ ...formData, images: newImages });
      }
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleBrandFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("Dung lượng ảnh quá lớn (Vui lòng chọn ảnh < 2MB)");
      return;
    }
    setUploadingBrandImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setBrandFormData({ ...brandFormData, image: reader.result as string });
      setUploadingBrandImage(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      if (!formData.brand && brands.length > 0) {
        formData.brand = brands[0].name;
      }
      
      const payload = { 
        ...formData, 
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        category: formData.category || 'Chưa phân loại',
        description: formData.description || '',
        features: [{label: 'Nổi bật', icon: 'zap'}] 
      };

      if (editingId) {
        await dataService.update('products', editingId, payload);
        onSuccess("Đã cập nhật sản phẩm!");
      } else {
        await dataService.create('products', payload);
        onSuccess("Đã thêm sản phẩm mới!");
      }
      
      setIsAdding(false);
      setEditingId(null);
      setFormData({ 
        title: '', 
        brand: brands[0]?.name || '', 
        image: '', 
        images: [],
        price: '', 
        original_price: '',
        category: '', 
        description: '' 
      });
      await load();
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('column') || err.message?.includes('category') || err.message?.includes('description')) {
        onError("Lỗi: Thiếu cột dữ liệu trong Database. Vui lòng copy nội dung file 'supabase_schema.sql' vào SQL Editor trên Supabase Dashboard và nhấn RUN để cập nhật. Sau khi chạy SQL, hãy tải lại trang (F5) để áp dụng.");
      } else {
        onError(err.message || "Lỗi khi lưu sản phẩm");
      }
    } finally {
      setUploading(false);
    }
  };

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      const payload = {
        ...brandFormData,
        slug: brandFormData.slug || brandFormData.name.toLowerCase().replace(/ /g, '-')
      };

      if (editingBrandId) {
        await dataService.update('brands', editingBrandId, payload);
        onSuccess("Đã cập nhật thương hiệu!");
      } else {
        await dataService.create('brands', payload);
        onSuccess("Đã thêm thương hiệu mới!");
      }
      setIsAddingBrand(false);
      setEditingBrandId(null);
      setBrandFormData({ name: '', description: '', color: 'text-blue-600', image: '', content: '', slug: '' });
      await load();
    } catch (err: any) {
      onError(err.message || "Lỗi khi tạo thương hiệu");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Quản lý sản phẩm & Thương hiệu</h2>
        <div className="flex gap-3">
          <button onClick={() => setIsAddingBrand(true)} className="bg-pink-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-pink-600 transition-all shadow-lg shadow-pink-500/20">
            <Plus size={20} /> Thêm Thương hiệu
          </button>
          <button onClick={() => setIsAdding(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            <Plus size={20} /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Brand Form */}
      {isAddingBrand && (
        <form onSubmit={handleAddBrand} className="bg-pink-50/50 p-8 rounded-[32px] shadow-xl mb-8 border border-pink-100">
           <h3 className="text-xl font-black text-pink-600 mb-6 uppercase tracking-tight">{editingBrandId ? 'Chỉnh sửa thương hiệu' : 'Cấu hình thương hiệu mới'}</h3>
           <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Tên thương hiệu</label>
                <input required className="w-full p-3 bg-white border-2 border-transparent focus:border-pink-500 rounded-xl outline-none transition-all" value={brandFormData.name} onChange={e=>setBrandFormData({...brandFormData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Màu sắc nhận diện</label>
                <select className="w-full p-3 bg-white border-2 border-transparent focus:border-pink-500 rounded-xl outline-none transition-all" value={brandFormData.color} onChange={e=>setBrandFormData({...brandFormData, color: e.target.value})}>
                  <option value="text-blue-600">Xanh dương (Blue)</option>
                  <option value="text-pink-600">Hồng (Pink)</option>
                  <option value="text-emerald-600">Xanh lá (Emerald)</option>
                  <option value="text-indigo-600">Tím xanh (Indigo)</option>
                  <option value="text-orange-600">Cam (Orange)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Mô tả ngắn (Hiển thị ở danh sách)</label>
                <input required className="w-full p-3 bg-white border-2 border-transparent focus:border-pink-500 rounded-xl outline-none transition-all" value={brandFormData.description} onChange={e=>setBrandFormData({...brandFormData, description: e.target.value})} />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Hình ảnh thương hiệu (Menu Thương hiệu)</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center gap-2 bg-white hover:border-pink-500 transition-all">
                      <ImageIcon className="text-gray-400 w-5 h-5" />
                      <span className="text-sm font-bold text-gray-400">{uploadingBrandImage ? 'Đang tải...' : 'Chọn ảnh thương hiệu'}</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleBrandFileChange} />
                  </label>
                  {brandFormData.image && <img src={brandFormData.image} className="w-16 h-16 rounded-xl border object-cover shadow-sm" alt="brand" />}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Slug (Đường dẫn tinh gọn)</label>
                <input className="w-full p-3 bg-white border-2 border-transparent focus:border-pink-500 rounded-xl outline-none transition-all" value={brandFormData.slug} onChange={e=>setBrandFormData({...brandFormData, slug: e.target.value})} placeholder="VD: nyna-baby" />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Giới thiệu chi tiết (Markdown)</label>
                <textarea rows={6} className="w-full p-3 bg-white border-2 border-transparent focus:border-pink-500 rounded-xl outline-none transition-all resize-none" value={brandFormData.content} onChange={e=>setBrandFormData({...brandFormData, content: e.target.value})} placeholder="Nhập giới thiệu đầy đủ về thương hiệu (Hỗ trợ Markdown)..." />
              </div>
           </div>
           <div className="flex gap-3">
            <button type="submit" disabled={uploading} className="bg-pink-600 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2">
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (editingBrandId ? 'Cập nhật' : 'Lưu thương hiệu')}
            </button>
            <button type="button" onClick={() => {setIsAddingBrand(false); setEditingBrandId(null);}} className="px-8 py-3 rounded-xl font-bold text-gray-400">Hủy</button>
           </div>
        </form>
      )}

      {/* Product Form */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-xl mb-8 border border-blue-50">
           <h3 className="text-xl font-black text-blue-900 mb-6 uppercase tracking-tight">{editingId ? 'Chỉnh sửa sản phẩm' : 'Chi tiết sản phẩm mới'}</h3>
           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Tên sản phẩm</label>
                <input required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl outline-none transition-all" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Thuộc thương hiệu</label>
                <select className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl outline-none transition-all font-bold" value={formData.brand} onChange={e=>setFormData({...formData, brand: e.target.value})}>
                  {brands.map(b => (
                    <option key={b.id} value={b.name}>{b.name}</option>
                  ))}
                  {brands.length === 0 && <option value="">Đang tải thương hiệu...</option>}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Giá gốc (Gạch bỏ nếu có)</label>
                <input type="number" className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl outline-none transition-all placeholder:font-normal" value={formData.original_price} onChange={e=>setFormData({...formData, original_price: e.target.value})} placeholder="VD: 250000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Giá bán hiện tại (VND)</label>
                <input type="number" required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl outline-none transition-all" value={formData.price} onChange={e=>setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Mô tả & Công dụng sản phẩm</label>
                <textarea rows={4} className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl outline-none transition-all resize-none" value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} placeholder="Nhập chi tiết về ưu điểm, công dụng, đặc tính của sản phẩm..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Nhóm sản phẩm (Phân loại)</label>
                <input required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-xl outline-none transition-all" value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value})} placeholder="VD: Tã bỉm em bé, Băng vệ sinh..." />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Hình ảnh sản phẩm (Tối đa 3 ảnh bổ sung + 1 ảnh chính)</label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center gap-2 bg-gray-50 hover:border-blue-900 transition-all">
                        <ImageIcon className="text-gray-400 w-5 h-5" />
                        <span className="text-sm font-bold text-gray-400">{uploading ? 'Đang tải...' : 'Thêm ảnh chính'}</span>
                      </div>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, true)} />
                    </label>
                    {formData.image && <img src={formData.image} className="w-16 h-16 rounded-xl border object-contain bg-white shadow-sm" alt="main" />}
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <label className={`flex-1 cursor-pointer ${formData.images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center gap-2 bg-gray-50 hover:border-blue-900 transition-all">
                        <Plus className="text-gray-400 w-5 h-5" />
                        <span className="text-sm font-bold text-gray-400">Thêm ảnh phụ ({formData.images.length}/3)</span>
                      </div>
                      <input type="file" disabled={formData.images.length >= 3} className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, false)} />
                    </label>
                    <div className="flex gap-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} className="w-16 h-16 rounded-xl border object-contain bg-white shadow-sm" alt="sub" />
                          <button 
                            type="button"
                            onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
           </div>
           <div className="flex gap-3">
            <button type="submit" disabled={uploading} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2">
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (editingId ? 'Cập nhật' : 'Lưu sản phẩm')}
            </button>
            <button type="button" onClick={() => {setIsAdding(false); setEditingId(null);}} className="px-8 py-3 rounded-xl font-bold text-gray-400">Hủy</button>
           </div>
        </form>
      )}

      {/* Brands Summary List */}
      <div className="mb-12">
        <h3 className="text-sm font-black text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
          <div className="w-8 h-[2px] bg-pink-500 rounded-full"></div>
          Thương hiệu hiện có
        </h3>
        <div className="flex flex-wrap gap-4">
          {brands.map(brand => (
            <div key={brand.id} className="bg-white px-6 py-4 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group">
              <div>
                <div className={`font-black uppercase tracking-tight text-sm ${brand.color}`}>{brand.name}</div>
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{brand.description}</div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleEditBrand(brand)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-xl">
                  <Edit size={16} />
                </button>
                <button 
                  onClick={async () => { if(confirm('Xóa thương hiệu này sẽ ảnh hưởng đến lọc sản phẩm. Tiếp tục?')) { await dataService.delete('brands', brand.id); load(); onSuccess("Đã xóa thương hiệu!"); } }}
                  className="p-2 text-red-400 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {brands.length === 0 && <p className="text-gray-400 text-xs font-bold italic">Chưa có thương hiệu được thiết lập.</p>}
        </div>
      </div>

      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-sm font-black text-gray-400 flex items-center gap-2 uppercase tracking-widest">
            <div className="w-8 h-[2px] bg-blue-500 rounded-full"></div>
            Kho hàng sản phẩm ({filteredItems.length})
          </h3>
          
          <div className="flex flex-wrap gap-3">
             <div className="flex items-center gap-2 bg-gray-100/80 px-4 py-2 rounded-2xl border border-gray-100">
               <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Nhóm:</span>
               <select 
                 className="bg-transparent text-xs font-bold text-blue-900 outline-none pb-0.5"
                 value={filterCategory}
                 onChange={e => setFilterCategory(e.target.value)}
               >
                 {filterCategories.map(cat => (
                   <option key={cat} value={cat}>{cat}</option>
                 ))}
               </select>
             </div>

             <div className="flex items-center gap-2 bg-gray-100/80 px-4 py-2 rounded-2xl border border-gray-100">
               <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Thương hiệu:</span>
               <select 
                 className="bg-transparent text-xs font-bold text-blue-900 outline-none pb-0.5"
                 value={filterBrand}
                 onChange={e => setFilterBrand(e.target.value)}
               >
                 {filterBrands.map(br => (
                   <option key={br} value={br}>{br}</option>
                 ))}
               </select>
             </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {filteredItems.length === 0 && (
            <p className="text-gray-400 text-xs font-bold italic col-span-2 py-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-100">
              Không tìm thấy sản phẩm nào khớp với bộ lọc.
            </p>
          )}
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-900 transition-all group">
              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-50">
                <img src={item.image} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" alt="P" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 leading-tight mb-1 line-clamp-1">{item.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">{item.brand}</span>
                  <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest bg-pink-50 px-2 py-0.5 rounded-md">{item.category}</span>
                  <span className="text-[11px] font-bold text-emerald-600">{new Intl.NumberFormat('vi-VN').format(item.price || 0)}đ</span>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEditProduct(item)} className="text-blue-400 p-2 hover:bg-blue-50 rounded-lg"><Edit size={18} /></button>
                <button onClick={async () => { if(confirm('Xóa sản phẩm?')) { await dataService.delete('products', item.id); load(); onSuccess("Đã xóa sản phẩm!"); } }} className="text-red-400 p-2 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const JobManager = ({ onSuccess, onError }: { onSuccess: (m: string) => void, onError: (m: string) => void }) => {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', location: '', salary: '', deadline: '' });

  const load = () => dataService.list<any>('jobs').then(setItems);
  useEffect(() => { load(); }, []);

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      location: item.location,
      salary: item.salary,
      deadline: item.deadline
    });
    setEditingId(item.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await dataService.update('jobs', editingId, formData);
        onSuccess("Đã cập nhật tin tuyển dụng!");
      } else {
        await dataService.create('jobs', formData);
        onSuccess("Đã đăng tin tuyển dụng mới!");
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', location: '', salary: '', deadline: '' });
      await load();
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('column')) {
        onError("Lỗi: Thiếu cột dữ liệu trong Database. Vui lòng copy nội dung file 'supabase_schema.sql' vào SQL Editor trên Supabase Dashboard và nhấn RUN để cập nhật. Sau khi chạy SQL, hãy tải lại trang (F5) để áp dụng.");
      } else {
        onError(err.message || "Lỗi khi lưu tin tuyển dụng");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Quản lý tuyển dụng</h2>
        <button onClick={() => {setIsAdding(true); setEditingId(null);}} className="bg-orange-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
          <Plus size={20} /> Thêm vị trí
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-xl mb-8 border border-orange-50">
           <h3 className="text-xl font-black text-orange-600 mb-6 uppercase tracking-tight">{editingId ? 'Chỉnh sửa tin tuyển dụng' : 'Tuyển dụng mới'}</h3>
           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Vị trí tuyển dụng</label>
                <input required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Địa điểm</label>
                <input required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all" value={formData.location} onChange={e=>setFormData({...formData, location: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Mức lương</label>
                <input required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all" value={formData.salary} onChange={e=>setFormData({...formData, salary: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Hạn nộp hồ sơ</label>
                <input type="date" required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-orange-500 rounded-xl outline-none transition-all" value={formData.deadline} onChange={e=>setFormData({...formData, deadline: e.target.value})} />
              </div>
           </div>
           <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (editingId ? 'Cập nhật' : 'Lưu tin')}
            </button>
            <button type="button" onClick={() => {setIsAdding(false); setEditingId(null);}} className="px-8 py-3 rounded-xl font-bold text-gray-400">Hủy</button>
           </div>
        </form>
      )}

      <div className="space-y-4">
        {items.length === 0 && <p className="text-gray-400 text-xs font-bold italic text-center py-8">Chưa có tin tuyển dụng nào.</p>}
        {items.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group">
            <div>
              <h4 className="font-bold text-blue-900 text-lg">{item.title}</h4>
              <p className="text-sm text-gray-500">{item.location} • {item.salary} • Hạn: {item.deadline}</p>
            </div>
            <div className="flex gap-1">
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                <Edit size={18} />
              </button>
              <button onClick={async () => { if(confirm('Xóa?')) { await dataService.delete('jobs', item.id); load(); onSuccess("Đã xóa tin!"); } }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PageManager = ({ onSuccess, onError }: { onSuccess: (m: string) => void, onError: (m: string) => void }) => {
  const [items, setItems] = useState<any[]>([]);
  const [formData, setFormData] = useState({ title: '', content: '', slug: '', category: 'policy', show_on_home: false });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = () => {
    dataService.list<any>('pages').then(setItems).catch(err => {
      console.error("Lỗi khi tải trang:", err);
      // Fallback empty if table doesn't exist yet
      setItems([]);
    });
  };
  useEffect(() => { load(); }, []);

  const handleEdit = (item: any) => {
    setFormData({
      title: item.title,
      slug: item.slug || '',
      category: item.category || 'policy',
      content: item.content || '',
      show_on_home: item.show_on_home || false
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.slug) payload.slug = payload.title.toLowerCase().replace(/ /g, '-');
      
      if (editingId) {
        await dataService.update('pages', editingId, payload);
        onSuccess("Đã cập nhật nội dung!");
      } else {
        await dataService.create('pages', payload);
        onSuccess("Đã thêm trang mới!");
      }
      setEditingId(null);
      setIsAdding(false);
      setFormData({ title: '', content: '', slug: '', category: 'policy', show_on_home: false });
      await load();
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('column') || err.message?.includes('category')) {
        onError("Lỗi: Thiếu cột dữ liệu trong Database. Vui lòng copy nội dung file 'supabase_schema.sql' vào SQL Editor trên Supabase Dashboard và nhấn RUN để cập nhật. Sau khi chạy SQL, hãy tải lại trang (F5) để áp dụng.");
      } else {
        onError(err.message || "Lỗi khi lưu trang");
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'policy', label: 'Chính sách' },
    { id: 'partner', label: 'Hỗ trợ đối tác' },
    { id: 'about', label: 'Giới thiệu / Khác' }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Quản lý nội dung trang & Footer</h2>
        <button 
          onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ title: '', content: '', slug: '', category: 'policy', show_on_home: false }); }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> Thêm trang mới
        </button>
      </div>
      
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-xl mb-8 border border-blue-50">
          <h3 className="text-xl font-black text-blue-900 mb-6 uppercase tracking-tight">{editingId ? 'Chỉnh sửa trang' : 'Thêm trang mới'}</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Tiêu đề hiển thị</label>
              <input required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-900 rounded-2xl outline-none transition-all" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Danh mục (Vị trí Footer)</label>
              <select className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-900 rounded-2xl outline-none transition-all font-bold" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Nội dung chi tiết (Markdown / Text)</label>
              <p className="text-[10px] text-gray-400 mb-2 font-black uppercase tracking-widest italic">Hỗ trợ Markdown. Chèn ảnh: ![Mô tả](link-ảnh)</p>
              <textarea rows={10} className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-900 rounded-2xl outline-none transition-all" value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })} />
            </div>
            <div className="flex items-center gap-6 col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.show_on_home} onChange={e => setFormData({ ...formData, show_on_home: e.target.checked })} className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="font-bold text-gray-700">Hiển thị Sứ mệnh trên Trang chủ (Slug 'about')</span>
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50">
              {loading ? 'Đang lưu...' : 'Lưu trang'}
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-3 rounded-xl font-bold text-gray-500">Hủy</button>
          </div>
        </form>
      )}

      {categories.map(cat => (
        <div key={cat.id} className="mb-12">
          <h3 className="text-sm font-black text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
            <div className="w-8 h-[2px] bg-blue-500 rounded-full"></div>
            {cat.label}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {items.filter(i => i.category === cat.id || (!i.category && cat.id === 'about')).map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-center group">
                <div>
                  <h4 className="font-black text-blue-900 uppercase tracking-tight">{item.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Slug: {item.slug}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(item)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-xl transition-all">
                    <Edit size={20} />
                  </button>
                  <button 
                    onClick={async () => { if(confirm('Xóa trang này?')) { await dataService.delete('pages', item.id); load(); onSuccess("Đã xóa trang!"); } }}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
            {items.filter(i => i.category === cat.id).length === 0 && <p className="text-gray-400 text-xs font-bold italic">Chưa có trang trong mục này.</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

const DistributorManager = ({ onSuccess, onError }: { onSuccess: (m: string) => void, onError: (m: string) => void }) => {
  const [items, setItems] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', region: 'Miền Nam' });

  const load = () => dataService.list<any>('distributors').then(setItems);
  useEffect(() => { load(); }, []);

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name,
      address: item.address,
      phone: item.phone,
      region: item.region
    });
    setEditingId(item.id);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await dataService.update('distributors', editingId, formData);
        onSuccess("Đã cập nhật nhà phân phối!");
      } else {
        await dataService.create('distributors', formData);
        onSuccess("Đã thêm nhà phân phối mới!");
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ name: '', address: '', phone: '', region: 'Miền Nam' });
      await load();
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes('column')) {
        onError("Lỗi: Thiếu cột dữ liệu trong Database. Vui lòng copy nội dung file 'supabase_schema.sql' vào SQL Editor trên Supabase Dashboard và nhấn RUN để cập nhật. Sau khi chạy SQL, hãy tải lại trang (F5) để áp dụng.");
      } else {
        onError(err.message || "Lỗi khi lưu nhà phân phối");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-blue-900">Nhà phân phối</h2>
        <button onClick={() => {setIsAdding(true); setEditingId(null);}} className="bg-indigo-500 text-white px-6 py-2.5 rounded-full font-bold flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
          <Plus size={20} /> Thêm NPP
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[32px] shadow-xl mb-8 border border-indigo-50">
           <h3 className="text-xl font-black text-indigo-600 mb-6 uppercase tracking-tight">{editingId ? 'Chỉnh sửa NPP' : 'Nhà phân phối mới'}</h3>
           <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Tên đại lý/NPP</label>
                <input required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Địa chỉ</label>
                <input required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all" value={formData.address} onChange={e=>setFormData({...formData, address: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Số điện thoại</label>
                <input required className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all" value={formData.phone} onChange={e=>setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Khu vực</label>
                <select className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-indigo-500 rounded-xl outline-none transition-all" value={formData.region} onChange={e=>setFormData({...formData, region: e.target.value})}>
                  <option>Miền Bắc</option>
                  <option>Miền Trung</option>
                  <option>Miền Nam</option>
                </select>
              </div>
           </div>
           <div className="flex gap-3">
            <button type="submit" disabled={loading} className="bg-blue-900 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang lưu...
                </>
              ) : (editingId ? 'Cập nhật' : 'Lưu NPP')}
            </button>
            <button type="button" onClick={() => {setIsAdding(false); setEditingId(null);}} className="px-8 py-3 rounded-xl font-bold text-gray-400">Hủy</button>
           </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {items.length === 0 && <p className="text-gray-400 text-xs font-bold italic text-center py-8 col-span-2">Chưa có nhà phân phối nào.</p>}
        {items.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 group">
            <div className="flex justify-between mb-2">
              <h4 className="font-bold text-blue-900 uppercase line-clamp-1">{item.name}</h4>
              <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold shrink-0">{item.region}</span>
            </div>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2 min-h-[40px]">{item.address}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-blue-900">{item.phone}</span>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(item)} className="p-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
                  <Edit size={18} />
                </button>
                <button onClick={async () => { if(confirm('Xóa?')) { await dataService.delete('distributors', item.id); load(); onSuccess("Đã xóa NPP!"); } }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const VideoManager = ({ onSuccess, onError }: { onSuccess: (m: string) => void, onError: (m: string) => void }) => {
  const [items, setItems] = useState<VideoItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: '', youtube_url: '', tag: 'SỰ KIỆN' });
  const [loading, setLoading] = useState(false);

  const load = () => dataService.list<VideoItem>('videos').then(setItems);
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await dataService.update('videos', editingId, formData);
        onSuccess("Đã cập nhật video!");
      } else {
        await dataService.create('videos', formData);
        onSuccess("Đã thêm video mới!");
      }
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: '', youtube_url: '', tag: 'SỰ KIỆN' });
      await load();
    } catch (err: any) {
      onError(err.message || "Lỗi khi lưu video");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Xóa video này?")) {
      try {
        await dataService.delete('videos', id);
        await load();
        onSuccess("Đã xóa video!");
      } catch (err: any) {
        onError(err.message || "Lỗi khi xóa");
      }
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black text-blue-900 uppercase">Thư viện Video</h2>
        <button onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ title: '', youtube_url: '', tag: 'SỰ KIỆN' }); }} className="bg-blue-900 text-white px-8 py-3 rounded-full font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:bg-pink-500 transition-all shadow-lg">
          <Plus size={18} /> Thêm Video
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-10 rounded-[40px] shadow-2xl border border-blue-50">
          <h3 className="text-xl font-black text-blue-900 mb-8 uppercase tracking-tight">{editingId ? 'Cập nhật video' : 'Thêm video mới'}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Tiêu đề video</label>
              <input required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl outline-none transition-all font-bold" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} placeholder="VD: QUY TRÌNH SẢN XUẤT TÃ NYNA" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Nhãn (Tag)</label>
              <input required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl outline-none transition-all font-bold" value={formData.tag} onChange={e=>setFormData({...formData, tag: e.target.value})} placeholder="Phóng sự, TVC, Sự kiện..." />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Link YouTube</label>
              <input required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl outline-none transition-all font-bold" value={formData.youtube_url} onChange={e=>setFormData({...formData, youtube_url: e.target.value})} placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            
            {/* Live Thumbnail Preview */}
            {formData.youtube_url && (
              <div className="md:col-span-2 p-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <span className="block text-xs font-bold text-gray-400 uppercase mb-3 ml-1">Thumbnail xem trước (Tự động)</span>
                <div className="aspect-video w-full max-w-sm rounded-2xl overflow-hidden shadow-lg bg-gray-200">
                  <img 
                    src={getYoutubeThumbnail(formData.youtube_url)} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Link+YouTube+không+hợp+lệ';
                    }}
                  />
                </div>
              </div>
            )}
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button disabled={loading} type="submit" className="flex-1 bg-blue-900 text-white h-14 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-500 transition-all disabled:opacity-50">
                {loading ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Lưu Video')}
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-10 h-14 rounded-2xl font-black uppercase text-gray-400 tracking-widest hover:bg-gray-100 transition-all">Hủy</button>
            </div>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map(item => (
          <div key={item.id} className="bg-white p-5 rounded-[40px] border border-gray-100 shadow-sm group hover:shadow-xl transition-all">
            <div className="aspect-video bg-gray-100 rounded-3xl overflow-hidden mb-6 relative">
               <img 
                src={getYoutubeThumbnail(item.youtube_url)} 
                alt="" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
               />
               <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="text-white" size={48} />
               </div>
               <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest leading-none">
                  {item.tag}
               </div>
            </div>
            <h4 className="font-black text-blue-900 uppercase tracking-tight mb-4 line-clamp-1">{item.title}</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => { setFormData(item); setEditingId(item.id); setIsAdding(true); }}
                className="flex-1 h-12 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"><Edit size={16} /> Sửa</button>
              <button 
                onClick={() => handleDelete(item.id)}
                className="w-12 h-12 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center justify-center"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="col-span-full py-20 text-center text-gray-300 font-bold italic uppercase tracking-widest">Chưa có video nào.</div>}
      </div>
    </div>
  );
};

const SettingsManager = ({ onSuccess, onError }: { onSuccess: (m: string) => void, onError: (m: string) => void }) => {
  const [bankSettings, setBankSettings] = useState({ bank_name: '', account_name: '', account_number: '', branch: '' });
  const [loading, setLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    dataService.get<any>('business_settings', 'main').then(res => {
      if (res) setBankSettings({
        bank_name: res.bank_name || '',
        account_name: res.account_name || '',
        account_number: res.account_number || '',
        branch: res.branch || ''
      });
    });
  }, []);

  const handleSaveBank = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Use get first to check existence
      let exists = false;
      try {
        const check = await dataService.get('business_settings', 'main');
        if (check) exists = true;
      } catch (e) {
        exists = false;
      }

      if (exists) {
        await dataService.update('business_settings', 'main', bankSettings);
      } else {
        await dataService.create('business_settings', { id: 'main', ...bankSettings });
      }
      
      // Reload to ensure state is in sync
      const updated = await dataService.get<any>('business_settings', 'main');
      if (updated) setBankSettings({
        bank_name: updated.bank_name || '',
        account_name: updated.account_name || '',
        account_number: updated.account_number || '',
        branch: updated.branch || ''
      });

      onSuccess("Đã lưu thông tin tài khoản!");
    } catch (err: any) {
      onError(err.message || "Lỗi lưu cấu hình");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const tables = ['news', 'products', 'brands', 'jobs', 'distributors', 'pages', 'videos', 'business_settings'];
      const backupData: any = {};
      for (const table of tables) {
        backupData[table] = await dataService.list(table);
      }
      
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nyna_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      onSuccess("Đã xuất dữ liệu sao lưu!");
    } catch (err: any) {
      onError("Lỗi xuất dữ liệu: " + err.message);
    } finally {
      setExportLoading(false);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!confirm("CẢNH BÁO: Khôi phục dữ liệu có thể tạo ra các bản ghi trùng lặp hoặc ghi đè dữ liệu hiện tại. Bạn có chắc muốn tiếp tục?")) return;

    setImportLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result as string);
        for (const table in data) {
          const records = data[table];
          if (Array.isArray(records)) {
            for (const record of records) {
              const { id, created_at, ...cleanRecord } = record;
              try {
                if (id) {
                   // Try to update first, if fail create
                   await dataService.update(table, id, cleanRecord);
                } else {
                   await dataService.create(table, cleanRecord);
                }
              } catch (err) {
                 await dataService.create(table, cleanRecord);
              }
            }
          }
        }
        onSuccess("Đã khôi phục dữ liệu thành công! Hãy tải lại trang.");
        window.location.reload();
      } catch (err: any) {
        onError("Lỗi nhập dữ liệu: " + err.message);
      } finally {
        setImportLoading(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-center bg-white p-8 rounded-[32px] shadow-xl border border-blue-50">
        <div>
          <h2 className="text-2xl font-black text-blue-900 uppercase">Sao lưu & Khôi phục</h2>
          <p className="text-gray-400 font-bold text-sm">Quản lý toàn bộ dữ liệu hệ thống</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={handleExport}
            disabled={exportLoading}
            className="bg-emerald-500 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-600 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-50"
          >
            {exportLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Download size={18} />}
            Xuất Sao Lưu (.json)
          </button>
          <label className={`bg-blue-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-3 cursor-pointer hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 ${importLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
             {importLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Upload size={18} />}
             Khôi Phục Dữ Liệu
             <input type="file" disabled={importLoading} className="hidden" accept=".json" onChange={handleImport} />
          </label>
        </div>
      </div>

      <div className="bg-white p-10 md:p-12 rounded-[48px] shadow-2xl border border-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
          <CreditCard size={200} />
        </div>
        
        <div className="flex items-center gap-4 mb-10">
           <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 shadow-sm border border-pink-100">
              <CreditCard size={28} />
           </div>
           <div>
              <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight">Cấu hình thanh toán</h3>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Thông tin chuyển khoản doanh nghiệp trong giỏ hàng</p>
           </div>
        </div>

        <form onSubmit={handleSaveBank} className="grid md:grid-cols-2 gap-8">
           <div>
             <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Ngân hàng</label>
             <input required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl outline-none transition-all font-bold text-blue-900" value={bankSettings.bank_name} onChange={e=>setBankSettings({...bankSettings, bank_name: e.target.value})} placeholder="VD: Vietcombank, Techcombank..." />
           </div>
           <div>
             <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Chủ tài khoản</label>
             <input required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl outline-none transition-all font-bold text-blue-900 uppercase" value={bankSettings.account_name} onChange={e=>setBankSettings({...bankSettings, account_name: e.target.value})} placeholder="VD: CONG TY TNHH NYNA" />
           </div>
           <div>
             <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Số tài khoản</label>
             <input required className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl outline-none transition-all font-bold text-blue-900" value={bankSettings.account_number} onChange={e=>setBankSettings({...bankSettings, account_number: e.target.value})} placeholder="VD: 123456789" />
           </div>
           <div>
             <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Chi nhánh</label>
             <input className="w-full p-4 bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl outline-none transition-all font-bold text-blue-900" value={bankSettings.branch} onChange={e=>setBankSettings({...bankSettings, branch: e.target.value})} placeholder="VD: Chi nhánh Hà Nội" />
           </div>
           
           <div className="md:col-span-2 pt-4">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-blue-900 text-white px-12 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-pink-500 transition-all shadow-2xl shadow-blue-900/20 flex items-center gap-3 disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save size={20} />}
                Lưu cấu hình doanh nghiệp
              </button>
           </div>
        </form>
      </div>
      
      <div className="bg-emerald-50/50 p-8 rounded-3xl border border-emerald-100 flex items-start gap-4">
         <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm shrink-0 mt-1">
            <Database size={20} />
         </div>
         <div>
            <h4 className="font-black text-emerald-900 uppercase text-sm mb-2">Hệ thống đang hoạt động tốt</h4>
            <p className="text-emerald-700/70 text-xs font-medium leading-relaxed">Bộ máy dữ liệu NYNA được bảo mật và tối ưu hóa cho trải nghiệm khách hàng. Định kỳ hàng tuần bạn nên xuất sao lưu dữ liệu để đề phòng các sự cố máy chủ.</p>
         </div>
      </div>
    </div>
  );
};

// ==========================================
// BÁO CÁO BÁN HÀNG MANAGER COMPONENT
// ==========================================
const SalesReportManager = ({ onSuccess, onError }: { onSuccess: (m: string) => void, onError: (m: string) => void }) => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [loading, setLoading] = useState(true);

  // States for filters
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');

  // Tải dữ liệu từ database
  const loadReportData = async () => {
    setLoading(true);
    try {
      const [ordersList, productsList, brandsList] = await Promise.all([
        dataService.list<OrderItem>('orders'),
        dataService.list<ProductItem>('products'),
        dataService.list<BrandItem>('brands'),
      ]);
      setOrders(ordersList || []);
      setProducts(productsList || []);
      setBrands(brandsList || []);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu báo cáo:", err);
      onError("Không thể kết nối dịch vụ để kết xuất báo cáo!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
  }, []);

  // Danh mục nhóm hàng duy nhất
  const uniqueCategories = React.useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => { if (p.category) list.add(p.category); });
    orders.forEach(o => {
      (o.items || []).forEach(it => { if (it.category) list.add(it.category); });
    });
    return Array.from(list);
  }, [products, orders]);

  // Tạo dữ liệu giao dịch mẫu để chạy thử nghiệm bộ lọc
  const handleGenerateDemoData = async () => {
    try {
      setLoading(true);
      const demoOrders = [
        {
          created_at: new Date(Date.now() - 0.2 * 24 * 60 * 60 * 1000).toISOString(), // Vừa mới mua hôm nay
          customer_name: 'Phan Anh Trúc',
          payment_method: 'Chuyển khoản',
          status: 'Hoàn thành',
          total_amount: 375000,
          items: [
            { id: '1', title: 'Tã dán người lớn NYNA M-L-XL', price: 125000, quantity: 3, brand: 'NYNA', category: 'Tã bỉm người lớn' }
          ]
        },
        {
          created_at: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // Hôm qua
          customer_name: 'Nguyễn Văn Hùng',
          payment_method: 'Chuyển khoản',
          status: 'Hoàn thành',
          total_amount: 750000,
          items: [
            { id: '1', title: 'Tã dán người lớn NYNA M-L-XL', price: 125000, quantity: 4, brand: 'NYNA', category: 'Tã bỉm người lớn' },
            { id: '2', title: 'Sữa hạt dinh dưỡng NYNA Gold', price: 250000, quantity: 2, brand: 'NYNA', category: 'Sữa dinh dưỡng' }
          ]
        },
        {
          created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 ngày trước
          customer_name: 'Lê Thị Thuỷ',
          payment_method: 'Chuyển khoản',
          status: 'Hoàn thành',
          total_amount: 450000,
          items: [
            { id: '3', title: 'Tã quần trẻ em NYNA Premium L', price: 150000, quantity: 3, brand: 'MOMMY', category: 'Tã bỉm trẻ em' }
          ]
        },
        {
          created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 ngày trước
          customer_name: 'Trần Văn Long',
          payment_method: 'Chuyển khoản',
          status: 'Hoàn thành',
          total_amount: 1000000,
          items: [
            { id: '2', title: 'Sữa hạt dinh dưỡng NYNA Gold', price: 250000, quantity: 4, brand: 'NYNA', category: 'Sữa dinh dưỡng' }
          ]
        }
      ];

      for (const order of demoOrders) {
        await dataService.create('orders', order);
      }
      
      onSuccess("Tạo thành công dữ liệu mẫu mô phỏng bán hàng!");
      loadReportData();
    } catch (err) {
      console.error("Lỗi khi tạo dữ liệu mẫu:", err);
      onError("Gặp lỗi khi ghi thông tin đơn hàng mẫu!");
      setLoading(false);
    }
  };

  // Làm sạch các bộ lọc
  const handleResetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSelectedProduct('');
    setSelectedCategory('');
    setSelectedBrand('');
  };

  // Lọc luồng dữ liệu bán hàng
  const filteredSalesRows = React.useMemo(() => {
    const rows: any[] = [];
    
    orders.forEach(order => {
      // 1. Lọc theo thời gian (Từ ngày - Đến ngày)
      if (order.created_at) {
        const orderDate = new Date(order.created_at);
        
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (orderDate < start) return;
        }
        
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (orderDate > end) return;
        }
      }
      
      // 2. Bung các sản phẩm bên trong đơn hàng để tính toán lọc chi tiết
      const orderItems = order.items || [];
      orderItems.forEach(item => {
        const itemCategory = item.category || 'Chưa phân loại';
        const itemBrand = item.brand || 'Khác';
        
        // Lọc theo thương hiệu
        if (selectedBrand && itemBrand !== selectedBrand) return;
        
        // Lọc theo nhóm hàng / phân loại
        if (selectedCategory && itemCategory !== selectedCategory) return;
        
        // Lọc theo mặt hàng
        if (selectedProduct && item.id !== selectedProduct && item.title !== selectedProduct) return;
        
        rows.push({
          orderId: order.id,
          createdAt: order.created_at || new Date().toISOString(),
          customerName: order.customer_name || 'Khách vãng lai',
          itemId: item.id,
          title: item.title,
          price: item.price || 0,
          quantity: item.quantity || 1,
          brand: itemBrand,
          category: itemCategory,
          total: (item.price || 0) * (item.quantity || 1)
        });
      });
    });
    
    return rows;
  }, [orders, startDate, endDate, selectedProduct, selectedCategory, selectedBrand]);

  // Tính toán số liệu tổng quan
  const stats = React.useMemo(() => {
    const revenue = filteredSalesRows.reduce((sum, r) => sum + r.total, 0);
    const qty = filteredSalesRows.reduce((sum, r) => sum + r.quantity, 0);
    const uniqueOrders = new Set(filteredSalesRows.map(r => r.orderId)).size;
    return { revenue, qty, uniqueOrders };
  }, [filteredSalesRows]);

  // Phân tích Mặt hàng bán chạy nhất
  const productSales = React.useMemo(() => {
    const map: Record<string, { title: string; quantity: number; revenue: number; brand: string; category: string }> = {};
    filteredSalesRows.forEach(row => {
      const key = row.title;
      if (!map[key]) {
        map[key] = { title: row.title, quantity: 0, revenue: 0, brand: row.brand, category: row.category };
      }
      map[key].quantity += row.quantity;
      map[key].revenue += row.total;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [filteredSalesRows]);

  // Phân tích Thương hiệu đóng góp nhiều doanh thu nhất
  const brandSales = React.useMemo(() => {
    const map: Record<string, { brand: string; quantity: number; revenue: number }> = {};
    filteredSalesRows.forEach(row => {
      const key = row.brand;
      if (!map[key]) {
        map[key] = { brand: key, quantity: 0, revenue: 0 };
      }
      map[key].quantity += row.quantity;
      map[key].revenue += row.total;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [filteredSalesRows]);

  // Phân tích Nhóm hàng/Phân loại đóng góp nhiều doanh thu nhất
  const categorySales = React.useMemo(() => {
    const map: Record<string, { category: string; quantity: number; revenue: number }> = {};
    filteredSalesRows.forEach(row => {
      const key = row.category;
      if (!map[key]) {
        map[key] = { category: key, quantity: 0, revenue: 0 };
      }
      map[key].quantity += row.quantity;
      map[key].revenue += row.total;
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [filteredSalesRows]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">BÁO CÁO ĐO LƯỜNG CHỈ SỐ DOANH NGHIỆP</span>
          <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tight">Báo cáo bán hàng</h1>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={loadReportData}
            className="px-5 py-3 tracking-wide bg-white text-blue-900 border border-gray-200 hover:border-blue-900 rounded-xl transition-all font-bold text-xs uppercase"
          >
            Làm mới dữ liệu
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-96 bg-white rounded-3xl flex flex-col items-center justify-center p-8 shadow-sm border border-gray-100">
          <div className="w-12 h-12 border-4 border-blue-900/10 border-t-blue-900 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Đang tính toán số liệu kinh doanh...</p>
        </div>
      ) : (
        <>
          {/* Bộ lọc tinh gọn */}
          <div className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xs font-black text-blue-900 uppercase tracking-widest flex items-center gap-2">
              <Filter size={16} className="text-blue-500" />
              Bộ lọc báo cáo kinh doanh
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Ngày bắt đầu */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Từ ngày</label>
                <div className="relative">
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs text-blue-900 cursor-pointer"
                  />
                </div>
              </div>

              {/* Ngày kết thúc */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Đến ngày</label>
                <div>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs text-blue-900 cursor-pointer"
                  />
                </div>
              </div>

              {/* Phân loại mặt hàng */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Nhóm hàng</label>
                <select 
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs text-blue-900 cursor-pointer"
                >
                  <option value="">Tất cả nhóm</option>
                  {uniqueCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Thương hiệu */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Thương hiệu</label>
                <select 
                  value={selectedBrand}
                  onChange={e => setSelectedBrand(e.target.value)}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs text-blue-900 cursor-pointer"
                >
                  <option value="">Tất cả thương hiệu</option>
                  {brands.map(brand => (
                    <option key={brand.id} value={brand.name}>{brand.name}</option>
                  ))}
                </select>
              </div>

              {/* Tên mặt hàng cụ thể */}
              <div>
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5 ml-1">Mặt hàng chi tiết</label>
                <select 
                  value={selectedProduct}
                  onChange={e => setSelectedProduct(e.target.value)}
                  className="w-full p-3 bg-gray-50 hover:bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs text-blue-900 cursor-pointer"
                >
                  <option value="">Tất cả mặt hàng</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id || p.title}>{p.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {(startDate || endDate || selectedCategory || selectedBrand || selectedProduct) && (
              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleResetFilters}
                  className="text-xs font-black text-rose-500 uppercase tracking-widest hover:text-rose-600 transition-colors"
                >
                  HỦY BỘ LỌC XEM TOÀN BỘ
                </button>
              </div>
            )}
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Doanh thu */}
            <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[40px] transition-transform group-hover:scale-125"></div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">TỔNG DOANH THU THU HOẠCH</span>
                <h4 className="text-3xl font-black text-blue-900 mt-2 tracking-tight">
                  {new Intl.NumberFormat('vi-VN').format(stats.revenue)}đ
                </h4>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 mt-2">
                  <TrendingUp size={14} /> Điểm ghi nhận thanh toán thành công
                </div>
              </div>
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                <CreditCard size={24} />
              </div>
            </div>

            {/* Sản lượng */}
            <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-[40px] transition-transform group-hover:scale-125"></div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">SẢN LƯỢNG TIÊU THỤ</span>
                <h4 className="text-3xl font-black text-blue-900 mt-2 tracking-tight">
                  {new Intl.NumberFormat('vi-VN').format(stats.qty)} sản phẩm
                </h4>
                <div className="text-xs font-bold text-gray-400 mt-2">
                  Tổng lượng hàng hóa giao thành công
                </div>
              </div>
              <div className="w-14 h-14 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center shadow-sm">
                <Package size={24} />
              </div>
            </div>

            {/* Số đơn hàng */}
            <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-[40px] transition-transform group-hover:scale-125"></div>
              <div>
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">LƯỢT GIAO DỊCH</span>
                <h4 className="text-3xl font-black text-blue-900 mt-2 tracking-tight">
                  {stats.uniqueOrders} hóa đơn
                </h4>
                <div className="text-xs font-bold text-blue-500 mt-2">
                  Hoàn tất quá trình quét mã ngân hàng
                </div>
              </div>
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                <FileText size={24} />
              </div>
            </div>
          </div>

          {/* Biểu đồ phân tích doanh thu bằng CSS Progress bar */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Phân tích Sản phẩm */}
            <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Doanh thu theo mặt hàng</h3>
                <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase">Xếp hạng cao nhất</span>
              </div>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                {productSales.length === 0 ? (
                  <p className="text-xs font-bold text-gray-400 text-center py-12">Không có số liệu kinh doanh phù hợp</p>
                ) : (
                  productSales.map((p, idx) => {
                    const percentage = stats.revenue > 0 ? (p.revenue / stats.revenue) * 100 : 0;
                    return (
                      <div key={p.title} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-black text-blue-900">
                          <div className="truncate max-w-[280px]">
                            <span className="text-blue-400 inline-block mr-2">#{idx + 1}</span>
                            {p.title}
                          </div>
                          <div>{new Intl.NumberFormat('vi-VN').format(p.revenue)}đ</div>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400">
                          <span>Sản lượng: {p.quantity} chiếc</span>
                          <span>•</span>
                          <span>Đầu phân phối: {p.brand}</span>
                        </div>
                        <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-900 rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Phân tích Thương hiệu & Phân loại */}
            <div className="space-y-8">
              {/* Theo thương hiệu */}
              <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-6">
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Thương hiệu phân phối</h3>
                
                <div className="space-y-4">
                  {brandSales.length === 0 ? (
                    <p className="text-xs font-bold text-gray-400 text-center py-6">Chưa ghi nhận đối tác bán hàng</p>
                  ) : (
                    brandSales.map((b) => {
                      const percentage = stats.revenue > 0 ? (b.revenue / stats.revenue) * 100 : 0;
                      return (
                        <div key={b.brand} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-black text-blue-900">
                            <div>Thương hiệu {b.brand}</div>
                            <div>{new Intl.NumberFormat('vi-VN').format(b.revenue)}đ ({percentage.toFixed(1)}%)</div>
                          </div>
                          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Theo nhóm hàng */}
              <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-6">
                <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Cơ cấu Nhóm hàng</h3>
                
                <div className="space-y-4">
                  {categorySales.length === 0 ? (
                    <p className="text-xs font-bold text-gray-400 text-center py-6">Chưa có phân loại bán hàng</p>
                  ) : (
                    categorySales.map((c) => {
                      const percentage = stats.revenue > 0 ? (c.revenue / stats.revenue) * 100 : 0;
                      return (
                        <div key={c.category} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-black text-blue-900">
                            <div>Phân khúc {c.category}</div>
                            <div>{new Intl.NumberFormat('vi-VN').format(c.revenue)}đ ({percentage.toFixed(1)}%)</div>
                          </div>
                          <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Bảng Chi tiết phiên Giao dịch bán hàng */}
          <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Danh sách giao dịch chi tiết</h3>
            
            <div className="overflow-x-auto pr-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    <th className="pb-4">Thời gian</th>
                    <th className="pb-4">Khách mua</th>
                    <th className="pb-4">Sản phẩm</th>
                    <th className="pb-4">Phân loại / Thương hiệu</th>
                    <th className="pb-4 text-center">SL</th>
                    <th className="pb-4 text-right">Đơn giá</th>
                    <th className="pb-4 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-600">
                  {filteredSalesRows.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest">
                        Chưa có lịch sử giao dịch bán hàng cho kỳ này
                      </td>
                    </tr>
                  ) : (
                    filteredSalesRows.map((row, idx) => (
                      <tr key={`${row.orderId}-${row.itemId}-${idx}`} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 font-normal text-gray-400 whitespace-nowrap">
                          {new Date(row.createdAt).toLocaleString('vi-VN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="py-4 text-blue-900 font-black">{row.customerName}</td>
                        <td className="py-4 font-black text-blue-900 truncate max-w-[200px]" title={row.title}>
                          {row.title}
                        </td>
                        <td className="py-4">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md block w-fit mb-1">
                            {row.category}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md block w-fit">
                            {row.brand}
                          </span>
                        </td>
                        <td className="py-4 text-center text-blue-900 font-black">{row.quantity}</td>
                        <td className="py-4 text-right font-bold text-gray-500 whitespace-nowrap">
                          {new Intl.NumberFormat('vi-VN').format(row.price)}đ
                        </td>
                        <td className="py-4 text-right text-blue-900 font-black whitespace-nowrap">
                          {new Intl.NumberFormat('vi-VN').format(row.total)}đ
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ==========================================
// THÀNH VIÊN & PHÂN QUYỀN CMS MANAGER COMPONENT
// ==========================================
const CmsUserManager = ({ onSuccess, onError }: { onSuccess: (m: string) => void, onError: (m: string) => void }) => {
  const [users, setUsers] = useState<CmsUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'nhân viên'
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('cms_users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err: any) {
      console.error("Lỗi khi tải danh sách phân quyền:", err);
      if (err.code === 'PGS01' || err.message?.includes('does not exist')) {
        onError("Lỗi: Thiếu bảng 'cms_users' trong Database. Vui lòng copy nội dung file 'supabase_schema.sql' vào SQL Editor trên Supabase Dashboard và click RUN để khởi tạo.");
      } else {
        onError("Không thể kết nối dịch vụ để tải danh sách thành viên!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;

    try {
      const supabase = getSupabase();
      if (editingId) {
        const { error } = await supabase
          .from('cms_users')
          .update({
            email: formData.email.trim().toLowerCase(),
            full_name: formData.full_name.trim(),
            role: formData.role
          })
          .eq('id', editingId);

        if (error) throw error;
        onSuccess("Cập nhật quyền thành viên thành công!");
      } else {
        const { error } = await supabase
          .from('cms_users')
          .insert([{
            email: formData.email.trim().toLowerCase(),
            full_name: formData.full_name.trim(),
            role: formData.role
          }]);

        if (error) throw error;
        onSuccess("Thêm danh sách cấp quyền truy cập thành công!");
      }

      setFormData({ email: '', full_name: '', role: 'nhân viên' });
      setShowAddForm(false);
      setEditingId(null);
      loadUsers();
    } catch (err: any) {
      console.error("Lỗi khi lưu phân quyền:", err);
      if (err.code === '23505') {
        onError("Email này đã có trong danh sách phân quyền của hệ thống!");
      } else {
        onError("Có lỗi xảy ra khi lưu thông tin phân quyền thành viên!");
      }
    }
  };

  const handleEdit = (user: CmsUser) => {
    setEditingId(user.id || null);
    setFormData({
      email: user.email,
      full_name: user.full_name || '',
      role: user.role
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: string, email: string) => {
    if (confirm(`Bạn có chắc muốn thu hồi quyền truy cập hệ thống của email này không?\n👉 ${email}`)) {
      try {
        const supabase = getSupabase();
        const { error } = await supabase
          .from('cms_users')
          .delete()
          .eq('id', id);

        if (error) throw error;
        onSuccess("Thu hồi quyền truy cập thành công!");
        loadUsers();
      } catch (err) {
        console.error("Lỗi khi xoá phân quyền:", err);
        onError("Không thể thực hiện thu hồi quyền truy cập thành viên!");
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest block mb-2">QUẢN TRỊ VIÊN BẢO MẬT HỆ THỐNG</span>
          <h1 className="text-4xl font-black text-blue-900 uppercase tracking-tight">Cấp phép & Phân quyền</h1>
        </div>
        
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) {
              setEditingId(null);
              setFormData({ email: '', full_name: '', role: 'nhân viên' });
            }
          }}
          className="px-5 py-3 tracking-wide bg-blue-900 text-white hover:bg-blue-950 rounded-xl transition-all font-bold text-xs uppercase shadow-lg shadow-blue-50 shadow-blue-900/10 flex items-center gap-2"
        >
          {showAddForm ? <X size={16} /> : <Plus size={16} />}
          {showAddForm ? 'Hủy bỏ' : 'Cấp quyền thành viên'}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleSubmit} className="p-8 bg-white rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">
            {editingId ? 'Chỉnh sửa thông tin phân quyền' : 'Khai báo cấp quyền truy cập mới'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email đăng nhập Auth</label>
              <input 
                type="email"
                required
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs text-blue-900"
                placeholder="VD: user@domain.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Họ tên thành viên</label>
              <input 
                type="text"
                required
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs text-blue-900"
                placeholder="VD: Nguyễn Văn A"
                value={formData.full_name}
                onChange={e => setFormData({ ...formData, full_name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Vai trò quyền hạn</label>
              <select 
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value })}
                className="w-full p-4 bg-gray-50 hover:bg-gray-100 border border-transparent focus:border-blue-500 focus:bg-white rounded-xl outline-none transition-all font-bold text-xs text-blue-900 cursor-pointer"
              >
                <option value="nhân viên">Nhân viên (CMS Thường)</option>
                <option value="quản trị">Quản trị viên (Toàn quyền)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
            <button 
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEditingId(null);
                setFormData({ email: '', full_name: '', role: 'nhân viên' });
              }}
              className="px-5 py-3 border border-gray-200 hover:border-blue-900 transition-all text-blue-900 rounded-xl font-bold text-xs uppercase"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              className="px-5 py-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl font-bold text-xs uppercase shadow-md transition-all"
            >
              {editingId ? 'Cập nhật phân quyền' : 'Khai báo cấp quyền'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="h-64 bg-white rounded-3xl flex flex-col items-center justify-center p-8 shadow-sm border border-gray-100">
          <div className="w-10 h-10 border-4 border-blue-900/10 border-t-blue-900 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest">Đang tải danh sách tài khoản phân quyền...</p>
        </div>
      ) : (
        <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-6">
          <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Danh sách nhân sự & cấp phép đăng nhập</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <th className="pb-4">Họ và Tên</th>
                  <th className="pb-4">Email liên quan</th>
                  <th className="pb-4">Ngày cấp quyền</th>
                  <th className="pb-4">Cấp độ truy cập</th>
                  <th className="pb-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-bold text-gray-600">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest">
                      Chưa ghi nhận tài khoản phân quyền nào trên hệ thống
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 text-blue-900 font-black">{u.full_name || 'Chưa ghi nhận'}</td>
                      <td className="py-4 text-gray-500 font-mono text-[11px]">{u.email}</td>
                      <td className="py-4 font-normal text-gray-400">
                        {u.created_at ? new Date(u.created_at).toLocaleString('vi-VN', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        }) : '--/--/----'}
                      </td>
                      <td className="py-4">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-md ${
                          u.role === 'quản trị' 
                            ? 'bg-amber-100 text-amber-800' 
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {u.role === 'quản trị' ? 'Quản trị viên' : 'Nhân viên CMS'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(u)}
                            className="p-2 hover:bg-blue-50 text-blue-900 rounded-lg transition-colors"
                            title="Sửa phân quyền"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(u.id!, u.email)}
                            className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                            title="Thu hồi quyền đăng nhập"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// TIN NHẮN LIÊN HỆ CMS COMPONENT
// ==========================================
const ContactsManager = ({ onSuccess, onError }: { onSuccess: (m: string) => void, onError: (m: string) => void }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = async () => {
    setLoading(true);
    let dbMessages: any[] = [];
    try {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('contacts')
        .select('*');

      if (error) {
        console.warn('Contacts Supabase query error (likely table table does not exist or RLS issue):', error);
      } else if (data) {
        dbMessages = data;
      }
    } catch (err: any) {
      console.warn('Failed to query Supabase contacts table:', err);
    }

    // Get any local contacts
    let localMessages: any[] = [];
    try {
      const saved = localStorage.getItem('nyna_local_contacts');
      if (saved) {
        localMessages = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading local contacts:', err);
    }

    // Combine or fallback
    let combined = [...dbMessages];
    // Add local messages that are not already present in dbMessages (matching by id)
    localMessages.forEach(lm => {
      if (!combined.some(dm => dm.id === lm.id)) {
        combined.push(lm);
      }
    });

    // Sort by created_at descending
    combined.sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA;
    });

    setMessages(combined);
    setLoading(false);
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tin nhắn này?')) return;
    try {
      // 1. Try to delete from Supabase if possible
      try {
        const supabase = getSupabase();
        await supabase.from('contacts').delete().eq('id', id);
      } catch (err) {
        console.warn('Could not delete contact from remote DB:', err);
      }

      // 2. Clear from local storage
      let localMessages: any[] = [];
      const saved = localStorage.getItem('nyna_local_contacts');
      if (saved) {
        localMessages = JSON.parse(saved);
      }
      const filtered = localMessages.filter(m => m.id !== id);
      localStorage.setItem('nyna_local_contacts', JSON.stringify(filtered));

      onSuccess('Xóa tin nhắn liên hệ thành công');
      loadMessages();
    } catch (err: any) {
      console.error(err);
      onError('Không thể xóa tin nhắn');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-blue-900 tracking-tight uppercase">Tin nhắn liên hệ</h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Quản lý các tin nhắn từ khách hàng</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="py-5 px-8 text-[10px] font-black text-blue-900 uppercase tracking-widest">Thời gian</th>
                <th className="py-5 px-8 text-[10px] font-black text-blue-900 uppercase tracking-widest">Khách hàng</th>
                <th className="py-5 px-8 text-[10px] font-black text-blue-900 uppercase tracking-widest">Liên hệ</th>
                <th className="py-5 px-8 text-[10px] font-black text-blue-900 uppercase tracking-widest">Nội dung</th>
                <th className="py-5 px-8 text-[10px] font-black text-blue-900 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Đang tải...</td>
                </tr>
              ) : messages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">Chưa có tin nhắn liên hệ nào</td>
                </tr>
              ) : (
                messages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-5 px-8 text-xs font-bold text-gray-500">
                      {msg.created_at ? new Date(msg.created_at).toLocaleString('vi-VN') : '—'}
                    </td>
                    <td className="py-5 px-8">
                      <div className="text-xs font-black text-blue-900 uppercase">{msg.full_name || msg.name || '—'}</div>
                    </td>
                    <td className="py-5 px-8">
                      <div className="text-xs font-bold text-blue-900">{msg.phone || '—'}</div>
                      <div className="text-[11px] text-gray-400 font-medium">{msg.email || '—'}</div>
                    </td>
                    <td className="py-5 px-8 max-w-xs">
                      <p className="text-xs text-gray-600 font-medium leading-relaxed break-words">{msg.message || msg.content || '—'}</p>
                    </td>
                    <td className="py-5 px-8 text-right">
                      <button 
                        onClick={() => handleDelete(msg.id)}
                        className="p-2 hover:bg-rose-50 text-rose-600 rounded-lg transition-colors"
                        title="Xóa tin nhắn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
