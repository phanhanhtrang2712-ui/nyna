
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
  features: { label: string; icon: any }[];
  color?: string;
  price?: number;
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
