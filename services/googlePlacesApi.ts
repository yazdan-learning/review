import { Place, Review } from '../types';

// You'll need to add your API key here or use environment variables
const API_KEY: string = ''; // Replace with your actual API key
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

interface GooglePlacesResponse {
  places: GooglePlace[];
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
  };
};

export const searchPlaces = async (query: string): Promise<Place[]> => {
  try {
    console.log('🔍 Making Google Places API request for:', query);
    console.log('🔑 Using API Key:', API_KEY.substring(0, 10) + '...');
    
    const response = await fetch(`${BASE_URL}/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.types,places.rating,places.priceLevel,places.location,places.currentOpeningHours.openNow,places.photos'
      },
      body: JSON.stringify({
        textQuery: query,
        maxResultCount: 10,
        languageCode: 'en'
      })
    });

    console.log('📡 API Response Status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`Google Places API error: ${response.status} - ${errorText}`);
    }

    const data: GooglePlacesResponse = await response.json();
    console.log('✅ API Response Data:', data);
    
    if (!data.places) {
      console.log('⚠️ No places found in response');
      return [];
    }

    const convertedPlaces = data.places.map(convertGooglePlaceToPlace);
    console.log('🏢 Converted places:', convertedPlaces.length);
    return convertedPlaces;
  } catch (error) {
    console.error('💥 Error searching places:', error);
    throw error;
  }
};

export const getPlaceDetails = async (placeId: string): Promise<Place | null> => {
  try {
    const response = await fetch(`${BASE_URL}/places/${placeId}`, {
      method: 'GET',
      headers: {
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,types,rating,priceLevel,location,currentOpeningHours.openNow,photos,reviews'
      }
    });

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`);
    }

    const googlePlace: GooglePlace = await response.json();
    return convertGooglePlaceToPlace(googlePlace);
  } catch (error) {
    console.error('Error getting place details:', error);
    throw error;
  }
};

// Helper function to check if API key is configured
export const isApiKeyConfigured = (): boolean => {
  const isConfigured = API_KEY !== 'YOUR_API_KEY_HERE' && API_KEY.length > 0;
  console.log('🔧 API Key Check:', {
    keyLength: API_KEY.length,
    isConfigured: isConfigured,
    keyPrefix: API_KEY.substring(0, 10) + '...',
    actualKey: API_KEY, // Full key for debugging - remove in production!
    isDefaultKey: API_KEY === 'YOUR_API_KEY_HERE'
  });
  return isConfigured;
};

// Test function to validate API key
export const testApiKey = async (): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🧪 Testing API key...');
    const response = await fetch(`${BASE_URL}/places:searchText`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName'
      },
      body: JSON.stringify({
        textQuery: 'restaurant',
        maxResultCount: 1,
        languageCode: 'en'
      })
    });

    if (response.ok) {
      console.log('✅ API key is working!');
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error('❌ API key test failed:', response.status, errorText);
      return { success: false, error: `${response.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('💥 API key test error:', error);
    return { success: false, error: String(error) };
  }
};