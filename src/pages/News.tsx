
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { dataService } from '../services/dataService';
import { NewsItem } from '../types';

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [activeNews, setActiveNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    dataService.list<NewsItem>('news').then(setNews);
  }, []);

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-pink-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">BLOG & CẬP NHẬT</span>
          <h1 className="text-5xl font-black text-blue-900 tracking-tighter uppercase">Tin tức & Sự kiện</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          {news.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setActiveNews(item)}
              className="group cursor-pointer"
            >
              <div className="h-72 rounded-[48px] overflow-hidden mb-10 shadow-xl border border-white relative">
                 <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" />
                 <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-2 rounded-2xl font-black text-[10px] uppercase text-blue-900">{item.date}</div>
              </div>
              <h3 className="text-2xl font-black text-blue-900 mb-4 group-hover:text-pink-500 transition-colors leading-tight uppercase tracking-tight line-clamp-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">{item.excerpt}</p>
              <button className="text-blue-900 font-black text-xs flex items-center gap-3 hover:gap-5 transition-all uppercase tracking-[0.2em]">Đọc bài viết <ArrowRight size={18} /></button>
            </motion.div>
          ))}
          {news.length === 0 && <p className="col-span-full text-center text-gray-400 py-20 uppercase font-black italic">Chưa có bài viết mới.</p>}
        </div>
      </div>

      <AnimatePresence>
        {activeNews && (
          <div className="fixed inset-0 z-[250] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveNews(null)}
              className="absolute inset-0 bg-blue-900/40 backdrop-blur-xl"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.9 }}
              className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[64px] shadow-2xl text-gray-900 scrollbar-hide"
            >
              <div className="h-[400px] w-full relative mb-12">
                <img src={activeNews.image} alt={activeNews.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                <button onClick={() => setActiveNews(null)} className="absolute top-10 right-10 w-14 h-14 rounded-full bg-white/20 backdrop-blur-lg border border-white/30 text-white flex items-center justify-center hover:bg-pink-500 hover:border-pink-500 transition-all shadow-xl">
                  <X size={28} />
                </button>
              </div>
              
              <div className="px-16 pb-20">
                <div className="mb-10">
                   <span className="bg-pink-100 text-pink-600 px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest mb-6 inline-block">{activeNews.date}</span>
                   <h2 className="text-5xl font-black text-blue-900 leading-[1.1] uppercase tracking-tighter">
                     {activeNews.title}
                   </h2>
                </div>
                <div className="prose prose-xl max-w-none text-gray-600 font-medium leading-[1.8]">
                  <ReactMarkdown>{activeNews.content || activeNews.excerpt}</ReactMarkdown>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default News;
