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
    photo: '/images/1000010452__3764dc88.webp',
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
  /*
   * Added 17 Sep 2026. `/gabe-salvanera` was routed, prerendered, in
   * sitemap.xml and indexable - but he was missing from THIS array, which is
   * what /pros renders from, so nothing on the site linked to his page. A
   * crawl found it with zero inbound internal links. That is an orphan: almost
   * no crawl priority and no internal authority.
   *
   * Every field below is copied from what GabeSalvaneraPage.tsx already says.
   * Three deliberate gaps, because inventing them is worse than leaving them:
   *
   * - `city`/`state`/`country` are empty: his page states no location. ProCard
   *   and ProModal both guard on `(pro.city || pro.state)` and `.filter(Boolean)`,
   *   so empty renders nothing rather than a stray comma. The only cost is he
   *   does not match a location search on /pros. FILL THESE IN when known.
   * - `contactEmail` is the published support address, not a personal one.
   *   `gabe@dominusgolf.com` would mirror Leroy, but a mailto that bounces is
   *   worse than one that reaches the team. SWAP IT if he has a real mailbox.
   * - No `rating`/`reviewCount`. Leroy's 5.0/359 are his own; there is no such
   *   figure for Gabe, and inventing one is the exact mistake that put fake
   *   aggregateRating into this site's Product schema once already.
   */
  {
    id: 'gabe-salvanera',
    name: 'Gabe Salvanera',
    affiliation: 'PGA Tour Americas · Grass League',
    city: '',
    state: '',
    country: '',
    bio: 'Expert in Swing Mechanics and Performance Optimization.',
    fullBio:
      'Gabe Salvanera is a PGA Tour Americas and Grass League professional who has built his reputation on elite swing mechanics and performance optimization. His sessions focus on building tour-level habits on the range that translate directly to better scoring.',
    photo: '/images/GabeSand__d54af4a2.webp',
    credentials: [
      'PGA Tour Americas competitor',
      'Grass League professional',
      'Certified performance Pro',
      'Specialist in swing optimization and practice structure',
    ],
    sessions: [
      {
        title: 'Full Swing',
        duration: '1 hour',
        description:
          'Pro will be hitting balls on the range. Golfers will have to pay for their golf balls on the range. Gabe provides real-time feedback on your swing mechanics, ball flight, and practice habits.',
      },
      {
        title: 'Putting',
        duration: '1 hour',
        description: 'Elite putting instruction focusing on path, tempo, and green reading.',
      },
      {
        title: 'Pitch & Chip',
        duration: '1 hour',
        description:
          'Refine your short game with professional techniques for chipping and pitching.',
      },
    ],
    acuityUrl:
      'https://app.acuityscheduling.com/schedule.php?owner=39236931&calendarID=14047266&ref=booking_button',
    contactEmail: 'Customersupport@dominusgolf.com',
  },
];
