import { Place, Review } from '../types';

// API key from environment variables
const API_KEY: string = process.env.REACT_APP_GOOGLE_API_KEY || '';
const BASE_URL = 'https://places.googleapis.com/v1';

interface GooglePlace {
  id: string;
  displayName: {
    text: string;
  };
  formattedAddress: string;
  types: string[];
  rating?: number;
  priceLevel?: string;
  userRatingCount?: number; // Total number of reviews
  location: {
    latitude: number;
    longitude: number;
  };
  currentOpeningHours?: {
    openNow: boolean;
  };
  photos?: Array<{
    name: string;
  }>;
  reviews?: Array<{
    name: string;
    authorAttribution: {
      displayName: string;
    };
    rating: number;
    text: {
      text: string;
    };
    publishTime: string;
    relativePublishTimeDescription: string;
  }>;
}

// Convert Google Places price level to our format
const convertPriceLevel = (priceLevel?: string): number => {
  switch (priceLevel) {
    case 'PRICE_LEVEL_FREE': return 1;
    case 'PRICE_LEVEL_INEXPENSIVE': return 2;
    case 'PRICE_LEVEL_MODERATE': return 3;
    case 'PRICE_LEVEL_EXPENSIVE': return 4;
    case 'PRICE_LEVEL_VERY_EXPENSIVE': return 5;
    default: return 2;
  }
};

// Convert Google place type to our simplified format
const convertPlaceType = (types: string[]): string => {
  const typeMap: { [key: string]: string } = {
    'restaurant': 'restaurant',
    'food': 'restaurant',
    'meal_takeaway': 'restaurant',
    'lodging': 'hotel',
    'tourist_attraction': 'attraction',
    'cafe': 'cafe',
    'store': 'shop',
    'electronics_store': 'electronics_store',
    'shopping_mall': 'shopping',
  };

  for (const type of types) {
    if (typeMap[type]) {
      return typeMap[type];
    }
  }
  return types[0] || 'place';
};

// Convert Google Place to our Place format
const convertGooglePlaceToPlace = (googlePlace: GooglePlace): Place => {
  const reviews: Review[] = googlePlace.reviews?.map(review => ({
    id: review.name,
    authorName: review.authorAttribution.displayName,
    rating: review.rating,
    text: review.text.text,
    time: review.publishTime,
    relativeTimeDescription: review.relativePublishTimeDescription,
  })) || [];

  return {
    id: googlePlace.id,
    name: googlePlace.displayName.text,
    address: googlePlace.formattedAddress,
    type: convertPlaceType(googlePlace.types),
    rating: googlePlace.rating || 0,
    priceLevel: convertPriceLevel(googlePlace.priceLevel),
    location: {
      latitude: googlePlace.location.latitude,
      longitude: googlePlace.location.longitude,
    },
    isOpen: googlePlace.currentOpeningHours?.openNow || true,
    reviews: reviews,
    userRatingCount: googlePlace.userRatingCount, // Total review count from Google
  };
};

// ============================================
// AUTOCOMPLETE API (91% cheaper than Text Search!)
// ============================================

// Session token for Autocomplete (Per Session pricing)
let currentSessionToken: string | null = null;

/**
 * Generate a unique session token for Autocomplete API
 * Session = All API calls from first keystroke until user selects a place
 */
const generateSessionToken = (): string => {
  return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

/**
 * Reset autocomplete session (call this when user selects a place)
 * This ends the current session and starts billing for next search
 */
export const resetAutocompleteSession = () => {
  currentSessionToken = null;
};

/**
 * Search places using Autocomplete API
 * Cost: $2.83 per 1,000 sessions
 */
export const searchPlaces = async (query: string): Promise<Place[]> => {
  try {
    // Create new session token if not exists
    if (!currentSessionToken) {
      currentSessionToken = generateSessionToken();
    }
    
    const response = await fetch(`${BASE_URL}/places:autocomplete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
      },
      body: JSON.stringify({
        input: query,
        sessionToken: currentSessionToken,
        languageCode: 'en',
        includedPrimaryTypes: ['restaurant', 'cafe', 'bar', 'hotel', 'store'],
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Places Autocomplete API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.suggestions || data.suggestions.length === 0) {
      return [];
    }

    // Convert autocomplete suggestions to our Place format
    const places: Place[] = data.suggestions
      .filter((suggestion: any) => suggestion.placePrediction)
      .map((suggestion: any) => {
        const prediction = suggestion.placePrediction;
        return {
          id: prediction.placeId,
          name: prediction.structuredFormat?.mainText?.text || prediction.text?.text || 'Unknown',
          address: prediction.structuredFormat?.secondaryText?.text || '',
          rating: 0,
          type: prediction.types?.[0] || 'place',
          priceLevel: 0,
          location: {
            latitude: 0,
            longitude: 0,
          },
          isOpen: true,
          reviews: []
        };
      });

    return places;
  } catch (error) {
    throw error;
  }
};

/**
 * Get place details WITH REVIEWS by place ID
 * Cost: $10 per 1,000 requests (Basic + Atmosphere for reviews)
 */
export const getPlaceDetailsWithReviews = async (placeId: string): Promise<Place | null> => {
  try {
    const response = await fetch(`${BASE_URL}/places/${placeId}`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,types,rating,priceLevel,location,reviews,userRatingCount',
      }
    });

    if (!response.ok) {
      throw new Error(`Place Details API error: ${response.status}`);
    }

    const googlePlace: GooglePlace = await response.json();
    return convertGooglePlaceToPlace(googlePlace);
  } catch (error) {
    throw error;
  }
};

export const isApiKeyConfigured = (): boolean => {
  return API_KEY !== 'YOUR_API_KEY_HERE' && API_KEY.length > 0;
};

// ============================================
// N8N BACKEND INTEGRATION (Recommended)
// ============================================

// n8n webhook URL from environment variables
const N8N_WEBHOOK_URL = process.env.REACT_APP_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/review';

/**
 * Send reviews to n8n for AI summarization with language support
 * @param place - Place object with details
 * @param reviews - Array of reviews to summarize
 * @param language - Language code for AI summary (default: 'en')
 */
export const getAISummaryFromN8n = async (place: Place, reviews: Review[], language: string = 'en') => {
  try {
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        placeId: place.id,
        placeName: place.name,
        placeAddress: place.address,
        rating: place.rating,
        reviews: reviews,
        reviewCount: reviews.length,
        language: language
      })
    });

    if (!response.ok) {
      throw new Error(`n8n webhook error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Check if n8n webhook is configured
 */
export const isN8nConfigured = (): boolean => {
  return N8N_WEBHOOK_URL.includes('localhost') || !N8N_WEBHOOK_URL.includes('your-n8n-instance');
};

