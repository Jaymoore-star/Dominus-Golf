import { Pro } from './types';

export const pros: Pro[] = [
  {
    id: 'leroy-bates',
    name: 'Leroy Bates',
    affiliation: 'Golf Junkyz Foundation · First Tee',
    city: 'Los Angeles',
    state: 'CA',
    country: 'USA',
    bio: 'Expert in Consistency and Technical Proficiency.',
    fullBio:
      'Leroy Bates is a Golf Junkyz Foundation professional and First Tee instructor whose entire Pro career is built around one goal: consistency. He gives everyday golfers a structured, repeatable path to lower scores through elite technical range sessions.',
    photo: 'https://firebasestorage.googleapis.com/v0/b/blink-451505.firebasestorage.app/o/user-uploads%2FL4O98NAxu1a1w3gO9QySN9Ussgi2%2F1000010452__3764dc88.jpg?alt=media&token=22783388-9f93-4757-9fa9-a5e992497359',
    credentials: [
      'Golf Junkyz Foundation certified professional',
      'First Tee instructor and youth development Pro',
      'Specialist in swing consistency and repeatable mechanics',
      'Dedicated to technical improvement on the range',
    ],
    sessions: [
      {
        title: 'Full Swing',
        duration: '1 hour',
        description:
          'Pro will be hitting balls on the range. Golfers will have to pay for their golf balls on the range. Leroy identifies pattern breakdowns and helps you build the repeatable habits that translate to lower scores.',
      },
      {
        title: 'Putting',
        duration: '1 hour',
        description: 'Elite putting instruction focusing on path, tempo, and green reading.',
      },
      {
        title: 'Pitch & Chip',
        duration: '1 hour',
        description: 'Refine your short game with professional techniques for chipping and pitching.',
      },
    ],
    acuityUrl:
      'https://app.acuityscheduling.com/schedule.php?owner=39236931&calendarID=14032949&ref=booking_button',
    contactEmail: 'leroy@dominusgolf.com',
    rating: 5.0,
    reviewCount: 359,
  },
];
