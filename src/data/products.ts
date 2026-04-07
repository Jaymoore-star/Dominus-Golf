export type Category =
  | 'training-system'
  | 'training-bundles'
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
  rating?: number;
  reviewCount?: number;
  includedImages?: { label: string; image: string }[];
};

export type CategoryCard = {
  id: Category | 'company';
  label: string;
  image: string;
  href: string;
};

export const categoryCards: CategoryCard[] = [
  {
    id: 'training-system',
    label: 'Training Systems',
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
    href: '/shop/training-system',
  },
  {
    id: 'training-bundles',
    label: 'Training Bundles',
    image: 'https://images.unsplash.com/photo-1473174038344-40656aad79bf?w=600&q=80',
    href: '/shop/training-bundles',
  },
  {
    id: 'accessories',
    label: 'Accessories',
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FScreenshot_20260324_042207_SamsungInternet__2f2a1710.jpg?alt=media&token=4e6db837-c08e-4745-b0c4-9d9e5d607413',
    href: '/shop/accessories',
  },
  {
    id: 'company',
    label: 'Company',
    image: 'https://images.unsplash.com/photo-1627934147169-854be8cb7e0c?w=600&q=80',
    href: '/about',
  },
];

export const products: Product[] = [
  // Training Systems
  {
    id: 'tour-pure-men',
    name: 'Tour Pure Men',
    category: 'training-system',
    subcategory: 'Performance',
    price: 59.99,
    compareAtPrice: 79.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
    hoverImage: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F2021-03-09__196c2c33.jpg?alt=media&token=dbaecb63-0518-44cc-beaa-4817b99a8fb5',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F2021-03-09__196c2c33.jpg?alt=media&token=dbaecb63-0518-44cc-beaa-4817b99a8fb5',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FGemini_Generated_Image_ofjfkaofjfkaofjf__1e06169b.png?alt=media&token=8b7d6778-29b1-44d2-a5b5-436472032131',
    ],
    badge: 'Best Seller',
    description:
      'Weighted swing trainer built to improve tempo, sequencing, swing path, and ball-striking consistency through structured repetition.',
    features: [
      'Improves tempo and sequencing',
      'Promotes repeatable swing path',
      'Builds golf-specific strength',
      'Training anywhere, anytime',
    ],
    specs: [
      'Weight: 3.8 lbs',
      'Length: 18 in',
      'Material: Industrial Steel / Polymer',
      'Color: Black',
    ],
    variants: [{ label: 'Color', options: ['Black'] }],
    inStock: true,
    rating: 4.9,
    reviewCount: 4897,
  },
  {
    id: 'tour-pure-women',
    name: 'Tour Pure Women',
    category: 'training-system',
    subcategory: 'Performance',
    price: 59.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FTourPureTrainerW2__165b6582.png?alt=media&token=9e37467f-20f0-4ad2-bde8-1af3d34acfd2',
    hoverImage: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FIMG-20251211-WA0000__f2e47d9b.jpg?alt=media&token=5ca49e9e-2470-4965-8658-5e9c4cdeab69',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FTourPureTrainerW2__165b6582.png?alt=media&token=9e37467f-20f0-4ad2-bde8-1af3d34acfd2',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FIMG-20251211-WA0000__f2e47d9b.jpg?alt=media&token=5ca49e9e-2470-4965-8658-5e9c4cdeab69',
    ],
    badge: 'Sold Out',
    description:
      'Precision weighted swing trainer designed to develop smooth tempo, proper sequencing, and a consistent swing motion.',
    features: [
      'Smooth weighted feel',
      'Improves rhythm and control',
      'Promotes consistent mechanics',
      'Built for repeatability',
    ],
    specs: [
      'Weight: 2.9 lbs',
      'Length: 16 in',
      'Material: Industrial Steel / Polymer',
      'Color: Pink',
    ],
    variants: [{ label: 'Color', options: ['Pink'] }],
    inStock: false,
    rating: 4.8,
    reviewCount: 2123,
  },
  {
    id: 'tour-pure-jr',
    name: 'Tour Pure Jr',
    category: 'training-system',
    subcategory: 'Junior Performance',
    price: 39.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FR__3951d4b9.png?alt=media&token=9d723d63-318c-4122-b7cd-b70a10e0520f',
    badge: 'Out of Stock',
    description:
      'Junior swing trainer designed to build balance, sequencing, and proper mechanics early—without overwhelming weight.',
    features: [
      'Junior-friendly weight',
      'Builds balance and timing',
      'Promotes good mechanics',
      'Confidence builder',
    ],
    inStock: false,
    rating: 4.7,
    reviewCount: 966,
  },

  // Training Bundles — images pending new assets
  {
    id: 'starter-system-men',
    name: 'Starter System (Men)',
    category: 'training-bundles',
    subcategory: 'Starter',
    price: 67.98,
    compareAtPrice: 72.98,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b',
    ],
    description:
      'Tour Pure + Feel Right Band — built to clean up mechanics and create consistency from day one.',
    features: [
      'Tour Pure trainer included',
      'Feel Right Band included',
      'Builds fundamentals fast',
      'Great entry-level system',
    ],
    inStock: true,
    includedImages: [
      { label: 'Feel Right Band', image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b' },
    ],
  },
  {
    id: 'starter-system-women',
    name: 'Starter System (Women)',
    category: 'training-bundles',
    subcategory: 'Starter',
    price: 67.98,
    compareAtPrice: 72.98,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FTourPureTrainerW2__165b6582.png?alt=media&token=9e37467f-20f0-4ad2-bde8-1af3d34acfd2',
    badge: 'Sold Out',
    description:
      'Tour Pure + Feel Right Band—built to improve tempo, motion, and consistency with structured training.',
    features: [
      'Tour Pure included',
      'Feel Right Band included',
      'Improves tempo and control',
      'Great entry system',
    ],
    inStock: false,
  },
  {
    id: 'core-training-system-men',
    name: 'Core Training System (Men)',
    category: 'training-bundles',
    subcategory: 'Core',
    price: 87.97,
    compareAtPrice: 92.97,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
    description:
      'Tour Pure + Feel Right Band + 90-Day Training Manual — full swing development in one system.',
    features: [
      'Tour Pure trainer included',
      'Feel Right Band included',
      '90-day training manual included',
      'Full swing development',
    ],
    inStock: true,
    includedImages: [
      { label: 'Feel Right Band', image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b' },
      { label: '90-Day Manual', image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FScreenshot_20260324_042207_SamsungInternet__2f2a1710.jpg?alt=media&token=4e6db837-c08e-4745-b0c4-9d9e5d607413' },
    ],
  },
  {
    id: 'core-training-system-women',
    name: 'Core Training System (Women)',
    category: 'training-bundles',
    subcategory: 'Core',
    price: 87.97,
    compareAtPrice: 92.97,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FTourPureTrainerW2__165b6582.png?alt=media&token=9e37467f-20f0-4ad2-bde8-1af3d34acfd2',
    badge: 'Sold Out',
    description:
      'The core system: Tour Pure + Feel Right Band + The Ultimate Guide to Mastering the Game (90-day manual).',
    features: [
      'Tour Pure included',
      'Feel Right Band included',
      '90-day training manual',
      'Full swing development',
    ],
    inStock: false,
  },
  {
    id: 'pro-performance-system',
    name: 'Pro Performance System',
    category: 'training-bundles',
    subcategory: 'Pro',
    price: 109.99,
    compareAtPrice: 124.98,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FPhotoroom-20251125_1425462241__e480e1c6.png?alt=media&token=7c96a611-0b70-415f-a7f7-8bebe5a974a2',
    description:
      'The complete system: Tour Pure + Feel Right Band + 90-Day Manual + Dominus Golf Towel.',
    features: [
      'Tour Pure trainer included',
      'Feel Right Band included',
      '90-day training manual included',
      'Dominus Golf towel included',
      'Built for consistency and performance',
    ],
    inStock: true,
    includedImages: [
      { label: 'Feel Right Band', image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b' },
      { label: '90-Day Manual', image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FScreenshot_20260324_042207_SamsungInternet__2f2a1710.jpg?alt=media&token=4e6db837-c08e-4745-b0c4-9d9e5d607413' },
      { label: 'Towel', image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FChatGPTImageMar24202607_40_17PM__db70f8cf.png?alt=media&token=6b657a6c-36d1-4a74-b3d2-d28b5a2de9c9' },
    ],
  },

  // Accessories (Feel Right Band + Towel + Book)
  {
    id: 'feel-right-band',
    name: 'Feel Right Band',
    category: 'accessories',
    subcategory: 'Training Aid',
    price: 12.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b',
    hoverImage: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBandonarm__c77b5c57.jpg?alt=media&token=9588ee49-ecd7-4c08-ba89-6c5e418216e8',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBand__cc34ac6f.png?alt=media&token=9a5b1874-aaa1-4e7c-ac39-2f865b12225b',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FFeelRiteGolfBandonarm__c77b5c57.jpg?alt=media&token=9588ee49-ecd7-4c08-ba89-6c5e418216e8',
    ],
    description:
      'Helps train proper arm structure and connection to build a more repeatable and efficient swing.',
    features: [
      'Improves arm structure',
      'Promotes connection',
      'Fast feedback',
      'Easy to use anywhere',
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 1324,
  },
  {
    id: 'dominus-towel',
    name: 'Dominus Golf Towel',
    category: 'accessories',
    subcategory: 'Accessories',
    price: 14.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FChatGPTImageMar24202607_40_17PM__db70f8cf.png?alt=media&token=6b657a6c-36d1-4a74-b3d2-d28b5a2de9c9',
    hoverImage: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FChatGPTImageMar24202607_39_41PM__213ac69a.png?alt=media&token=13055075-bd93-454a-9faf-30bdd6a757b8',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FChatGPTImageMar24202607_40_17PM__db70f8cf.png?alt=media&token=6b657a6c-36d1-4a74-b3d2-d28b5a2de9c9',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FChatGPTImageMar24202607_39_41PM__213ac69a.png?alt=media&token=13055075-bd93-454a-9faf-30bdd6a757b8',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FGolfTowel2__dfa91d93.png?alt=media&token=f24c8a91-7d2c-4962-854f-5c6ce02557d2',
    ],
    description: 'Premium Dominus Golf towel—clean, durable, built for the bag.',
    features: ['Durable fabric', 'Bag-ready size', 'Clean branding', 'Premium feel'],
    inStock: true,
  },
  {
    id: 'mastering-the-game-book',
    name: 'The Ultimate Guide to Mastering the Game (90-Day Training Manual)',
    category: 'accessories',
    subcategory: 'Education',
    price: 24.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FScreenshot_20260324_042207_SamsungInternet__2f2a1710.jpg?alt=media&token=4e6db837-c08e-4745-b0c4-9d9e5d607413',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2FScreenshot_20260324_042207_SamsungInternet__2f2a1710.jpg?alt=media&token=4e6db837-c08e-4745-b0c4-9d9e5d607413',
    ],
    badge: 'New',
    description:
      'Stop guessing and start grinding with purpose. The Ultimate Guide to Mastering the Game is a structured, day-by-day training curriculum designed to bridge the gap between "having a tool" and "having a game." Built specifically to complement the Tour Pure system, this manual takes you through a professional-grade progression to achieve locked-in mechanics and elite tempo. Whether you prefer a physical copy for the bag or a digital version for your phone, we have you covered.',
    features: [
      'The 90-Day Transformation: A step-by-step daily calendar of drills to build permanent muscle memory',
      '"Feel vs. Real" Breakdown: Learn how to interpret feedback from your Tour Pure trainer to fix your swing path in real-time',
      'Progress Tracking: Dedicated sections to log your stats and watch your handicap drop',
      'Complements the Tour Pure training system',
    ],
    specs: [
      'Formats Available: Physical Spiral-bound Hard Copy (stays flat on the range) & Instant Downloadable PDF',
      'Length: 90-Day Curriculum',
    ],
    inStock: true,
  },

  // Men's Apparel
  {
    id: 'dominus-tee-icon-white',
    name: "Dominus Icon Tee — White (Men's)",
    category: 'apparel',
    subcategory: "Men's Apparel",
    price: 14.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F362bd22b-fdf8-4a12-9d27-e2c171733e41__c6e99d68.png?alt=media&token=2f224778-65dc-4ebe-9917-4ba4012a0c1a',
    hoverImage: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-18__5cee2081.jpg?alt=media&token=89842c6e-8985-4106-a87a-c4f1429da757',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F362bd22b-fdf8-4a12-9d27-e2c171733e41__c6e99d68.png?alt=media&token=2f224778-65dc-4ebe-9917-4ba4012a0c1a',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-18__5cee2081.jpg?alt=media&token=89842c6e-8985-4106-a87a-c4f1429da757',
    ],
    badge: 'New',
    description: 'Clean Dominus Golf icon tee. Minimalist design, premium feel—built for the course and beyond.',
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
    rating: 4.9,
    reviewCount: 87,
  },
  {
    id: 'dominus-tee-wordmark-white',
    name: "Dominus Wordmark Tee — White (Men's)",
    category: 'apparel',
    subcategory: "Men's Apparel",
    price: 14.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-17__2eb54519.jpg?alt=media&token=67d61cc4-4dcb-4fdf-a1bf-bf08e9316f53',
    hoverImage: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F362bd22b-fdf8-4a12-9d27-e2c171733e41__c6e99d68.png?alt=media&token=2f224778-65dc-4ebe-9917-4ba4012a0c1a',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-17__2eb54519.jpg?alt=media&token=67d61cc4-4dcb-4fdf-a1bf-bf08e9316f53',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F362bd22b-fdf8-4a12-9d27-e2c171733e41__c6e99d68.png?alt=media&token=2f224778-65dc-4ebe-9917-4ba4012a0c1a',
    ],
    badge: 'New',
    description: 'Bold Dominus Golf wordmark tee. Arched lettering with the iconic D logo—represent the brand on and off the course.',
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
    rating: 4.8,
    reviewCount: 63,
  },
  {
    id: 'dominus-tee-performance-black',
    name: "Dominus Performance Tee — Black (Men's)",
    category: 'apparel',
    subcategory: "Men's Apparel",
    price: 14.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Fninjapod_11843683_f_4980_00_f__c9a61eee.jpg?alt=media&token=711e7d00-0de7-4691-9561-083071fddf2a',
    hoverImage: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-18__5cee2081.jpg?alt=media&token=89842c6e-8985-4106-a87a-c4f1429da757',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Fninjapod_11843683_f_4980_00_f__c9a61eee.jpg?alt=media&token=711e7d00-0de7-4691-9561-083071fddf2a',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-18__5cee2081.jpg?alt=media&token=89842c6e-8985-4106-a87a-c4f1429da757',
    ],
    badge: 'New',
    description: 'Dominus Golf performance tee in black. White icon logo on moisture-wicking triblend fabric—train and play in style.',
    features: [
      'White Dominus icon on black',
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
    rating: 4.9,
    reviewCount: 54,
  },
  {
    id: 'dominus-tee-performance-white',
    name: "Dominus Performance Tee — White (Men's)",
    category: 'apparel',
    subcategory: "Men's Apparel",
    price: 14.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-18__5cee2081.jpg?alt=media&token=89842c6e-8985-4106-a87a-c4f1429da757',
    hoverImage: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Fninjapod_11843683_f_4980_00_f__c9a61eee.jpg?alt=media&token=711e7d00-0de7-4691-9561-083071fddf2a',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-18__5cee2081.jpg?alt=media&token=89842c6e-8985-4106-a87a-c4f1429da757',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Fninjapod_11843683_f_4980_00_f__c9a61eee.jpg?alt=media&token=711e7d00-0de7-4691-9561-083071fddf2a',
    ],
    badge: 'New',
    description: 'Dominus Golf performance tee in white. Lightweight, breathable triblend built for movement—on and off the course.',
    features: [
      'Black Dominus icon on white',
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
    rating: 4.8,
    reviewCount: 41,
  },

  // Women's Apparel
  // Group A: Black Icon Tee (unnamed-11 front + unnamed-16 side)
  {
    id: 'dominus-womens-tee-black-icon',
    name: "Dominus Icon Tee — Black (Women's)",
    category: 'apparel',
    subcategory: "Women's Apparel",
    price: 14.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-11__fc5a40f7.jpg?alt=media&token=87722e6d-11e3-4e1b-a6b4-7e84ebce8990',
    hoverImage: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-16__4cc41a28.jpg?alt=media&token=ba681f7f-3fbe-49cf-8d7a-d8b6df139f44',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-11__fc5a40f7.jpg?alt=media&token=87722e6d-11e3-4e1b-a6b4-7e84ebce8990',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-16__4cc41a28.jpg?alt=media&token=ba681f7f-3fbe-49cf-8d7a-d8b6df139f44',
    ],
    badge: 'New',
    description: "Dominus Golf icon tee for women in black. Bold logo, premium feel—built for the course and beyond.",
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
    rating: 4.9,
    reviewCount: 32,
  },
  // Group B: White Icon Tee (unnamed-13 front + unnamed-12 side)
  {
    id: 'dominus-womens-tee-white-icon',
    name: "Dominus Icon Tee — White (Women's)",
    category: 'apparel',
    subcategory: "Women's Apparel",
    price: 14.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-13__94ffe0c4.jpg?alt=media&token=e511fa27-43af-49c7-a2cb-dbc281792be2',
    hoverImage: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-12__3c0a4238.jpg?alt=media&token=c9bfd0f2-c84f-4bc5-80d9-cfaeb745a57d',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-13__94ffe0c4.jpg?alt=media&token=e511fa27-43af-49c7-a2cb-dbc281792be2',
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Funnamed-12__3c0a4238.jpg?alt=media&token=c9bfd0f2-c84f-4bc5-80d9-cfaeb745a57d',
    ],
    badge: 'New',
    description: "Dominus Golf icon tee for women in white. Lightweight, breathable triblend built for movement—on and off the course.",
    features: [
      'Black Dominus icon on white',
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
    rating: 4.8,
    reviewCount: 28,
  },
  // Group C: Black Performance Tee (a2d1da0a — standalone)
  {
    id: 'dominus-womens-tee-black-performance',
    name: "Dominus Performance Tee — Black (Women's)",
    category: 'apparel',
    subcategory: "Women's Apparel",
    price: 14.99,
    image: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Fa2d1da0a-6213-4a84-8dca-5122fd81823a__3ed0e102.png?alt=media&token=477bc876-34dd-41b2-b344-778269d56bd4',
    gallery: [
      'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2Fa2d1da0a-6213-4a84-8dca-5122fd81823a__3ed0e102.png?alt=media&token=477bc876-34dd-41b2-b344-778269d56bd4',
    ],
    badge: 'New',
    description: "Dominus Golf performance tee for women in black. Moisture-wicking triblend with the iconic D logo—train and play in style.",
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
    rating: 4.9,
    reviewCount: 19,
  },
];

// Legacy export kept for any other components that may reference `categories`
export const categories = categoryCards;
