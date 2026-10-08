import { Product } from '../types';

export const apparel: Product[] = [
  // Men's Apparel
  {
    id: 'dominus-tee-icon-white',
    name: "Icon Tee (Men's)",
    seoTitle: "Icon Golf T-Shirt - White (Men's)",
    seoDescription:
      "Men's golf t-shirt with the Dominus icon. Minimalist design in a premium cotton feel, built for the course and beyond.",
    category: 'apparel',
    subcategory: "Men's Apparel",
    audience: 'men',
    price: 19.99,
    image: '/images/Gemini_Generated_Image_a1fmgba1fmgba1fm-square__c5e52c9e.webp',
    hoverImage: '/images/Gemini_Generated_Image_j0e7ykj0e7ykj0e7-square__24a3b57f.webp',
    colorVariants: {
      White: '/images/Gemini_Generated_Image_a1fmgba1fmgba1fm-square__c5e52c9e.webp',
    },
    pattern: 'Logo print',
    gallery: [
      '/images/Gemini_Generated_Image_a1fmgba1fmgba1fm-square__c5e52c9e.webp',
      '/images/Gemini_Generated_Image_j0e7ykj0e7ykj0e7-square__24a3b57f.webp',
    ],
    badge: 'New',
    description: 'Clean Dominus Golf icon tee. Minimalist design, premium feel-built for the course and beyond.',
    features: [
      'Dominus Golf icon print',
      'Vintage look and extreme softness',
      'Great recovery and stretch',
      'Athletic fit',
    ],
    specs: [
      "Model: Next Level 6010 Men's Triblend Crew",
      'Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% Rayon',
      'Weight: 4.3 oz',
      'Fit: Athletic',
    ],
    variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }],
    inStock: true,
  },
  {
    id: 'dominus-tee-wordmark-white',
    name: "Wordmark Tee (Men's)",
    seoTitle: "Wordmark Golf T-Shirt - White (Men's)",
    seoDescription:
      "Men's golf t-shirt with the arched Dominus wordmark and D logo. Premium cotton feel for the course and beyond.",
    category: 'apparel',
    subcategory: "Men's Apparel",
    audience: 'men',
    price: 19.99,
    image: '/images/ninjapod_11843683_f_4980_00_f__c9a61eee.webp',
    colorVariants: {
      White: '/images/ninjapod_11843683_f_4980_00_f__c9a61eee.webp',
    },
    pattern: 'Logo print',
    gallery: [
      '/images/ninjapod_11843683_f_4980_00_f__c9a61eee.webp',
    ],
    badge: 'New',
    description: 'Bold Dominus Golf wordmark tee. Arched lettering with the iconic D logo-represent the brand on and off the course.',
    features: [
      'Full wordmark + icon print',
      'Vintage look and extreme softness',
      'Great recovery and stretch',
      'Classic fit',
    ],
    specs: [
      "Model: Next Level 6010 Men's Triblend Crew",
      'Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% Rayon',
      'Weight: 4.3 oz',
      'Fit: Athletic',
    ],
    variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }],
    inStock: true,
  },
  {
    id: 'dominus-tee-performance-black',
    name: "Performance Tee (Men's)",
    seoTitle: "Performance Golf T-Shirt - White (Men's)",
    seoDescription:
      "Men's moisture-wicking golf t-shirt in triblend fabric. Back logo with sleeve branding, built to train and play in.",
    category: 'apparel',
    subcategory: "Men's Apparel",
    audience: 'men',
    price: 19.99,
    image: '/images/unnamed-18-square__965291a0.webp',
    colorVariants: {
      White: '/images/unnamed-18-square__965291a0.webp',
    },
    pattern: 'Logo print',
    gallery: [
      '/images/unnamed-18-square__965291a0.webp',
    ],
    badge: 'New',
    description: 'Dominus Golf performance tee. Back logo with sleeve branding on moisture-wicking triblend fabric-train and play in style.',
    features: [
      'Back logo with sleeve branding',
      'Vintage look and extreme softness',
      'Great recovery and stretch',
      'Course to gym ready',
    ],
    specs: [
      "Model: Next Level 6010 Men's Triblend Crew",
      'Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% Rayon',
      'Weight: 4.3 oz',
      'Fit: Athletic',
    ],
    variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }],
    inStock: true,
  },
  // Women's Apparel
  {
    id: 'dominus-womens-tee-black-icon',
    name: "Icon Tee - Black (Women's)",
    seoTitle: "Icon Golf T-Shirt - Black (Women's)",
    seoDescription:
      "Women's golf t-shirt with the Dominus icon in black. Bold logo and a premium feel, built for the course and beyond.",
    category: 'apparel',
    subcategory: "Women's Apparel",
    audience: 'women',
    price: 19.99,
    image: '/images/tee-womens-black-icon__72061fef.webp',
    hoverImage: '/images/unnamed-16-square__2647aee8.webp',
    // Black only. This and the white icon tee are separate products, so each
    // offers just its own colour — listing both made them look like duplicates.
    colorVariants: {
      Black: '/images/tee-womens-black-icon__72061fef.webp',
    },
    pattern: 'Logo print',
    gallery: [
      '/images/tee-womens-black-icon__72061fef.webp',
      '/images/unnamed-16-square__2647aee8.webp',
    ],
    badge: 'New',
    description: "Dominus Golf icon tee for women in black. Bold logo, premium feel-built for the course and beyond.",
    features: [
      'Dominus Golf icon print',
      'Vintage look and extreme softness',
      'Great recovery and stretch',
      'Athletic fit',
    ],
    specs: [
      "Model: Next Level 6010 Women's Triblend Crew",
      'Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% Rayon',
      'Weight: 4.3 oz',
      'Fit: Athletic',
    ],
    variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }],
    inStock: true,
  },
  {
    id: 'dominus-womens-tee-white-icon',
    name: "Icon Tee - White (Women's)",
    seoTitle: "Icon Golf T-Shirt - White (Women's)",
    seoDescription:
      "Women's golf t-shirt with the Dominus icon in white. Clean minimalist design, built for the course and beyond.",
    category: 'apparel',
    subcategory: "Women's Apparel",
    audience: 'women',
    price: 19.99,
    image: '/images/unnamed-12-square__24aceb8d.webp',
    hoverImage: '/images/unnamed-13-square__b12db29e.webp',
    // White only. It used to list Black first, and the card defaults to the first
    // colour in COLOR_ORDER — which is why this product showed the black shirt.
    colorVariants: {
      White: '/images/unnamed-12-square__24aceb8d.webp',
    },
    pattern: 'Logo print',
    gallery: [
      '/images/unnamed-12-square__24aceb8d.webp',
      '/images/unnamed-13-square__b12db29e.webp',
    ],
    badge: 'New',
    description: "Dominus Golf icon tee for women in white. Clean, minimalist design-built for the course and beyond.",
    features: [
      'Dominus Golf icon print',
      'Vintage look and extreme softness',
      'Great recovery and stretch',
      'Athletic fit',
    ],
    specs: [
      "Model: Next Level 6010 Women's Triblend Crew",
      'Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% Rayon',
      'Weight: 4.3 oz',
      'Fit: Athletic',
    ],
    variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }],
    inStock: true,
  },
  {
    id: 'dominus-womens-tee-black-performance',
    name: "Performance Tee (Women's)",
    seoTitle: "Performance Golf T-Shirt - Black (Women's)",
    seoDescription:
      "Women's moisture-wicking golf t-shirt in triblend fabric with the Dominus D logo. Built to train in and to play a full round in.",
    category: 'apparel',
    subcategory: "Women's Apparel",
    audience: 'women',
    price: 19.99,
    image: '/images/tee-womens-black-performance__0a43f740.webp',
    // Black only.
    colorVariants: {
      Black: '/images/tee-womens-black-performance__0a43f740.webp',
    },
    pattern: 'Logo print',
    gallery: [
      '/images/tee-womens-black-performance__0a43f740.webp',
    ],
    badge: 'New',
    description: "Dominus Golf performance tee for women in black. Moisture-wicking triblend with the iconic D logo-train and play in style.",
    features: [
      'White Dominus icon on black',
      'Vintage look and extreme softness',
      'Great recovery and stretch',
      'Course to gym ready',
    ],
    specs: [
      "Model: Next Level 6010 Women's Triblend Crew",
      'Fabric: 50% Polyester, 25% Combed Ring-Spun Cotton, 25% Rayon',
      'Weight: 4.3 oz',
      'Fit: Athletic',
    ],
    variants: [{ label: 'Size', options: ['S', 'M', 'L', 'XL', 'XXL'] }],
    inStock: true,
  },
];
