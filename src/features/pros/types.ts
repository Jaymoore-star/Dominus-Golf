export type Pro = {
  id: string;
  name: string;
  affiliation: string;
  region: string;
  city: string;
  state: string;
  bio: string;
  fullBio: string;
  photo: string | null;
  credentials: string[];
  sessions: { title: string; duration: string; description: string }[];
  acuityUrl: string | null;
  contactEmail: string;
  rating?: number;
  reviewCount?: number;
};
