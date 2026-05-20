
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, Phone, Mail, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ cartCount, onOpenCart }: { cartCount: number; onOpenCart: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'TRANG CHỦ', path: '/' },
    { name: 'GIỚI THIỆU', path: '/gioi-thieu' },
    { name: 'THƯƠNG HIỆU', path: '/thuong-hieu' },
    { name: 'TIN TỨC', path: '/tin-tuc' },
    { name: 'VIDEO', path: '/video' },
    { name: 'LIÊN HỆ', path: '/lien-he' },
  ];

  return (
    <header className="w-full relative z-50">
      <div className="bg-blue-900 text-white text-[11px] py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-6">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5" />
              <span>0916 070 421 - 0916 070 422</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Thứ 2 - Thứ 7: 7:30 - 17:30</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              <span>info@nyna.com.vn</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Link to="/he-thong" className="bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 transition-all font-bold text-emerald-400">
              Hệ thống phân phối
            </Link>
            <Link to="/tuyen-dung" className="hover:underline cursor-pointer">
              Tuyển dụng
            </Link>
            <span className="hover:underline cursor-pointer">Tài liệu</span>
          </div>
        </div>
      </div>

      <nav className={`w-full transition-all duration-300 ${isScrolled ? 'fixed top-0 bg-white/90 backdrop-blur-md shadow-md py-2' : 'bg-white py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="text-4xl font-black tracking-tighter text-blue-900 flex flex-col items-center">
              <span className="leading-none uppercase">NYNA</span>
              <div className="flex gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500"></div>
              </div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {navItems.map(item => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`text-[13px] font-black tracking-tight uppercase transition-colors ${location.pathname === item.path ? 'text-pink-500 underline underline-offset-4 decoration-2' : 'text-blue-900 hover:text-pink-500'}`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-6 text-blue-900">
               <Search className="w-5 h-5 cursor-pointer hover:text-pink-500 transition-colors" />
               <div className="relative cursor-pointer group" onClick={onOpenCart}>
                 <ShoppingCart className="w-5 h-5 group-hover:text-pink-500 transition-colors" />
                 {cartCount > 0 && (
                   <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
                     {cartCount}
                   </span>
                 )}
               </div>
            </div>
            <Link 
              to="/lien-he"
              className="bg-blue-900 text-white px-8 py-3 rounded-full text-[13px] font-black hover:bg-pink-500 hover:shadow-xl transition-all hidden md:block uppercase tracking-tight"
            >
              Liên hệ ngay
            </Link>
            <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-[100] bg-white p-8 overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-12">
              <div className="text-3xl font-black text-blue-900 uppercase">NYNA</div>
              <button className="p-2 bg-gray-100 rounded-full" onClick={() => setMobileMenuOpen(false)}>
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col gap-6">
              {navItems.map(item => (
                <Link 
                  key={item.path} 
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-2xl font-black text-left uppercase tracking-tighter ${location.pathname === item.path ? 'text-pink-500' : 'text-blue-900'}`}
                >
                  {item.name}
                </Link>
              ))}
              <button 
                onClick={() => { setMobileMenuOpen(false); onOpenCart(); }}
                className="text-2xl font-black text-pink-500 text-left uppercase tracking-tighter flex items-center gap-3"
              >
                GIỎ HÀNG ({cartCount})
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
