import React from 'react';
import { ShieldAlert, Clock, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] text-gray-100 flex items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-pink-500 selection:text-white">
      {/* Background radial soft ambient glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-600/10 blur-[120px] pointer-events-none"></div>

      <div className="max-w-2xl w-full relative z-10 text-center">
        {/* Animated warning lock node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center justify-center p-5 rounded-[32px] bg-red-500/10 border border-red-500/20 mb-8 shadow-inner relative"
        >
          <div className="absolute inset-0 rounded-[32px] bg-red-500/5 animate-ping opacity-75"></div>
          <ShieldAlert className="w-12 h-12 text-red-500 relative z-10 animate-pulse" />
        </motion.div>

        {/* Display Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="text-3xl md:text-5xl font-black text-white mb-6 uppercase tracking-tight leading-tight">
            Website Tạm Dừng Hoạt Động
          </h1>
        </motion.div>

        {/* Polished Notice Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="space-y-6 text-gray-400 font-medium text-base md:text-lg leading-relaxed mb-10"
        >
          <p>
            Hệ thống website đang thực hiện bảo trì định kỳ và tạm ngừng cung cấp dịch vụ trực tuyến. 
          </p>
          <div className="inline-block bg-white/5 border border-white/10 px-6 py-3 rounded-2xl text-sm font-semibold text-pink-400">
            Khóa truy cập: Toàn bộ phân hệ bao gồm module CMS & Admin
          </div>
          <p className="text-xs md:text-sm text-gray-500">
            Xin chân thành cảm ơn sự thông cảm của quý khách. Mọi thắc mắc hoặc yêu cầu hỗ trợ, vui lòng liên hệ qua các kênh thông tin chính thức của chúng tôi.
          </p>
        </motion.div>

        {/* Technical Status line purely for design discipline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12"
        >
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 font-bold">
            <Clock size={16} className="text-gray-400" />
            <span>Trạng thái: Tạm dừng</span>
          </div>
          <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 font-bold">
            <Globe size={16} className="text-gray-400" />
            <span>Tất cả các module khóa</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
