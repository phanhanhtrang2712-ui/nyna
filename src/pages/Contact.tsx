
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Mail, MapPin, Send, Facebook, Youtube, CheckCircle2 } from 'lucide-react';
import { getSupabase } from '../lib/supabase';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      setErrorMsg('Vui lòng điền đầy đủ các thông tin bắt buộc (*)');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    const contactId = `contact_${Date.now()}`;
    const newContact = {
      id: contactId,
      full_name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || null,
      message: formData.message.trim(),
      created_at: new Date().toISOString()
    };

    // 1. Save to Supabase (attempt)
    let dbSuccess = false;
    try {
      const supabase = getSupabase();
      const { error } = await supabase.from('contacts').insert([newContact]);
      if (!error) {
        dbSuccess = true;
      } else {
        console.warn('Supabase insert failed, falling back to local saving', error);
      }
    } catch (err) {
      console.warn('Could not connect to online contacts DB, falling back to local saving', err);
    }

    // 2. Save to local storage anyway so both online and offline setups work reliably
    try {
      const saved = localStorage.getItem('nyna_local_contacts');
      const list = saved ? JSON.parse(saved) : [];
      list.unshift(newContact);
      localStorage.setItem('nyna_local_contacts', JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save to localStorage', err);
    }

    setLoading(false);
    setSuccess(true);
    setFormData({ name: '', phone: '', email: '', message: '' });

    setTimeout(() => {
      setSuccess(false);
    }, 5000);
  };

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
            className="bg-gray-50 p-16 rounded-[64px] border border-white shadow-xl relative overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div 
                  key="success-overlay"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center text-center py-16 space-y-4"
                >
                  <div className="text-emerald-500 bg-emerald-50 p-4 rounded-full">
                    <CheckCircle2 size={48} className="animate-bounce" />
                  </div>
                  <h3 className="text-2xl font-black text-blue-900 uppercase">Giao dịch gửi tin thành công!</h3>
                  <p className="text-gray-500 font-bold text-sm max-w-sm leading-relaxed">
                    Đội ngũ NYNA đã ghi nhận yêu cầu liên hệ của bạn. Chúng tôi sẽ sớm tư vấn và liên lạc lại qua số điện thoại hoặc email.
                  </p>
                </motion.div>
              ) : (
                <form className="space-y-8" onSubmit={handleSubmit} key="contact-form">
                   {errorMsg && (
                     <div className="bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl p-4 border border-rose-100">
                       ⚠️ {errorMsg}
                     </div>
                   )}

                   <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Họ và tên <span className="text-rose-500">*</span></label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white px-8 py-5 rounded-[24px] outline-none border-2 border-transparent focus:border-pink-500 transition-all font-bold text-blue-900" 
                          placeholder="David Nyna..." 
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Số điện thoại <span className="text-rose-500">*</span></label>
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white px-8 py-5 rounded-[24px] outline-none border-2 border-transparent focus:border-pink-500 transition-all font-bold text-blue-900" 
                          placeholder="09xx..." 
                        />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white px-8 py-5 rounded-[24px] outline-none border-2 border-transparent focus:border-pink-500 transition-all font-bold text-blue-900" 
                        placeholder="yourname@gmail.com" 
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-blue-900 uppercase tracking-widest ml-1">Nội dung tin nhắn <span className="text-rose-500">*</span></label>
                      <textarea 
                        rows={5} 
                        required
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white px-8 py-6 rounded-[32px] outline-none border-2 border-transparent focus:border-pink-500 transition-all font-bold text-blue-900 resize-none" 
                        placeholder="Hãy nói với chúng tôi nhu cầu của bạn..."
                      ></textarea>
                   </div>
                   <button 
                     type="submit"
                     disabled={loading}
                     className="w-full bg-blue-900 text-white py-6 rounded-full font-black text-lg uppercase tracking-tight hover:bg-pink-500 hover:shadow-2xl transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3 disabled:bg-gray-400"
                   >
                     {loading ? 'ĐANG GỬI...' : 'GỬI YÊU CẦU'} <Send size={20} />
                   </button>
                </form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
