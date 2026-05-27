import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#030712] text-gray-100 flex items-center justify-center p-6 font-sans relative overflow-hidden select-none">
      {/* Immersive background glow elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-pink-500/10 via-purple-600/10 to-indigo-500/10 blur-[130px] pointer-events-none animate-pulse duration-[8000s]"></div>
      
      {/* Decorative fine mesh style grid purely as visual backdrop */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      ></div>

      <div className="max-w-lg w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-[40px] p-8 md:p-12 shadow-2xl relative overflow-hidden text-center"
        >
          {/* Subtle gold-pink top border glow */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-pink-500/30 to-transparent"></div>

          {/* Animated Glowing Icon Container */}
          <div className="mb-8 inline-flex relative">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8] 
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl"
            ></motion.div>
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/10 to-purple-600/10 border border-pink-500/30 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-pink-400" />
            </div>
          </div>

          {/* Eye-catching Heading */}
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-4 uppercase leading-tight bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
            Website đang tạm dừng hoạt động
          </h1>

          {/* Minimalist modern body copy */}
          <p className="text-gray-400 text-sm md:text-base leading-relaxed max-w-sm mx-auto font-medium">
            Hệ thống đang được nâng cấp để mang lại trải nghiệm tối ưu và nhanh chóng hơn. Rất mong quý khách thông cảm cho sự bất tiện này.
          </p>

          {/* Minimal footer line */}
          <div className="mt-8 pt-8 border-t border-white/[0.04] flex items-center justify-center">
            <span className="text-[11px] font-mono tracking-[0.2em] text-pink-500/60 uppercase font-semibold">
              Sẽ hoạt động trở lại sớm nhất
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
