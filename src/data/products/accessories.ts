import { Product } from '../types';

export const accessories: Product[] = [
  {
    id: 'feel-right-band',
    name: 'Feel Right Band',
    category: 'accessories',
    subcategory: 'Training Aid',
    price: 12.99,
    image: '/images/FeelRiteGolfBand__cc34ac6f.png',
    gallery: [
      '/images/FeelRiteGolfBand__cc34ac6f.png',
    ],
    description:
      'Helps train proper arm structure and connection to build a more repeatable and efficient swing. Inspired by the famous "floatie drill" used on tour by world #1 Nelly Korda, this band gives you the exact same structural feedback in a sleek, premium design.',
    paymentUrl: 'https://square.link/u/Kx7GBaMA',
    features: [
      'Improves arm structure',
      'Promotes connection',
      'Fast feedback',
      'Easy to use anywhere',
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 1324,
    reviews: [
      {
        id: 'rev-b1',
        author: 'Robert T.',
        rating: 5,
        date: '2024-03-10',
        title: 'Essential for connection',
        body: 'The band really helps keep the arms connected. Simple but very effective.',
        verified: true,
      },
    ],
  },
  {
    id: 'dominus-towel',
    name: 'Dominus Golf Towel',
    category: 'accessories',
    subcategory: 'Accessories',
    price: 19.99,
    image: '/images/ChatGPTImageMar24202607_40_17PM__db70f8cf.png',
    hoverImage: '/images/ChatGPTImageMar24202607_39_41PM__213ac69a.png',
    gallery: [
      '/images/ChatGPTImageMar24202607_40_17PM__db70f8cf.png',
      '/images/ChatGPTImageMar24202607_39_41PM__213ac69a.png',
      '/images/GolfTowel2__dfa91d93.png',
    ],
    description: 'Premium Dominus Golf towel-clean, durable, built for the bag.',
    paymentUrl: 'https://square.link/u/mxCT3IDV',
    features: ['Durable fabric', 'Bag-ready size', 'Clean branding', 'Premium feel'],
    inStock: true,
    reviews: [
      {
        id: 'rev-t1',
        author: 'Kevin B.',
        rating: 5,
        date: '2024-03-15',
        title: 'Premium quality',
        body: 'Large size, absorbent, and looks great on the bag. The material is much better than my previous towel.',
        verified: true,
      },
    ],
  },
  {
    id: 'mastering-the-game-book',
    name: 'The Ultimate Guide to Mastering the Game (Physical Copy)',
    category: 'accessories',
    subcategory: 'Education',
    price: 14.99,
    image: '/images/Screenshot_20260324_042207_SamsungInternet__2f2a1710.jpg',
    gallery: [
      '/images/Screenshot_20260324_042207_SamsungInternet__2f2a1710.jpg',
    ],
    badge: 'New',
    paymentUrl: 'https://square.link/u/CY8NyjAv',
    description:
      'Stop guessing and start grinding with purpose. The Ultimate Guide to Mastering the Game is a structured, day-by-day training curriculum designed to bridge the gap between "having a tool" and "having a game." Built specifically to complement the Tour Pure system. FREE (PDF Version) with the purchase of any Tour Pure trainer.',
    features: [
      'The 90-Day Transformation: A step-by-step daily calendar of drills to build permanent muscle memory',
      '"Feel vs. Real" Breakdown: Learn how to interpret feedback from your Tour Pure trainer to fix your swing path in real-time',
      'Progress Tracking: Dedicated sections to log your stats and watch your handicap drop',
      'Complements the Tour Pure training system',
    ],
    specs: [
      'Formats Available: Physical Spiral-bound Hard Copy (stays flat on the range)',
      'Length: 90-Day Curriculum',
    ],
    inStock: true,
  },
  {
    id: 'training-manual-pdf',
    name: 'Ultimate Guide to Mastering the Game (PDF)',
    category: 'accessories',
    subcategory: 'Education',
    price: 9.99,
    compareAtPrice: 14.99,
    image: '/images/Screenshot_20260324_042207_SamsungInternet__2f2a1710.jpg',
    badge: 'FREE WITH TRAINER',
    paymentUrl: 'https://square.link/u/dgAr3D7l',
    description:
      'The complete 90-day training curriculum in digital PDF format. FREE with the purchase of any Tour Pure swing trainer. Instant access to tour-level drills, progress tracking, and technical mechanical breakdowns.',
    features: [
      'Instant Digital Download',
      '90-Day Structured Curriculum',
      'Mobile-Friendly Format',
      'Progress Tracking Sheets',
      'Technical Mechanical Breakdowns',
    ],
    inStock: true,
  },
];
