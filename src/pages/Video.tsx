
import React from 'react';
import { motion } from 'motion/react';
import { Play } from 'lucide-react';

const Video = () => {
  const videos = [
    { title: 'QUY TRÌNH SẢN XUẤT TÃ NYNA', url: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=1200', tag: 'SẢN XUẤT' },
    { title: 'TVC TÃ BÉ NYNA - ÊM MỀM VƯỢT TRỘI', url: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=1200', tag: 'QUẢNG CÁO' },
    { title: 'NYNA ĐỒNG HÀNH CÙNG MẸ VÀ BÉ', url: 'https://images.unsplash.com/photo-1544126592-807daa2b567b?auto=format&fit=crop&q=80&w=1200', tag: 'SỰ KIỆN' },
  ];

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">MEDIA HUB</span>
          <h1 className="text-5xl font-black text-blue-900 tracking-tighter uppercase">Thư viện Video</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
          {videos.map((vid, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="aspect-video rounded-[48px] overflow-hidden relative mb-8">
                <img src={vid.url} alt={vid.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-blue-900/40 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-900 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute top-6 left-6 bg-pink-500 text-white px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">{vid.tag}</div>
              </div>
              <h3 className="text-xl font-black text-blue-900 uppercase tracking-tight group-hover:text-pink-500 transition-colors">{vid.title}</h3>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 p-16 bg-blue-900 rounded-[80px] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-[80px]"></div>
          <h2 className="text-4xl font-black text-white mb-8 uppercase tracking-tighter">Theo dõi chúng tôi trên Youtube</h2>
          <button className="bg-red-600 text-white px-12 py-5 rounded-full font-black text-lg uppercase tracking-tight hover:bg-red-700 transition-all flex items-center gap-3 mx-auto">
            <Play size={24} fill="currentColor" /> SUBSCRIBE NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default Video;
