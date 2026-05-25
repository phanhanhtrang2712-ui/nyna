
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import ScrollToTop from './components/ScrollToTop';
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
import MaintenanceGuard from './components/MaintenanceGuard';
import { prefetchAppCore } from './services/prefetch';

const WrappedRoute = () => (
  <MainLayout>
    <Outlet />
  </MainLayout>
);

export default function App() {
  useEffect(() => {
    // Clear any stale local cache items from local storage to force raw real-time data loading
    try {
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && key.startsWith('nyna_cache')) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.warn("Could not sweep localStorage:", e);
    }

    // Prefetch critical datasets immediately on boot
    prefetchAppCore();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MaintenanceGuard>
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
      </MaintenanceGuard>
    </BrowserRouter>
  );
}
