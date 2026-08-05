export type Category =
  | 'training-system'
  | 'apparel'
  | 'accessories';

export type Money = number;

export type Variant = {
  label: string;
  options: string[];
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
  /**
   * Delivered by email, never shipped. Excluded from the shipping fee, and a
   * cart holding nothing else is not asked for a shipping address at all.
   * See src/lib/shipping.ts.
   */
  digital?: boolean;
  /* No rating/reviewCount/reviews here. Reviews are real customer records in
     Supabase (see lib/reviews.ts); the fields that used to sit here held
     invented figures that also reached Google as aggregateRating markup. */
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
