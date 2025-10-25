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
  googleReviewSummary?: GoogleReviewSummary; // AI-powered summary from Google
}

// Google's native AI review summary (from reviewSummary field)
export interface GoogleReviewSummary {
  text: string; // The AI-generated summary text
  languageCode: string; // Language of the summary
  disclosureText: string; // "Summarized with Gemini" (MANDATORY to display)
  reviewsUri: string; // Link to full reviews on Google Maps (MANDATORY)
  flagContentUri: string; // Link to report inappropriate content (MANDATORY)
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

