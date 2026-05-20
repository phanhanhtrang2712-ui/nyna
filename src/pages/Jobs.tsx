
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { MapPin, Users, Zap } from 'lucide-react';
import { dataService } from '../services/dataService';
import { JobItem } from '../types';

const Jobs = () => {
  const [jobs, setJobs] = useState<JobItem[]>([]);

  useEffect(() => {
    dataService.list<JobItem>('jobs').then(setJobs);
  }, []);

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">CAREERS</span>
          <h1 className="text-6xl font-black text-blue-900 uppercase tracking-tighter mb-4">Gia nhập đội ngũ NYNA</h1>
          <p className="text-xl text-gray-400 font-bold uppercase tracking-widest leading-none">Cùng chúng tôi tạo nên giá trị cho cộng đồng</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {jobs.map((job, idx) => (
            <motion.div 
              key={job.id} 
              initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gray-50 p-12 rounded-[64px] transition-all border border-transparent hover:border-blue-900 group relative overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-900/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <h3 className="text-3xl font-black text-blue-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors max-w-[70%]">{job.title}</h3>
                <span className="bg-pink-100 text-pink-600 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest">Tuyển gấp</span>
              </div>
              <div className="flex flex-wrap gap-10 text-[14px] text-gray-500 font-bold uppercase mb-12 relative z-10">
                <div className="flex items-center gap-4"><MapPin size={22} className="text-blue-400" /> {job.location}</div>
                <div className="flex items-center gap-4"><Users size={22} className="text-blue-400" /> {job.salary}</div>
                <div className="flex items-center gap-4"><Zap size={22} className="text-blue-400" /> {job.deadline}</div>
              </div>
              <button className="w-full bg-blue-900 text-white py-6 rounded-full font-black text-lg uppercase tracking-tight hover:bg-pink-500 transition-all shadow-xl shadow-blue-900/10 relative z-10">Ứng tuyển ngay</button>
            </motion.div>
          ))}
          {jobs.length === 0 && <p className="col-span-full text-center text-gray-400 py-20 uppercase font-black italic">Đang cập nhật vị trí tuyển dụng...</p>}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
