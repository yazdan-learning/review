export interface Place {
  id: string;
  name: string;
  address: string;
  type: string;
  rating: number;
  priceLevel: number;
  location: {
    latitude: number;
    longitude: number;
  };
  photoUrl?: string;
  isOpen: boolean;
  reviews?: Review[];
  userRatingCount?: number; // Total number of reviews on Google
}

export interface Review {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  time: string;
  relativeTimeDescription: string;
}

export interface ReviewSummary {
  overall_rating: number;
  total_reviews: number;
  sentiment_summary: string;
  pros: string[];
  cons: string[];
  key_themes: string[];
  recommendation: string;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

