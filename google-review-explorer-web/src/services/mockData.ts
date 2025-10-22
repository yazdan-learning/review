import { Place, Review, ReviewSummary } from '../types';

export const mockReviews: Review[] = [
  {
    id: '1',
    authorName: 'John Smith',
    rating: 5,
    text: 'Amazing food and great service! The pasta was perfectly cooked and the staff was very friendly. Highly recommend this place for a romantic dinner.',
    time: '2024-01-15',
    relativeTimeDescription: '2 weeks ago'
  },
  {
    id: '2',
    authorName: 'Sarah Johnson',
    rating: 4,
    text: 'Good food but a bit pricey. The atmosphere is nice and the location is convenient. Would come back for special occasions.',
    time: '2024-01-10',
    relativeTimeDescription: '3 weeks ago'
  },
  {
    id: '3',
    authorName: 'Mike Davis',
    rating: 3,
    text: 'Average experience. Food was okay but nothing special. Service could be faster.',
    time: '2024-01-05',
    relativeTimeDescription: '1 month ago'
  }
];

export const mockPlaces: Place[] = [
  {
    id: '1',
    name: 'Ristorante Italiano',
    address: '123 Main Street, New York, NY',
    type: 'restaurant',
    rating: 4.2,
    priceLevel: 3,
    location: {
      latitude: 40.7128,
      longitude: -74.0060
    },
    isOpen: true,
    reviews: mockReviews,
    userRatingCount: 127
  },
  {
    id: '2',
    name: 'Grand Hotel Manhattan',
    address: '456 Broadway, New York, NY',
    type: 'hotel',
    rating: 4.5,
    priceLevel: 4,
    location: {
      latitude: 40.7589,
      longitude: -73.9851
    },
    isOpen: true,
    userRatingCount: 89,
    reviews: [
      {
        id: '4',
        authorName: 'Emma Wilson',
        rating: 5,
        text: 'Excellent hotel with beautiful rooms and outstanding service. The location is perfect for exploring the city.',
        time: '2024-01-20',
        relativeTimeDescription: '1 week ago'
      }
    ]
  },
  {
    id: '3',
    name: 'Coffee Corner',
    address: '789 5th Avenue, New York, NY',
    type: 'cafe',
    rating: 4.0,
    priceLevel: 2,
    location: {
      latitude: 40.7614,
      longitude: -73.9776
    },
    isOpen: true,
    reviews: [
      {
        id: '5',
        authorName: 'David Brown',
        rating: 4,
        text: 'Great coffee and cozy atmosphere. Perfect place to work or meet friends.',
        time: '2024-01-18',
        relativeTimeDescription: '1 week ago'
      }
    ]
  },
  {
    id: '4',
    name: 'Electronics Plus',
    address: '321 Tech Street, New York, NY',
    type: 'electronics_store',
    rating: 3.8,
    priceLevel: 2,
    location: {
      latitude: 40.7505,
      longitude: -73.9934
    },
    isOpen: true,
    reviews: [
      {
        id: '6',
        authorName: 'Lisa Garcia',
        rating: 4,
        text: 'Good selection of electronics with competitive prices. Staff is knowledgeable.',
        time: '2024-01-12',
        relativeTimeDescription: '2 weeks ago'
      }
    ]
  }
];

export const mockReviewSummary: ReviewSummary = {
  overall_rating: 4.2,
  total_reviews: 127,
  sentiment_summary: "Generally positive reviews with customers praising the food quality and atmosphere, though some mention high prices and occasionally slow service.",
  pros: [
    "Excellent food quality",
    "Great atmosphere",
    "Friendly staff",
    "Good location"
  ],
  cons: [
    "Higher prices",
    "Sometimes slow service",
    "Limited parking"
  ],
  key_themes: [
    "Italian cuisine",
    "Romantic dining",
    "Special occasions",
    "Central location"
  ],
  recommendation: "Highly recommended for special occasions and romantic dinners. The quality justifies the price point."
};

export const mockSearchResults = (query: string): Place[] => {
  const lowerQuery = query.toLowerCase();
  return mockPlaces.filter(place => 
    place.name.toLowerCase().includes(lowerQuery) ||
    place.type.toLowerCase().includes(lowerQuery) ||
    place.address.toLowerCase().includes(lowerQuery)
  );
};

