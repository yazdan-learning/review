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

export type RootStackParamList = {
  Search: undefined;
  PlaceList: { searchQuery: string };
  PlaceDetails: { place: Place };
  Chat: { place: Place };
};