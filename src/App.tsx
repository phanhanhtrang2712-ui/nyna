import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Lenis from 'lenis';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Brands from './pages/Brands';
import News from './pages/News';
import Video from './pages/Video';
import Contact from './pages/Contact';
import Distribution from './pages/Distribution';
import Jobs from './pages/Jobs';
import Admin from './pages/Admin';
import ProductDetail from './pages/ProductDetail';

// Components
import MainLayout from './components/MainLayout';
import ScrollToTop from './components/ScrollToTop';

// Prefetch
import { prefetchAppCore } from './services/prefetch';
import { initSupabaseConfigAtRuntime } from './lib/supabase';

const WrappedRoute = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

export default function App() {
  useEffect(() => {
    // Dynamically retrieve Supabase client configuration then prefetch data
    initSupabaseConfigAtRuntime().finally(() => {
      prefetchAppCore();
    });

    // Initialize premium Flash-like silky-smooth inertial scroll engine (Lenis)
    const lenis = new Lenis({
      duration: 1.4, // Custom timing for premium slide-y momentum
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Silky ease-out
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.15, // Responsive multiplier for momentum
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/cms" element={<Admin />} />
        
        <Route element={<WrappedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/san-pham/:id" element={<ProductDetail />} />
          <Route path="/gioi-thieu" element={<About />} />
          <Route path="/thuong-hieu" element={<Brands />} />
          <Route path="/tin-tuc" element={<News />} />
          <Route path="/video" element={<Video />} />
          <Route path="/lien-he" element={<Contact />} />
          <Route path="/he-thong" element={<Distribution />} />
          <Route path="/tuyen-dung" element={<Jobs />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
