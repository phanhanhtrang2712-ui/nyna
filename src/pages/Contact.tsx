
import React from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Send, Facebook, Youtube } from 'lucide-react';

const Contact = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <span className="text-pink-500 font-black uppercase tracking-[0.4em] text-xs mb-4 block">LIÊN HỆ VỚI CHÚNG TÔI</span>
            <h1 className="text-6xl font-black text-blue-900 mb-8 tracking-tighter uppercase leading-[0.95]">
              HÃY ĐỂ LẠI <br/> LỜI NHẮN
            </h1>
            <p className="text-xl text-gray-500 font-medium mb-16 leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Mọi ý kiến đóng góp là động lực để NYNA hoàn thiện hơn.
            </p>

            <div className="space-y-10">
              {[
                { icon: <Phone size={24} />, label: "GỌI CHO CHÚNG TÔI", value: "0235 3675 822 / 0923888885" },
                { icon: <Mail size={24} />, label: "EMAIL HỖ TRỢ", value: "info@nyna.com.vn" },
                { icon: <MapPin size={24} />, label: "TRỤ SỞ CHÍNH", value: "08 Trần Hớn , Xã Thăng Bình , TP Đà Nẵng" },
              ].map(item => (
                <div key={item.label} className="flex gap-6 items-center group">
                  <div className="w-16 h-16 rounded-[24px] bg-gray-50 text-blue-900 flex items-center justify-center group-hover:bg-blue-900 group-hover:text-white transition-all transform group-hover:rotate-6">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{item.label}</div>
                    <div className="text-lg font-black text-blue-900">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 flex gap-6">
               {[Facebook, Youtube, Send].map((Icon, i) => (
                 <div key={i} className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-blue-900 hover:bg-pink-500 hover:text-white transition-all cursor-pointer">
                    <Icon size={24} />
                 </div>
               ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-50 p-16 rounded-[64px] border border-white shadow-xl"
          >
            <form className="space-y-8" onSubmit={e => e.preventDefault()}>
               <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Họ và tên</label>
                    <input type="text" className="w-full bg-white px-8 py-5 rounded-[24px] outline-none border-2 border-transparent focus:border-pink-500 transition-all font-bold text-blue-900" placeholder="David Nyna..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Số điện thoại</label>
                    <input type="text" className="w-full bg-white px-8 py-5 rounded-[24px] outline-none border-2 border-transparent focus:border-pink-500 transition-all font-bold text-blue-900" placeholder="09xx..." />
                  </div>
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Email</label>
                  <input type="email" className="w-full bg-white px-8 py-5 rounded-[24px] outline-none border-2 border-transparent focus:border-pink-500 transition-all font-bold text-blue-900" placeholder="yourname@gmail.com" />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Nội dung tin nhắn</label>
                  <textarea rows={5} className="w-full bg-white px-8 py-6 rounded-[32px] outline-none border-2 border-transparent focus:border-pink-500 transition-all font-bold text-blue-900 resize-none" placeholder="Hãy nói với chúng tôi nhu cầu của bạn..."></textarea>
               </div>
               <button className="w-full bg-blue-900 text-white py-6 rounded-full font-black text-lg uppercase tracking-tight hover:bg-pink-500 hover:shadow-2xl transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3">
                  GỬI YÊU CẦU <Send size={20} />
               </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
