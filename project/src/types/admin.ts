export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface Product {
  _id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  createdAt: string;
}

export interface GalleryItem {
  _id: string;
  title: string;
  category: string;
  image: string;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  title: string;
  company: string;
  image: string;
  testimonial: string;
  rating: number;
  featured: boolean;
  approved: boolean;
  createdAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  product?: string;
  message: string;
  status: 'new' | 'read' | 'responded';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  errors?: any[];
}

export interface LoginCredentials {
  email: string;
  password: string;
  clientInfo?: {
    browser: string;
    screenSize: string;
    language: string;
  };
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  data?: User;
}

export interface DashboardStats {
  productCount: number;
  galleryCount: number;
  testimonialCount: number;
  contactCount: number;
  recentProducts: Product[];
  recentContacts: Contact[];
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  image?: FileList; // react-hook-form returns FileList for <input type="file" />
}

export interface GalleryFormData {
  title: string;
  category: string;
  image?: FileList; // react-hook-form returns FileList for <input type="file" />
}

export interface TestimonialFormData {
  name: string;
  title: string;
  company: string;
  testimonial: string;
  rating: number;
  featured: boolean;
  approved: boolean;
  image?: FileList; // react-hook-form returns FileList for <input type="file" />
}

export type CategoryType = 'Hospital' | 'School' | 'Sports' | 'Hotel' | 'Industrial' | 'Scout & NCC';

export const CATEGORIES: CategoryType[] = [
  'Hospital',
  'School', 
  'Sports',
  'Hotel',
  'Industrial',
  'Scout & NCC'
];
