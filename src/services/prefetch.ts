import { dataService } from './dataService';
import { queryCache } from './queryCache';

export const prefetchTable = async (table: string, orderField: string = 'created_at'): Promise<void> => {
  const cacheKey = `nyna_cache_${table}`;
  const freshData = queryCache.get(cacheKey);
  if (freshData) return;

  try {
    const fetchPromise = () => dataService.list(table, orderField);
    const res = await queryCache.getOrCreatePromise(cacheKey + '_promise', fetchPromise);
    queryCache.set(cacheKey, res);
  } catch (err) {
    console.warn(`Failed to prefetch ${table}:`, err);
  }
};

export const prefetchProducts = () => prefetchTable('products');
export const prefetchBrands = () => prefetchTable('brands');
export const prefetchNews = () => prefetchTable('news');
export const prefetchVideos = () => prefetchTable('videos');
export const prefetchDistributors = () => prefetchTable('distributors');
export const prefetchPages = () => prefetchTable('pages');
export const prefetchJobs = () => prefetchTable('jobs');

// Prefetch TẤT CẢ các bảng ngay khi app khởi động
export const prefetchAppCore = () => {
  prefetchProducts();
  prefetchBrands();
  prefetchPages();
  prefetchNews();
  prefetchVideos();
  prefetchDistributors();
  prefetchJobs();
};
