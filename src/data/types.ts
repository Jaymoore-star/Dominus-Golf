export type Category =
  | 'training-system'
  | 'apparel'
  | 'accessories';

export type Money = number;

export type Variant = {
  label: string;
  options: string[];
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
};

export type Product = {
  id: string;
  name: string;
  category: Category;
  subcategory?: string;
  price: Money;
  compareAtPrice?: Money;
  image: string;
  hoverImage?: string;
  gallery?: string[];
  badge?: string;
  description: string;
  features: string[];
  specs?: string[];
  variants?: Variant[];
  inStock: boolean;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
  includedImages?: { label: string; image: string }[];
  colorVariants?: Record<string, string>;
  paymentUrl?: string;
};

export type CategoryCard = {
  id: Category | 'company';
  label: string;
  image: string;
  href: string;
};
