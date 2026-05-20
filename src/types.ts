
import { LucideIcon } from 'lucide-react';

export interface NewsItem {
  id?: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  content?: string;
}

export interface ProductItem {
  id?: string;
  title: string;
  brand: string;
  image: string;
  images?: string[]; // Up to 3 images
  features: { label: string; icon: any }[];
  color?: string;
  price?: number;
  original_price?: number;
  category?: string;
  description?: string;
  specifications?: { key: string; value: string }[];
}

export interface JobItem {
  id?: string;
  title: string;
  location: string;
  salary: string;
  deadline: string;
}

export interface DistributorItem {
  id?: string;
  name: string;
  address: string;
  phone: string;
  region: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  brand: string;
}

export interface PageItem {
  id: string;
  title: string;
  slug: string;
  category: 'policy' | 'partner' | 'about';
  content: string;
  show_on_home?: boolean;
}

export interface VideoItem {
  id: string;
  title: string;
  youtube_url: string;
  tag: string;
}

export interface BrandItem {
  id?: string;
  name: string;
  description: string;
  image: string;
  content: string;
  color?: string;
  slug?: string;
}

export interface BusinessSettings {
  id: 'main';
  bank_name: string;
  account_name: string;
  account_number: string;
  branch: string;
}
