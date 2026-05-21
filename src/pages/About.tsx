
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { dataService } from '../services/dataService';
import { PageItem } from '../types';

const About = () => {
  const [about, setAbout] = useState<PageItem | null>(null);

  useEffect(() => {
    dataService.list<PageItem>('pages').then(pages => {
      const page = pages.find(p => p.slug === 'about');
      if (page) setAbout(page);
    });
  }, []);

  return (
    <div className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-pink-500 font-black uppercase tracking-[0.4em] text-xs mb-8 block text-center">GIỚI THIỆU CHUNG</span>
          <h1 className="text-5xl md:text-6xl font-black text-blue-900 mb-12 tracking-tight leading-[1.1] uppercase text-center">
            {about?.title || "Về NYNA"}
          </h1>
          
          <div className="prose prose-xl max-w-none text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
            {about?.content || "Thông tin đang được cập nhật..."}
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'NĂM THÀNH LẬP', value: '2018' },
              { label: 'NHÂN SỰ', value: '50+' },
              { label: 'ĐẠI LÝ', value: '100+' },
              { label: 'KHÁCH HÀNG', value: '1M+' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-8 bg-gray-50 rounded-[32px]">
                <div className="text-3xl font-black text-blue-900 mb-2">{stat.value}</div>
                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
