
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, X } from 'lucide-react';
import { dataService } from '../services/dataService';
import { useDataList } from '../hooks/useDataList';
import { VideoItem } from '../types';
import { getYoutubeThumbnail, getYoutubeEmbedUrl } from '../lib/youtube';

const Video = () => {
  const { data: fetchedVideos, loading } = useDataList<VideoItem>('videos');
  const [videos, setVideos] = useState<VideoItem[]>(fetchedVideos);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    setVideos(fetchedVideos);
  }, [fetchedVideos]);

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-20">
          <span className="text-blue-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">MEDIA HUB</span>
          <h1 className="text-5xl md:text-6xl font-black text-blue-900 tracking-tighter uppercase">Thư viện Video</h1>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {videos.map((vid, i) => (
            <motion.div 
              key={vid.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer flex flex-col"
              onClick={() => setSelectedVideo(vid)}
            >
              <div className="aspect-[4/3] rounded-[48px] overflow-hidden relative mb-8 bg-gray-100 shadow-sm transition-all group-hover:shadow-2xl">
                <img 
                  src={getYoutubeThumbnail(vid.youtube_url)} 
                  alt={vid.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-blue-900/30 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-900 shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                    <Play size={32} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute top-8 left-8 bg-pink-500 text-white px-6 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg">
                  {vid.tag}
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-black text-blue-900 uppercase tracking-tighter group-hover:text-pink-500 transition-colors leading-none">
                {vid.title}
              </h3>
            </motion.div>
          ))}
          
          {videos.length === 0 && (
            <div className="col-span-full py-32 text-center text-gray-300 font-black uppercase tracking-[0.4em]">Đang cập nhật video...</div>
          )}
        </div>

        <div className="mt-40 p-16 md:p-32 bg-blue-900 rounded-[80px] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px]"></div>
          <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[120px]"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-10 uppercase tracking-tighter leading-tight">THEO DÕI CHÚNG TÔI TRÊN YOUTUBE</h2>
            <p className="text-blue-100/60 font-bold uppercase tracking-widest mb-12 text-sm">Cập nhật những video mới nhất về sản phẩm và sự kiện của NYNA.</p>
            <button className="bg-red-600 text-white px-16 py-6 rounded-full font-black text-xl uppercase tracking-tighter hover:bg-red-700 hover:scale-105 transition-all flex items-center gap-4 mx-auto shadow-2xl">
              <Play size={28} fill="currentColor" /> SUBSCRIBE NYNA TV
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-blue-900/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-[48px] overflow-hidden shadow-2xl"
            >
              <button 
                onClick={() => setSelectedVideo(null)}
                className="absolute top-8 right-8 z-10 w-14 h-14 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all ring-1 ring-white/20"
              >
                <X size={28} />
              </button>
              <iframe 
                src={getYoutubeEmbedUrl(selectedVideo.youtube_url)} 
                title={selectedVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Video;
