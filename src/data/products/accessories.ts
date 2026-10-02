import { Product } from '../types';

export const accessories: Product[] = [
  {
    id: 'feel-right-band',
    name: 'Feel Right Band',
    seoTitle: 'Golf Arm Connection and Wrist Training Band',
    seoDescription:
      'Neoprene golf training band you wear while you swing. Under the arm, on the forearm or on the wrist, it lets you feel and see arm connection and wrist position.',
    category: 'accessories',
    subcategory: 'Training Aid',
    price: 12.99,
    image: '/images/FeelRightBand-studio-square__42876ffb.webp',
    gallery: [
      '/images/FeelRightBand-studio-square__42876ffb.webp',
      '/images/FeelRiteGolfBand-square__4d3debef.webp',
    ],
    description:
      'A neoprene band you wear while you swing. It puts a reference on your body - something you can feel and something you can see - so what feels right and what is right finally match. Wear it with a real club. Hit real balls.',
    paymentUrl: 'https://square.link/u/Kx7GBaMA',
    features: [
      'Checks arm connection, a forearm reference line and wrist position',
      'Something you can feel and something you can see',
      'Stays on while you hit real balls',
      'Neoprene - wear it snug, not tight',
    ],
    inStock: true,
  },
  {
    id: 'laser-path-trainer',
    name: 'Tour Pure Laser Path Trainer',
    seoTitle: 'Golf Laser Swing Path and Plane Trainer',
    seoDescription:
      "A laser that screws into the end of the Tour Pure grip and traces your swing path on the mat in real time. Fits Men's, Women's and Junior models.",
    category: 'accessories',
    subcategory: 'Training Aid',
    price: 19.99,
    image: '/images/laser-on-grip__ead9a20d.webp',
    gallery: ['/images/laser-on-grip__ead9a20d.webp', '/images/laser-length__a28d8e71.webp'],
    badge: 'Pre-Order',
    description:
      'Master your swing plane with real-time laser feedback. The Tour Pure Laser Path Trainer screws into the rear port of your Tour Pure grip and projects a red laser line onto the mat, so you watch your backswing and downswing paths as you make them.',
    features: [
      'Real-time laser feedback on your swing path and plane',
      'Screws into the rear port of the Tour Pure grip',
      "Fits Tour Pure Men's, Women's and Junior models (LH/RH)",
      'Batteries included (3x LR44)',
    ],
    specs: [
      'Mounting: screws directly into the grip rear port',
      'Weight: 0.8 oz (zero impact on swing weight)',
      'Laser output: Class 2/3R red diode, under 5mW, 650nm',
      'Power: 3x LR44 button cell (batteries included)',
      "Fitment: Tour Pure Men's, Women's and Junior (LH/RH)",
      'Length: 2.99 in',
    ],
    inStock: true,
    preorder: true,
    shipsIn: '5-7 business days',
  },
  {
    id: 'dominus-towel',
    name: 'Dominus Golf Towel',
    seoTitle: 'Premium Microfiber Golf Towel',
    seoDescription:
      'Microfiber golf towel built for the bag. Durable, quick-drying and sized to clip on and stay put through a full round.',
    category: 'accessories',
    subcategory: 'Accessories',
    price: 19.99,
    image: '/images/ChatGPTImageMar24202607_40_17PM-square__5ebd200e.webp',
    hoverImage: '/images/ChatGPTImageMar24202607_39_41PM-square__8f545786.webp',
    gallery: [
      '/images/ChatGPTImageMar24202607_40_17PM-square__5ebd200e.webp',
      '/images/ChatGPTImageMar24202607_39_41PM-square__8f545786.webp',
      '/images/GolfTowel2-square__e75a1b93.webp',
    ],
    description: 'Premium Dominus Golf towel-clean, durable, built for the bag.',
    paymentUrl: 'https://square.link/u/mxCT3IDV',
    features: ['Durable fabric', 'Bag-ready size', 'Clean branding', 'Premium feel'],
    inStock: true,
  },
  {
    id: 'mastering-the-game-book',
    name: 'The Ultimate Guide to Mastering the Game (Physical Copy)',
    seoTitle: '90-Day Golf Training Program - Paperback',
    seoDescription:
      'A structured day-by-day golf training curriculum. Ninety days of drills, rep counts and practice plans in a printed paperback.',
    category: 'accessories',
    subcategory: 'Education',
    price: 14.99,
    image: '/images/book-ultimate-guide__3f8ec230.webp',
    gallery: [
      '/images/book-ultimate-guide__3f8ec230.webp',
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
    seoTitle: '90-Day Golf Training Program - PDF',
    seoDescription:
      'The full 90-day golf training curriculum as an instant PDF download. Free with any Tour Pure swing trainer. Drills, reps and practice plans.',
    category: 'accessories',
    subcategory: 'Education',
    price: 9.99,
    compareAtPrice: 14.99,
    image: '/images/book-ultimate-guide__3f8ec230.webp',
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
    // Emailed as a download link on payment — there is nothing to post.
    digital: true,
  },
];
