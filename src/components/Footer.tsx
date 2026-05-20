
import React, { useState, useEffect } from 'react';
import { 
  Facebook, Youtube, Send, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { dataService } from '../services/dataService';
import { PageItem } from '../types';

const Footer = () => {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [activePage, setActivePage] = useState<PageItem | null>(null);

  useEffect(() => {
    dataService.list<PageItem>('pages').then(setPages);
  }, []);

  const policyPages = pages.filter(p => p.category === 'policy');
  const partnerPages = pages.filter(p => p.category === 'partner');

  return (
    <footer className="bg-blue-900 text-white pt-32 pb-16 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-blue-800 rounded-full blur-[100px] opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-32 relative z-10">
        <div className="flex flex-col gap-8">
          <div className="text-5xl font-black tracking-tighter uppercase">NYNA</div>
          <p className="text-blue-100/70 font-medium leading-relaxed text-sm">
            Tự hào là đơn vị tiên phong mang đến các giải pháp chăm sóc gia đình tiêu chuẩn quốc tế cho người Việt.
          </p>
          <div className="flex gap-4">
             {[Facebook, Youtube, Send].map((Icon, i)=> (
               <div key={i} className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center cursor-pointer hover:bg-pink-500 transition-all hover:-translate-y-1">
                  <Icon size={20} />
               </div>
             ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-lg font-black mb-10 uppercase tracking-[0.2em] text-pink-400">CHÍNH SÁCH</h4>
          <ul className="space-y-4 text-blue-100/60 font-bold text-sm uppercase tracking-wide">
            {policyPages.map(page => (
              <li key={page.id} onClick={() => setActivePage(page)} className="hover:text-white cursor-pointer transition-colors line-clamp-1">{page.title}</li>
            ))}
            {policyPages.length === 0 && <li className="opacity-40 italic">Chưa có chính sách</li>}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-black mb-10 uppercase tracking-[0.2em] text-pink-400">HỖ TRỢ ĐỐI TÁC</h4>
          <ul className="space-y-4 text-blue-100/60 font-bold text-sm uppercase tracking-wide">
            {partnerPages.map(page => (
              <li key={page.id} onClick={() => setActivePage(page)} className="hover:text-white cursor-pointer transition-colors line-clamp-1">{page.title}</li>
            ))}
            {partnerPages.length === 0 && <li className="opacity-40 italic">Chưa có thông tin đối tác</li>}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-black mb-10 uppercase tracking-[0.2em] text-pink-400">ĐĂNG KÝ NHẬN TIN</h4>
          <p className="text-blue-100/60 text-sm mb-8 font-medium">Nhận thông tin ưu đãi sớm nhất từ NYNA.</p>
          <div className="flex bg-white/5 border border-white/10 rounded-3xl p-1.5 focus-within:border-pink-500 transition-all">
             <input type="text" placeholder="Email của bạn..." className="bg-transparent border-none outline-none flex-1 px-4 text-sm font-bold placeholder:text-blue-100/30" />
             <button className="bg-pink-500 text-white p-4 rounded-2xl hover:bg-pink-600 transition-all">
                <Send size={18} />
             </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
        <p className="text-[11px] font-black text-blue-100/30 uppercase tracking-[0.3em]">
          © 2026 CÔNG TY TNHH MTV SẢN XUẤT VÀ THƯƠNG MẠI NYNA. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-10">
           
           <div className="text-[11px] font-black text-blue-100/30 uppercase tracking-[0.3em]">THIẾT KẾ BỞI BH.CO</div>
        </div>
      </div>

      <AnimatePresence>
        {activePage && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActivePage(null)} className="absolute inset-0 bg-blue-900/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 100, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.9 }} className="relative bg-white w-full max-w-4xl max-h-[80vh] overflow-y-auto rounded-[48px] p-12 shadow-2xl text-gray-900 scrollbar-hide">
              <button onClick={() => setActivePage(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all"><X size={24} /></button>
              <div className="mb-8">
                <span className="text-blue-500 font-black uppercase tracking-widest text-xs mb-2 block">{activePage.category === 'policy' ? 'Chính sách' : 'Đối tác'}</span>
                <h2 className="text-4xl font-black text-blue-900 uppercase tracking-tighter">{activePage.title}</h2>
              </div>
              <div className="prose prose-lg max-w-none text-gray-600 font-medium leading-relaxed">
                <ReactMarkdown>{activePage.content}</ReactMarkdown>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </footer>
  );
};

export default Footer;
