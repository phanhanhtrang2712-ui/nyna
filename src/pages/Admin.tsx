import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Newspaper, Package, Briefcase, 
  MapPin, LogOut, Plus, Trash2, Edit, Save, X, Image as ImageIcon, FileText, ShieldCheck,
  PlayCircle
} from 'lucide-react';
import { auth, signInWithGoogle, logout } from '../lib/firebase';
import { dataService } from '../services/dataService';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { VideoItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { getYoutubeThumbnail } from '../lib/youtube';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('nyna_admin_auth') === 'true';
  });
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    if (isAuthenticated) {
      dataService.list('news').then(() => setDbStatus('connected')).catch(() => setDbStatus('error'));
    }
  }, [isAuthenticated]);

  const [activeTab, setActiveTab] = useState<'news' | 'products' | 'jobs' | 'distributors' | 'pages' | 'videos'>('news');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === '123456123456') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nyna_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Tài khoản hoặc mật khẩu không đúng');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nyna_admin_auth');
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
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Tài khoản</label>
              <input 
                type="text"
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-medium"
                placeholder="Nhập tài khoản"
                value={loginData.username}
                onChange={e => setLoginData({...loginData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Mật khẩu</label>
              <input 
                type="password"
                required
                className="w-full bg-gray-50 border-2 border-transparent focus:border-blue-900 focus:bg-white rounded-2xl py-4 px-6 outline-none transition-all font-medium"
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
              className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center shadow-xl shadow-blue-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-wider mt-4"
            >
              Đăng nhập hệ thống
            </button>
            
            <a 
              href="/"
              className="block w-full py-4 text-center text-gray-400 font-bold hover:text-blue-900 transition-all text-sm"
            >
              Quay lại trang chủ
            </a>
          </form>
          
          <div className="mt-8 pt-8 border-t border-gray-100 text-[10px] text-center text-gray-400 uppercase tracking-widest leading-relaxed">
            Quản trị: Phan Thái Bình
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
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
            { id: 'videos', icon: <PlayCircle size={20} />, label: 'Thư viện Video' },
            { id: 'jobs', icon: <Briefcase size={20} />, label: 'Quản lý Tuyển dụng' },
            { id: 'distributors', icon: <MapPin size={20} />, label: 'Nhà phân phối' },
            { id: 'pages', icon: <FileText size={20} />, label: 'Nội dung trang' },
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
            <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center font-black text-white shadow-lg">
              AD
            </div>
            <div className="overflow-hidden">
              <div className="text-[14px] font-black tracking-tight">Administrator</div>
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">NYNA Manager</div>
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
          {activeTab === 'videos' && <VideoManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'jobs' && <JobManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'distributors' && <DistributorManager onSuccess={showSuccess} onError={showError} />}
          {activeTab === 'pages' && <PageManager onSuccess={showSuccess} onError={showError} />}
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
  const [formData, setFormData] = useState({ title: '', brand: '', image: '', price: '', category: '', description: '' });
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
      price: item.price.toString(),
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
      setFormData({ title: '', brand: brands[0]?.name || '', image: '', price: '', category: '', description: '' });
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
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Giá bán dự kiến (VND)</label>
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
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Ảnh đại diện sản phẩm</label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-3 flex items-center justify-center gap-2 bg-gray-50 hover:border-blue-900 transition-all">
                      <ImageIcon className="text-gray-400 w-5 h-5" />
                      <span className="text-sm font-bold text-gray-400">{uploading ? 'Đang tải...' : 'Chọn từ máy'}</span>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                  {formData.image && <img src={formData.image} className="w-12 h-12 rounded-lg border object-cover shadow-sm" alt="p" />}
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
        <h3 className="text-sm font-black text-gray-400 mb-6 flex items-center gap-2 uppercase tracking-widest">
          <div className="w-8 h-[2px] bg-blue-500 rounded-full"></div>
          Kho hàng sản phẩm
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {items.length === 0 && <p className="text-gray-400 text-xs font-bold italic">Chưa có sản phẩm nào.</p>}
          {items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-900 transition-all group">
              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0 border border-gray-50">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="P" />
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

export default AdminPage;
