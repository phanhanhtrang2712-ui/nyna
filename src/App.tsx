import React from 'react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#030712] text-gray-100 flex items-center justify-center p-6 font-sans select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center"
      >
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
          website đang tạm dừng hoạt động
        </h1>
      </motion.div>
    </div>
  );
}
