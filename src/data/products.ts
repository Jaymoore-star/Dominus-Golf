import { Product } from './types';
import { trainingSystems } from './products/trainingSystems';
import { apparel } from './products/apparel';
import { accessories } from './products/accessories';
import { categoryCards } from './categories';

export * from './types';
export * from './categories';
export * from './products/trainingSystems';
export * from './products/apparel';
export * from './products/accessories';

export const products: Product[] = [
  ...trainingSystems,
  ...accessories,
  ...apparel,
];

// Legacy export kept for any other components that may reference `categories`
export const categories = categoryCards;
